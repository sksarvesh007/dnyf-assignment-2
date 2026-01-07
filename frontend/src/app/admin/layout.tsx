import { Navbar } from "@/components/Navbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden font-sans antialiased text-foreground selection:bg-primary/20">
            {/* Background Gradient/Grid Effect can be added here */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background dark:bg-grid-white/[0.05] bg-grid-black/[0.05]">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            </div>

            <Navbar />
            <main className="flex-1 h-full overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}
