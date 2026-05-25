import { useRef, useState } from 'react';
import { classes } from '../../data/classes.js';
import { formatPrice } from '../../utils/format.js';

export default function DemoForm({ selectedClassId, onClassChange, onSubmit }) {
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
                                    {c.name} - {formatPrice(c.monthlyFee)} / month
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
