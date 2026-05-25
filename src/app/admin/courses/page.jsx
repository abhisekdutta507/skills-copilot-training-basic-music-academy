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
            <div className="admin-page-head d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Courses</h1>
                    <p className="text-body-secondary mb-0">{courses.length} program(s) in the catalog</p>
                </div>
                <Link href="/admin/courses/new" className="btn admin-action-btn admin-action-btn-primary">
                    + Add Course
                </Link>
            </div>

            {isLoading ? (
                <div className="admin-loading-state">
                    <span className="spinner-border text-primary" />
                    <p className="admin-empty-title">Loading course catalog</p>
                    <p className="admin-empty-copy">Preparing instruments, instructors, and schedule details.</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="admin-empty-state">
                    <div className="h2 mb-0">🎵</div>
                    <p className="admin-empty-title">No courses yet</p>
                    <p className="admin-empty-copy mb-3">Create your first class to start accepting enrollments and demo requests.</p>
                    <Link href="/admin/courses/new" className="btn admin-action-btn admin-action-btn-primary">
                        Add your first course
                    </Link>
                </div>
            ) : (
                <div className="card admin-panel admin-table-shell">
                    <div className="table-responsive admin-table-wrap">
                        <table className="table table-hover mb-0 align-middle admin-table admin-table-responsive-mobile">
                            <thead>
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
                                {courses.map((c, index) => (
                                    <tr key={c.id} style={{ '--row-delay': `${index * 45}ms` }}>
                                        <td data-label="Course">
                                            <div className="d-flex align-items-center gap-2">
                                                <span>{c.icon}</span>
                                                <div>
                                                    <div className="fw-semibold">{c.name}</div>
                                                    <div className="text-body-secondary small">{c.instructor}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Category">{c.category}</td>
                                        <td data-label="Level">{c.level}</td>
                                        <td data-label="Fee / month">{formatPrice(c.monthlyFee)}</td>
                                        <td data-label="Batch">{c.batch}</td>
                                        <td data-label="Demo">
                                            {c.demoAvailable ? (
                                                <span className="admin-status-chip admin-status-yes">Yes</span>
                                            ) : (
                                                <span className="admin-status-chip admin-status-no">No</span>
                                            )}
                                        </td>
                                        <td data-label="Enrolled">{c._count?.enrollments ?? 0}</td>
                                        <td data-label="Actions">
                                            <div className="admin-row-actions">
                                                <Link
                                                    href={`/admin/courses/${c.id}/edit`}
                                                    className="btn btn-sm admin-action-btn admin-action-btn-sm admin-action-btn-cool"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    className="btn btn-sm admin-action-btn admin-action-btn-sm admin-action-btn-danger"
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
