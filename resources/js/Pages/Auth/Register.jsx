import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const form = useForm({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.post('/register');
    };

    const fields = [
        ['username', 'Username', 'text'],
        ['first_name', 'First name', 'text'],
        ['last_name', 'Last name', 'text'],
        ['email', 'Email address', 'email'],
        ['password', 'Password', 'password'],
        ['password_confirmation', 'Confirm password', 'password'],
    ];

    return (
        <>
            <Head title="Create account" />
            <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#061b2f] px-4 py-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(135deg,#061b2f_0%,#0a2742_45%,#081e33_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#051829] to-transparent" />

                <section className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-white/95 shadow-[0_30px_80px_rgba(2,6,23,0.55)] backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-[#0f766e] via-[#0d8a6e] to-[#0b6e59] px-8 py-7 text-center text-white">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner shadow-emerald-900/20">
                            <img src="/images/Logo.svg" alt="SeedTrack logo" className="h-10 w-10 object-contain" />
                        </div>
                        <h1 className="text-[2rem] font-black tracking-tight">Create a SeedTrack account</h1>
                        <p className="mt-2 text-sm text-emerald-50/90">New registrations receive staff access.</p>
                    </div>

                    <form onSubmit={submit} className="grid gap-4 p-7 sm:grid-cols-2 sm:p-8">
                        {fields.map(([name, label, type]) => (
                            <div key={name} className={name === 'email' || name === 'password' || name === 'password_confirmation' ? 'sm:col-span-1' : 'sm:col-span-1'}>
                                <label htmlFor={name} className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    {label}
                                </label>
                                <input
                                    id={name}
                                    type={type}
                                    autoComplete={name}
                                    value={form.data[name]}
                                    onChange={(event) => form.setData(name, event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                />
                                {form.errors[name] && <p className="mt-2 text-xs text-rose-600">{form.errors[name]}</p>}
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="sm:col-span-2 w-full rounded-xl bg-gradient-to-r from-[#0e8a6b] to-[#0b6f5b] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:from-[#117e64] hover:to-[#0b6857] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {form.processing ? 'Creating account…' : 'Create account'}
                        </button>

                        <p className="sm:col-span-2 text-center text-sm text-slate-600">
                            Already registered?{' '}
                            <Link href="/login" className="font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </section>
            </main>
        </>
    );
}