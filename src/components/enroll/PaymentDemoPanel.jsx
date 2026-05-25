'use client';

import { useState } from 'react';
import { formatPrice } from '@/utils/format.js';

function PaymentBadge({ status }) {
    const toneMap = {
        PENDING: 'payment-demo-badge-pending',
        FAILED: 'payment-demo-badge-failed',
        PAID: 'payment-demo-badge-paid',
        REFUNDED: 'payment-demo-badge-refunded',
    };

    return <span className={`payment-demo-badge ${toneMap[status] ?? 'payment-demo-badge-default'}`}>{status}</span>;
}

function normalizeCardNumber(value) {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
}

function normalizeExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function onlyDigits(value, maxLength) {
    return value.replace(/\D/g, '').slice(0, maxLength);
}

export default function PaymentDemoPanel({ enrollment, isProcessing, onPay }) {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        if (isProcessing) return;
        onPay();
    }

    return (
        <div className="payment-demo-panel mt-4" aria-live="polite">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                    <span className="eyebrow">Card checkout</span>
                    <h3 className="h5 mt-2 mb-1">Complete your debit or credit card payment</h3>
                    <p className="payment-demo-copy mb-0">
                        Secure in-app checkout UI for demo use. Payment is approved immediately after you submit.
                    </p>
                </div>
                <PaymentBadge status={enrollment.paymentStatus} />
            </div>

            <div className="payment-card-visual mb-3" role="presentation">
                <div className="payment-card-brand">BASIC MUSIC ACADEMY</div>
                <div className="payment-card-number">{cardNumber || '•••• •••• •••• ••••'}</div>
                <div className="payment-card-meta">
                    <div>
                        <span>Card holder</span>
                        <strong>{cardName || 'YOUR NAME'}</strong>
                    </div>
                    <div>
                        <span>Expires</span>
                        <strong>{expiry || 'MM/YY'}</strong>
                    </div>
                </div>
            </div>

            <div className="payment-demo-grid mb-3">
                <div className="payment-demo-item">
                    <span>Program</span>
                    <strong>{enrollment.course?.name}</strong>
                </div>
                <div className="payment-demo-item">
                    <span>Amount</span>
                    <strong>{formatPrice(enrollment.paymentAmount ?? enrollment.course?.monthlyFee ?? 0)}</strong>
                </div>
                <div className="payment-demo-item">
                    <span>Enrollment ID</span>
                    <strong>{enrollment.id}</strong>
                </div>
                <div className="payment-demo-item">
                    <span>Reference</span>
                    <strong>{enrollment.paymentReference || 'Generated on success'}</strong>
                </div>
            </div>

            <div className="payment-demo-note mb-3">
                Enter card details and confirm payment. The demo gateway always returns a successful authorization.
            </div>

            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                    <label className="form-label" htmlFor="cardNumber">Card number</label>
                    <input
                        id="cardNumber"
                        className="form-control payment-card-input"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={event => setCardNumber(normalizeCardNumber(event.target.value))}
                        required
                    />
                </div>
                <div className="col-12">
                    <label className="form-label" htmlFor="cardName">Name on card</label>
                    <input
                        id="cardName"
                        className="form-control payment-card-input"
                        autoComplete="cc-name"
                        placeholder="Student or guardian name"
                        value={cardName}
                        onChange={event => setCardName(event.target.value.slice(0, 60))}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="cardExpiry">Expiry (MM/YY)</label>
                    <input
                        id="cardExpiry"
                        className="form-control payment-card-input"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={event => setExpiry(normalizeExpiry(event.target.value))}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="cardCvv">CVV</label>
                    <input
                        id="cardCvv"
                        className="form-control payment-card-input"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        value={cvv}
                        onChange={event => setCvv(onlyDigits(event.target.value, 4))}
                        required
                    />
                </div>
                <div className="col-12 d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <small className="text-body-secondary">Accepted cards: Visa, Mastercard, RuPay</small>
                    <button type="submit" className="btn btn-dark" disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : `Pay ${formatPrice(enrollment.course?.monthlyFee ?? 0)}`}
                    </button>
                </div>
            </form>
        </div>
    );
}