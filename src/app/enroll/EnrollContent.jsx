'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../../lib/api';
import { useSubmissions } from '../../hooks/useSubmissions';
import ClassSummary from '../../components/enroll/ClassSummary';
import SubmissionList from '../../components/enroll/SubmissionList';
import DemoForm from '../../components/enroll/DemoForm';
import RegistrationForm from '../../components/enroll/RegistrationForm';

export default function EnrollContent() {
    const searchParams = useSearchParams();
    const { submissions, addSubmission } = useSubmissions();

    const { data: allClasses = [] } = useQuery({
        queryKey: ['classes'],
        queryFn: classesApi.getAll,
    });

    const { data: demoEligibleClasses = [] } = useQuery({
        queryKey: ['classes', 'demo-eligible'],
        queryFn: classesApi.getDemoEligible,
    });

    const [selectedClassId, setSelectedClassId] = useState(() => searchParams.get('class') ?? '');

    // Validate the preselected class id once classes are loaded
    useEffect(() => {
        if (!allClasses.length) return;
        const id = searchParams.get('class');
        if (id && allClasses.some(c => c.id === id)) {
            setSelectedClassId(id);
        }
    }, [allClasses, searchParams]);

    // Scroll to hash section on mount
    useEffect(() => {
        const hash = window.location.hash;
        if (!hash) return;
        const el = document.querySelector(hash);
        if (el) {
            setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, []);

    const selectedClass = allClasses.find(c => c.id === selectedClassId) ?? null;

    return (
        <>
            <section className="page-hero py-5">
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-7">
                            <span className="eyebrow">Enrollment desk</span>
                            <h1 className="section-title mt-2">
                                Choose a demo lesson or register for a monthly program.
                            </h1>
                            <p className="lead text-body-secondary mt-3 mb-0">
                                Both forms use simple client-side validation and save submissions
                                to local browser storage for demo purposes.
                            </p>
                        </div>
                        <div className="col-lg-5">
                            <div className="catalog-note">
                                <strong>What this starter includes</strong>
                                <ul className="mb-0 mt-3 simple-list">
                                    <li>Demo booking flow</li>
                                    <li>Program registration flow</li>
                                    <li>Selected class summary</li>
                                    <li>Recent submissions list</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-5">
                <div className="container">
                    <div className="row g-4 align-items-start">
                        <div className="col-xl-4 order-xl-2">
                            <div className="sticky-summary">
                                <div className="summary-card mb-4">
                                    <ClassSummary classData={selectedClass} />
                                </div>
                                <div className="summary-card">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h2 className="h5 mb-0">Recent submissions</h2>
                                        <span className="badge text-bg-light">Local only</span>
                                    </div>
                                    <SubmissionList
                                        submissions={submissions}
                                        allClasses={allClasses}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-8 order-xl-1">
                            <div className="row g-4">
                                <DemoForm
                                    allClasses={demoEligibleClasses}
                                    selectedClassId={selectedClassId}
                                    onClassChange={setSelectedClassId}
                                    onSubmit={addSubmission}
                                />
                                <RegistrationForm
                                    allClasses={allClasses}
                                    selectedClassId={selectedClassId}
                                    onClassChange={setSelectedClassId}
                                    onSubmit={addSubmission}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
