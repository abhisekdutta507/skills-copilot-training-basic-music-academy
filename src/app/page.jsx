import Link from 'next/link';
import { classes } from '../data/classes';
import ClassCard from '../components/ClassCard';

const featured = classes.slice(0, 3);

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
                                <Link className="btn btn-accent btn-lg" href="/classes">
                                    Explore Classes
                                </Link>
                                <Link className="btn btn-outline-dark btn-lg" href="/enroll#demo-form">
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
                                        href="/enroll?class=guitar-foundations#registration-form"
                                    >
                                        Register for Guitar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="featured-section py-5">
                <div className="container">
                    <div className="row g-4 align-items-end mb-4">
                        <div className="col-lg-8">
                            <span className="eyebrow">Start here</span>
                            <h2 className="section-title mt-2">
                                Three beginner-friendly programs to explore first.
                            </h2>
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            <Link className="btn btn-outline-dark" href="/classes">
                                View all classes
                            </Link>
                        </div>
                    </div>
                    <div className="row g-4">
                        {featured.map(c => (
                            <ClassCard key={c.id} musicClass={c} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
