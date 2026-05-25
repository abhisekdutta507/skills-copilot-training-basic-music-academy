'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const linkClass = (href, exact = false) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return `nav-link${isActive ? ' active' : ''}`;
    };

    return (
        <nav className="navbar navbar-expand-lg academy-navbar sticky-top">
            <div className="container py-2">
                <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
                    <span className="brand-mark">B</span>
                    <span>
                        <span className="brand-title">Basic Music Academy</span>
                        <span className="brand-subtitle d-block">Learn. Perform. Grow.</span>
                    </span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#academyNav"
                    aria-controls="academyNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="academyNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        <li className="nav-item">
                            <Link className={linkClass('/', true)} href="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={linkClass('/classes')} href="/classes">Classes</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={linkClass('/enroll')} href="/enroll">Enroll</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
