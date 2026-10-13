<?php

namespace Tests\Feature;

use App\Models\ActiveSeed;
use App\Models\SeedRequest;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\SeedTrackDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeedTrackWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([RolesAndPermissionsSeeder::class, SeedTrackDataSeeder::class]);
    }

    public function test_registration_assigns_staff_role(): void
    {
        $this->post('/register', [
            'username' => 'newstaff',
            'first_name' => 'New',
            'last_name' => 'Staff',
            'email' => 'newstaff@example.test',
            'password' => 'StrongPass123!',
            'password_confirmation' => 'StrongPass123!',
        ])->assertRedirect('/dashboard');

        $user = User::where('email', 'newstaff@example.test')->firstOrFail();
        $this->assertTrue($user->hasRole('Staff'));
        $this->assertFalse($user->hasRole('Admin'));
    }

    public function test_user_can_sign_in_with_username(): void
    {
        $user = User::factory()->create(['username' => 'seedstaff']);

        $this->post('/login', [
            'username' => 'seedstaff',
            'password' => 'password',
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($user);
    }

    public function test_staff_cannot_approve_a_request(): void
    {
        $staff = User::factory()->create();
        $staff->assignRole('Staff');
        $request = SeedRequest::where('status', 'PENDING')->firstOrFail();

        $this->actingAs($staff)
            ->patch('/requests/' . $request->id . '/status', ['status' => 'APPROVED'])
            ->assertForbidden();

        $this->assertDatabaseHas('requests', ['id' => $request->id, 'status' => 'PENDING']);
    }

    public function test_admin_can_create_a_valid_seed_request(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $seed = ActiveSeed::firstOrFail();

        $this->actingAs($admin)
            ->post('/requests', [
                'first_name' => 'Test',
                'last_name' => 'Requester',
                'agency' => 'Research Lab',
                'email' => 'requester@example.test',
                'municipality_id' => 1,
                'active_seed_id' => $seed->id,
                'weight_req' => 12.5,
                'study_title' => 'Seed growth trial',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('requests', [
            'study_title' => 'Seed growth trial',
            'weight_req' => 12.5,
            'status' => 'PENDING',
        ]);
        $this->assertDatabaseHas('request_line_items', [
            'active_seed_id' => $seed->id,
            'stock_out' => 0,
        ]);
    }

    public function test_admin_can_update_a_pending_request(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        $request = SeedRequest::where('status', 'PENDING')->with(['requester', 'lineItems'])->firstOrFail();
        $seed = ActiveSeed::firstOrFail();

        $this->actingAs($admin)
            ->put('/requests/' . $request->id, [
                'first_name' => $request->requester->first_name,
                'last_name' => $request->requester->last_name,
                'agency' => $request->requester->agency,
                'email' => $request->requester->email,
                'municipality_id' => $request->requester->municipality_id,
                'active_seed_id' => $seed->id,
                'weight_req' => 14,
                'study_title' => 'Updated study title',
            ])
            ->assertRedirect('/requests/' . $request->id);

        $this->assertDatabaseHas('requests', [
            'id' => $request->id,
            'weight_req' => 14,
            'study_title' => 'Updated study title',
        ]);
    }

    public function test_admin_can_register_seed_inventory_with_accession(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $this->actingAs($admin)
            ->post('/seeds', [
                'name' => 'Test Rice',
                'barcode' => 'TEST-SEED-0001',
                'accession_number' => 'TEST000001',
                'current_weight' => 25.5,
                'stock_on_hand' => 8,
                'viability' => 97.5,
                'location' => 'RACK-01',
                'availability' => 'AVAILABLE',
            ])
            ->assertRedirect('/seeds');

        $this->assertDatabaseHas('gids', [
            'accession_number' => 'TEST000001',
            'accession_name' => 'Test Rice',
        ]);
        $this->assertDatabaseHas('active_seeds', [
            'barcode' => 'TEST-SEED-0001',
            'current_weight' => 25.5,
            'stock_on_hand' => 8,
        ]);
    }

    public function test_invalid_request_input_is_rejected_server_side(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $this->actingAs($admin)
            ->from('/requests/create')
            ->post('/requests', ['study_title' => 'Incomplete request'])
            ->assertRedirect('/requests/create')
            ->assertSessionHasErrors(['first_name', 'email', 'municipality_id', 'active_seed_id', 'weight_req']);

        $this->assertDatabaseMissing('requests', ['study_title' => 'Incomplete request']);
    }

    public function test_mismatched_barcode_does_not_dispatch_or_deduct_stock(): void
    {
        $staff = User::factory()->create();
        $staff->assignRole('Staff');
        $request = SeedRequest::where('status', 'APPROVED')->with('lineItems.activeSeed')->firstOrFail();
        $seed = $request->lineItems->first()->activeSeed;
        $originalWeight = (float) $seed->current_weight;

        $this->actingAs($staff)
            ->from('/scanner/' . $request->id)
            ->post('/requests/' . $request->id . '/dispatch', [
                'barcode' => 'NOT-THE-REQUESTED-SEED',
                'quantity_grams' => $request->weight_req,
            ])
            ->assertRedirect('/scanner/' . $request->id)
            ->assertSessionHasErrors('barcode');

        $this->assertDatabaseHas('requests', ['id' => $request->id, 'status' => 'APPROVED']);
        $this->assertEquals($originalWeight, (float) $seed->fresh()->current_weight);
    }

    public function test_staff_dispatch_deducts_inventory_and_updates_request(): void
    {
        $staff = User::factory()->create();
        $staff->assignRole('Staff');
        $request = SeedRequest::where('status', 'APPROVED')->with('lineItems.activeSeed')->firstOrFail();
        $seed = $request->lineItems->first()->activeSeed;
        $originalWeight = (float) $seed->current_weight;

        $this->actingAs($staff)
            ->post('/requests/' . $request->id . '/dispatch', [
                'barcode' => $seed->barcode,
                'quantity_grams' => $request->weight_req,
            ])
            ->assertRedirect('/dashboard');

        $this->assertDatabaseHas('requests', ['id' => $request->id, 'status' => 'DISPATCHED']);
        $this->assertEquals($originalWeight - (float) $request->weight_req, (float) $seed->fresh()->current_weight);
        $this->assertEquals((float) $request->weight_req, (float) $request->lineItems->first()->fresh()->stock_out);
    }
}
