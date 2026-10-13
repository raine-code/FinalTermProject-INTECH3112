import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FaSearch, FaUsers } from 'react-icons/fa';
import Layout from '../Shared/Layout';

export default function Index({ users, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = (event) => {
        event.preventDefault();
        router.get('/users', { search: search.trim() || undefined, status: status || undefined }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <Layout>
            <Head title="Users" />

            <div className="mx-auto flex max-w-7xl flex-col gap-4">
                <header className="flex shrink-0 flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            <FaUsers />
                            Administration
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Users</h1>
                        <p className="mt-1 text-sm text-slate-500">Review user accounts, roles, and access status.</p>
                    </div>
                    <div className="text-sm text-slate-500">
                        Showing <span className="font-semibold text-slate-800">{users.from || 0}-{users.to || 0}</span> of{' '}
                        <span className="font-semibold text-slate-800">{users.total}</span> accounts
                    </div>
                </header>

                <section aria-label="User account totals" className="grid shrink-0 gap-3 sm:grid-cols-3">
                    {[
                        { label: 'Total accounts', value: stats.total, tone: 'text-slate-900' },
                        { label: 'Active access', value: stats.active, tone: 'text-emerald-700' },
                        { label: 'Inactive access', value: stats.inactive, tone: 'text-rose-700' },
                    ].map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                            <span className={`text-xl font-extrabold ${stat.tone}`}>{stat.value}</span>
                        </div>
                    ))}
                </section>

                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <form onSubmit={applyFilters} className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 p-3">
                        <label className="relative min-w-55 flex-1">
                            <span className="sr-only">Search users</span>
                            <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search name, username, or email"
                                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </label>
                        <label>
                            <span className="sr-only">Filter by access status</span>
                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="h-10 min-w-37.5 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="">All statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </label>
                        <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800">
                            <FaSearch className="text-xs" />
                            Search
                        </button>
                        {(filters.search || filters.status) && (
                            <Link href="/users" className="px-2 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                                Clear
                            </Link>
                        )}
                    </form>

                    <div className="max-h-[30dvh] overflow-auto sm:max-h-[45dvh]">
                        <table className="min-w-full text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                <tr>
                                    <th scope="col" className="px-4 py-3">User</th>
                                    <th scope="col" className="px-4 py-3">Username</th>
                                    <th scope="col" className="px-4 py-3">Role</th>
                                    <th scope="col" className="px-4 py-3">Status</th>
                                    <th scope="col" className="px-4 py-3">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.data.length > 0 ? users.data.map((user) => {
                                    const active = user.status === 'active';
                                    const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U';

                                    return (
                                        <tr key={user.id} className="transition hover:bg-slate-50/80">
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">
                                                        {initials}
                                                    </span>
                                                    <div>
                                                        <div className="font-semibold text-slate-800">{user.first_name} {user.last_name}</div>
                                                        <div className="text-xs text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600">@{user.username}</td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {user.roles.length > 0 ? user.roles.join(', ') : <span className="text-slate-400">Unassigned</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-500">{user.created_at || '-'}</td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-14 text-center">
                                            <div className="font-semibold text-slate-700">No users found</div>
                                            <p className="mt-1 text-sm text-slate-500">Try changing the search or status filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {users.last_page > 1 && (
                        <nav aria-label="User list pages" className="flex shrink-0 flex-wrap items-center justify-center gap-1 border-t border-slate-200 p-3">
                            {users.links.map((link, index) => {
                                const label = link.label.includes('Previous')
                                    ? 'Previous'
                                    : link.label.includes('Next')
                                        ? 'Next'
                                        : link.label;
                                const classes = `rounded-md px-3 py-1.5 text-sm ${link.active ? 'bg-emerald-700 font-semibold text-white' : 'text-slate-600 hover:bg-slate-100'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`;

                                return link.url ? (
                                    <Link key={index} href={link.url} className={classes} aria-current={link.active ? 'page' : undefined}>
                                        {label}
                                    </Link>
                                ) : (
                                    <span key={index} className={classes}>{label}</span>
                                );
                            })}
                        </nav>
                    )}
                </section>
            </div>
        </Layout>
    );
}