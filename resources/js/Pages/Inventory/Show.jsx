import { Head, Link, router } from "@inertiajs/react";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import Layout from "../Shared/Layout";

export default function Show({ seed }) {
    const remove = () => {
        if (window.confirm(`Delete ${seed.name}?`))
            router.delete(`/seeds/${seed.id}`);
    };
    const rows = [
        ["Accession", seed.gid?.accession_number || "—"],
        ["Barcode", seed.barcode],
        ["Current weight", `${seed.current_weight} g`],
        ["Viability", `${seed.viability}%`],
        ["Stock on-hand", seed.stock_on_hand],
        ["Location", seed.location || "—"],
        ["Availability", seed.availability],
    ];
    return (
        <Layout>
            <Head title={seed.name} />
            <main className="mx-auto max-w-3xl space-y-5 px-4 py-7 sm:px-6">
                <Link
                    href="/seeds"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600"
                >
                    <FaArrowLeft />
                    Inventory
                </Link>
                <header>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        {seed.name}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Seed inventory record #{seed.id}
                    </p>
                </header>
                <dl className="grid gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:grid-cols-2">
                    {rows.map(([label, value]) => (
                        <div
                            key={label}
                            className="border-b border-slate-100 p-4"
                        >
                            <dt className="text-[10px] font-bold uppercase text-slate-400">
                                {label}
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-slate-800">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>
                <div className="flex gap-2">
                    <Link
                        href={`/seeds/${seed.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white"
                    >
                        <FaEdit />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={remove}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-4 py-2.5 text-xs font-bold text-rose-700"
                    >
                        <FaTrash />
                        Delete
                    </button>
                </div>
            </main>
        </Layout>
    );
}
