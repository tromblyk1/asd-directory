// Stripe webhook for featured-listing checkouts.
// Auth: Stripe signature verification (deployed with verify_jwt=false).
// Required secrets (Supabase dashboard > Edge Functions > stripe-webhook):
//   STRIPE_WEBHOOK_SECRET - signing secret from the Stripe webhook endpoint
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.
//
// Each Stripe payment link must carry metadata (set in the Stripe dashboard):
//   tier    = basic | enhanced | premium
//   billing = monthly | annual
//   variant = founder | standard
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
    const metadata = session.metadata ?? {};
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (metadata.variant === "founder") {
      const { error } = await supabase.rpc("decrement_founder_slots");
      if (error) console.error("decrement_founder_slots failed:", error.message);
    }

    const ref = session.client_reference_id;
    if (ref && /^\d+$/.test(ref)) {
      const tier = ["basic", "enhanced", "premium"].includes(metadata.tier ?? "")
        ? metadata.tier
        : "basic";
      const { error } = await supabase
        .from("resources")
        .update({ featured: true, featured_tier: tier })
        .eq("id", Number(ref));
      if (error) console.error("resources update failed:", error.message);
    } else {
      // No listing reference (e.g., post-submission upsell before the listing
      // exists) - match manually from the Stripe email + submission email.
      console.log(
        "checkout.session.completed without client_reference_id",
        session.customer_details?.email ?? "no-email",
        JSON.stringify(metadata),
      );
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
