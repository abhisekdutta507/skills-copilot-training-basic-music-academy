import { useState, useCallback } from 'react';

const STORAGE_KEY = 'basic-music-academy-submissions';

function readSubmissions() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function useSubmissions() {
    const [submissions, setSubmissions] = useState(readSubmissions);

    const addSubmission = useCallback((type, formData) => {
        const entry = {
            type,
            studentName: formData.studentName,
            classId: formData.classId,
            paymentStatus: formData.paymentStatus,
            paymentReference: formData.paymentReference,
            timestamp: new Date().toISOString(),
        };
        setSubmissions(prev => {
            const next = [...prev, entry];
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // ignore storage errors
            }
            return next;
        });
    }, []);

    return { submissions, addSubmission };
}
