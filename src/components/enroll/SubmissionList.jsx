import { getClassById } from '../../data/classes.js';

export default function SubmissionList({ submissions }) {
    const recent = submissions.slice(-4).reverse();

    if (recent.length === 0) {
        return <p className="mb-0 text-body-secondary">No submissions yet.</p>;
    }

    return recent.map((submission, index) => {
        const cls = getClassById(submission.classId);
        const className = cls ? cls.name : 'Unknown class';

        return (
            <div key={index} className="submission-item">
                <strong>{submission.studentName}</strong>
                <small>
                    {submission.type === 'demo' ? 'Demo request' : 'Registration'} for {className}
                </small>
            </div>
        );
    });
}
