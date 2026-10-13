import { Head, Link } from '@inertiajs/react';
import { FaPlus } from 'react-icons/fa';
import { usePage } from '@inertiajs/react';
import Layout from '../Shared/Layout';
import RequestsTable from '../Shared/RequestsTable';

export default function Index({ requests }) {
    const { auth = {} } = usePage().props;
    return <Layout><Head title="Requests" /><main className="mx-auto max-w-7xl space-y-5 px-4 py-7 sm:px-6 lg:px-8"><header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-extrabold text-slate-900">Requisition orders</h1><p className="mt-1 text-sm text-slate-500">Review requests, assign deadlines, and track dispatches.</p></div>{(auth.permissions || []).includes('requests.create') && <Link href="/requests/create" className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white"><FaPlus />Add request</Link>}</header><RequestsTable requests={requests} /></main></Layout>;
}