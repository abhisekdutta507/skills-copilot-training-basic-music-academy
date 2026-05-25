'use client';

import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { formatPrice } from '../../utils/format.js';
import { enrollmentsApi } from '@/lib/api.js';
import PaymentDemoPanel from '@/components/enroll/PaymentDemoPanel.jsx';

export default function RegistrationForm({ allClasses = [], selectedClassId, onClassChange, onSubmit }) {
    const [validated, setValidated] = useState(false);
    const [checkoutEnrollment, setCheckoutEnrollment] = useState(null);
    const [paymentNotice, setPaymentNotice] = useState(null);
    const formRef = useRef(null);

    const registrationMutation = useMutation({
        mutationFn: enrollmentsApi.submit,
        onSuccess: (enrollment) => {
            setValidated(false);
            setPaymentNotice({
                tone: 'info',
                message: 'Registration saved. Complete the card payment below to activate the enrollment.',
            });
            setCheckoutEnrollment(enrollment);
        },
    });

    const paymentMutation = useMutation({
        mutationFn: (id) => enrollmentsApi.completePayment(id),
        onSuccess: (enrollment) => {
            setCheckoutEnrollment(enrollment);
            onSubmit('registration', {
                studentName: enrollment.studentName,
                classId: enrollment.courseId,
                paymentStatus: enrollment.paymentStatus,
                paymentReference: enrollment.paymentReference,
            });

            if (enrollment.paymentStatus === 'PAID') {
                setPaymentNotice({
                    tone: 'success',
                    message: 'Payment successful. Enrollment is now active.',
                });
                formRef.current?.reset();
                onClassChange(enrollment.courseId);
                setCheckoutEnrollment(null);
                return;
            }

            setPaymentNotice({
                tone: 'danger',
                message: 'Payment could not be completed. Please try again.',
            });
        },
    });

    const hasOpenCheckout = Boolean(checkoutEnrollment);
    const isFormLocked = hasOpenCheckout || registrationMutation.isPending || paymentMutation.isPending;

    function handleSubmit(event) {
        event.preventDefault();
        if (!formRef.current.checkValidity()) {
            setValidated(true);
            return;
        }

        setPaymentNotice(null);
        const raw = Object.fromEntries(new FormData(formRef.current));
        registrationMutation.mutate({
            studentName: raw.studentName,
            guardianName: raw.guardianName,
            email: raw.email,
            phone: raw.phone,
            classId: raw.classId,
            startDate: raw.startMonth || undefined,
        });
    }

    function handlePaymentSubmit() {
        if (!checkoutEnrollment || paymentMutation.isPending) return;
        paymentMutation.mutate(checkoutEnrollment.id);
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
                {!checkoutEnrollment ? (
                    <form
                        ref={formRef}
                        className={`needs-validation${validated ? ' was-validated' : ''}`}
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <fieldset className="row g-3 border-0 p-0 m-0" disabled={isFormLocked}>
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
                        <button className="btn btn-dark" type="submit" disabled={isFormLocked}>
                            {registrationMutation.isPending ? (
                                <><span className="spinner-border spinner-border-sm me-2" />Submitting…</>
                            ) : (
                                hasOpenCheckout ? 'Registration Saved' : 'Continue to Payment'
                            )}
                        </button>
                        {paymentNotice && (
                            <div className={`form-message text-${paymentNotice.tone}`}>
                                {paymentNotice.message}
                            </div>
                        )}
                        {registrationMutation.isError && (
                            <div className="form-message text-danger">
                                {registrationMutation.error?.response?.data?.error || 'Submission failed. Please try again.'}
                            </div>
                        )}
                        {paymentMutation.isError && (
                            <div className="form-message text-danger">
                                {paymentMutation.error?.response?.data?.error || 'Payment failed. Please try again.'}
                            </div>
                        )}
                    </div>
                    </fieldset>
                    </form>
                ) : (
                    <div className="mt-4">
                        <div className="form-message text-info mb-3">
                            {paymentNotice?.message}
                        </div>
                    </div>
                )}

                {checkoutEnrollment && (
                    <PaymentDemoPanel
                        enrollment={checkoutEnrollment}
                        isProcessing={paymentMutation.isPending}
                        onPay={handlePaymentSubmit}
                    />
                )}
            </div>
        </div>
    );
}
