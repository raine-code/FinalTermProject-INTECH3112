import { Head } from "@inertiajs/react";
import {
    FaBuilding,
    FaMapMarkerAlt,
    FaSeedling,
    FaUsers,
} from "react-icons/fa";
import Layout from "./Shared/Layout";

const chartColors = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#14b8a6",
];

function EmptyChart() {
    return (
        <div className="flex h-48 items-center justify-center text-xs text-slate-400">
            No data available yet.
        </div>
    );
}

function PieChart({ data, donut = false }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (!data.length || total === 0) return <EmptyChart />;

    const radius = 62;
    const center = 80;
    let angle = -90;
    const slices = data.map((item, index) => {
        const sweep = (item.value / total) * 360;
        const start = angle;
        const end = angle + sweep;
        angle = end;
        const startRadians = (start * Math.PI) / 180;
        const endRadians = (end * Math.PI) / 180;
        const startX = center + radius * Math.cos(startRadians);
        const startY = center + radius * Math.sin(startRadians);
        const endX = center + radius * Math.cos(endRadians);
        const endY = center + radius * Math.sin(endRadians);
        const largeArc = sweep > 180 ? 1 : 0;
        const path = `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
        return {
            ...item,
            color: chartColors[index % chartColors.length],
            path,
        };
    });

    return (
        <div className="grid min-h-48 grid-cols-[minmax(120px,1fr)_minmax(0,1.2fr)] items-center gap-3 sm:gap-5">
            <svg
                viewBox="0 0 160 160"
                className="mx-auto h-36 w-full max-w-40"
                role="img"
                aria-label={`${donut ? "Doughnut" : "Pie"} chart of ${data.length} categories`}
            >
                {slices.length === 1 ? (
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill={slices[0].color}
                    />
                ) : (
                    slices.map((slice) => (
                        <path
                            key={slice.label}
                            d={slice.path}
                            fill={slice.color}
                            stroke="white"
                            strokeWidth="2"
                        />
                    ))
                )}
                {donut && (
                    <circle cx={center} cy={center} r="34" fill="white" />
                )}
                {donut && (
                    <text
                        x={center}
                        y={center - 2}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="17"
                        fontWeight="700"
                    >
                        {total}
                    </text>
                )}
                {donut && (
                    <text
                        x={center}
                        y={center + 13}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="7"
                    >
                        TOTAL
                    </text>
                )}
            </svg>
            <ul className="min-w-0 space-y-2.5">
                {slices.map((slice) => (
                    <li
                        key={slice.label}
                        className="flex min-w-0 items-center gap-2 text-xs"
                    >
                        <span
                            className="h-2.5 w-2.5 shrink-0 rounded-sm"
                            style={{ backgroundColor: slice.color }}
                        />
                        <span
                            className="min-w-0 flex-1 truncate text-slate-600"
                            title={slice.label}
                        >
                            {slice.label}
                        </span>
                        <span className="shrink-0 font-mono font-semibold text-slate-800">
                            {slice.value}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function VerticalBarChart({ data, color = "#3b82f6" }) {
    const max = Math.max(1, ...data.map((item) => item.value));
    if (!data.length || max === 0) return <EmptyChart />;

    return (
        <div className="min-h-48 px-1 pt-3">
            <div className="grid h-36 grid-cols-6 items-end gap-2 border-b border-slate-200 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_34px,#e2e8f0_35px)] px-1">
                {data.map((item, index) => (
                    <div
                        key={item.label}
                        className="group relative flex h-full flex-col justify-end"
                        title={`${item.label}: ${item.value}`}
                    >
                        <span className="mb-1 text-center text-[10px] font-semibold text-slate-600">
                            {item.value}
                        </span>
                        <div
                            className="mx-auto w-full max-w-9 rounded-t-md transition-[height]"
                            style={{
                                height: `${Math.max((item.value / max) * 72, item.value ? 5 : 0)}%`,
                                backgroundColor:
                                    chartColors[index % chartColors.length],
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-2 grid grid-cols-6 gap-2">
                {data.map((item) => (
                    <span
                        key={item.label}
                        className="truncate text-center text-[10px] text-slate-500"
                        title={item.label}
                    >
                        {item.shortLabel}
                    </span>
                ))}
            </div>
        </div>
    );
}

function HorizontalBarChart({ data, color = "#f59e0b" }) {
    const max = Math.max(1, ...data.map((item) => item.value));
    if (!data.length || max === 0) return <EmptyChart />;

    return (
        <div className="min-h-48 space-y-3 py-3">
            {data.map((item, index) => (
                <div
                    key={item.label}
                    className="grid grid-cols-[minmax(0,1fr)_2fr_auto] items-center gap-3 text-xs"
                >
                    <span
                        className="truncate text-slate-600"
                        title={item.label}
                    >
                        {item.label}
                    </span>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${Math.max((item.value / max) * 100, item.value ? 2 : 0)}%`,
                                backgroundColor:
                                    chartColors[index % chartColors.length] ||
                                    color,
                            }}
                        />
                    </div>
                    <strong className="w-7 text-right font-mono text-slate-800">
                        {item.value}
                    </strong>
                </div>
            ))}
        </div>
    );
}

function ChartCard({ title, label, icon, color, chart, total }) {
    const colors = {
        emerald: "bg-emerald-50 text-emerald-700",
        blue: "bg-blue-50 text-blue-700",
        amber: "bg-amber-50 text-amber-700",
        teal: "bg-teal-50 text-teal-700",
    };
    return (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
                <div className="flex min-w-0 items-center gap-3">
                    <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${colors[color]}`}
                    >
                        {icon}
                    </span>
                    <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold text-slate-800">
                            {title}
                        </h2>
                        <p className="text-[10px] text-slate-500">{label}</p>
                    </div>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white">
                    {total} total
                </span>
            </header>
            <div className="px-4 py-3">{chart}</div>
        </section>
    );
}

export default function Analytics({
    topSeeds,
    topRequesters,
    topLocations,
    topAgencies,
}) {
    const seedSeries = (topSeeds || []).slice(0, 6).map((row, index) => ({
        label: row.active_seed?.name || `Seed ${index + 1}`,
        shortLabel: (row.active_seed?.name || `S${index + 1}`).slice(0, 3),
        value: Number(row.request_count) || 0,
    }));

    const requesterSeries = (topRequesters || [])
        .slice(0, 6)
        .map((row, index) => ({
            label:
                `${row.first_name || "User"} ${row.last_name || ""}`.trim() ||
                `Requester ${index + 1}`,
            shortLabel: (row.first_name || `Req ${index + 1}`).slice(0, 6),
            value: Number(row.distributed_count) || 0,
        }));

    const locationSeries = (topLocations || [])
        .slice(0, 6)
        .map((row, index) => ({
            label: row.location || `Location ${index + 1}`,
            shortLabel: (row.location || `L${index + 1}`).slice(0, 3),
            value: Number(row.count) || 0,
        }));

    const agencySeries = (topAgencies || []).slice(0, 6).map((row, index) => ({
        label: row.agency || `Agency ${index + 1}`,
        shortLabel: (row.agency || `A${index + 1}`).slice(0, 4),
        value: Number(row.count) || 0,
    }));

    const totalOf = (series) =>
        series.reduce((sum, item) => sum + item.value, 0);

    return (
        <Layout>
            <Head title="Analytics" />
            <main className="mx-auto max-w-7xl space-y-5 px-4 py-7 sm:px-6 lg:px-8">
                <header>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Operations & Requisition Analytics
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Demand trends by seed, requester, location, and agency.
                    </p>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                    <ChartCard
                        title="Most requested seeds"
                        label="Request count by variety"
                        icon={<FaSeedling />}
                        color="emerald"
                        total={totalOf(seedSeries)}
                        chart={<PieChart data={seedSeries} />}
                    />
                    <ChartCard
                        title="Top requesters"
                        label="Successfully dispatched orders"
                        icon={<FaUsers />}
                        color="blue"
                        total={totalOf(requesterSeries)}
                        chart={<VerticalBarChart data={requesterSeries} />}
                    />
                    <ChartCard
                        title="Demand by location"
                        label="Requisitions by town and province"
                        icon={<FaMapMarkerAlt />}
                        color="amber"
                        total={totalOf(locationSeries)}
                        chart={<HorizontalBarChart data={locationSeries} />}
                    />
                    <ChartCard
                        title="Requesting agencies"
                        label="Requisitions by institution"
                        icon={<FaBuilding />}
                        color="teal"
                        total={totalOf(agencySeries)}
                        chart={<PieChart data={agencySeries} donut />}
                    />
                </div>
            </main>
        </Layout>
    );
}
