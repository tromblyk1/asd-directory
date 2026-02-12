import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { PPECCenter } from '@/lib/supabase';

export default function DaycareDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: daycare, isLoading } = useQuery({
    queryKey: ['daycare', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ppec_centers')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as PPECCenter;
    },
    enabled: !!slug,
  });

  return (
    <>
      <Helmet>
        <title>{daycare?.name ? `${daycare.name} | Florida Autism Services` : 'Daycare Detail | Florida Autism Services'}</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-8 sm:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Link to="/find-daycares" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Find Daycares
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {isLoading ? 'Loading...' : daycare?.name || 'Daycare Not Found'}
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading daycare details...</p>
            </div>
          ) : !daycare ? (
            <Card className="border-none shadow-lg">
              <CardContent className="py-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Daycare not found</h3>
                <p className="text-gray-600 mb-4">The daycare you're looking for doesn't exist or has been removed.</p>
                <Link to="/find-daycares">
                  <Button>Browse All Daycares</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <p className="text-gray-600">Full detail page coming soon. Basic info:</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {daycare.address && <li><strong>Address:</strong> {daycare.address}, {daycare.city}, {daycare.state} {daycare.zip_code}</li>}
                  {daycare.phone && <li><strong>Phone:</strong> {daycare.phone}</li>}
                  {daycare.website && <li><strong>Website:</strong> <a href={daycare.website.startsWith('http') ? daycare.website : `https://${daycare.website}`} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">{daycare.website}</a></li>}
                  {daycare.licensed_beds && <li><strong>Licensed Beds:</strong> {daycare.licensed_beds}</li>}
                  {daycare.profit_status && <li><strong>Status:</strong> {daycare.profit_status}</li>}
                  {daycare.county && <li><strong>County:</strong> {daycare.county}</li>}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
