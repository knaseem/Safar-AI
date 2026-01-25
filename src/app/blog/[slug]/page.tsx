import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, Share2, Sparkles } from "lucide-react"
import { blogPosts, BlogPost } from "@/lib/blog-data"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }))
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)
    if (!post) return { title: "Not Found" }

    return {
        title: `${post.title} | SafarAI Blog`,
        description: post.excerpt,
    }
}

// Simple content generator based on post data
function generateArticleContent(post: BlogPost): string[] {
    // Special handling for the Detailed Umrah Guide
    if (post.slug === "detailed-umrah-guide-2026") {
        return [
            "Embarking on the journey of Umrah is a dream for millions of Muslims. It is a spiritual reset, a chance to wipe the slate clean, and a moment to stand before the House of Allah. This guide breaks down every step of the process, ensuring you can perform your rites with confidence.",

            "## 1. Preparation & Ihram (The Intention)\n\n**Before you leave home:**\n- Clip your nails, remove unwanted hair, and perform Ghusl (ritual bath).\n- Men: Wear the two white unstitched sheets (Ihram). Do not cover your head.\n- Women: Wear modest, loose-fitting clothing that covers the entire body except the face and hands.\n\n**Entering the State of Ihram:**\n- You must enter Ihram before crossing the Miqat (boundary).\n- If flying, it is best to wear Ihram at the airport or on the plane before the announcement.\n- **Make the Intention (Niyyah):** *\"Labbayk Allahumma Umrah\"* (O Allah, here I am for Umrah).\n- **Start Reciting Talbiyah:**\n*\"Labbayk Allahumma Labbayk. Labbayka La Sharika Laka Labbayk. Innal Hamda Wan-Ni'mata Laka Wal-Mulk. La Sharika Lak.\"*\n*(Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise, blessings, and sovereignty belong to You. You have no partner.)*",

            "## 2. Entering Masjid Al Haram\n\n- Enter with your **right foot** first.\n- Recite: *\"Bismillahi was-salatu was-salamu 'ala Rasulillah. Allahumma aftah li abwaba rahmatik.\"*\n*(In the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, open the gates of Your mercy for me.)*\n- Upon seeing the Kaaba, raise your hands and make dua—this is a time when prayers are accepted.",

            "## 3. Tawaf (Circumambulating the Kaaba)\n\n- **Start at the Black Stone (Hajar al-Aswad):** Raise your right hand towards it and say *\"Bismillahi Allahu Akbar\"*.\n- **Complete 7 Rounds** counter-clockwise around the Kaaba.\n- **Men:** For the first 3 rounds, perform *Ramal* (brisk walking with chest out). The right shoulder should be uncovered (*Idtiba*) during Tawaf only.\n- **During Tawaf:** You can recite Quran, make dua, or simply do Dhikr. There is no specific dua for each round, but the Dua between the Yemeni Corner and the Black Stone is recommended:\n*\"Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar.\"*\n*(Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.)*\n- **After 7 Rounds:** Pray 2 Rak'ats behind Maqam Ibrahim (or anywhere in the Haram).",

            "## 4. Sa'i (Walking between Safa and Marwa)\n\n- Drink Zamzam water before heading to Safa.\n- **Approaching Safa:** Recite the verse:\n*\"Innas-Safaa wal-Marwata min sha'aa'irillaah...\"* (Indeed, Safa and Marwah are among the symbols of Allah).\nThen say: *\"Abda'u bima bada'a Allahu bihi.\"* (I begin with what Allah started with).\n- **At Safa:** Face the Kaaba, raise your hands, and praise Allah. You may recite (3 times):\n*\"Allahu Akbar, Allahu Akbar, Allahu Akbar. La ilaha illallahu wahdahu la sharika lahu, lahul mulku wa lahul hamdu, wa huwa 'ala kulli shay'in qadir. La ilaha illallahu wahdahu, anjaza wa'dah, wa nasara 'abdah, wa hazamal ahzaba wahdah.\"*\n*(Allah is the Greatest. There is no god but Allah alone, with no partner. To Him belongs the Dominion, to Him belongs all praise, and He has power over all things. There is no god but Allah alone. He has fulfilled His promise, granted victory to His servant, and defeated the confederates alone.)*\n- **Walk to Marwa:** This counts as one lap. (Men run between the green lights).\n- **Walk back to Safa:** This is the second lap.\n- **Complete 7 Laps:** Ending at Marwa.",

            "## 5. Halq or Taqsir (Shaving or Trimming)\n\n- **Men:** It is most virtuous to shave the entire head (Halq). Trimming (Taqsir) is also permissible.\n- **Women:** Gather hair and trim about a fingertip's length from the end.\n\n**Congratulations! Your Umrah is complete.** You are now out of the state of Ihram and can wear normal clothes.",

            "## Practical Tips for 2026\n\n- **Nusuk App:** You must book your Umrah slot via the Nusuk app. Rawdah slots fill up weeks in advance.\n- **Best Time:** Perform Tawaf immediately after Fajr or late at night (1 AM - 3 AM) to avoid the biggest crowds.\n- **Footwear:** Carry a shoe bag. You will walk a lot, so keep your shoes with you or in a designated locker you can easily find.\n- **Hydration:** Zamzam dispensers are everywhere. Drink often."
        ]
    }

    const intros: Record<string, string> = {
        "Destinations": `Planning a trip to experience ${post.title.split(':')[0]}? You're in for an unforgettable adventure. This comprehensive guide covers everything you need to know—from must-see attractions to hidden gems that only locals know about.`,
        "Travel Tips": `${post.excerpt} Whether you're a seasoned traveler or just getting started, these insights will transform how you approach your next journey.`,
        "Halal Trip": `Traveling as a Muslim comes with unique considerations, and ${post.title.split(':')[0]} offers incredible experiences for the faithful. From prayer facilities to halal dining, here is your essential guide.`,
        "Halal Travel": `Traveling as a Muslim comes with unique considerations, and ${post.title.split(':')[0]} has evolved to become one of the most welcoming destinations for halal-conscious travelers. Here's your complete guide.`,
        "Luxury & Lifestyle": `For those who appreciate the finer things in travel, ${post.title.split(':')[0]} represents the pinnacle of sophisticated exploration. Here's how to experience it in style.`,
        "Food & Dining": `The best way to understand a culture is through its food. In ${post.title.split(':')[0]}, the culinary scene is vibrant, diverse, and absolutely delicious. Get your appetite ready.`,
    }

    return [
        intros[post.category] || post.excerpt,

        `## Why ${post.title.split(':')[0]}?\n\nThere's something magical about discovering a place that speaks to your soul. ${post.excerpt} The key is knowing where to look and how to make the most of your time.`,

        `## Best Time to Visit\n\nTiming can make or break any trip. For this destination, consider the shoulder seasons—you'll enjoy smaller crowds, better prices, and often the most pleasant weather. Peak season has its advantages too, with more events and activities, but book well in advance.`,

        `## Getting There\n\nMost major airlines offer convenient connections. Look for deals 6-8 weeks before your departure date, and consider flying mid-week for the best fares. Premium economy offers a great balance of comfort and value for longer flights.`,

        `## Where to Stay\n\nAccommodation options range from boutique hotels to luxury resorts. For the best experience, consider staying in a central location that puts you within walking distance of major attractions. Many properties offer special packages that include breakfast and local experiences.`,

        `## Halal-Friendly Experiences\n\n1. **Prayer Facilities** - Most malls and attractions have designated prayer rooms.\n2. **Halal Dining** - Look for the Halal certification logo or ask staff.\n3. **Local Mosques** - Visit historic masjids to connect with the local community.\n4. **Modest Fun** - Enjoy family-friendly activities suitable for all ages.`,

        `## Travel Tips\n\n- Download the local prayer time app (e.g., Muslim Pro or Athan)\n- Carry a travel prayer mat for convenience\n- Learn basic local phrases for connection\n- Leave room in your itinerary for spontaneous discoveries`,

        `## Budget Considerations\n\nExpect to spend moderately for a comfortable experience. Splurge on one or two special experiences that will become lasting memories—whether that's a sunset dinner, a spa day, or a private tour.`,

        `## Final Thoughts\n\nEvery journey begins with a single step—or in this case, a well-planned itinerary. ${post.excerpt} Ready to make it happen? SafarAI can create a personalized itinerary tailored to your preferences in seconds.`
    ]
}



export default async function BlogArticlePage({ params }: Props) {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)

    if (!post) {
        notFound()
    }

    const content = generateArticleContent(post)
    const relatedPosts = blogPosts
        .filter((p) => p.category === post.category && p.slug !== post.slug)
        .slice(0, 3)

    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-24">
                <div className="aspect-[21/9] max-h-[500px] overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="container mx-auto px-6 mt-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-white hover:text-emerald-400 mb-6 transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Blog
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                            {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-gray-300 text-sm">
                            <Clock className="size-4 text-emerald-400" />
                            {post.readTime} read
                        </span>
                        <span className="flex items-center gap-1 text-gray-300 text-sm">
                            <Calendar className="size-4 text-emerald-400" />
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mb-6">
                        {post.title}
                    </h1>

                    <p className="text-xl text-gray-300 max-w-3xl">
                        {post.excerpt}
                    </p>
                </div>
            </section>

            {/* Article Content */}
            <article className="container mx-auto px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <div className="prose prose-invert prose-lg prose-emerald max-w-none">
                        {content.map((section, index) => (
                            <div key={index} className="mb-8">
                                {section.split('\n').map((line, lineIndex) => {
                                    if (line.startsWith('## ')) {
                                        return <h2 key={lineIndex} className="text-2xl font-bold text-white mt-12 mb-4">{line.replace('## ', '')}</h2>
                                    } else if (line.startsWith('1. ') || line.startsWith('- ')) {
                                        return <li key={lineIndex} className="text-gray-300 mb-2 ml-6">{line.replace(/^[0-9]+\. |\*\*|^- /g, '').replace(/\*\*/g, '')}</li>
                                    } else if (line.trim()) {
                                        return <p key={lineIndex} className="text-gray-300 leading-relaxed mb-4">{line}</p>
                                    }
                                    return null
                                })}
                            </div>
                        ))}
                    </div>

                    {/* CTA Box */}
                    <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-white/10 text-center">
                        <Sparkles className="size-8 text-emerald-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Ready to Plan Your Trip?</h3>
                        <p className="text-white/60 mb-6">Let SafarAI create your perfect personalized itinerary in seconds.</p>
                        <Link href="/">
                            <Button variant="premium" size="lg">
                                Plan My Trip Now
                            </Button>
                        </Link>
                    </div>

                    {/* Share */}
                    <div className="flex items-center justify-center gap-4 mt-12 pt-12 border-t border-white/10">
                        <span className="text-white/50">Share this article</span>
                        <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                            <Share2 className="size-5" />
                        </button>
                    </div>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="container mx-auto px-6 pb-24">
                    <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {relatedPosts.map((related) => (
                            <Link
                                key={related.slug}
                                href={`/blog/${related.slug}`}
                                className="group"
                            >
                                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-neutral-900">
                                    <img
                                        src={related.image}
                                        alt={related.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                    {related.title}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 px-6">
                <div className="container mx-auto text-center text-white/40 text-sm">
                    © 2025 SafarAI. All rights reserved.
                </div>
            </footer>
        </main>
    )
}
