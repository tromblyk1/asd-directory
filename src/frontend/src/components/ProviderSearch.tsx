import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase, Provider } from "../lib/supabase";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { ProviderCard } from "./ProviderCard";

type FilterOption = { key: string; label: string };

const FilterGroup = ({
  title,
  filters,
  selected,
  onToggle,
}: {
  title: string;
  filters: FilterOption[];
  selected: string[];
  onToggle: (key: string) => void;
}) => (
  <div className="mb-4">
    <h3 className="font-semibold mb-2 text-gray-800">{title}</h3>
    <div className="flex flex-col gap-1">
      {filters.map((f) => (
        <label key={f.key} className="flex items-center gap-2 text-sm text-gray-700">
          <Checkbox
            checked={selected.includes(f.key)}
            onCheckedChange={() => onToggle(f.key)}
          />
          {f.label}
        </label>
      ))}
    </div>
  </div>
);

type SelectedFilterState = {
  services: string[];
  otherServices: string[];
  ages: string[];
  insurance: string[];
  scholarships: string[];
};

type ProviderSearchProps = {
  initialSearch?: string;
  onNavigate?: (page: string, data?: unknown) => void;
};

export default function ProviderSearch({ initialSearch, onNavigate }: ProviderSearchProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch ?? "");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilterState>({
    services: [],
    otherServices: [],
    ages: [],
    insurance: [],
    scholarships: [],
  });

  // -------- Filter Definitions --------
  const coreServices: FilterOption[] = [
    { key: "aba", label: "ABA Therapy" },
    { key: "speech", label: "Speech Therapy" },
    { key: "ot", label: "Occupational Therapy" },
    { key: "pt", label: "Physical Therapy" },
    { key: "feeding", label: "Feeding Therapy" },
    { key: "music_therapy", label: "Music Therapy" },
    { key: "inpp", label: "INPP (Neuromotor Maturity)" },
    { key: "aac_speech", label: "AAC / Speech Devices" },
    { key: "dir_floortime", label: "DIR / Floortime" },
  ];

  const otherServices: FilterOption[] = [
    { key: "church_support", label: "Church Support" },
    { key: "pet_therapy", label: "Pet Therapy" },
    { key: "life_skills", label: "Life Skills / Daily Living" },
    { key: "residential", label: "Residential Program" },
    { key: "support_groups", label: "Support Groups" },
  ];

  const insuranceFilters: FilterOption[] = [
    { key: "accepts_medicaid", label: "Medicaid" },
    { key: "accepts_medicare", label: "Medicare" },
    { key: "accepts_aetna", label: "Aetna" },
    { key: "accepts_cigna", label: "Cigna" },
    { key: "accepts_tricare", label: "TRICARE" },
    { key: "accepts_humana", label: "Humana" },
    { key: "accepts_florida_blue", label: "Florida Blue" },
    { key: "accepts_unitedhealthcare", label: "UnitedHealthcare" },
    { key: "accepts_florida_healthcare_plans", label: "Florida Healthcare Plans" },
    { key: "accepts_wellcare", label: "WellCare" },
    { key: "accepts_molina", label: "Molina" },
    { key: "accepts_sunshine_health", label: "Sunshine Health" },
    { key: "accepts_florida_kidcare", label: "Florida KidCare" },
  ];

  const scholarshipFilters: FilterOption[] = [
    { key: "accepts_pep", label: "PEP Scholarship" },
    { key: "accepts_fes_ua", label: "FES UA" },
    { key: "accepts_fes_eo", label: "FES EO" },
    { key: "accepts_ftc", label: "Florida Tax Credit (FTC)" },
    { key: "accepts_hope_scholarship", label: "Hope Scholarship" },
  ];

  const ageFilters: FilterOption[] = [
    { key: "serves_children", label: "Children" },
    { key: "serves_teens", label: "Teens" },
    { key: "serves_adults", label: "Adults" },
  ];

  const toggleFilter = (group: keyof SelectedFilterState, key: string) => {
    setSelectedFilters((prev) => {
      const currentSelection = prev[group];
      const isSelected = currentSelection.includes(key);
      const nextSelection = isSelected
        ? currentSelection.filter((value) => value !== key)
        : [...currentSelection, key];

      return {
        ...prev,
        [group]: nextSelection,
      };
    });
  };

  const activeFilters = useMemo(
    () => [
      ...selectedFilters.services,
      ...selectedFilters.otherServices,
      ...selectedFilters.ages,
      ...selectedFilters.insurance,
      ...selectedFilters.scholarships,
    ],
    [selectedFilters]
  );

  // -------- Query Logic --------
  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from("providers").select("*").limit(300);

      if (searchTerm) {
        query = query.ilike("provider_name", `%${searchTerm}%`);
      }

      activeFilters.forEach((key) => {
        query = query.eq(key, true);
      });

      const { data, error } = await query;
      if (error) throw error;
      setProviders((data ?? []) as Provider[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeFilters, searchTerm]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // -------- UI --------
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-72">
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Search by provider name..."
              value={searchTerm}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
              className="mb-4"
            />

            <FilterGroup
              title="Services Offered"
              filters={coreServices}
              selected={selectedFilters.services}
              onToggle={(key) => toggleFilter("services", key)}
            />

            <FilterGroup
              title="Other Services Offered"
              filters={otherServices}
              selected={selectedFilters.otherServices}
              onToggle={(key) => toggleFilter("otherServices", key)}
            />

            <FilterGroup
              title="Ages Served"
              filters={ageFilters}
              selected={selectedFilters.ages}
              onToggle={(key) => toggleFilter("ages", key)}
            />

            <FilterGroup
              title="Insurance Accepted"
              filters={insuranceFilters}
              selected={selectedFilters.insurance}
              onToggle={(key) => toggleFilter("insurance", key)}
            />

            <FilterGroup
              title="Florida Scholarships & Funding"
              filters={scholarshipFilters}
              selected={selectedFilters.scholarships}
              onToggle={(key) => toggleFilter("scholarships", key)}
            />

            <Button
              className="w-full mt-4"
              onClick={fetchProviders}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                "Apply Filters"
              )}
            </Button>
          </CardContent>
        </Card>
      </aside>

      {/* Results */}
      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : providers.length === 0 ? (
          <p className="text-gray-500">No providers found.</p>
        ) : (
          <div className="grid gap-4">
            {providers.map((provider, index) => (
              <ProviderCard
                key={
                  provider.id
                  ?? provider.provider_id?.toString()
                  ?? provider.google_place_id
                  ?? `${provider.provider_name ?? 'provider'}-${index}`
                }
                provider={provider}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
