import { Navbar } from "@/components/layout/navbar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            {/* We can use the main Navbar or a custom simplified one. 
          For now, keeping the main Navbar for consistency, or we can hide it.
          Let's hide the main public navbar and build a custom admin shell. */}

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar (simplified for now, can be expanded) */}
                <aside className="w-64 border-r border-white/10 bg-neutral-900/50 backdrop-blur-xl hidden md:flex flex-col">
                    <div className="p-6">
                        <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-emerald-400 font-serif italic">S</span>
                            </div>
                            Safar<span className="text-white/60">Admin</span>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        <a href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-medium">
                            Command Center
                        </a>
                        <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                            View Live Site
                        </a>
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500" />
                            <div className="text-xs">
                                <div className="font-medium text-white">knaseem22</div>
                                <div className="text-white/40">Super Admin</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
