// Stripe webhook for featured-listing checkouts.
// Auth: Stripe signature verification (deployed with verify_jwt=false).
// Required secrets (Supabase dashboard > Edge Functions > stripe-webhook):
//   STRIPE_WEBHOOK_SECRET - signing secret from the Stripe webhook endpoint
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.
//
// What was purchased is identified by the pre-tax amount (every price is
// unique across all 12 payment links); payment-link metadata (tier/billing/
// variant), if present, takes precedence.
// On checkout.session.completed:
//   - variant=founder  -> decrement site_stats.founder_slots_remaining
//   - client_reference_id (numeric resources.id, appended to the payment link
//     URL for existing providers) -> mark that listing featured with the tier

import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "sk_unused", {
  apiVersion: "2024-06-20",
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

type Plan = { tier: string; billing: string; variant: string };

// Pre-tax USD cents -> plan. Every payment link price is unique.
const AMOUNT_TO_PLAN: Record<number, Plan> = {
  1500: { tier: "basic", billing: "monthly", variant: "founder" },
  15300: { tier: "basic", billing: "annual", variant: "founder" },
  2900: { tier: "basic", billing: "monthly", variant: "standard" },
  29600: { tier: "basic", billing: "annual", variant: "standard" },
  3000: { tier: "enhanced", billing: "monthly", variant: "founder" },
  30600: { tier: "enhanced", billing: "annual", variant: "founder" },
  5900: { tier: "enhanced", billing: "monthly", variant: "standard" },
  60200: { tier: "enhanced", billing: "annual", variant: "standard" },
  5000: { tier: "premium", billing: "monthly", variant: "founder" },
  51000: { tier: "premium", billing: "annual", variant: "founder" },
  9900: { tier: "premium", billing: "monthly", variant: "standard" },
  101000: { tier: "premium", billing: "annual", variant: "standard" },
};

function resolvePlan(session: Stripe.Checkout.Session): Plan | null {
  const m = session.metadata ?? {};
  if (m.tier && m.billing && m.variant) {
    return { tier: m.tier, billing: m.billing, variant: m.variant };
  }
  // amount_subtotal is pre-tax/pre-discount, so automatic tax doesn't skew it.
  return AMOUNT_TO_PLAN[session.amount_subtotal ?? -1] ?? null;
}

Deno.serve(async (req: Request) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error("Signature verification failed:", (err as Error).message);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = resolvePlan(session);
    const businessName =
      session.custom_fields?.find((f) => f.type === "text")?.text?.value ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (!plan) {
      console.error(
        "Could not resolve plan from metadata or amount:",
        session.amount_subtotal,
        session.customer_details?.email ?? "no-email",
      );
    }

    if (plan?.variant === "founder") {
      const { error } = await supabase.rpc("decrement_founder_slots");
      if (error) console.error("decrement_founder_slots failed:", error.message);
    }

    const ref = session.client_reference_id;
    if (ref && /^\d+$/.test(ref)) {
      const tier = ["basic", "enhanced", "premium"].includes(plan?.tier ?? "")
        ? plan!.tier
        : "basic";
      const { error } = await supabase
        .from("resources")
        .update({ featured: true, featured_tier: tier })
        .eq("id", Number(ref));
      if (error) console.error("resources update failed:", error.message);
    } else {
      // No listing reference (e.g., post-submission upsell before the listing
      // exists) - match manually from the Stripe email + business name.
      console.log(
        "checkout.session.completed without client_reference_id",
        session.customer_details?.email ?? "no-email",
        "business:", businessName,
        "plan:", JSON.stringify(plan),
      );
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
