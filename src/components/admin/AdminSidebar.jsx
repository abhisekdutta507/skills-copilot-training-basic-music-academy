'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
    { href: '/admin/courses', label: 'Courses', icon: '🎵' },
    { href: '/admin/enrollments', label: 'Enrollments', icon: '📋' },
    { href: '/admin/demo-requests', label: 'Demo Requests', icon: '🎤' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    function isActive(href, exact) {
        return exact ? pathname === href : pathname.startsWith(href);
    }

    async function handleSignOut() {
        await signOut({ redirect: false });
        router.push('/login');
    }

    return (
        <aside className="admin-sidebar d-flex flex-column">
            <div className="admin-sidebar-header p-3">
                <div className="d-flex align-items-center gap-3">
                    <span className="brand-mark">B</span>
                    <div>
                        <div className="fw-semibold small text-white">Music Academy</div>
                        <div className="admin-sidebar-subtitle">Control Center</div>
                    </div>
                </div>
            </div>

            <nav className="flex-grow-1 px-2 pb-2">
                <ul className="nav flex-column gap-1">
                    {NAV_ITEMS.map(({ href, label, icon, exact }) => (
                        <li key={href} className="nav-item">
                            <Link
                                href={href}
                                className={`admin-sidebar-link nav-link rounded-3 px-3 py-2 d-flex align-items-center gap-2 ${
                                    isActive(href, exact) ? 'active' : ''
                                }`}
                            >
                                <span className="admin-sidebar-icon">{icon}</span>
                                <span>{label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-3 admin-sidebar-footer mt-auto">
                <Link href="/" className="btn btn-outline-light btn-sm w-100 mb-2 admin-sidebar-btn">
                    ← View Site
                </Link>
                <button
                    onClick={handleSignOut}
                    className="btn btn-outline-danger btn-sm w-100 admin-sidebar-btn"
                >
                    Sign out
                </button>
            </div>
        </aside>
    );
}
