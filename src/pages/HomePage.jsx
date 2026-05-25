import { Link } from 'react-router-dom';
import { classes } from '../data/classes.js';
import ClassCard from '../components/ClassCard.jsx';

export default function HomePage() {
    return (
        <>
            <section className="hero-section overflow-hidden">
                <div className="container position-relative">
                    <div className="row align-items-center gy-5">
                        <div className="col-lg-6">
                            <span className="eyebrow">Music classes for every stage</span>
                            <h1 className="display-4 hero-title mt-3">
                                Build confidence through weekly instrument training.
                            </h1>
                            <p className="hero-copy mt-4">
                                Discover structured classes for guitar, piano, violin, drums, flute,
                                keyboard, and vocal training. Compare monthly fees in Indian rupees,
                                book a demo lesson, and join a batch that fits your schedule.
                            </p>
                            <div className="d-flex flex-wrap gap-3 mt-4">
                                <Link className="btn btn-accent btn-lg" to="/classes">
                                    Explore Classes
                                </Link>
                                <Link className="btn btn-outline-dark btn-lg" to="/enroll#demo-form">
                                    Book Demo
                                </Link>
                            </div>
                            <div className="hero-metrics row row-cols-2 row-cols-md-4 g-3 mt-4">
                                <div className="col">
                                    <div className="metric-card">
                                        <strong>7</strong>
                                        <span>Instrument tracks</span>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="metric-card">
                                        <strong>INR 1,800+</strong>
                                        <span>Monthly plans</span>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="metric-card">
                                        <strong>Weekend</strong>
                                        <span>Flexible batches</span>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="metric-card">
                                        <strong>Demo</strong>
                                        <span>Available now</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-panel shadow-lg">
                                <div className="hero-panel-header d-flex justify-content-between align-items-center">
                                    <span className="pill-label">Popular this month</span>
                                    <span className="text-body-secondary">Beginner friendly</span>
                                </div>
                                <div className="featured-class-card mt-4">
                                    <p className="featured-kicker">Featured program</p>
                                    <h2>Contemporary Guitar</h2>
                                    <p>
                                        Technique, rhythm reading, and stage-ready performance
                                        practice across weekday and weekend batches.
                                    </p>
                                    <div className="d-flex flex-wrap gap-2 mb-4">
                                        <span className="chip">3 sessions / week</span>
                                        <span className="chip">INR 2,400 / month</span>
                                        <span className="chip">Age 10+</span>
                                    </div>
                                    <Link
                                        className="btn btn-dark"
                                        to="/enroll?class=guitar-foundations#registration-form"
                                    >
                                        Register for Guitar
                                    </Link>
                                </div>
                                <div className="mini-timetable row g-3 mt-1">
                                    <div className="col-sm-6">
                                        <div className="schedule-card">
                                            <span>Tue / Thu</span>
                                            <strong>5:00 PM - 6:00 PM</strong>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="schedule-card">
                                            <span>Sat</span>
                                            <strong>11:00 AM - 1:00 PM</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="section-heading d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
                        <div>
                            <span className="eyebrow">Instrument classes</span>
                            <h2 className="section-title mt-2">Browse featured programs</h2>
                        </div>
                        <Link className="link-dark fw-semibold" to="/classes">
                            View full catalog
                        </Link>
                    </div>
                    <div className="row g-4">
                        {classes.slice(0, 3).map(c => (
                            <ClassCard key={c.id} musicClass={c} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-5 academy-band">
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-5">
                            <span className="eyebrow">Why families choose us</span>
                            <h2 className="section-title mt-2">
                                A starter app that already shows useful patterns.
                            </h2>
                        </div>
                        <div className="col-lg-7">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="value-card h-100">
                                        <h3>Simple pricing</h3>
                                        <p>
                                            Monthly fees stay visible across cards, detail blocks,
                                            and forms in INR.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="value-card h-100">
                                        <h3>Demo first</h3>
                                        <p>
                                            Students can request a demo class before committing
                                            to a full batch.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="value-card h-100">
                                        <h3>Refactor ready</h3>
                                        <p>
                                            Data, rendering, and form handling are separated so
                                            participants can evolve the codebase quickly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="cta-panel text-center text-lg-start d-lg-flex align-items-center justify-content-between gap-4">
                        <div>
                            <span className="eyebrow">Ready to join a batch?</span>
                            <h2 className="section-title mt-2 mb-2">
                                Reserve a demo lesson or complete your registration.
                            </h2>
                            <p className="mb-0 text-body-secondary">
                                Use the starter flow now, then let your hackathon team extend it
                                with APIs, dashboards, and richer workflows.
                            </p>
                        </div>
                        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mt-4 mt-lg-0">
                            <Link className="btn btn-accent btn-lg" to="/enroll#demo-form">
                                Book Demo
                            </Link>
                            <Link className="btn btn-dark btn-lg" to="/enroll#registration-form">
                                Register Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
