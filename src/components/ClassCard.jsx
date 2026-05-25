import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format.js';

export default function ClassCard({ musicClass }) {
    const enrollTo = (hash) => ({
        pathname: '/enroll',
        search: `?class=${musicClass.id}`,
        hash,
    });

    return (
        <div className="col-md-6 col-xl-4">
            <article className="class-card">
                <div className="d-flex justify-content-between align-items-start gap-3">
                    <div className="class-symbol">{musicClass.icon}</div>
                    <span className="price-tag">{formatPrice(musicClass.monthlyFee)} / month</span>
                </div>
                <h3>{musicClass.name}</h3>
                <p>{musicClass.blurb}</p>
                <div className="class-meta">
                    <span className="meta-badge">{musicClass.category}</span>
                    <span className="meta-badge">{musicClass.level}</span>
                    <span className="meta-badge">{musicClass.batch}</span>
                </div>
                <div className="detail-grid">
                    <div className="detail-row">
                        <span>Schedule</span>
                        <strong>{musicClass.schedule}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Session length</span>
                        <strong>{musicClass.duration}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Instructor</span>
                        <strong>{musicClass.instructor}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Age group</span>
                        <strong>{musicClass.ageGroup}</strong>
                    </div>
                </div>
                <div className="mt-auto d-flex flex-wrap gap-2">
                    <Link className="btn btn-accent" to={enrollTo('#registration-form')}>
                        Register
                    </Link>
                    <Link className="btn btn-outline-dark" to={enrollTo('#demo-form')}>
                        {musicClass.demoAvailable ? 'Book Demo' : 'Join Waitlist'}
                    </Link>
                </div>
            </article>
        </div>
    );
}
