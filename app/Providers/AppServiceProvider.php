<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::loginView(fn() => Inertia::render('Auth/Login'));
        Fortify::registerView(fn() => Inertia::render('Auth/Register'));
        Fortify::requestPasswordResetLinkView(fn() => Inertia::render('Auth/ForgotPassword'));
        Fortify::resetPasswordView(fn(Request $request) => Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));
        Fortify::authenticateUsing(function (Request $request): ?User {
            $user = User::where('username', mb_strtolower($request->input('username')))->first();

            return $user && $user->status === 'active' && Hash::check($request->input('password'), $user->password)
                ? $user
                : null;
        });
    }
}
