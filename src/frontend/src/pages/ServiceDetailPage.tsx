import { useParams } from "react-router-dom";
import { SERVICE_DEFINITIONS } from "../lib/serviceDefinitions";
import { Card, CardContent } from "@/components/ui/card";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const def = Object.values(SERVICE_DEFINITIONS).find((d) => d.slug === slug);

  if (!def) return <p className="p-6 text-gray-600">Service not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{def.label}</h1>
          <p className="text-gray-700 leading-relaxed">{def.long}</p>
        </CardContent>
      </Card>
    </div>
  );
}
