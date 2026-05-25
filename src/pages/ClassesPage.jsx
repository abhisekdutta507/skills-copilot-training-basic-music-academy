import { useState, useMemo } from 'react';
import { classes } from '../data/classes.js';
import ClassCard from '../components/ClassCard.jsx';

const categories = [...new Set(classes.map(c => c.category))];

export default function ClassesPage() {
    const [category, setCategory] = useState('all');
    const [level, setLevel] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        return classes.filter(c => {
            const matchesCategory = category === 'all' || c.category === category;
            const matchesLevel = level === 'all' || c.level === level;
            const haystack = `${c.name} ${c.category} ${c.blurb} ${c.instructor}`.toLowerCase();
            const matchesSearch = search.trim() === '' || haystack.includes(search.trim().toLowerCase());
            return matchesCategory && matchesLevel && matchesSearch;
        });
    }, [category, level, search]);

    return (
        <>
            <section className="page-hero py-5">
                <div className="container">
                    <div className="row g-4 align-items-end">
                        <div className="col-lg-8">
                            <span className="eyebrow">All programs</span>
                            <h1 className="section-title mt-2">
                                Compare classes, levels, schedules, and monthly fees.
                            </h1>
                            <p className="lead text-body-secondary mt-3 mb-0">
                                This catalog is seeded from a single JavaScript data module so
                                participants can later swap it for an API or CMS.
                            </p>
                        </div>
                        <div className="col-lg-4">
                            <div className="catalog-note">
                                <strong>Starter scope</strong>
                                <p className="mb-0 mt-2">
                                    Public browsing, demo booking, and registration flows without
                                    a backend.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-5">
                <div className="container">
                    <div className="filter-panel mb-4">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-5">
                                <label className="form-label" htmlFor="instrumentFilter">
                                    Filter by instrument type
                                </label>
                                <select
                                    className="form-select"
                                    id="instrumentFilter"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    <option value="all">All instruments</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label" htmlFor="levelFilter">
                                    Filter by level
                                </label>
                                <select
                                    className="form-select"
                                    id="levelFilter"
                                    value={level}
                                    onChange={e => setLevel(e.target.value)}
                                >
                                    <option value="all">All levels</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="searchInput">Search</label>
                                <input
                                    className="form-control"
                                    id="searchInput"
                                    type="search"
                                    placeholder="Search classes"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {filtered.map(c => (
                            <ClassCard key={c.id} musicClass={c} />
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="empty-state mt-4">
                            <h2 className="h4">No classes match your filters.</h2>
                            <p className="mb-0 text-body-secondary">
                                Try a different level or search term, or reset filters to view all
                                programs.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
