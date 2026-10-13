<?php

namespace App\Http\Controllers;

use App\Models\ActiveSeed;
use App\Models\SeedRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $requests = SeedRequest::with(['requester', 'lineItems.activeSeed.gid'])
            ->latest('date_req')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'approvedSeeds' => SeedRequest::where('status', 'APPROVED')->count(),
                'distributedSeeds' => SeedRequest::where('status', 'DISPATCHED')->count(),
                'totalSeedPackets' => ActiveSeed::count(),
                'currentRequests' => SeedRequest::where('status', 'PENDING')->count(),
            ],
            'requests' => $requests,
            'canCreateRequest' => $request->user()->can('requests.create'),
            'isStaff' => $request->user()->hasRole('Staff'),
        ]);
    }
}
