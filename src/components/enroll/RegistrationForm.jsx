'use client';

import { useRef, useState } from 'react';
import { formatPrice } from '../../utils/format.js';

export default function RegistrationForm({ allClasses = [], selectedClassId, onClassChange, onSubmit }) {
    const [validated, setValidated] = useState(false);
    const [message, setMessage] = useState('');
    const formRef = useRef(null);

    function handleSubmit(event) {
        event.preventDefault();
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
                            {allClasses.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name} - {formatPrice(c.monthlyFee)} / month
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
