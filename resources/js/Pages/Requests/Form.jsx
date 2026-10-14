import { Head, Link, useForm } from "@inertiajs/react";
import Layout from "../Shared/Layout";

const fieldStyle =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600 focus:bg-white";

export default function Form({ requestRecord, municipalities, seeds }) {
    const requester = requestRecord?.requester || {};
    const firstLine = requestRecord?.line_items?.[0];
    const form = useForm({
        first_name: requester.first_name || "",
        last_name: requester.last_name || "",
        agency: requester.agency || "",
        email: requester.email || "",
        municipality_id: requester.municipality_id || "",
        active_seed_id: firstLine?.active_seed_id || "",
        weight_req: requestRecord?.weight_req || "",
        study_title: requestRecord?.study_title || "",
    });
    const submit = (event) => {
        event.preventDefault();
        requestRecord
            ? form.put(`/requests/${requestRecord.id}`)
            : form.post("/requests");
    };
    const field = (name, label, type = "text", required = true) => (
        <label
            key={name}
            className="block text-xs font-semibold text-slate-700"
        >
            {label}
            {required && <span className="ml-1 text-rose-600">*</span>}
            <input
                type={type}
                step={name === "weight_req" ? "0.01" : undefined}
                min={name === "weight_req" ? "0.01" : undefined}
                required={required}
                value={form.data[name]}
                onChange={(event) => form.setData(name, event.target.value)}
                className={fieldStyle}
            />
            {form.errors[name] && (
                <span className="mt-1 block font-normal text-rose-700">
                    {form.errors[name]}
                </span>
            )}
        </label>
    );
    return (
        <Layout>
            <Head title={requestRecord ? "Edit request" : "New request"} />
            <main className="mx-auto max-w-4xl space-y-5 px-4 py-7 sm:px-6">
                <header>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        {requestRecord
                            ? "Update requisition"
                            : "Create seed requisition order"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Capture requester details and the seed requirement.
                    </p>
                </header>
                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
                >
                    <section>
                        <h2 className="border-b border-slate-100 pb-2 text-sm font-bold">
                            Requester profile & institution
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {field("first_name", "First name")}
                            {field("last_name", "Last name")}
                            {field(
                                "agency",
                                "Agency / organization",
                                "text",
                                false,
                            )}
                            {field("email", "Email address", "email")}
                            <label className="block text-xs font-semibold text-slate-700 sm:col-span-2">
                                Municipality / province
                                <span className="ml-1 text-rose-600">*</span>
                                <select
                                    required
                                    value={form.data.municipality_id}
                                    onChange={(event) =>
                                        form.setData(
                                            "municipality_id",
                                            event.target.value,
                                        )
                                    }
                                    className={fieldStyle}
                                >
                                    <option value="">
                                        Select municipality
                                    </option>
                                    {municipalities.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.town}
                                            {item.province &&
                                            item.province !== "N/A"
                                                ? ` (${item.province})`
                                                : ""}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.municipality_id && (
                                    <span className="mt-1 block font-normal text-rose-700">
                                        {form.errors.municipality_id}
                                    </span>
                                )}
                            </label>
                        </div>
                    </section>
                    <section>
                        <h2 className="border-b border-slate-100 pb-2 text-sm font-bold">
                            Seed requirement & study
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {field(
                                "study_title",
                                "Study / project title",
                                "text",
                            )}
                            <label className="block text-xs font-semibold text-slate-700">
                                Seed variety
                                <span className="ml-1 text-rose-600">*</span>
                                <select
                                    required
                                    value={form.data.active_seed_id}
                                    onChange={(event) =>
                                        form.setData(
                                            "active_seed_id",
                                            event.target.value,
                                        )
                                    }
                                    className={fieldStyle}
                                >
                                    <option value="">
                                        Select seed variety
                                    </option>
                                    {seeds.map((seed) => (
                                        <option key={seed.id} value={seed.id}>
                                            {seed.name} · {seed.barcode} ·{" "}
                                            {seed.current_weight} g available
                                        </option>
                                    ))}
                                </select>
                                {form.errors.active_seed_id && (
                                    <span className="mt-1 block font-normal text-rose-700">
                                        {form.errors.active_seed_id}
                                    </span>
                                )}
                            </label>
                            {field(
                                "weight_req",
                                "Weight required (grams)",
                                "number",
                            )}
                        </div>
                    </section>
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                        <Link
                            href="/requests"
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700"
                        >
                            Cancel
                        </Link>
                        <button
                            disabled={form.processing}
                            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                        >
                            {form.processing
                                ? "Saving…"
                                : requestRecord
                                  ? "Save request"
                                  : "Submit requisition"}
                        </button>
                    </div>
                </form>
            </main>
        </Layout>
    );
}
