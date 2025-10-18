import ProviderSearch from '../components/ProviderSearch';

type ProvidersPageProps = {
  initialSearch?: string;
};

export default function ProvidersPage({ initialSearch }: ProvidersPageProps) {
  return (
    <div>
      <ProviderSearch initialSearch={initialSearch} />
    </div>
  );
}
