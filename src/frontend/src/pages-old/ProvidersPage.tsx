import ProviderSearch from '../components/ProviderSearch';

type ProvidersPageProps = {
  initialSearch?: string;
  onNavigate?: (page: string, data?: unknown) => void;
};

export default function ProvidersPage({ initialSearch, onNavigate }: ProvidersPageProps) {
  return (
    <div>
      <ProviderSearch initialSearch={initialSearch} onNavigate={onNavigate} />
    </div>
  );
}
