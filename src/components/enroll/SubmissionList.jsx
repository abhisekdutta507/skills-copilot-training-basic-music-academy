export default function SubmissionList({ submissions, allClasses = [] }) {
    const recent = submissions.slice(-4).reverse();

    if (recent.length === 0) {
        return <p className="mb-0 text-body-secondary">No submissions yet.</p>;
    }

    return recent.map((submission, index) => {
        const cls = allClasses.find(c => c.id === submission.classId);
        const className = cls ? cls.name : 'Unknown class';
        const paymentLabel = submission.paymentStatus
            ? submission.paymentStatus === 'PAID'
                ? 'Payment completed'
                : submission.paymentStatus === 'FAILED'
                    ? 'Payment failed'
                    : submission.paymentStatus === 'PENDING'
                        ? 'Payment pending'
                        : submission.paymentStatus
            : null;

        return (
            <div key={index} className="submission-item">
                <strong>{submission.studentName}</strong>
                <small>
                    {submission.type === 'demo' ? 'Demo request' : 'Registration'} for {className}
                </small>
                {paymentLabel && (
                    <small>
                        {paymentLabel}
                        {submission.paymentReference ? ` (${submission.paymentReference})` : ''}
                    </small>
                )}
            </div>
        );
    });
}
