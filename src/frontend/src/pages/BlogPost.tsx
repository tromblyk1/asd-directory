import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2, Clock, AlertCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { Helmet } from 'react-helmet-async';

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

const categoryColors: Record<string, string> = {
  success_story: "bg-green-100 text-green-800 border-green-200",
  resource_spotlight: "bg-blue-100 text-blue-800 border-blue-200",
  community_news: "bg-purple-100 text-purple-800 border-purple-200",
  tips_advice: "bg-orange-100 text-orange-800 border-orange-200",
  advocacy: "bg-red-100 text-red-800 border-red-200",
  guide: "bg-blue-100 text-blue-800 border-blue-200",
};

const categoryLabels: Record<string, string> = {
  success_story: "Success Story",
  resource_spotlight: "Resource Spotlight",
  community_news: "Community News",
  tips_advice: "Tips & Advice",
  advocacy: "Advocacy",
  guide: "Guide",
};

const getCategoryColor = (category: string): string => {
  return categoryColors[category] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || category?.replace(/_/g, ' ') || "Article";
};

export default function BlogPostPage() {
  const { id: slug } = useParams();

  const { data: post, isLoading } = useQuery<BlogPost | null>({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!slug,
  });

  const isComingSoon = post?.content?.includes('## Coming Soon');
  const isGuide = post?.category === 'guide';
  const backLink = isGuide ? '/guides' : createPageUrl("Blog");
  const backText = isGuide ? 'Back to Guides' : 'Back to Stories';

  const sharePost = () => {
    if (post && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Post not found</h2>
          <Link to="/guides">
            <Button>Back to Guides</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Coming Soon page for guides not yet written
  if (isComingSoon) {
    return (
      <>
        <Helmet>
          <title>{post.title} | Florida Autism Services</title>
          <meta name="description" content={post.excerpt} />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-12">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-8 sm:py-10 lg:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <Link to={backLink}>
                <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {backText}
                </Button>
              </Link>
              
              <Badge className="bg-white/20 text-white border-white/30 border mb-4">
                {getCategoryLabel(post.category)}
              </Badge>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{post.title}</h1>
              <p className="text-base sm:text-lg lg:text-xl text-blue-100">{post.excerpt}</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
            <Card className="border-none shadow-xl">
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-amber-600" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Coming Soon</h2>
                
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                  We're working hard to bring you this comprehensive guide. 
                  Check back soon for detailed information on this topic.
                </p>

                <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    This guide will cover:
                  </h3>
                  <ReactMarkdown
                    components={{
                      ul: ({ children }) => <ul className="list-disc ml-6 space-y-1 text-gray-700">{children}</ul>,
                      li: ({ children }) => <li>{children}</li>,
                      p: ({ children }) => <p className="text-gray-700">{children}</p>,
                      h2: () => null,
                      em: ({ children }) => <em className="text-gray-500 text-sm block mt-4">{children}</em>,
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>

                <Link to={backLink}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Browse Available Guides
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Regular post/guide display
  return (
    <>
      <Helmet>
        <title>{post.title} | Florida Autism Services</title>
        <meta name="description" content={post.excerpt} />
        
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image_url || ''} />
        <meta property="og:url" content={`https://floridaautismservices.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.created_at} />
        <meta property="article:author" content={post.author} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.image_url || ''} />
        
        <link rel="canonical" href={`https://floridaautismservices.com/blog/${post.slug}`} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image_url,
            "datePublished": post.created_at,
            "dateModified": post.updated_at,
            "author": {
              "@type": "Organization",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Florida Autism Services",
              "logo": {
                "@type": "ImageObject",
                "url": "https://floridaautismservices.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://floridaautismservices.com/blog/${post.slug}`
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header Image */}
        {post.image_url && (
          <div className="h-48 sm:h-64 lg:h-96 overflow-hidden relative">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 sm:mt-12 sm:-mt-16 lg:-mt-20 relative z-10">
          <Link to={backLink}>
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backText}
            </Button>
          </Link>

          <Card className="border-none shadow-2xl">
            <CardContent className="p-4 sm:p-6 lg:p-4 sm:p-6 lg:p-8 xl:p-12">
              {/* Category and Share */}
              <div className="flex items-center justify-between mb-6">
                <Badge className={`${getCategoryColor(post.category)} border text-sm`}>
                  {getCategoryLabel(post.category)}
                </Badge>
                <Button variant="ghost" size="sm" onClick={sharePost}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {format(new Date(post.created_at), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-base sm:text-lg text-gray-700 italic leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-700">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">
                        {children}
                      </blockquote>
                    ),
                    a: ({ children, href }) => (
                      <a href={href} className="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Back CTA */}
          <div className="text-center mt-8 sm:mt-12">
            <Link to={backLink}>
              <Button size="lg" variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isGuide ? 'Browse More Guides' : 'Read More Stories'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}