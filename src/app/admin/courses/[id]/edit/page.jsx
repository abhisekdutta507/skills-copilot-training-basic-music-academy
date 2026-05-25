'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import CourseForm from '@/components/admin/CourseForm.jsx';
import { adminCoursesApi } from '@/lib/api.js';

export default function EditCoursePage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: course, isLoading } = useQuery({
        queryKey: ['admin', 'courses', id],
        queryFn: () => adminCoursesApi.getById(id),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: (data) => adminCoursesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            router.push('/admin/courses');
        },
    });

    if (isLoading) {
        return (
            <div className="admin-page p-3 p-md-4 p-xl-5 text-center">
                <span className="spinner-border text-primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="admin-page p-3 p-md-4 p-xl-5">
                <div className="alert alert-danger">Course not found.</div>
                <Link href="/admin/courses" className="btn btn-secondary">Back to Courses</Link>
            </div>
        );
    }

    return (
        <div className="admin-page p-3 p-md-4 p-xl-5" style={{ maxWidth: 900 }}>
            <div className="mb-4">
                <Link href="/admin/courses" className="text-decoration-none text-body-secondary small">
                    ← Back to Courses
                </Link>
                <h1 className="h3 mt-2 mb-0">Edit Course</h1>
                <p className="text-body-secondary">{course.name}</p>
            </div>

            {mutation.error && (
                <div className="alert alert-danger">
                    {mutation.error.response?.data?.error || 'Failed to save changes. Please try again.'}
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    <CourseForm
                        defaultValues={course}
                        onSubmit={mutation.mutate}
                        loading={mutation.isPending}
                        isEdit
                    />
                </div>
            </div>
        </div>
    );
}
