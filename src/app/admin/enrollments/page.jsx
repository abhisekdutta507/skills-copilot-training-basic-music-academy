'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminEnrollmentsApi } from '@/lib/api.js';
import { formatPrice } from '@/utils/format.js';

const STATUS_OPTIONS = ['all', 'ACTIVE', 'REFUNDED', 'CANCELLED'];

function StatusBadge({ status }) {
    const map = { ACTIVE: 'success', REFUNDED: 'warning', CANCELLED: 'secondary' };
    return <span className={`badge bg-${map[status] ?? 'secondary'}`}>{status}</span>;
}

export default function AdminEnrollmentsPage() {
    const [statusFilter, setStatusFilter] = useState('all');
    const queryClient = useQueryClient();

    const { data: enrollments = [], isLoading } = useQuery({
        queryKey: ['admin', 'enrollments', statusFilter],
        queryFn: () => adminEnrollmentsApi.getAll(statusFilter !== 'all' ? { status: statusFilter } : {}),
    });

    const refundMutation = useMutation({
        mutationFn: adminEnrollmentsApi.refund,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'enrollments'] }),
    });

    function handleRefund(id, studentName) {
        if (!confirm(`Issue refund for ${studentName}? This will mark the enrollment as REFUNDED.`)) return;
        refundMutation.mutate(id);
    }

    return (
        <div className="admin-page p-3 p-md-4 p-xl-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">Enrollments</h1>
                    <p className="text-body-secondary mb-0">{enrollments.length} record(s)</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <label className="form-label mb-0 text-nowrap">Filter by status</label>
                    <select
                        className="form-select form-select-sm"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s === 'all' ? 'All' : s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-5"><span className="spinner-border text-primary" /></div>
            ) : enrollments.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <p className="text-body-secondary mb-0">No enrollments found.</p>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Student</th>
                                    <th>Guardian</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map(e => (
                                    <tr key={e.id}>
                                        <td className="fw-semibold">{e.studentName}</td>
                                        <td>{e.guardianName}</td>
                                        <td>{e.email}</td>
                                        <td>{e.phone}</td>
                                        <td>{e.course?.name}</td>
                                        <td><StatusBadge status={e.status} /></td>
                                        <td className="text-body-secondary small">
                                            {new Date(e.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td>
                                            {e.status === 'ACTIVE' && (
                                                <button
                                                    className="btn btn-sm btn-outline-warning"
                                                    onClick={() => handleRefund(e.id, e.studentName)}
                                                    disabled={refundMutation.isPending}
                                                >
                                                    Refund
                                                </button>
                                            )}
                                            {e.status === 'REFUNDED' && e.refundedAt && (
                                                <span className="text-body-secondary small">
                                                    {new Date(e.refundedAt).toLocaleDateString('en-IN')}
                                                </span>
                                            )}
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
