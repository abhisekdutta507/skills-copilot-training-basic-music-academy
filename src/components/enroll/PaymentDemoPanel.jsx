'use client';

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

export default function PaymentDemoPanel({ enrollment, isProcessing, onOutcome }) {
    return (
        <div className="payment-demo-panel mt-4" aria-live="polite">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                    <span className="eyebrow">Demo checkout</span>
                    <h3 className="h5 mt-2 mb-1">Complete the payment simulation</h3>
                    <p className="payment-demo-copy mb-0">
                        This is an in-app payment stub for demo use only. No real card or gateway credentials are used.
                    </p>
                </div>
                <PaymentBadge status={enrollment.paymentStatus} />
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

            {enrollment.paymentFailureReason ? (
                <div className="payment-demo-note payment-demo-note-danger mb-3">
                    {enrollment.paymentFailureReason}
                </div>
            ) : (
                <div className="payment-demo-note mb-3">
                    Choose an outcome to simulate a sandbox checkout response.
                </div>
            )}

            <div className="d-flex flex-wrap gap-2">
                <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => onOutcome('success')}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Simulate Payment Success'}
                </button>
                <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => onOutcome('failure')}
                    disabled={isProcessing}
                >
                    Simulate Payment Failure
                </button>
            </div>
        </div>
    );
}