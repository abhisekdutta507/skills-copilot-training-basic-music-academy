import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const linkClass = ({ isActive }) =>
        `nav-link${isActive ? ' active' : ''}`;

    return (
        <nav className="navbar navbar-expand-lg academy-navbar sticky-top">
            <div className="container py-2">
                <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <span className="brand-mark">B</span>
                    <span>
                        <span className="brand-title">Basic Music Academy</span>
                        <span className="brand-subtitle d-block">Learn. Perform. Grow.</span>
                    </span>
                </NavLink>
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
                            <NavLink className={linkClass} to="/" end>Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/classes">Classes</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/enroll">Enroll</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
