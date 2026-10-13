<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Spatie\Permission\Models\Role;

class CreateNewUser implements CreatesNewUsers
{
    public function create(array $input): User
    {
        Validator::make($input, [
            'username' => ['required', 'string', 'min:4', 'max:50', 'alpha_dash', 'unique:users,username'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ])->validate();

        $user = User::create([
            'username' => mb_strtolower($input['username']),
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'email' => mb_strtolower($input['email']),
            'password' => $input['password'],
        ]);

        Role::findOrCreate('Staff', 'web');
        $user->assignRole('Staff');

        return $user;
    }
}
