import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FaArrowLeft, FaQrcode, FaRedo, FaTruck } from 'react-icons/fa';
import Layout from './Shared/Layout';

export default function Scanner({ requestRecord }) {
    const line = requestRecord.line_items?.[0];
    const expectedSeed = line?.active_seed;
    const form = useForm({ barcode: '', quantity_grams: requestRecord.weight_req });
    const [verified, setVerified] = useState(false);
    const [scanError, setScanError] = useState('');

    useEffect(() => {
        if (verified) return undefined;
        const scanner = new Html5QrcodeScanner('seedtrack-reader', { fps: 8, qrbox: { width: 220, height: 220 } }, false);
        scanner.render((decodedText) => {
            form.setData('barcode', decodedText);
            setScanError(decodedText === expectedSeed?.barcode ? '' : 'Scanned barcode does not match this request.');
            setVerified(decodedText === expectedSeed?.barcode);
            if (decodedText === expectedSeed?.barcode) scanner.clear().catch(() => { });
        }, () => { });
        return () => { scanner.clear().catch(() => { }); };
    }, [verified]);

    const setBarcode = (value) => {
        form.setData('barcode', value);
        setScanError(value && value !== expectedSeed?.barcode ? 'Barcode does not match the requested seed.' : '');
        setVerified(value === expectedSeed?.barcode);
    };
    const submit = (event) => {
        event.preventDefault();
        form.post(`/requests/${requestRecord.id}/dispatch`);
    };

    return <Layout><Head title="Scan & dispatch" /><main className="mx-auto max-w-2xl px-4 py-7 sm:px-6"><section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><header className="flex items-start justify-between border-b border-slate-100 pb-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700"><FaQrcode /></span><div><h1 className="text-lg font-bold">{verified ? 'Confirm seed dispatch' : 'Scan seed barcode'}</h1><p className="text-xs text-slate-500">Verify the accession before stock is deducted.</p></div></div><Link href="/dashboard" aria-label="Back to dashboard" className="p-2 text-slate-500"><FaArrowLeft /></Link></header><div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-950"><strong>{requestRecord.tracking_no}:</strong> {requestRecord.requester?.first_name} {requestRecord.requester?.last_name} requested <strong>{expectedSeed?.name}</strong> ({requestRecord.weight_req} g).</div>{!verified && <div className="space-y-3"><div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2"><div id="seedtrack-reader" /></div><p className="text-center text-[10px] text-slate-500">Camera permission is required. You can also enter the barcode below.</p></div>}<form onSubmit={submit} className="space-y-4"><label className="block text-xs font-semibold">Barcode<input value={form.data.barcode} onChange={(event) => setBarcode(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm" />{(scanError || form.errors.barcode) && <span className="mt-1 block font-normal text-rose-700">{scanError || form.errors.barcode}</span>}</label>{verified && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">Verified: <strong>{expectedSeed.name}</strong>, {expectedSeed.current_weight} g available.</div>}<label className="block text-xs font-semibold">Quantity to dispatch (grams)<input type="number" min="0.01" step="0.01" value={form.data.quantity_grams} onChange={(event) => form.setData('quantity_grams', event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm" />{form.errors.quantity_grams && <span className="mt-1 block font-normal text-rose-700">{form.errors.quantity_grams}</span>}</label><div className="flex gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => { setVerified(false); setScanError(''); form.setData('barcode', ''); }} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-semibold"><FaRedo />Rescan</button><button disabled={form.processing || !verified || Boolean(scanError)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"><FaTruck />{form.processing ? 'Dispatching…' : 'Confirm & dispatch'}</button></div></form></section></main></Layout>;
}