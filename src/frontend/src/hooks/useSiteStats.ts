import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Fallbacks render instantly and are also used if the network fetch fails.
// Keep in sync with the seed values in supabase/migrations/create_site_stats.sql.
const DEFAULT_STATS: Record<string, string> = {
  featured_impressions_3mo: "230K",
  featured_clicks_3mo: "4,280",
  featured_ctr_3mo: "1.9%",
  featured_impressions_per_month: "76K+",
  featured_clicks_per_month: "1,425+",
  featured_audience_focus: "100%",
  hero_providers_count: "3,300+",
  hero_daycares_count: "250+",
};

export function useSiteStats() {
  const { data } = useQuery<Record<string, string>>({
    queryKey: ["site_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_stats")
        .select("key, value");
      if (error) throw error;
      const out: Record<string, string> = {};
      for (const row of data ?? []) out[row.key] = row.value;
      return out;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { ...DEFAULT_STATS, ...(data ?? {}) };
}
