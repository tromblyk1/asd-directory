import { Helmet } from 'react-helmet-async';
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen, Search, Calendar, User, ArrowRight, Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image_url: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export default function Guides() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: guides = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['guides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('category', 'guide')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredGuides = guides.filter((guide: BlogPost) => {
    const matchesSearch = !searchTerm ||
      guide.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Autism Guides & Resources | Florida Autism Services</title>
        <meta name="description" content="In-depth guides to help Florida families navigate autism services, therapies, insurance coverage, school options, and support resources." />
        <meta name="keywords" content="autism guides Florida, autism resources, ABA therapy guide, autism insurance guide, autism school guide, autism parent resources" />
        <link rel="canonical" href="https://floridaautismservices.com/guides" />
        <meta property="og:title" content="Autism Guides & Resources" />
        <meta property="og:description" content="In-depth guides to help Florida families navigate autism services, therapies, and support resources." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://floridaautismservices.com/guides" />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Autism Guides & Resources | Florida Autism Services" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Autism Guides & Resources",
            "description": "In-depth guides to help Florida families navigate autism services",
            "url": "https://floridaautismservices.com/guides",
            "isPartOf": { "@type": "WebSite", "name": "Florida Autism Services Directory", "url": "https://floridaautismservices.com" }
          })}
        </script>
      </Helmet>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Guides & Resources</h1>
              <p className="text-base sm:text-lg lg:text-xl text-blue-50">
                In-depth guides to help you navigate autism services in Florida
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <Card className="border-none shadow-lg mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-8 sm:py-10 lg:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : filteredGuides.length === 0 ? (
          <Card className="border-none shadow-lg">
            <CardContent className="py-8 sm:py-10 lg:py-12 text-center">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No guides found
              </h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search" : "Check back soon for new guides"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <TooltipProvider delayDuration={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredGuides.map((guide: BlogPost) => (
                <Link key={guide.id} to={`/blog/${guide.slug}`}>
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                    {guide.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={guide.image_url}
                          alt={guide.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-4 sm:p-6">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 border mb-3 cursor-help">
                            Guide
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>In-depth educational resource</p>
                        </TooltipContent>
                      </Tooltip>

                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                        {guide.title}
                      </h3>

                      {guide.excerpt && (
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {guide.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-600 pt-4 border-t">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>5-7 min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {format(new Date(guide.updated_at || guide.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TooltipProvider>
        )}
      </div>
    </div>
    </>
  );
}