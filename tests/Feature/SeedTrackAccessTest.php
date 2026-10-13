<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SeedTrackAccessTest extends TestCase
{
    public function test_guest_is_redirected_to_fortify_login_before_dashboard(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_fortify_login_uses_the_inertia_react_page(): void
    {
        $this->get('/login')
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page->component('Auth/Login'));
    }

    public function test_guest_cannot_open_seed_inventory(): void
    {
        $this->get('/seeds')->assertRedirect('/login');
    }
}
