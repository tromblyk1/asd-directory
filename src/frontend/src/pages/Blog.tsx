import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    BookOpen, Search, Calendar, User, ArrowRight, Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const categoryColors = {
    success_story: "bg-green-100 text-green-800 border-green-200",
    resource_spotlight: "bg-blue-100 text-blue-800 border-blue-200",
    community_news: "bg-purple-100 text-purple-800 border-purple-200",
    tips_advice: "bg-orange-100 text-orange-800 border-orange-200",
    advocacy: "bg-red-100 text-red-800 border-red-200",
};

const categoryNames: Record<string, string> = {
    success_story: "Success Stories",
    resource_spotlight: "Resource Spotlights",
    community_news: "Community News",
    tips_advice: "Tips & Advice",
    advocacy: "Advocacy"
};

type CategoryKey = keyof typeof categoryColors;

const getCategoryColor = (category: any): string => {
    return categoryColors[category as CategoryKey] || categoryColors.advocacy;
};

export default function Blog() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const { data: posts = [], isLoading, error } = useQuery({
        queryKey: ['blog-posts'],
        queryFn: async () => {
            const result = await base44.entities.BlogPost.filter({ published: true }, '-created_date', 100);
            return result;
        },
        initialData: [],
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    const filteredPosts = posts.filter(post => {
        const matchesSearch = !searchTerm ||
            post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
    const otherPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

    // SEO structured data
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Florida Autism Services Blog",
        "description": "Stories, news, and resources for the autism community in Florida. Read success stories, community updates, tips, and advocacy articles.",
        "url": "https://floridaautismservices.com/blog",
        "publisher": {
            "@type": "Organization",
            "name": "Florida Autism Services Directory",
            "url": "https://floridaautismservices.com"
        },
        "blogPost": posts.slice(0, 10).map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt || "",
            "author": {
                "@type": "Person",
                "name": post.author || "Florida Autism Services"
            },
            "datePublished": post.created_at,
            "url": `https://floridaautismservices.com/blog/${post.slug}`,
            ...(post.image_url && { "image": post.image_url })
        }))
    };

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Autism Stories & News | Florida Autism Services",
        "description": "Success stories, community updates, and helpful resources for families affected by autism in Florida.",
        "url": "https://floridaautismservices.com/blog",
        "mainEntity": {
            "@type": "ItemList",
            "name": "Blog Articles",
            "numberOfItems": posts.length,
            "itemListElement": posts.slice(0, 10).map((post, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://floridaautismservices.com/blog/${post.slug}`
            }))
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://floridaautismservices.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://floridaautismservices.com/blog"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <title>Autism Stories & News | Florida Autism Services Blog</title>
                <meta name="description" content="Read inspiring success stories, community news, tips and advice for families affected by autism in Florida. Stay updated with the latest autism resources and advocacy." />
                <meta name="keywords" content="autism blog, autism success stories, autism news Florida, autism tips, autism advocacy, autism community, autism resources, autism families" />
                <link rel="canonical" href="https://floridaautismservices.com/blog" />
                
                {/* Open Graph */}
                <meta property="og:title" content="Autism Stories & News | Florida Autism Services" />
                <meta property="og:description" content="Read inspiring success stories, community news, and tips for families affected by autism in Florida." />
                <meta property="og:type" content="blog" />
                <meta property="og:url" content="https://floridaautismservices.com/blog" />
                <meta property="og:site_name" content="Florida Autism Services Directory" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Autism Stories & News | Florida" />
                <meta name="twitter:description" content="Success stories, community news, and resources for the autism community in Florida." />
                
                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(blogSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(collectionSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-8 sm:pb-12">
                {/* Header - Mobile optimized */}
                <header className="bg-gradient-to-r from-orange-600 to-purple-600 text-white py-8 sm:py-10 lg:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0" role="img" aria-label="Blog icon">
                                <BookOpen className="w-5 h-5 sm:w-8 sm:h-8" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Stories & News</h1>
                                <p className="text-base sm:text-lg lg:text-xl text-orange-50 truncate sm:whitespace-normal">
                                    <span className="hidden sm:inline">Success stories, community updates, and helpful resources</span>
                                    <span className="sm:hidden">Success stories & updates</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    {/* Search and Filters */}
                    <Card className="border-none shadow-lg mb-6 sm:mb-8">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                                        <Input
                                            type="text"
                                            placeholder="Search stories..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                            aria-label="Search blog posts"
                                        />
                                    </div>
                                </div>

                                <div className="w-full sm:w-48 md:w-64">
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger aria-label="Filter by category">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            <SelectItem value="success_story">Success Stories</SelectItem>
                                            <SelectItem value="resource_spotlight">Resource Spotlights</SelectItem>
                                            <SelectItem value="community_news">Community News</SelectItem>
                                            <SelectItem value="tips_advice">Tips & Advice</SelectItem>
                                            <SelectItem value="advocacy">Advocacy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
                            <p className="mt-4 text-gray-600">Loading stories...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <Card className="border-none shadow-lg">
                            <CardContent className="py-8 sm:py-12 text-center">
                                <BookOpen className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    No posts found
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Try adjusting your search or filters
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Featured Post */}
                            {featuredPost && (
                                <Link to={`/blog/${featuredPost.slug}`}>
                                    <article>
                                        <Card className="border-none shadow-2xl mb-8 sm:mb-12 overflow-hidden group cursor-pointer">
                                            <div className="grid md:grid-cols-2">
                                                {featuredPost.image_url && (
                                                    <div className="h-48 sm:h-64 md:h-auto overflow-hidden">
                                                        <img
                                                            src={featuredPost.image_url}
                                                            alt={featuredPost.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                )}
                                                <CardContent className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs sm:text-sm">
                                                            <Star className="w-3 h-3 mr-1" aria-hidden="true" />
                                                            Featured
                                                        </Badge>
                                                        <Badge className={`${getCategoryColor(featuredPost.category)} border text-xs sm:text-sm`}>
                                                            {featuredPost.category?.replace(/_/g, ' ')}
                                                        </Badge>
                                                    </div>

                                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-orange-600 transition-colors line-clamp-2 sm:line-clamp-none">
                                                        {featuredPost.title}
                                                    </h2>

                                                    <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed line-clamp-3">
                                                        {featuredPost.excerpt}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                                                        <div className="flex items-center gap-1 sm:gap-2">
                                                            <User className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                                                            <span>{featuredPost.author}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 sm:gap-2">
                                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                                                            <time dateTime={featuredPost.created_at}>
                                                                {format(new Date(featuredPost.created_at), 'MMM d, yyyy')}
                                                            </time>
                                                        </div>
                                                    </div>

                                                    <Button className="w-full sm:w-fit bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700">
                                                        <span className="hidden sm:inline">Read Full Story</span>
                                                        <span className="sm:hidden">Read More</span>
                                                        <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                                                    </Button>
                                                </CardContent>
                                            </div>
                                        </Card>
                                    </article>
                                </Link>
                            )}

                            {/* Other Posts Grid */}
                            {otherPosts.length > 0 && (
                                <section aria-label="More stories">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">More Stories</h2>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        {otherPosts.map((post) => (
                                            <Link key={post.id} to={`/blog/${post.slug}`}>
                                                <article>
                                                    <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                                                        {post.image_url && (
                                                            <div className="h-40 sm:h-48 overflow-hidden">
                                                                <img
                                                                    src={post.image_url}
                                                                    alt={post.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        )}
                                                        <CardContent className="p-4 sm:p-6">
                                                            <Badge className={`${getCategoryColor(post.category)} border mb-2 sm:mb-3 text-xs`}>
                                                                {post.category?.replace(/_/g, ' ')}
                                                            </Badge>

                                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                                                {post.title}
                                                            </h3>

                                                            {post.excerpt && (
                                                                <p className="text-gray-700 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 text-sm sm:text-base">
                                                                    {post.excerpt}
                                                                </p>
                                                            )}

                                                            <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-600 pt-3 sm:pt-4 border-t">
                                                                <div className="flex items-center gap-1">
                                                                    <User className="w-3 h-3" aria-hidden="true" />
                                                                    <span className="truncate max-w-[80px] sm:max-w-none">{post.author}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" aria-hidden="true" />
                                                                    <time dateTime={post.created_at}>
                                                                        {format(new Date(post.created_at), 'MMM d')}
                                                                    </time>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </article>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </main>
            </div>
        </>
    );
}