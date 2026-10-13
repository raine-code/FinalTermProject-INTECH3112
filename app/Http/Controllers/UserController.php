<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
        ]);
        $search = trim($filters['search'] ?? '');

        $users = User::query()
            ->select(['id', 'username', 'first_name', 'last_name', 'email', 'status', 'created_at'])
            ->with('roles:id,name,guard_name')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(($filters['status'] ?? null) === 'active', fn($query) => $query->where('status', 'active'))
            ->when(($filters['status'] ?? null) === 'inactive', fn($query) => $query->where('status', '!=', 'active'))
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->paginate(12)
            ->withQueryString()
            ->through(fn(User $user): array => [
                'id' => $user->id,
                'username' => $user->username,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'status' => $user->status,
                'roles' => $user->getRoleNames()->values(),
                'created_at' => $user->created_at?->toDateString(),
            ]);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'status' => $filters['status'] ?? '',
            ],
            'stats' => [
                'total' => User::count(),
                'active' => User::where('status', 'active')->count(),
                'inactive' => User::where('status', '!=', 'active')->count(),
            ],
        ]);
    }
}
