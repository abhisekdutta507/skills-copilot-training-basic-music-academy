'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminDemoRequestsApi } from '@/lib/api.js';

const STATUS_OPTIONS = ['all', 'PENDING', 'CONFIRMED', 'CANCELLED'];

function StatusBadge({ status }) {
    const map = {
        PENDING: 'admin-status-pending',
        CONFIRMED: 'admin-status-confirmed',
        CANCELLED: 'admin-status-cancelled',
    };
    return <span className={`admin-status-chip ${map[status] ?? 'admin-status-default'}`}>{status}</span>;
}

export default function AdminDemoRequestsPage() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [pendingConfirmation, setPendingConfirmation] = useState(null);
    const queryClient = useQueryClient();

    const { data: demoRequests = [], isLoading } = useQuery({
        queryKey: ['admin', 'demo-requests', statusFilter],
        queryFn: () => adminDemoRequestsApi.getAll(statusFilter !== 'all' ? { status: statusFilter } : {}),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => adminDemoRequestsApi.updateStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'demo-requests'] }),
    });

    useEffect(() => {
        if (!pendingConfirmation) return undefined;

        function handleEscape(event) {
            if (event.key === 'Escape' && !updateStatusMutation.isPending) {
                setPendingConfirmation(null);
            }
        }

        document.body.classList.add('admin-modal-open');
        window.addEventListener('keydown', handleEscape);

        return () => {
            document.body.classList.remove('admin-modal-open');
            window.removeEventListener('keydown', handleEscape);
        };
    }, [pendingConfirmation, updateStatusMutation.isPending]);

    function openStatusDialog(request, status) {
        setPendingConfirmation({
            id: request.id,
            status,
            studentName: request.studentName,
            courseName: request.course?.name,
        });
    }

    function closeStatusDialog() {
        if (updateStatusMutation.isPending) return;
        setPendingConfirmation(null);
    }

    function confirmStatusChange() {
        if (!pendingConfirmation || updateStatusMutation.isPending) return;

        const { id, status } = pendingConfirmation;
        setPendingConfirmation(null);
        updateStatusMutation.mutate({ id, status });
    }

    const isConfirmAction = pendingConfirmation?.status === 'CONFIRMED';

    return (
        <div className="admin-page p-3 p-md-4 p-xl-5">
            <div className="admin-page-head d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Demo Requests</h1>
                    <p className="text-body-secondary mb-0">{demoRequests.length} request(s)</p>
                </div>
                <div className="admin-filter-bar">
                    <label className="form-label text-nowrap" htmlFor="demo-request-status-filter">Filter by status</label>
                    <select
                        className="form-select form-select-sm"
                        id="demo-request-status-filter"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s === 'all' ? 'All' : s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="admin-loading-state">
                    <span className="spinner-border text-primary" />
                    <p className="admin-empty-title">Loading demo requests</p>
                    <p className="admin-empty-copy">Pulling pending and scheduled demo records.</p>
                </div>
            ) : demoRequests.length === 0 ? (
                <div className="admin-empty-state">
                    <div className="h2 mb-0">🎤</div>
                    <p className="admin-empty-title">No demo requests found</p>
                    <p className="admin-empty-copy">Incoming trial class requests will land here for quick follow-up.</p>
                </div>
            ) : (
                <div className="card admin-panel admin-table-shell">
                    <div className="table-responsive admin-table-wrap">
                        <table className="table table-hover mb-0 align-middle admin-table admin-table-responsive-mobile">
                            <thead>
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
                                {demoRequests.map((d, index) => (
                                    <tr key={d.id} style={{ '--row-delay': `${index * 45}ms` }}>
                                        <td className="fw-semibold" data-label="Student">{d.studentName}</td>
                                        <td data-label="Age">{d.age}</td>
                                        <td data-label="Email">{d.email}</td>
                                        <td data-label="Phone">{d.phone}</td>
                                        <td data-label="Course">{d.course?.name}</td>
                                        <td data-label="Preferred Date">{d.preferredDate || <span className="text-body-secondary">—</span>}</td>
                                        <td data-label="Status"><StatusBadge status={d.status} /></td>
                                        <td className="text-body-secondary small" data-label="Submitted">
                                            {new Date(d.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td data-label="Actions">
                                            {d.status === 'PENDING' && (
                                                <div className="admin-row-actions">
                                                    <button
                                                        className="btn btn-sm admin-action-btn admin-action-btn-sm admin-action-btn-emerald"
                                                        onClick={() => openStatusDialog(d, 'CONFIRMED')}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        className="btn btn-sm admin-action-btn admin-action-btn-sm admin-action-btn-danger"
                                                        onClick={() => openStatusDialog(d, 'CANCELLED')}
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

            {pendingConfirmation && (
                <div className="admin-confirm-backdrop" role="presentation" onClick={closeStatusDialog}>
                    <div
                        className="admin-confirm-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="demo-request-confirm-title"
                        aria-describedby="demo-request-confirm-copy"
                        onClick={event => event.stopPropagation()}
                    >
                        <span className={`admin-confirm-kicker ${isConfirmAction ? 'admin-confirm-kicker-confirm' : 'admin-confirm-kicker-cancel'}`}>
                            {isConfirmAction ? 'Finalize Demo Slot' : 'Cancel Demo Slot'}
                        </span>
                        <h2 className="admin-confirm-title" id="demo-request-confirm-title">
                            {isConfirmAction ? 'Confirm this demo request?' : 'Cancel this demo request?'}
                        </h2>
                        <p className="admin-confirm-copy" id="demo-request-confirm-copy">
                            {isConfirmAction ? 'This will mark the request as CONFIRMED for' : 'This will mark the request as CANCELLED for'}{' '}
                            <strong>{pendingConfirmation.studentName}</strong>
                            {pendingConfirmation.courseName ? (
                                <>
                                    {' '}in <strong>{pendingConfirmation.courseName}</strong>.
                                </>
                            ) : (
                                '.'
                            )}
                        </p>
                        <div className="admin-confirm-actions">
                            <button
                                type="button"
                                className="btn admin-action-btn admin-action-btn-ghost"
                                onClick={closeStatusDialog}
                                disabled={updateStatusMutation.isPending}
                            >
                                Keep Pending
                            </button>
                            <button
                                type="button"
                                className={`btn admin-action-btn ${isConfirmAction ? 'admin-action-btn-emerald' : 'admin-action-btn-danger'}`}
                                onClick={confirmStatusChange}
                                disabled={updateStatusMutation.isPending}
                            >
                                {updateStatusMutation.isPending
                                    ? 'Saving...'
                                    : isConfirmAction
                                        ? 'Yes, Confirm'
                                        : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
