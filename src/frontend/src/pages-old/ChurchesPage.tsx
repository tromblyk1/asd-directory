import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Church, MapPin, Phone, Globe, Heart, Mail } from 'lucide-react';

interface ChurchData {
  ChurchName: string;
  Denomination: string;
  Website: string;
  AccommodationSnippet: string;
  AccommodationTags: string;
  SensoryRoom: string;
  AlternativeService: string;
  ChildrenProgram: string;
  AdultProgram: string;
  ContactEmail: string;
  Phone: string;
  Street: string;
  City: string;
  County: string;
  State: string;
  ZIP: number;
  Lat: number;
  Lon: number;
  LastVerifiedDate: string;
  SourceURL: string;
}

function ChurchesPage() {
  const [churches, setChurches] = useState<ChurchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChurches();
  }, []);

  const fetchChurches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .order('City', { ascending: true });

      if (error) {
        console.error('Error fetching churches:', error);
      } else {
        setChurches(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredChurches = churches.filter(church => {
    const search = searchTerm.toLowerCase();
    return (
      church.ChurchName.toLowerCase().includes(search) ||
      church.City.toLowerCase().includes(search) ||
      church.Denomination.toLowerCase().includes(search) ||
      church.AccommodationSnippet.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Church className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Faith-Based Support</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Autism-friendly churches and faith communities across Florida offering
            sensory-friendly services, special needs ministries, and inclusive worship experiences.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <input
            type="text"
            placeholder="Search by church name, city, or accommodation type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading churches...</p>
          </div>
        ) : filteredChurches.length === 0 ? (
          <div className="text-center py-12">
            <Church className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {searchTerm ? 'No churches match your search.' : 'No churches found in the database.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Found <span className="font-bold text-purple-600 dark:text-purple-400">{filteredChurches.length}</span> autism-friendly {filteredChurches.length === 1 ? 'church' : 'churches'}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {filteredChurches.map((church, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  {/* Church Name & Denomination */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {church.ChurchName}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">
                      {church.Denomination}
                    </p>
                  </div>

                  {/* Accommodation Snippet */}
                  {church.AccommodationSnippet && (
                    <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {church.AccommodationSnippet}
                      </p>
                    </div>
                  )}

                  {/* Accommodation Tags */}
                  {church.AccommodationTags && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {church.AccommodationTags.split('|').map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 
                                   dark:text-blue-300 text-xs rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Programs & Features */}
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {church.SensoryRoom === 'Yes' && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Heart className="w-4 h-4 text-green-600" />
                        <span>Sensory Room</span>
                      </div>
                    )}
                    {church.AlternativeService === 'Yes' && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Heart className="w-4 h-4 text-green-600" />
                        <span>Alt. Service</span>
                      </div>
                    )}
                    {church.ChildrenProgram === 'Yes' && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Heart className="w-4 h-4 text-green-600" />
                        <span>Children's Program</span>
                      </div>
                    )}
                    {church.AdultProgram === 'Yes' && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Heart className="w-4 h-4 text-green-600" />
                        <span>Adult Program</span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="mb-3 flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{church.Street}</p>
                      <p>{church.City}, {church.State} {church.ZIP}</p>
                      <p className="text-sm">{church.County} County</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {church.Phone && (
                      <a
                        href={`tel:${church.Phone}`}
                        className="flex items-center gap-2 text-purple-600 dark:text-purple-400 
                                 hover:underline text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        {church.Phone}
                      </a>
                    )}
                    {church.Website && (
                      <a
                        href={church.Website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-600 dark:text-purple-400 
                                 hover:underline text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                      </a>
                    )}
                    {church.ContactEmail && !(church.ContactEmail.toLowerCase().includes('email') && church.ContactEmail.toLowerCase().includes('protected')) ? (
                      <a
                        href={`mailto:${church.ContactEmail}`}
                        className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        {church.ContactEmail}
                      </a>
                    ) : null}
                  </div>

                  {/* Last Verified */}
                  {
                    church.LastVerifiedDate && (
                      <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                        Last verified: {new Date(church.LastVerifiedDate).toLocaleDateString()}
                      </p>
                    )
                  }
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div >
  );
}

export default ChurchesPage;
