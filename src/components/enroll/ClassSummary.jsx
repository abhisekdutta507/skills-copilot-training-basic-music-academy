import { getClassById } from '../../data/classes.js';
import { formatPrice } from '../../utils/format.js';

export default function ClassSummary({ classId }) {
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
