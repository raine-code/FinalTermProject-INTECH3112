import { Link, router, usePage } from '@inertiajs/react';
import { FaBars, FaBoxes, FaChartBar, FaChevronLeft, FaClipboardList, FaHome, FaSignOutAlt, FaUsers } from 'react-icons/fa';

export default function Sidebar({ collapsed = false, onToggle }) {
    const page = usePage();
    const { auth = {} } = page.props;
    const roles = auth.roles || [];
    const permissions = auth.permissions || [];
    const isAdmin = roles.some((role) => role.toLowerCase() === 'admin');
    const currentPath = page.url.split('?')[0];
    const links = [
        { href: '/dashboard', label: 'Home', icon: <FaHome />, permitted: true },
        { href: '/requests', label: 'Requests', icon: <FaClipboardList />, permitted: isAdmin || permissions.includes('requests.view') },
        { href: '/seeds', label: 'Inventory', icon: <FaBoxes />, permitted: isAdmin || permissions.includes('inventory.view') },
        { href: '/analytics', label: 'Analytics', icon: <FaChartBar />, permitted: isAdmin || permissions.includes('analytics.view') },
        { href: '/users', label: 'Users', icon: <FaUsers />, permitted: isAdmin || permissions.includes('users.manage') },
    ].filter((link) => link.permitted);

    const isActive = (href) => currentPath === href || currentPath.startsWith(`${href}/`)
        || (href === '/requests' && currentPath.startsWith('/scanner/'));

    return (
        <aside className="flex h-full flex-col border-r border-slate-200 bg-[#f8faf9] px-1 py-3 sm:px-2">
            <div className={`mb-4 flex ${collapsed ? 'justify-center' : 'justify-end'}`}>
                <button
                    type="button"
                    aria-label={collapsed ? 'Open sidebar' : 'Collapse sidebar'}
                    aria-expanded={!collapsed}
                    onClick={onToggle}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
                >
                    {collapsed ? <FaBars /> : <FaChevronLeft />}
                </button>
            </div>

            <nav aria-label="Main navigation" className="mt-2">
                {!collapsed && (
                    <div className="mb-2 hidden px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">Workspace</div>
                )}
                <div className="space-y-1">
                    {links.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={active ? 'page' : undefined}
                                aria-label={link.label}
                                title={collapsed ? link.label : undefined}
                                className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} max-sm:justify-center rounded-xl px-2.5 py-2.5 text-sm font-medium transition ${active ? 'bg-[#0f766e] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <span className={active ? 'text-white' : 'text-slate-500'}>{link.icon}</span>
                                {!collapsed && <span className="max-sm:hidden">{link.label}</span>}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="mt-auto border-t border-slate-200 pt-3">
                <button
                    type="button"
                    aria-label="Sign out"
                    onClick={() => router.post('/logout')}
                    title={collapsed ? 'Sign out' : undefined}
                    className={`flex w-full items-center ${collapsed ? 'justify-center' : 'gap-3'} rounded-xl px-2.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700`}
                >
                    <FaSignOutAlt /> {!collapsed && <span className="max-sm:hidden">Sign out</span>}
                </button>
            </div>
        </aside>
    );
}