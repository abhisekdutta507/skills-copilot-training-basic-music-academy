'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const form = new FormData(e.target);
        const result = await signIn('credentials', {
            email: form.get('email'),
            password: form.get('password'),
            redirect: false,
        });

        setLoading(false);
        if (result?.error) {
            setError('Invalid email or password. Please try again.');
        } else {
            router.push('/admin');
        }
    }

    return (
        <main className="admin-login-shell min-vh-100 d-flex align-items-center py-4 py-md-5">
            <div className="container">
                <div className="admin-login-frame overflow-hidden">
                    <section className="admin-login-showcase p-4 p-lg-5">
                        <span className="admin-login-eyebrow">BASIC MUSIC ACADEMY</span>
                        <h1 className="admin-login-title mt-3 mb-3">Studio Command Deck</h1>
                        <p className="admin-login-copy mb-4">
                            Run admissions, class planning, and daily studio ops from one energetic workspace.
                        </p>

                        <div className="admin-login-points d-grid gap-2">
                            <div className="admin-login-point">
                                <strong>Pulse dashboard</strong>
                                <span>Track classes, demos, and seat flow in real time.</span>
                            </div>
                            <div className="admin-login-point">
                                <strong>Creator workflow</strong>
                                <span>Keep coordinators and instructors aligned every session.</span>
                            </div>
                            <div className="admin-login-point">
                                <strong>Secure backstage</strong>
                                <span>Only verified academy managers can enter.</span>
                            </div>
                        </div>
                    </section>

                    <section className="admin-login-panel p-4 p-md-5">
                        <div className="text-center mb-4">
                            <span className="brand-mark fs-3">B</span>
                            <h2 className="h4 mt-2 mb-1">Welcome back</h2>
                            <p className="text-body-secondary small mb-0">Sign in to continue to the admin dashboard</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger py-2 small" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="email">Email address</label>
                                <input
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                            <button
                                className="btn admin-login-btn w-100"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
