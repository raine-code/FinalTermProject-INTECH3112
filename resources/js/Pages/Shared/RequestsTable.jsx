import { useMemo, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { FaCheck, FaQrcode, FaSearch, FaTimes } from 'react-icons/fa';

const badgeStyles = {
    PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
    APPROVED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    REJECTED: 'bg-rose-50 text-rose-800 border-rose-200',
    DISPATCHED: 'bg-blue-50 text-blue-800 border-blue-200',
};

export default function RequestsTable({ requests }) {
    const { auth = {} } = usePage().props;
    const permissions = auth.permissions || [];
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('ALL');
    const [deadlines, setDeadlines] = useState({});
    const filters = ['ALL', 'PENDING', 'APPROVED', 'DISPATCHED', 'REJECTED'];
    const filtered = useMemo(() => requests.filter((item) => {
        const line = item.line_items?.[0];
        const haystack = `${item.tracking_no} ${item.requester?.first_name} ${item.requester?.last_name} ${line?.active_seed?.name}`.toLowerCase();
        return (status === 'ALL' || item.status === status) && haystack.includes(query.toLowerCase());
    }), [requests, status, query]);

    const setRequestStatus = (item, nextStatus) => {
        if (window.confirm(`Mark ${item.tracking_no} as ${nextStatus.toLowerCase()}?`)) {
            router.patch(`/requests/${item.id}/status`, { status: nextStatus }, { preserveScroll: true });
        }
    };

    const saveDeadline = (item) => {
        router.patch(`/requests/${item.id}/deadline`, { deadline_date: deadlines[item.id] ?? item.deadline_date ?? '' }, { preserveScroll: true });
    };

    return (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="space-y-4 border-b border-slate-200 p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div><h2 className="text-base font-bold text-slate-900">Seed requisition orders</h2><p className="text-xs text-slate-500">Review, schedule, and dispatch requests</p></div>
                    <label className="relative block w-full sm:w-72"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tracking no., requester, seed" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-emerald-500" /></label>
                </div>
                <div className="flex gap-1.5 overflow-x-auto">
                    {filters.map((filter) => <button key={filter} type="button" onClick={() => setStatus(filter)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${filter === status ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{filter === 'ALL' ? 'All' : `${filter[0]}${filter.slice(1).toLowerCase()}`} <span className="ml-1 opacity-70">{filter === 'ALL' ? requests.length : requests.filter((item) => item.status === filter).length}</span></button>)}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase text-slate-500"><tr><th className="px-4 py-3">Tracking</th><th className="px-4 py-3">Requester</th><th className="px-4 py-3">Seed / study</th><th className="px-4 py-3 text-right">Weight</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Deadline / actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map((item) => {
                            const line = item.line_items?.[0];
                            return <tr key={item.id} className="align-top hover:bg-slate-50/70">
                                <td className="whitespace-nowrap px-4 py-3.5"><Link href={`/requests/${item.id}`} className="font-mono font-bold text-emerald-800 hover:underline">{item.tracking_no}</Link><div className="mt-1 text-[10px] text-slate-400">{item.date_req}</div></td>
                                <td className="min-w-40 px-4 py-3.5"><strong className="block text-slate-800">{item.requester?.first_name} {item.requester?.last_name}</strong><span className="text-[10px] text-slate-500">{item.requester?.agency || 'Individual requester'}</span></td>
                                <td className="min-w-44 px-4 py-3.5"><strong className="block">{line?.active_seed?.name || 'Seed unavailable'}</strong><span className="text-[10px] text-slate-500">{item.study_title}</span></td>
                                <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono font-semibold">{item.weight_req} g</td>
                                <td className="px-4 py-3.5"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${badgeStyles[item.status] || 'border-slate-200 bg-slate-100'}`}>{item.status}</span></td>
                                <td className="min-w-56 px-4 py-3.5">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {permissions.includes('requests.approve') && <><input aria-label={`Deadline for ${item.tracking_no}`} type="date" value={deadlines[item.id] ?? item.deadline_date ?? ''} onChange={(event) => setDeadlines((current) => ({ ...current, [item.id]: event.target.value }))} className="rounded border border-slate-200 px-1.5 py-1 text-[10px]" /><button type="button" onClick={() => saveDeadline(item)} className="rounded bg-slate-800 px-2 py-1 text-[10px] font-semibold text-white">Set</button></>}
                                        {permissions.includes('requests.approve') && item.status === 'PENDING' && <><button type="button" title="Approve" onClick={() => setRequestStatus(item, 'APPROVED')} className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1.5 font-semibold text-white"><FaCheck />Approve</button><button type="button" title="Reject" onClick={() => setRequestStatus(item, 'REJECTED')} className="flex items-center gap-1 rounded bg-rose-600 px-2 py-1.5 font-semibold text-white"><FaTimes />Reject</button></>}
                                        {permissions.includes('requests.dispatch') && item.status === 'APPROVED' && <Link href={`/scanner/${item.id}`} className="flex items-center gap-1 rounded bg-blue-700 px-2 py-1.5 font-semibold text-white"><FaQrcode />Scan & dispatch</Link>}
                                    </div>
                                </td>
                            </tr>;
                        })}
                        {filtered.length === 0 && <tr><td colSpan="6" className="px-4 py-12 text-center text-slate-500">No requests match these filters.</td></tr>}
                    </tbody>
                </table>
            </div>
        </section>
    );
}