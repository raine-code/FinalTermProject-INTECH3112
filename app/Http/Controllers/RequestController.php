<?php

namespace App\Http\Controllers;

use App\Models\ActiveSeed;
use App\Models\Municipality;
use App\Models\Requester;
use App\Models\SeedRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class RequestController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Requests/Index', [
            'requests' => $this->requestList(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Requests/Form', [
            'requestRecord' => null,
            'municipalities' => Municipality::orderBy('town')->get(['id', 'town', 'province']),
            'seeds' => ActiveSeed::where('availability', 'AVAILABLE')->orderBy('name')->get(['id', 'name', 'barcode', 'current_weight']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateRequest($request);

        $seedRequest = DB::transaction(function () use ($validated): SeedRequest {
            $requester = Requester::firstOrCreate(
                ['email' => mb_strtolower($validated['email'])],
                [
                    'municipality_id' => $validated['municipality_id'],
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'agency' => $validated['agency'] ?? null,
                ],
            );

            $prefix = now()->format('Y') . '-GBSR-';
            $lastRequest = SeedRequest::where('tracking_no', 'like', $prefix . '%')
                ->lockForUpdate()
                ->orderByDesc('id')
                ->first();
            $sequence = (int) substr((string) $lastRequest?->tracking_no, -4) + 1;

            $seedRequest = SeedRequest::create([
                'requester_id' => $requester->id,
                'tracking_no' => $prefix . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
                'date_req' => today(),
                'weight_req' => $validated['weight_req'],
                'study_title' => $validated['study_title'],
                'status' => 'PENDING',
            ]);

            $seedRequest->lineItems()->create([
                'active_seed_id' => $validated['active_seed_id'],
                'stock_out' => 0,
            ]);

            return $seedRequest;
        }, 3);

        return to_route('requests.show', $seedRequest)->with('success', 'Requisition created: ' . $seedRequest->tracking_no);
    }

    public function show(SeedRequest $seedRequest): Response
    {
        return Inertia::render('Requests/Show', [
            'requestRecord' => $seedRequest->load(['requester.municipality', 'lineItems.activeSeed.gid']),
        ]);
    }

    public function edit(SeedRequest $seedRequest): Response
    {
        abort_unless($seedRequest->status === 'PENDING', 422);

        return Inertia::render('Requests/Form', [
            'requestRecord' => $seedRequest->load(['requester', 'lineItems.activeSeed']),
            'municipalities' => Municipality::orderBy('town')->get(['id', 'town', 'province']),
            'seeds' => ActiveSeed::orderBy('name')->get(['id', 'name', 'barcode', 'current_weight']),
        ]);
    }

    public function update(Request $request, SeedRequest $seedRequest): RedirectResponse
    {
        abort_unless($seedRequest->status === 'PENDING', 422);
        $validated = $this->validateRequest($request, $seedRequest);

        DB::transaction(function () use ($validated, $seedRequest): void {
            $seedRequest->requester->update([
                'municipality_id' => $validated['municipality_id'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'agency' => $validated['agency'] ?? null,
                'email' => mb_strtolower($validated['email']),
            ]);
            $seedRequest->update([
                'weight_req' => $validated['weight_req'],
                'study_title' => $validated['study_title'],
            ]);
            $seedRequest->lineItems()->updateOrCreate(
                ['active_seed_id' => $validated['active_seed_id']],
                ['stock_out' => 0],
            );
            $seedRequest->lineItems()->where('active_seed_id', '!=', $validated['active_seed_id'])->delete();
        });

        return to_route('requests.show', $seedRequest)->with('success', 'Requisition updated.');
    }

    public function destroy(SeedRequest $seedRequest): RedirectResponse
    {
        abort_unless(in_array($seedRequest->status, ['PENDING', 'REJECTED'], true), 422);
        $seedRequest->delete();

        return to_route('requests.index')->with('success', 'Requisition deleted.');
    }

    public function updateStatus(Request $request, SeedRequest $seedRequest): RedirectResponse
    {
        $validated = $request->validate(['status' => ['required', 'in:APPROVED,REJECTED']]);
        abort_unless($seedRequest->status === 'PENDING', 422);

        $seedRequest->update([
            'status' => $validated['status'],
            'date_approved' => $validated['status'] === 'APPROVED' ? today() : null,
        ]);

        return back()->with('success', 'Request ' . $validated['status'] . '.');
    }

    public function updateDeadline(Request $request, SeedRequest $seedRequest): RedirectResponse
    {
        $validated = $request->validate(['deadline_date' => ['nullable', 'date']]);
        $seedRequest->update(['deadline_date' => $validated['deadline_date'] ?? null]);

        return back()->with('success', 'Processing deadline updated.');
    }

    public function scanner(SeedRequest $seedRequest): Response
    {
        abort_unless($seedRequest->status === 'APPROVED', 422);

        return Inertia::render('Scanner', [
            'requestRecord' => $seedRequest->load(['requester', 'lineItems.activeSeed']),
        ]);
    }

    public function dispatch(Request $request, SeedRequest $seedRequest): RedirectResponse
    {
        $validated = $request->validate([
            'barcode' => ['required', 'string', 'max:100'],
            'quantity_grams' => ['required', 'numeric', 'gt:0'],
        ]);

        try {
            DB::transaction(function () use ($seedRequest, $validated): void {
                $lockedRequest = SeedRequest::whereKey($seedRequest->id)->lockForUpdate()->firstOrFail();
                if ($lockedRequest->status !== 'APPROVED') {
                    throw ValidationException::withMessages(['request' => 'Only approved requests can be dispatched.']);
                }

                $lineItem = $lockedRequest->lineItems()->with('activeSeed')->first();
                $seed = $lineItem?->activeSeed;
                if (! $seed || ! hash_equals($seed->barcode, $validated['barcode'])) {
                    throw ValidationException::withMessages(['barcode' => 'The scanned barcode does not match this request.']);
                }
                if ((float) $validated['quantity_grams'] !== (float) $lockedRequest->weight_req) {
                    throw ValidationException::withMessages(['quantity_grams' => 'Dispatch quantity must match the approved request.']);
                }

                $lockedSeed = ActiveSeed::whereKey($seed->id)->lockForUpdate()->firstOrFail();
                if ((float) $lockedSeed->current_weight < (float) $validated['quantity_grams']) {
                    throw ValidationException::withMessages(['quantity_grams' => 'Insufficient seed weight in inventory.']);
                }

                $lockedSeed->current_weight = (float) $lockedSeed->current_weight - (float) $validated['quantity_grams'];
                if ((float) $lockedSeed->current_weight === 0.0) {
                    $lockedSeed->availability = 'UNAVAILABLE';
                }
                $lockedSeed->save();
                $lineItem->update(['stock_out' => $validated['quantity_grams']]);
                $lockedRequest->update(['status' => 'DISPATCHED', 'date_dispatched' => today()]);
            }, 3);
        } catch (Throwable $exception) {
            if ($exception instanceof ValidationException) {
                throw $exception;
            }

            throw ValidationException::withMessages(['barcode' => 'Dispatch could not be completed. Please retry.']);
        }

        return to_route('dashboard')->with('success', 'Seed verified, stock updated, and request dispatched.');
    }

    private function validateRequest(Request $request, ?SeedRequest $seedRequest = null): array
    {
        $rules = [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'agency' => ['nullable', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150'],
            'municipality_id' => ['required', 'exists:municipalities,id'],
            'active_seed_id' => ['required', 'exists:active_seeds,id'],
            'weight_req' => ['required', 'numeric', 'gt:0', 'max:99999999.99'],
            'study_title' => ['required', 'string', 'max:255'],
        ];

        if ($seedRequest) {
            $rules['email'][] = Rule::unique('requesters', 'email')->ignore($seedRequest->requester_id);
        }

        return $request->validate($rules);
    }

    private function requestList()
    {
        return SeedRequest::with(['requester.municipality', 'lineItems.activeSeed.gid'])
            ->latest('date_req')
            ->get();
    }
}
