"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
            active: pathname === "/admin",
        },
        {
            label: "All Reviews",
            icon: MessageSquare,
            href: "/admin/reviews",
            active: pathname === "/admin/reviews",
        },
    ];

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">A</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Admin</span>
                </div>

                <div className="flex items-center gap-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                route.active
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <route.icon className="w-4 h-4" />
                            {route.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden border border-border">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full" />
                </div>
            </div>
        </nav>
    );
}
