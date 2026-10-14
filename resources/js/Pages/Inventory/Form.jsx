import { Head, Link, useForm } from "@inertiajs/react";
import Layout from "../Shared/Layout";

const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600 focus:bg-white";

export default function Form({ seed }) {
    const form = useForm({
        name: seed?.name || "",
        barcode: seed?.barcode || "",
        accession_number: seed?.gid?.accession_number || "",
        current_weight: seed?.current_weight || "",
        stock_on_hand: seed?.stock_on_hand ?? "",
        viability: seed?.viability || "",
        location: seed?.location || "",
        availability: seed?.availability || "AVAILABLE",
    });
    const submit = (event) => {
        event.preventDefault();
        seed ? form.put(`/seeds/${seed.id}`) : form.post("/seeds");
    };
    const fields = [
        ["name", "Seed / variety name", "text"],
        ["barcode", "Barcode identifier", "text"],
        ["accession_number", "Accession number / GID", "text"],
        ["location", "Rack storage location", "text"],
        ["current_weight", "Current weight (g)", "number"],
        ["stock_on_hand", "Stock on-hand", "number"],
        ["viability", "Viability score (%)", "number"],
    ];
    return (
        <Layout>
            <Head title={seed ? "Edit seed" : "Register seed"} />
            <main className="mx-auto max-w-3xl space-y-5 px-4 py-7 sm:px-6">
                <header>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        {seed
                            ? "Update seed variety"
                            : "Register new seed variety"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Keep accession, weight, viability, and location details
                        current.
                    </p>
                </header>
                <form
                    onSubmit={submit}
                    className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7"
                >
                    {fields.map(([name, label, type]) => (
                        <label
                            key={name}
                            className="block text-xs font-semibold text-slate-700"
                        >
                            {label}
                            {name !== "accession_number" &&
                                name !== "location" && (
                                    <span className="ml-1 text-rose-600">
                                        *
                                    </span>
                                )}
                            <input
                                type={type}
                                min={type === "number" ? "0" : undefined}
                                step={
                                    name === "viability" ||
                                    name === "current_weight"
                                        ? "0.1"
                                        : "1"
                                }
                                required={
                                    name !== "accession_number" &&
                                    name !== "location"
                                }
                                value={form.data[name]}
                                onChange={(event) =>
                                    form.setData(name, event.target.value)
                                }
                                className={inputClass}
                            />
                            {form.errors[name] && (
                                <span className="mt-1 block font-normal text-rose-700">
                                    {form.errors[name]}
                                </span>
                            )}
                        </label>
                    ))}
                    <label className="block text-xs font-semibold text-slate-700">
                        Availability
                        <select
                            value={form.data.availability}
                            onChange={(event) =>
                                form.setData("availability", event.target.value)
                            }
                            className={inputClass}
                        >
                            {["AVAILABLE", "RESERVED", "UNAVAILABLE"].map(
                                (status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ),
                            )}
                        </select>
                        {form.errors.availability && (
                            <span className="mt-1 block font-normal text-rose-700">
                                {form.errors.availability}
                            </span>
                        )}
                    </label>
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 sm:col-span-2">
                        <Link
                            href="/seeds"
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold"
                        >
                            Cancel
                        </Link>
                        <button
                            disabled={form.processing}
                            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                        >
                            {form.processing
                                ? "Saving…"
                                : seed
                                  ? "Save changes"
                                  : "Register seed"}
                        </button>
                    </div>
                </form>
            </main>
        </Layout>
    );
}
