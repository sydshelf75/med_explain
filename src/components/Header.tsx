"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="glass fixed top-0 left-0 right-0 z-50" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 no-underline group">
                    <div
                        className="flex items-center justify-center rounded-lg p-2 transition-all duration-300 group-hover:scale-105"
                        style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}
                    >
                        <Activity size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                        Med<span style={{ color: 'var(--primary)' }}>Explain</span>
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-1">
                    <NavLink href="/" active={pathname === "/"}>
                        Home
                    </NavLink>
                    <NavLink href="/upload" active={pathname === "/upload"}>
                        Upload Report
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

function NavLink({
    href,
    active,
    children,
}: {
    href: string;
    active: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="px-4 py-2 rounded-full text-sm font-medium no-underline transition-all duration-200"
            style={{
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                background: active ? 'var(--primary-glow)' : 'transparent',
            }}
        >
            {children}
        </Link>
    );
}
