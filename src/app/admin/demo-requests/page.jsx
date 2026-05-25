'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminDemoRequestsApi } from '@/lib/api.js';

const STATUS_OPTIONS = ['all', 'PENDING', 'CONFIRMED', 'CANCELLED'];

function StatusBadge({ status }) {
    const map = { PENDING: 'warning', CONFIRMED: 'success', CANCELLED: 'secondary' };
    return <span className={`badge bg-${map[status] ?? 'secondary'}`}>{status}</span>;
}

export default function AdminDemoRequestsPage() {
    const [statusFilter, setStatusFilter] = useState('all');
    const queryClient = useQueryClient();

    const { data: demoRequests = [], isLoading } = useQuery({
        queryKey: ['admin', 'demo-requests', statusFilter],
        queryFn: () => adminDemoRequestsApi.getAll(statusFilter !== 'all' ? { status: statusFilter } : {}),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => adminDemoRequestsApi.updateStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'demo-requests'] }),
    });

    function handleStatusChange(id, status) {
        const label = status === 'CONFIRMED' ? 'confirm' : 'cancel';
        if (!confirm(`Are you sure you want to ${label} this demo request?`)) return;
        updateStatusMutation.mutate({ id, status });
    }

    return (
        <div className="admin-page p-3 p-md-4 p-xl-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">Demo Requests</h1>
                    <p className="text-body-secondary mb-0">{demoRequests.length} request(s)</p>
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
            ) : demoRequests.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <p className="text-body-secondary mb-0">No demo requests found.</p>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Student</th>
                                    <th>Age</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Course</th>
                                    <th>Preferred Date</th>
                                    <th>Status</th>
                                    <th>Submitted</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demoRequests.map(d => (
                                    <tr key={d.id}>
                                        <td className="fw-semibold">{d.studentName}</td>
                                        <td>{d.age}</td>
                                        <td>{d.email}</td>
                                        <td>{d.phone}</td>
                                        <td>{d.course?.name}</td>
                                        <td>{d.preferredDate || <span className="text-body-secondary">—</span>}</td>
                                        <td><StatusBadge status={d.status} /></td>
                                        <td className="text-body-secondary small">
                                            {new Date(d.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td>
                                            {d.status === 'PENDING' && (
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleStatusChange(d.id, 'CONFIRMED')}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleStatusChange(d.id, 'CANCELLED')}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
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
