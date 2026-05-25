import { Suspense } from 'react';
import EnrollContent from './EnrollContent';

export default function EnrollPage() {
    return (
        <Suspense>
            <EnrollContent />
        </Suspense>
    );
}
