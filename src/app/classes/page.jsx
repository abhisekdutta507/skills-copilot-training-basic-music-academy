'use client';

import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../../lib/api';
import ClassCard from '../../components/ClassCard';
import CatalogFilters from '../../components/classes/CatalogFilters';

export default function ClassesPage() {
    const [category, setCategory] = useState('all');
    const [level, setLevel] = useState('all');
    const [search, setSearch] = useState('');

    const { data: filtered = [] } = useQuery({
        queryKey: ['classes', { category, level, search }],
        queryFn: () => classesApi.getFiltered({ category, level, search }),
    });

    const allCategoriesRef = useRef(null);
    if (allCategoriesRef.current === null && filtered.length > 0) {
        allCategoriesRef.current = [...new Set(filtered.map(c => c.category))];
    }
    const categories = allCategoriesRef.current ?? [];

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
                                The catalog is served from the{' '}
                                <code>/api/classes</code> endpoint so it can be
                                swapped for any backend or CMS.
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
                    <CatalogFilters
                        categories={categories}
                        category={category}
                        level={level}
                        search={search}
                        onCategoryChange={setCategory}
                        onLevelChange={setLevel}
                        onSearchChange={setSearch}
                    />

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
