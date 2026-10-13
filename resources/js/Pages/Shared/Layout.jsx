import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { FaBars, FaBoxes, FaChartBar, FaHome, FaSeedling, FaSignOutAlt, FaTimes } from 'react-icons/fa';

export default function Layout({ children }) {
    const { auth = {}, flash = {} } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const user = auth.user;
    const roles = auth.roles || [];
    const permissions = auth.permissions || [];
    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: <FaHome />, show: true },
        { href: '/seeds', label: 'Seed inventory', icon: <FaBoxes />, show: permissions.includes('inventory.view') },
        { href: '/analytics', label: 'Analytics', icon: <FaChartBar />, show: permissions.includes('analytics.view') },
    ].filter((link) => link.show);
    const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase() || user?.username?.slice(0, 2).toUpperCase() || 'ST';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-7">
                        <Link href="/dashboard" className="flex items-center gap-2.5">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm"><FaSeedling /></span>
                            <span><strong className="block text-base leading-tight text-slate-900">SeedTrack</strong><small className="text-[11px] text-slate-500">Genebank management</small></span>
                        </Link>
                        <nav className="hidden items-center gap-1 md:flex">
                            {links.map((link) => (
                                <Link key={link.href} href={link.href} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${window.location.pathname.startsWith(link.href) ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'}`}>
                                    {link.icon}{link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="hidden items-center gap-3 md:flex">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold">{initials}</span>
                        <span className="mr-1"><strong className="block text-xs">{user?.first_name} {user?.last_name}</strong><small className="text-[10px] uppercase text-emerald-700">{roles.join(', ')}</small></span>
                        <button type="button" onClick={() => router.post('/logout')} title="Sign out" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:bg-rose-50 hover:text-rose-700"><FaSignOutAlt />Logout</button>
                    </div>
                    <button type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden">{menuOpen ? <FaTimes /> : <FaBars />}</button>
                </div>
                {menuOpen && <nav className="space-y-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden">
                    {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700">{link.icon}{link.label}</Link>)}
                    <button type="button" onClick={() => router.post('/logout')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-700"><FaSignOutAlt />Sign out</button>
                </nav>}
            </header>
            {flash.success && <div role="status" className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8"><div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div></div>}
            {children}
        </div>
    );
}