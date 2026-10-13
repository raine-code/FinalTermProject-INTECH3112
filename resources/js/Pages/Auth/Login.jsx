import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const form = useForm({ username: '', password: '', remember: false });

    const submit = (event) => {
        event.preventDefault();
        form.post('/login');
    };

    return (
        <>
            <Head title="Sign in" />
            <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#061b2f] px-4 py-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(135deg,#061b2f_0%,#0a2742_45%,#081e33_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#051829] to-transparent" />

                <section className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-white/95 shadow-[0_30px_80px_rgba(2,6,23,0.55)] backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-[#0f766e] via-[#0d8a6e] to-[#0b6e59] px-8 py-8 text-center text-white">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner shadow-emerald-900/20">
                            <img src="/images/Logo.svg" alt="SeedTrack logo" className="h-10 w-10 object-contain" />
                        </div>
                        <h1 className="text-[2rem] font-black tracking-tight">SeedTrack</h1>
                        <p className="mt-2 text-sm text-emerald-50/90">Genebank management & requisitions</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5 p-7 sm:p-8">
                        <div>
                            <label htmlFor="username" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Username
                            </label>
                            <input
                                id="username"
                                autoComplete="username"
                                value={form.data.username}
                                onChange={(event) => form.setData('username', event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                placeholder="Enter your username"
                            />
                            {form.errors.username && <p className="mt-2 text-xs text-rose-600">{form.errors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={form.data.password}
                                onChange={(event) => form.setData('password', event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                placeholder="Enter your password"
                            />
                            {form.errors.password && <p className="mt-2 text-xs text-rose-600">{form.errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-1">
                            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={form.data.remember}
                                    onChange={(event) => form.setData('remember', event.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="w-full rounded-xl bg-gradient-to-r from-[#0e8a6b] to-[#0b6f5b] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:from-[#117e64] hover:to-[#0b6857] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {form.processing ? 'Signing in…' : 'Sign in to SeedTrack'}
                        </button>

                        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm">
                            <Link href="/forgot-password" className="font-medium text-emerald-700 transition hover:text-emerald-800 hover:underline">
                                Forgot password?
                            </Link>
                            <Link href="/register" className="font-semibold text-slate-700 transition hover:text-emerald-700 hover:underline">
                                Create account
                            </Link>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
}