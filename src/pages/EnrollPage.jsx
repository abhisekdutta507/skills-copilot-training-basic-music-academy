import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { classes, getClassById } from '../data/classes.js';
import { formatPrice } from '../utils/format.js';
import { useSubmissions } from '../hooks/useSubmissions.js';

function ClassSummary({ classId }) {
    const selected = getClassById(classId);

    if (!selected) {
        return (
            <>
                <p className="text-body-secondary mb-2">Selected class</p>
                <h2 className="h4">Choose a class from the form</h2>
                <p className="mb-0">Monthly fee, schedule, and mode will appear here.</p>
            </>
        );
    }

    return (
        <>
            <p className="text-body-secondary mb-2">Selected class</p>
            <h2 className="h4">{selected.name}</h2>
            <p className="mb-3">{selected.blurb}</p>
            <div className="detail-row mb-2">
                <span>Monthly fee</span>
                <strong>{formatPrice(selected.monthlyFee)}</strong>
            </div>
            <div className="detail-row mb-2">
                <span>Schedule</span>
                <strong>{selected.schedule}</strong>
            </div>
            <div className="detail-row">
                <span>Batch</span>
                <strong>{selected.batch}</strong>
            </div>
        </>
    );
}

function SubmissionList({ submissions }) {
    const recent = submissions.slice(-4).reverse();

    if (recent.length === 0) {
        return <p className="mb-0 text-body-secondary">No submissions yet.</p>;
    }

    return recent.map((s, i) => {
        const cls = getClassById(s.classId);
        const className = cls ? cls.name : 'Unknown class';
        return (
            <div key={i} className="submission-item">
                <strong>{s.studentName}</strong>
                <small>
                    {s.type === 'demo' ? 'Demo request' : 'Registration'} for {className}
                </small>
            </div>
        );
    });
}

function DemoForm({ selectedClassId, onClassChange, onSubmit }) {
    const [validated, setValidated] = useState(false);
    const [message, setMessage] = useState('');
    const formRef = useRef(null);

    function handleSubmit(e) {
        e.preventDefault();
        if (!formRef.current.checkValidity()) {
            setValidated(true);
            return;
        }
        const data = Object.fromEntries(new FormData(formRef.current));
        onSubmit('demo', data);
        setMessage('Demo request saved in local storage.');
        setValidated(false);
        formRef.current.reset();
        onClassChange(data.classId);
    }

    return (
        <div className="col-12">
            <div className="form-shell">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                    <div>
                        <span className="eyebrow">Demo class</span>
                        <h2 className="h3 mt-2 mb-1" id="demo-form">Book a demo lesson</h2>
                        <p className="mb-0 text-body-secondary">
                            A lightweight starter flow for trial class inquiries.
                        </p>
                    </div>
                </div>
                <form
                    ref={formRef}
                    className={`row g-3 needs-validation${validated ? ' was-validated' : ''}`}
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="demoName">Student name</label>
                        <input className="form-control" id="demoName" name="studentName" required />
                        <div className="invalid-feedback">Please enter the student name.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="demoAge">Age</label>
                        <input
                            className="form-control"
                            id="demoAge"
                            name="age"
                            type="number"
                            min="5"
                            max="70"
                            required
                        />
                        <div className="invalid-feedback">Enter an age between 5 and 70.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="demoEmail">Email</label>
                        <input
                            className="form-control"
                            id="demoEmail"
                            name="email"
                            type="email"
                            required
                        />
                        <div className="invalid-feedback">Enter a valid email address.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="demoPhone">Phone number</label>
                        <input
                            className="form-control"
                            id="demoPhone"
                            name="phone"
                            type="tel"
                            pattern="[0-9]{10}"
                            required
                        />
                        <div className="invalid-feedback">Enter a 10-digit phone number.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="demoInstrument">Instrument</label>
                        <select
                            className="form-select"
                            id="demoInstrument"
                            name="classId"
                            value={selectedClassId}
                            onChange={e => onClassChange(e.target.value)}
                            required
                        >
                            <option value="">Select a class</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name} — {formatPrice(c.monthlyFee)} / month
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">Choose an instrument class.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="demoSlot">Preferred demo slot</label>
                        <input
                            className="form-control"
                            id="demoSlot"
                            name="preferredSlot"
                            placeholder="Example: Saturday 11 AM"
                            required
                        />
                        <div className="invalid-feedback">Add a preferred slot.</div>
                    </div>
                    <div className="col-12">
                        <label className="form-label" htmlFor="demoNotes">Notes</label>
                        <textarea
                            className="form-control"
                            id="demoNotes"
                            name="notes"
                            rows="3"
                            placeholder="Preferred level, prior experience, or other requirements"
                        ></textarea>
                    </div>
                    <div className="col-12 d-flex flex-wrap gap-3 align-items-center">
                        <button className="btn btn-accent" type="submit">Request Demo</button>
                        {message && <div className="form-message text-success">{message}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
}

function RegistrationForm({ selectedClassId, onClassChange, onSubmit }) {
    const [validated, setValidated] = useState(false);
    const [message, setMessage] = useState('');
    const formRef = useRef(null);

    function handleSubmit(e) {
        e.preventDefault();
        if (!formRef.current.checkValidity()) {
            setValidated(true);
            return;
        }
        const data = Object.fromEntries(new FormData(formRef.current));
        onSubmit('registration', data);
        setMessage('Registration saved in local storage.');
        setValidated(false);
        formRef.current.reset();
        onClassChange(data.classId);
    }

    return (
        <div className="col-12">
            <div className="form-shell">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                    <div>
                        <span className="eyebrow">Monthly admission</span>
                        <h2 className="h3 mt-2 mb-1" id="registration-form">Register for classes</h2>
                        <p className="mb-0 text-body-secondary">
                            Straightforward fields by design so teams can later replace or
                            enhance the workflow.
                        </p>
                    </div>
                </div>
                <form
                    ref={formRef}
                    className={`row g-3 needs-validation${validated ? ' was-validated' : ''}`}
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="registerName">Student name</label>
                        <input
                            className="form-control"
                            id="registerName"
                            name="studentName"
                            required
                        />
                        <div className="invalid-feedback">Please enter the student name.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="registerGuardian">
                            Parent or guardian
                        </label>
                        <input
                            className="form-control"
                            id="registerGuardian"
                            name="guardianName"
                            required
                        />
                        <div className="invalid-feedback">
                            Please enter the parent or guardian name.
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="registerEmail">Email</label>
                        <input
                            className="form-control"
                            id="registerEmail"
                            name="email"
                            type="email"
                            required
                        />
                        <div className="invalid-feedback">Enter a valid email address.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="registerPhone">Phone number</label>
                        <input
                            className="form-control"
                            id="registerPhone"
                            name="phone"
                            type="tel"
                            pattern="[0-9]{10}"
                            required
                        />
                        <div className="invalid-feedback">Enter a 10-digit phone number.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="registerInstrument">Program</label>
                        <select
                            className="form-select"
                            id="registerInstrument"
                            name="classId"
                            value={selectedClassId}
                            onChange={e => onClassChange(e.target.value)}
                            required
                        >
                            <option value="">Select a class</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name} — {formatPrice(c.monthlyFee)} / month
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">Choose a program.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="registerMode">
                            Batch preference
                        </label>
                        <select
                            className="form-select"
                            id="registerMode"
                            name="batchPreference"
                            required
                        >
                            <option value="">Select batch preference</option>
                            <option value="Weekday">Weekday</option>
                            <option value="Weekend">Weekend</option>
                            <option value="Either">Either</option>
                        </select>
                        <div className="invalid-feedback">Choose a batch preference.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="registerStart">
                            Preferred start month
                        </label>
                        <input
                            className="form-control"
                            id="registerStart"
                            name="startMonth"
                            type="month"
                            required
                        />
                        <div className="invalid-feedback">Choose a start month.</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="registerExperience">
                            Prior experience
                        </label>
                        <select
                            className="form-select"
                            id="registerExperience"
                            name="experience"
                            required
                        >
                            <option value="">Select experience level</option>
                            <option value="New learner">New learner</option>
                            <option value="Some prior lessons">Some prior lessons</option>
                            <option value="Comfortable performer">Comfortable performer</option>
                        </select>
                        <div className="invalid-feedback">
                            Select the learner experience level.
                        </div>
                    </div>
                    <div className="col-12">
                        <label className="form-label" htmlFor="registerNotes">Goals</label>
                        <textarea
                            className="form-control"
                            id="registerNotes"
                            name="notes"
                            rows="3"
                            placeholder="Example: Trinity preparation, school band, stage confidence"
                        ></textarea>
                    </div>
                    <div className="col-12 d-flex flex-wrap gap-3 align-items-center">
                        <button className="btn btn-dark" type="submit">
                            Complete Registration
                        </button>
                        {message && <div className="form-message text-success">{message}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function EnrollPage() {
    const [searchParams] = useSearchParams();
    const { hash } = useLocation();
    const { submissions, addSubmission } = useSubmissions();

    const [selectedClassId, setSelectedClassId] = useState(() => {
        const id = searchParams.get('class');
        return id && classes.some(c => c.id === id) ? id : '';
    });

    // scroll to hash section on mount / hash change
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
