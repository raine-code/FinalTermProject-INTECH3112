<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'requests.view',
            'requests.create',
            'requests.approve',
            'requests.dispatch',
            'inventory.view',
            'inventory.manage',
            'analytics.view',
            'users.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        Role::findOrCreate('Admin', 'web')->syncPermissions(array_diff($permissions, ['requests.dispatch']));
        Role::findOrCreate('Staff', 'web')->syncPermissions([
            'requests.view',
            'requests.dispatch',
        ]);

        $admin = config('seedtrack.admin');
        if (filled($admin['email']) && filled($admin['username']) && filled($admin['password'])) {
            $user = User::updateOrCreate(
                ['email' => mb_strtolower($admin['email'])],
                [
                    'username' => mb_strtolower($admin['username']),
                    'first_name' => $admin['first_name'],
                    'last_name' => $admin['last_name'],
                    'password' => Hash::make($admin['password']),
                    'status' => 'active',
                ],
            );
            $user->syncRoles('Admin');
        }
    }
}
