'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminEnrollmentsApi } from '@/lib/api.js';
import { formatPrice } from '@/utils/format.js';

const STATUS_OPTIONS = ['all', 'ACTIVE', 'REFUNDED', 'CANCELLED'];

function StatusBadge({ status }) {
    const map = {
        ACTIVE: 'admin-status-active',
        REFUNDED: 'admin-status-refunded',
        CANCELLED: 'admin-status-cancelled',
    };
    return <span className={`admin-status-chip ${map[status] ?? 'admin-status-default'}`}>{status}</span>;
}

export default function AdminEnrollmentsPage() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [pendingRefund, setPendingRefund] = useState(null);
    const queryClient = useQueryClient();

    const { data: enrollments = [], isLoading } = useQuery({
        queryKey: ['admin', 'enrollments', statusFilter],
        queryFn: () => adminEnrollmentsApi.getAll(statusFilter !== 'all' ? { status: statusFilter } : {}),
    });

    const refundMutation = useMutation({
        mutationFn: adminEnrollmentsApi.refund,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'enrollments'] }),
    });

    useEffect(() => {
        if (!pendingRefund) return undefined;

        function handleEscape(event) {
            if (event.key === 'Escape' && !refundMutation.isPending) {
                setPendingRefund(null);
            }
        }

        document.body.classList.add('admin-modal-open');
        window.addEventListener('keydown', handleEscape);

        return () => {
            document.body.classList.remove('admin-modal-open');
            window.removeEventListener('keydown', handleEscape);
        };
    }, [pendingRefund, refundMutation.isPending]);

    function openRefundDialog(enrollment) {
        setPendingRefund({
            id: enrollment.id,
            studentName: enrollment.studentName,
            courseName: enrollment.course?.name,
        });
    }

    function closeRefundDialog() {
        if (refundMutation.isPending) return;
        setPendingRefund(null);
    }

    function confirmRefund() {
        if (!pendingRefund || refundMutation.isPending) return;

        const { id } = pendingRefund;
        setPendingRefund(null);
        refundMutation.mutate(id);
    }

    return (
        <div className="admin-page p-3 p-md-4 p-xl-5">
            <div className="admin-page-head d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3 mb-4">
                <div>
                    <h1 className="h3 mb-1">Enrollments</h1>
                    <p className="text-body-secondary mb-0">{enrollments.length} record(s)</p>
                </div>
                <div className="admin-filter-bar">
                    <label className="form-label text-nowrap" htmlFor="enrollment-status-filter">Filter by status</label>
                    <select
                        className="form-select form-select-sm"
                        id="enrollment-status-filter"
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
                    <p className="admin-empty-title">Loading enrollments</p>
                    <p className="admin-empty-copy">Fetching latest registrations and payment status.</p>
                </div>
            ) : enrollments.length === 0 ? (
                <div className="admin-empty-state">
                    <div className="h2 mb-0">📋</div>
                    <p className="admin-empty-title">No enrollments found</p>
                    <p className="admin-empty-copy">Try a different filter or wait for new registrations.</p>
                </div>
            ) : (
                <div className="card admin-panel admin-table-shell">
                    <div className="table-responsive admin-table-wrap">
                        <table className="table table-hover mb-0 align-middle admin-table admin-table-responsive-mobile">
                            <thead>
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
                                {enrollments.map((e, index) => (
                                    <tr key={e.id} style={{ '--row-delay': `${index * 45}ms` }}>
                                        <td className="fw-semibold" data-label="Student">{e.studentName}</td>
                                        <td data-label="Guardian">{e.guardianName}</td>
                                        <td data-label="Email">{e.email}</td>
                                        <td data-label="Phone">{e.phone}</td>
                                        <td data-label="Course">{e.course?.name}</td>
                                        <td data-label="Status"><StatusBadge status={e.status} /></td>
                                        <td className="text-body-secondary small" data-label="Date">
                                            {new Date(e.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td data-label="Actions">
                                            {e.status === 'ACTIVE' && (
                                                <div className="admin-row-actions">
                                                    <button
                                                        className="btn btn-sm admin-action-btn admin-action-btn-sm admin-action-btn-amber"
                                                        onClick={() => openRefundDialog(e)}
                                                        disabled={refundMutation.isPending}
                                                    >
                                                        Refund
                                                    </button>
                                                </div>
                                            )}
                                            {e.status === 'REFUNDED' && e.refundedAt && (
                                                <span className="admin-refund-date">
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

            {pendingRefund && (
                <div className="admin-confirm-backdrop" role="presentation" onClick={closeRefundDialog}>
                    <div
                        className="admin-confirm-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="enrollment-refund-confirm-title"
                        aria-describedby="enrollment-refund-confirm-copy"
                        onClick={event => event.stopPropagation()}
                    >
                        <span className="admin-confirm-kicker admin-confirm-kicker-cancel">Process Refund</span>
                        <h2 className="admin-confirm-title" id="enrollment-refund-confirm-title">
                            Issue refund for this enrollment?
                        </h2>
                        <p className="admin-confirm-copy" id="enrollment-refund-confirm-copy">
                            This will mark <strong>{pendingRefund.studentName}</strong>
                            {pendingRefund.courseName ? (
                                <>
                                    {' '}in <strong>{pendingRefund.courseName}</strong>
                                </>
                            ) : null}
                            {' '}as <strong>REFUNDED</strong>.
                        </p>
                        <div className="admin-confirm-actions">
                            <button
                                type="button"
                                className="btn admin-action-btn admin-action-btn-ghost"
                                onClick={closeRefundDialog}
                                disabled={refundMutation.isPending}
                            >
                                Keep Active
                            </button>
                            <button
                                type="button"
                                className="btn admin-action-btn admin-action-btn-amber"
                                onClick={confirmRefund}
                                disabled={refundMutation.isPending}
                            >
                                {refundMutation.isPending ? 'Saving...' : 'Yes, Refund'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
