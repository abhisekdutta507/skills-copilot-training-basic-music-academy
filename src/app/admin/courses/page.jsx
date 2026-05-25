'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCoursesApi } from '@/lib/api.js';
import { formatPrice } from '@/utils/format.js';

export default function AdminCoursesPage() {
    const queryClient = useQueryClient();

    const { data: courses = [], isLoading } = useQuery({
        queryKey: ['admin', 'courses'],
        queryFn: adminCoursesApi.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: adminCoursesApi.remove,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] }),
    });

    function handleDelete(id, name) {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        deleteMutation.mutate(id);
    }

    return (
        <div className="admin-page p-3 p-md-4 p-xl-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">Courses</h1>
                    <p className="text-body-secondary mb-0">{courses.length} program(s) in the catalog</p>
                </div>
                <Link href="/admin/courses/new" className="btn btn-primary">
                    + Add Course
                </Link>
            </div>

            {isLoading ? (
                <div className="text-center py-5">
                    <span className="spinner-border text-primary" />
                </div>
            ) : courses.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <p className="text-body-secondary mb-3">No courses yet.</p>
                        <Link href="/admin/courses/new" className="btn btn-primary">
                            Add your first course
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Course</th>
                                    <th>Category</th>
                                    <th>Level</th>
                                    <th>Fee / month</th>
                                    <th>Batch</th>
                                    <th>Demo</th>
                                    <th>Enrolled</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(c => (
                                    <tr key={c.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <span>{c.icon}</span>
                                                <div>
                                                    <div className="fw-semibold">{c.name}</div>
                                                    <div className="text-body-secondary small">{c.instructor}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{c.category}</td>
                                        <td>{c.level}</td>
                                        <td>{formatPrice(c.monthlyFee)}</td>
                                        <td>{c.batch}</td>
                                        <td>
                                            {c.demoAvailable
                                                ? <span className="badge bg-success">Yes</span>
                                                : <span className="badge bg-secondary">No</span>}
                                        </td>
                                        <td>{c._count?.enrollments ?? 0}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link
                                                    href={`/admin/courses/${c.id}/edit`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(c.id, c.name)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
