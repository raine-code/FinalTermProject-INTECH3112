import { Head, Link, useForm } from '@inertiajs/react';
import { FaSeedling } from 'react-icons/fa';

export default function Login() {
    const form = useForm({ username: '', password: '', remember: false });
    const submit = (event) => { event.preventDefault(); form.post('/login'); };

    return <><Head title="Sign in" /><main className="grid min-h-screen place-items-center bg-slate-900 px-4 py-10">
        <section className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-emerald-700 px-8 py-8 text-center text-white"><div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-2xl"><FaSeedling /></div><h1 className="text-2xl font-black">SeedTrack</h1><p className="mt-1 text-xs text-emerald-100">Genebank management & requisitions</p></div>
            <form onSubmit={submit} className="space-y-5 p-7 sm:p-8">
                <div><label htmlFor="username" className="mb-1.5 block text-xs font-semibold">Username</label><input id="username" autoComplete="username" value={form.data.username} onChange={(event) => form.setData('username', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600" />{form.errors.username && <p className="mt-1 text-xs text-rose-700">{form.errors.username}</p>}</div>
                <div><label htmlFor="password" className="mb-1.5 block text-xs font-semibold">Password</label><input id="password" type="password" autoComplete="current-password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600" />{form.errors.password && <p className="mt-1 text-xs text-rose-700">{form.errors.password}</p>}</div>
                <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={form.data.remember} onChange={(event) => form.setData('remember', event.target.checked)} />Remember me</label>
                <button disabled={form.processing} className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50">{form.processing ? 'Signing in…' : 'Sign in to SeedTrack'}</button>
                <div className="flex justify-between text-xs"><Link href="/forgot-password" className="text-emerald-800 hover:underline">Forgot password?</Link><Link href="/register" className="font-semibold text-emerald-800 hover:underline">Create account</Link></div>
            </form>
        </section>
    </main></>;
}