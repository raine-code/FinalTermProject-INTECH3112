<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserDirectoryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_guest_is_redirected_from_user_directory(): void
    {
        $this->get('/users')->assertRedirect('/login');
    }

    public function test_staff_cannot_open_user_directory(): void
    {
        $staff = User::factory()->create();
        $staff->assignRole('Staff');

        $this->actingAs($staff)->get('/users')->assertForbidden();
    }

    public function test_admin_can_search_and_filter_user_directory(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        User::factory()->create([
            'username' => 'findme-active',
            'first_name' => 'Avery',
            'last_name' => 'Member',
            'email' => 'avery@example.test',
            'status' => 'active',
        ])->assignRole('Staff');

        User::factory()->create([
            'username' => 'findme-inactive',
            'first_name' => 'Morgan',
            'last_name' => 'Member',
            'email' => 'morgan@example.test',
            'status' => 'inactive',
        ])->assignRole('Staff');

        $this->actingAs($admin)
            ->get('/users?search=findme&status=active')
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page
                ->component('Users/Index')
                ->where('filters.search', 'findme')
                ->where('filters.status', 'active')
                ->where('users.total', 1)
                ->where('users.data.0.username', 'findme-active')
                ->where('users.data.0.roles', ['Staff']))
            ->assertJsonMissingPath('props.users.data.0.password');
    }
}
