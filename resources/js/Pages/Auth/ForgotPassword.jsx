import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword() {
    const form = useForm({ email: '' });
    const submit = (event) => { event.preventDefault(); form.post('/forgot-password'); };
    return <><Head title="Reset password" /><main className="grid min-h-screen place-items-center bg-slate-900 px-4"><form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-2xl"><h1 className="text-xl font-bold">Reset your password</h1><p className="text-sm text-slate-500">Enter the email address linked to your account.</p><div><input type="email" aria-label="Email address" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm" />{form.errors.email && <p className="mt-1 text-xs text-rose-700">{form.errors.email}</p>}</div><button disabled={form.processing} className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white">Send reset link</button><Link href="/login" className="block text-center text-xs text-emerald-800">Back to sign in</Link></form></main></>;
}