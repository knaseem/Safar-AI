"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, Clock, ArrowRight, Grid3X3, LayoutList } from "lucide-react"
import { blogPosts, getDailyFeaturedPosts } from "@/lib/blog-data"
import { Navbar } from "@/components/layout/navbar"

const categories = ["All", "Destinations", "Food & Dining", "Luxury & Lifestyle", "Travel Tips", "Halal Trip"] as const
type Category = typeof categories[number]

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>("All")
    const featuredPosts = getDailyFeaturedPosts()

    // Filter posts based on selected category
    const filteredPosts = selectedCategory === "All"
        ? blogPosts
        : blogPosts.filter(p => p.category === selectedCategory)

    // Get category counts
    const getCategoryCount = (cat: Category) => {
        if (cat === "All") return blogPosts.length
        return blogPosts.filter(p => p.category === cat).length
    }

    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-black" />
                <div className="container mx-auto relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="size-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400 uppercase tracking-widest font-medium">Travel Journal</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        The SafarAI Blog
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl">
                        Expert guides, insider tips, and inspiration for the modern traveler.
                    </p>
                </div>
            </section>

            {/* Category Navigation Menu */}
            <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <span>{category}</span>
                                    <span className={`ml-2 ${selectedCategory === category ? "text-white/80" : "text-white/40"
                                        }`}>
                                        ({getCategoryCount(category)})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Featured Stories (only show when "All" is selected) */}
            {selectedCategory === "All" && (
                <section id="featured" className="px-6 pb-16 pt-8">
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full" />
                                <h2 className="text-2xl font-bold text-white">Daily Featured Stories</h2>
                            </div>
                            <span className="text-emerald-400 text-sm font-medium px-3 py-1 bg-emerald-500/10 rounded-full">
                                ✨ Updated Daily
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                                                {post.category}
                                            </span>
                                            <span className="flex items-center gap-1 text-white/40 text-xs">
                                                <Clock className="size-3" />
                                                {post.readTime}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Filtered Posts */}
            <section className="px-6 pb-24 pt-8">
                <div className="container mx-auto">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full" />
                            <h2 className="text-2xl font-bold text-white">
                                {selectedCategory === "All" ? "All Articles" : selectedCategory}
                            </h2>
                        </div>
                        <span className="text-white/40 text-sm">
                            {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
                        </span>
                    </div>

                    {/* Posts Grid */}
                    {filteredPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group"
                                >
                                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-neutral-900 border border-white/5 group-hover:border-emerald-500/30 transition-all duration-300">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
                                            {post.category}
                                        </span>
                                        <span className="text-white/30">•</span>
                                        <span className="text-white/40 text-xs">{post.readTime} read</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors mb-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-white/50 text-sm line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-white/40 text-lg">No articles found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24">
                <div className="container mx-auto">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 border border-white/10 p-12 text-center">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Plan Your Trip?
                            </h2>
                            <p className="text-white/60 mb-8 max-w-xl mx-auto">
                                Let SafarAI's AI create your perfect personalized itinerary in seconds.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors"
                            >
                                Plan My Trip
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 px-6">
                <div className="container mx-auto text-center text-white/40 text-sm">
                    © 2025 SafarAI. All rights reserved.
                </div>
            </footer>
        </main>
    )
}
