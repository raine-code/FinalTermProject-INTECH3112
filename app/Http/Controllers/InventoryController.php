<?php

namespace App\Http\Controllers;

use App\Models\ActiveSeed;
use App\Models\Gid;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Inventory/Index', [
            'seeds' => ActiveSeed::with('gid')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Inventory/Form', ['seed' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateSeed($request);

        $gid = $this->resolveGid($validated);
        ActiveSeed::create([...$validated, 'gid_id' => $gid?->id]);

        return to_route('seeds.index')->with('success', 'Seed inventory item registered.');
    }

    public function show(ActiveSeed $seed): Response
    {
        return Inertia::render('Inventory/Show', ['seed' => $seed->load('gid')]);
    }

    public function edit(ActiveSeed $seed): Response
    {
        return Inertia::render('Inventory/Form', ['seed' => $seed->load('gid')]);
    }

    public function update(Request $request, ActiveSeed $seed): RedirectResponse
    {
        $validated = $this->validateSeed($request, $seed);
        $gid = $this->resolveGid($validated);

        $seed->update([...$validated, 'gid_id' => $gid?->id]);

        return to_route('seeds.index')->with('success', 'Seed inventory item updated.');
    }

    public function destroy(ActiveSeed $seed): RedirectResponse
    {
        if ($seed->requestLineItems()->exists()) {
            throw ValidationException::withMessages([
                'seed' => 'This seed is referenced by a request and cannot be deleted.',
            ]);
        }

        $seed->delete();

        return to_route('seeds.index')->with('success', 'Seed inventory item deleted.');
    }

    private function validateSeed(Request $request, ?ActiveSeed $seed = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'barcode' => ['required', 'string', 'max:100', Rule::unique('active_seeds', 'barcode')->ignore($seed)],
            'current_weight' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'viability' => ['required', 'numeric', 'min:0', 'max:100'],
            'stock_on_hand' => ['required', 'integer', 'min:0'],
            'location' => ['nullable', 'string', 'max:100'],
            'availability' => ['required', 'in:AVAILABLE,UNAVAILABLE,RESERVED'],
            'accession_number' => ['nullable', 'string', 'max:20'],
        ]);
    }

    private function resolveGid(array $validated): ?Gid
    {
        if (blank($validated['accession_number'] ?? null)) {
            return null;
        }

        return Gid::updateOrCreate(
            ['accession_number' => trim($validated['accession_number'])],
            ['accession_name' => $validated['name']],
        );
    }
}
