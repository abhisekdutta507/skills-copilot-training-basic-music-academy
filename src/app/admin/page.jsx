'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { adminCoursesApi, adminEnrollmentsApi, adminDemoRequestsApi } from '@/lib/api.js';
import { formatPrice } from '@/utils/format.js';

export default function AdminDashboard() {
    const { data: courses = [] } = useQuery({
        queryKey: ['admin', 'courses'],
        queryFn: adminCoursesApi.getAll,
    });

    const { data: enrollments = [] } = useQuery({
        queryKey: ['admin', 'enrollments'],
        queryFn: () => adminEnrollmentsApi.getAll(),
    });

    const { data: demoRequests = [] } = useQuery({
        queryKey: ['admin', 'demo-requests'],
        queryFn: () => adminDemoRequestsApi.getAll(),
    });

    const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE' && e.paymentStatus === 'PAID').length;
    const refundedEnrollments = enrollments.filter(e => e.status === 'REFUNDED').length;
    const pendingPayments = enrollments.filter(
        e => e.status === 'PENDING' || e.paymentStatus === 'PENDING' || e.paymentStatus === 'FAILED'
    ).length;
    const pendingDemos = demoRequests.filter(d => d.status === 'PENDING').length;
    const monthlyRevenue = enrollments
        .filter(e => e.status === 'ACTIVE' && e.paymentStatus === 'PAID')
        .reduce((sum, e) => sum + (e.paymentAmount ?? e.course?.monthlyFee ?? 0), 0);

    const stats = [
        {
            label: 'Total Courses',
            value: courses.length,
            helper: `${courses.filter(c => c.demoAvailable).length} with demo enabled`,
            icon: '🎵',
            href: '/admin/courses',
            tone: 'blue',
        },
        {
            label: 'Active Enrollments',
            value: activeEnrollments,
            helper: `Monthly run rate ${formatPrice(monthlyRevenue)}`,
            icon: '📋',
            href: '/admin/enrollments?status=ACTIVE',
            tone: 'emerald',
        },
        {
            label: 'Pending Demo Requests',
            value: pendingDemos,
            helper: 'Awaiting callback scheduling',
            icon: '🎤',
            href: '/admin/demo-requests?status=PENDING',
            tone: 'amber',
        },
        {
            label: 'Pending Payments',
            value: pendingPayments,
            helper: `${refundedEnrollments} refunds issued so far`,
            icon: '💳',
            href: '/admin/enrollments?status=PENDING',
            tone: 'rose',
        },
    ];

    const recentEnrollments = [...enrollments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="admin-page p-3 p-md-4 p-xl-5">
            <div className="admin-hero admin-page-head d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 mb-xl-5">
                <div>
                    <span className="admin-kicker">Operations Dashboard</span>
                    <h1 className="h2 mb-2">Welcome to Basic Music Academy</h1>
                    <p className="text-body-secondary mb-0">A real-time pulse of classes, enrollments, demos, and refunds.</p>
                </div>
                <div className="admin-hero-badge">
                    <span>Total monthly revenue</span>
                    <strong>{formatPrice(monthlyRevenue)}</strong>
                </div>
            </div>

            <div className="row g-3 g-xl-4 mb-4">
                {stats.map(({ label, value, helper, icon, href, tone }) => (
                    <div key={label} className="col-sm-6 col-xl-3">
                        <Link href={href} className="text-decoration-none d-block h-100">
                            <div className={`admin-stat-card admin-stat-${tone} h-100`}>
                                <div className="admin-stat-top">
                                    <span className="admin-stat-icon">{icon}</span>
                                    <span className="admin-stat-arrow">→</span>
                                </div>
                                <div className="admin-stat-body">
                                    <div className="admin-stat-value">{value}</div>
                                    <div className="admin-stat-label">{label}</div>
                                    <div className="admin-stat-helper">{helper}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-xl-8">
                    <div className="card admin-panel admin-table-shell h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">Recent Enrollments</span>
                            <Link href="/admin/enrollments" className="btn btn-sm admin-action-btn admin-action-btn-sm admin-action-btn-ghost">
                                View all
                            </Link>
                        </div>
                        <div className="card-body p-0">
                            {recentEnrollments.length === 0 ? (
                                <div className="admin-empty-state m-3">
                                    <div className="h2 mb-0">🎼</div>
                                    <p className="admin-empty-title">No enrollments yet</p>
                                    <p className="admin-empty-copy">New admissions will appear here once students register.</p>
                                </div>
                            ) : (
                                <div className="table-responsive admin-table-wrap">
                                    <table className="table table-hover mb-0 align-middle admin-table admin-table-responsive-mobile">
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Course</th>
                                                <th>Fee</th>
                                                <th>Status</th>
                                                <th>Payment</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentEnrollments.map((e, index) => (
                                                <tr key={e.id} style={{ '--row-delay': `${index * 45}ms` }}>
                                                    <td className="fw-semibold" data-label="Student">{e.studentName}</td>
                                                    <td className="text-truncate" data-label="Course" style={{ maxWidth: 220 }}>
                                                        {e.course?.name}
                                                    </td>
                                                    <td data-label="Fee">{formatPrice(e.course?.monthlyFee ?? 0)}</td>
                                                    <td data-label="Status">
                                                        <StatusBadge status={e.status} />
                                                    </td>
                                                    <td data-label="Payment">
                                                        <PaymentStatusBadge status={e.paymentStatus} />
                                                    </td>
                                                    <td className="text-body-secondary small" data-label="Date">
                                                        {new Date(e.createdAt).toLocaleDateString('en-IN')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className="card admin-panel">
                        <div className="card-header fw-semibold">Quick Actions</div>
                        <div className="card-body d-flex flex-column gap-2">
                            <Link href="/admin/courses/new" className="btn admin-action-btn admin-action-btn-primary">
                                + Add New Course
                            </Link>
                            <Link href="/admin/demo-requests?status=PENDING" className="btn admin-action-btn admin-action-btn-amber">
                                View Pending Demos ({pendingDemos})
                            </Link>
                            <Link href="/admin/enrollments?status=ACTIVE" className="btn admin-action-btn admin-action-btn-emerald">
                                View Active Enrollments ({activeEnrollments})
                            </Link>
                            <Link href="/admin/enrollments?status=PENDING" className="btn admin-action-btn admin-action-btn-cool">
                                View Pending Payments ({pendingPayments})
                            </Link>
                            <Link href="/admin/enrollments?status=REFUNDED" className="btn admin-action-btn admin-action-btn-danger">
                                View Refunds ({refundedEnrollments})
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const map = {
        ACTIVE: 'admin-status-active',
        REFUNDED: 'admin-status-refunded',
        CANCELLED: 'admin-status-cancelled',
        PENDING: 'admin-status-pending',
        CONFIRMED: 'admin-status-confirmed',
    };
    return (
        <span className={`admin-status-chip ${map[status] ?? 'admin-status-default'}`}>
            {status}
        </span>
    );
}

function PaymentStatusBadge({ status }) {
    const map = {
        PENDING: 'admin-status-pending',
        FAILED: 'admin-status-failed',
        PAID: 'admin-status-paid',
        REFUNDED: 'admin-status-refunded',
    };
    return (
        <span className={`admin-status-chip ${map[status] ?? 'admin-status-default'}`}>
            {status}
        </span>
    );
}
