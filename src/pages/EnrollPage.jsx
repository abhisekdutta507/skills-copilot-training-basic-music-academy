import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { classes } from '../data/classes.js';
import { useSubmissions } from '../hooks/useSubmissions.js';
import ClassSummary from '../components/enroll/ClassSummary.jsx';
import SubmissionList from '../components/enroll/SubmissionList.jsx';
import DemoForm from '../components/enroll/DemoForm.jsx';
import RegistrationForm from '../components/enroll/RegistrationForm.jsx';

export default function EnrollPage() {
    const [searchParams] = useSearchParams();
    const { hash } = useLocation();
    const { submissions, addSubmission } = useSubmissions();

    const [selectedClassId, setSelectedClassId] = useState(() => {
        const id = searchParams.get('class');
        return id && classes.some(c => c.id === id) ? id : '';
    });

    // Scroll to hash section on mount and hash changes.
    useEffect(() => {
        if (!hash) return;
        const el = document.querySelector(hash);
        if (el) {
            setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, [hash]);

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
                                    <ClassSummary classId={selectedClassId} />
                                </div>
                                <div className="summary-card">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h2 className="h5 mb-0">Recent submissions</h2>
                                        <span className="badge text-bg-light">Local only</span>
                                    </div>
                                    <SubmissionList submissions={submissions} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-8 order-xl-1">
                            <div className="row g-4">
                                <DemoForm
                                    selectedClassId={selectedClassId}
                                    onClassChange={setSelectedClassId}
                                    onSubmit={addSubmission}
                                />
                                <RegistrationForm
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
