import { auth } from '@/auth.js';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar.jsx';
import { isAdminSession } from '@/lib/adminAuth.js';

export const metadata = { title: 'Admin — Basic Music Academy' };

export default async function AdminLayout({ children }) {
    const session = await auth();
    if (!session) redirect('/login');
    if (!isAdminSession(session)) redirect('/');

    return (
        <div className="admin-shell d-flex flex-column flex-lg-row" style={{ minHeight: '100vh' }}>
            <AdminSidebar />
            <main className="admin-main flex-grow-1 overflow-auto" style={{ minHeight: '100vh' }}>
                {children}
            </main>
        </div>
    );
}
