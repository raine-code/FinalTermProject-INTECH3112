import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { FaCheck, FaChevronLeft, FaChevronRight, FaClock, FaPaperPlane, FaPlus, FaWarehouse } from 'react-icons/fa';
import Layout from './Shared/Layout';

export default function Dashboard({ stats, requests, calendarEvents = [], canCreateRequest, isStaff }) {
    const { auth = {} } = usePage().props;
    const user = auth.user || {};
    const role = (auth.roles && auth.roles[0]) || 'ADMIN';
    const name = user.first_name || user.username || 'Admin';
    const recentRequests = (requests || []).slice(0, 4);
    const [calendarMonth, setCalendarMonth] = useState(() => {
        const today = new Date();
        const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const events = calendarEvents.filter((event) => event.deadline_date && ['APPROVED', 'DISPATCHED'].includes(event.status));
        const currentMonthHasEvents = events.some((event) => {
            const [year, month] = event.deadline_date.slice(0, 10).split('-').map(Number);
            return year === today.getFullYear() && month - 1 === today.getMonth();
        });

        if (currentMonthHasEvents || events.length === 0) return currentMonth;

        const closestEvent = events.reduce((closest, event) => {
            const [year, month, day] = event.deadline_date.slice(0, 10).split('-').map(Number);
            const eventDate = new Date(year, month - 1, day);
            return !closest || Math.abs(eventDate - today) < Math.abs(closest - today) ? eventDate : closest;
        }, null);

        return new Date(closestEvent.getFullYear(), closestEvent.getMonth(), 1);
    });
    const today = new Date();
    const firstWeekday = calendarMonth.getDay();
    const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
    const calendarCells = [
        ...Array.from({ length: firstWeekday }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    const metricCards = [
        {
            label: 'Pending requests',
            value: stats?.currentRequests ?? 0,
            icon: <FaClock className="text-amber-600" />,
            accent: 'border-amber-200 bg-amber-50 text-amber-700',
        },
        {
            label: 'Approved requests',
            value: stats?.approvedSeeds ?? 0,
            icon: <FaCheck className="text-emerald-600" />,
            accent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        },
        {
            label: 'Dispatched',
            value: stats?.distributedSeeds ?? 0,
            icon: <FaPaperPlane className="text-sky-600" />,
            accent: 'border-sky-200 bg-sky-50 text-sky-700',
        },
        {
            label: 'Inventory packets',
            value: stats?.totalSeedPackets ?? 0,
            icon: <FaWarehouse className="text-violet-600" />,
            accent: 'border-violet-200 bg-violet-50 text-violet-700',
        },
    ];

    return (
        <Layout>
            <Head title="Dashboard" />

            <div className="mx-auto flex min-h-full max-w-none flex-col gap-4">
                <section className="grid gap-3 xl:grid-cols-[1.7fr_0.9fr]">
                    <div className="flex min-h-[158px] items-center rounded-2xl bg-[#0c6a5d] p-5 text-white shadow-[0_12px_35px_rgba(11,106,93,0.18)] sm:p-6">
                        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                    Operations Overview
                                </h1>
                                <p className="mt-2 max-w-xl text-sm text-emerald-50">
                                    Welcome back, {name}. Monitor seed movement, inventory readiness, and fulfilment progress from a single operational view.
                                </p>
                            </div>

                            {canCreateRequest && (
                                <Link
                                    href="/requests/create"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0c6a5d] shadow-sm transition hover:bg-emerald-50"
                                >
                                    <FaPlus />
                                    Create request
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Today's snapshot
                        </div>
                        <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                <span className="text-slate-500">Role</span>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700">
                                    {role}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                <span className="text-slate-500">Requests in queue</span>
                                <span className="text-base font-bold text-slate-800">{stats?.currentRequests ?? 0}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                <span className="text-slate-500">Warehouse availability</span>
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                                    Healthy
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {metricCards.map(({ label, value, icon, accent }) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accent}`}>
                                    {icon}
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black tracking-tight text-slate-900">{value}</div>
                                </div>
                            </div>
                            <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                {label}
                            </div>
                        </div>
                    ))}
                </section>

                <section className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[1.8fr_0.9fr]">
                    <div className="min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Recent requests</h3>
                                <p className="text-xs text-slate-500">
                                    Most recent seed requisitions and current status
                                </p>
                            </div>
                        </div>

                        <div className="h-full overflow-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3">Tracking</th>
                                        <th className="px-5 py-3">Requester</th>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {recentRequests.length > 0 ? (
                                        recentRequests.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50">
                                                <td className="px-5 py-4 font-mono text-[12px] font-semibold text-slate-800">
                                                    {item.tracking_no}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-800">
                                                        {item.requester?.first_name || '-'} {item.requester?.last_name || ''}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-slate-500">{item.date_req || '-'}</td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${item.status === 'PENDING'
                                                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                            : item.status === 'APPROVED'
                                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                : item.status === 'DISPATCHED'
                                                                    ? 'border-sky-200 bg-sky-50 text-sky-700'
                                                                    : 'border-rose-200 bg-rose-50 text-rose-700'
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-5 py-12 text-center text-sm text-slate-500">
                                                No requests to display.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Calendar</div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    aria-label="Previous month"
                                    onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                >
                                    <FaChevronLeft className="text-[10px]" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next month"
                                    onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                >
                                    <FaChevronRight className="text-[10px]" />
                                </button>
                            </div>
                        </div>
                        <div className="mb-2 text-center text-sm font-bold text-slate-800">
                            {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-slate-400">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((weekday, index) => (
                                <div key={`${weekday}-${index}`} className="py-1.5">{weekday}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                            {calendarCells.map((day, index) => {
                                const isToday = day === today.getDate()
                                    && calendarMonth.getMonth() === today.getMonth()
                                    && calendarMonth.getFullYear() === today.getFullYear();
                                const dateKey = day
                                    ? `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                    : null;
                                const dayEvents = dateKey
                                    ? calendarEvents.filter((event) => event.deadline_date?.slice(0, 10) === dateKey)
                                    : [];
                                const hasPendingDispatch = dayEvents.some((event) => event.status === 'APPROVED');
                                const markerStyle = hasPendingDispatch
                                    ? 'bg-amber-300 font-bold text-amber-950'
                                    : dayEvents.length > 0
                                        ? 'bg-blue-500 font-bold text-white'
                                        : isToday
                                            ? 'bg-slate-200 font-bold text-slate-800'
                                            : 'text-slate-700';
                                const eventDescription = dayEvents.map((event) => `${event.tracking_no}: ${event.status === 'DISPATCHED' ? 'dispatched' : 'dispatch due'}`).join('; ');

                                return (
                                    <div key={day ? `day-${day}` : `blank-${index}`} className="flex aspect-square items-center justify-center">
                                        {day && (
                                            <span
                                                title={eventDescription || (isToday ? 'Today' : undefined)}
                                                aria-label={`${dateKey}${eventDescription ? `, ${eventDescription}` : isToday ? ', today' : ''}`}
                                                className={`flex h-7 w-7 items-center justify-center rounded-full ${markerStyle}`}
                                            >
                                                {day}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
                            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-200" />Today</span>
                            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-300" />Dispatch by deadline</span>
                            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />Dispatched</span>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
