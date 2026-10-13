<?php

namespace App\Http\Controllers;

use App\Models\Requester;
use App\Models\RequestLineItem;
use App\Models\SeedRequest;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Analytics', [
            'topSeeds' => RequestLineItem::query()
                ->selectRaw('active_seed_id, count(*) as request_count')
                ->with('activeSeed:id,name')
                ->groupBy('active_seed_id')
                ->orderByDesc('request_count')
                ->limit(10)
                ->get(),
            'topRequesters' => Requester::query()
                ->withCount(['requests as distributed_count' => fn($query) => $query->where('status', 'DISPATCHED')])
                ->orderByDesc('distributed_count')
                ->limit(10)
                ->get(['id', 'first_name', 'last_name']),
            'topLocations' => SeedRequest::query()
                ->join('requesters', 'requests.requester_id', '=', 'requesters.id')
                ->join('municipalities', 'requesters.municipality_id', '=', 'municipalities.id')
                ->select('municipalities.town', 'municipalities.province')
                ->selectRaw('count(*) as count')
                ->groupBy('municipalities.town', 'municipalities.province')
                ->orderByDesc('count')
                ->limit(10)
                ->get()
                ->map(fn($row) => [
                    'location' => $row->town . ', ' . $row->province,
                    'count' => $row->count,
                ]),
            'topAgencies' => SeedRequest::query()
                ->join('requesters', 'requests.requester_id', '=', 'requesters.id')
                ->whereNotNull('requesters.agency')
                ->selectRaw('requesters.agency, count(*) as count')
                ->groupBy('requesters.agency')
                ->orderByDesc('count')
                ->limit(10)
                ->get(),
        ]);
    }
}
