'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import CourseForm from '@/components/admin/CourseForm.jsx';
import { adminCoursesApi } from '@/lib/api.js';

export default function NewCoursePage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: adminCoursesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            router.push('/admin/courses');
        },
    });

    return (
        <div className="admin-page p-3 p-md-4 p-xl-5" style={{ maxWidth: 900 }}>
            <div className="mb-4">
                <Link href="/admin/courses" className="text-decoration-none text-body-secondary small">
                    ← Back to Courses
                </Link>
                <h1 className="h3 mt-2 mb-1">Add New Course</h1>
            </div>

            {mutation.error && (
                <div className="alert alert-danger">
                    {mutation.error.response?.data?.error || 'Failed to create course. Please try again.'}
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    <CourseForm onSubmit={mutation.mutate} loading={mutation.isPending} />
                </div>
            </div>
        </div>
    );
}
