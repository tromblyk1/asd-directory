import React, { useState, useEffect } from 'react';
import { BookOpen, Tag, ArrowRight } from 'lucide-react';
import { supabase, Resource } from '../lib/supabase';
import { useAccessibility } from '../contexts/AccessibilityContext';

type ResourcesPageProps = {
  onNavigate: (page: string, slug?: string) => void;
};

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigate }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { lowSensoryMode } = useAccessibility();

  const categories = [
    'Types of Therapy',
    'Insurance & Funding',
    'Education & IEP',
    'Early Intervention',
    'Parent Support',
    'Legal Rights',
    'Daily Living',
    'Transition to Adulthood'
  ];

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('resources')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredResources = resources.filter(r => r.featured);
  const regularResources = resources.filter(r => !r.featured);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-3">
          <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Resource Hub
          </h1>
        </div>
        <p className="text-slate-700 dark:text-slate-300 max-w-3xl">
          Educational articles, guides, and information to help you navigate autism services in Florida.
          Learn about therapies, insurance, education rights, and more.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === ''
              ? 'bg-green-600 dark:bg-green-500 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600'
          }`}
        >
          All Resources
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-green-600 dark:bg-green-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-green-600 dark:border-t-green-400" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading resources...</p>
        </div>
      ) : (
        <>
          {featuredResources.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Featured Resources
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className={`bg-gradient-to-br from-green-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 ${
                      lowSensoryMode ? '' : 'hover:shadow-lg transition-shadow duration-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 dark:bg-green-500 text-white">
                        {resource.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 mb-4">
                      {resource.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400"
                          >
                            <Tag className="w-3 h-3" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => onNavigate('resource', resource.slug)}
                        className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {regularResources.length > 0 && (
            <div className="space-y-4">
              {featuredResources.length > 0 && (
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  All Resources
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularResources.map((resource) => (
                  <div
                    key={resource.id}
                    className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 ${
                      lowSensoryMode ? '' : 'hover:shadow-md transition-shadow duration-200'
                    }`}
                  >
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mb-3">
                      {resource.category}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                      {resource.excerpt}
                    </p>
                    <button
                      onClick={() => onNavigate('resource', resource.slug)}
                      className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium text-sm transition-colors"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resources.length === 0 && (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <BookOpen className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No resources found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Check back soon for helpful articles and guides
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
