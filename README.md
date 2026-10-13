# SeedTrack Laravel

SeedTrack is the Laravel conversion of the SEED inventory and requisition prototype. Laravel serves the normalized MySQL data model and session-authenticated workflows; React pages are delivered through Inertia.

## Requirements

- PHP 8.3+ with PDO MySQL, Composer, Node.js 20.19+ or 22.12+, and MySQL/MariaDB.
- Create a database named `seedtrack_db` or update the database values in `.env`.

## First Run

1. Install PHP and JavaScript dependencies:

    ```sh
    composer install
    npm install
    ```

2. Edit the generated `.env` file (or copy `.env.example` if `.env` is missing), configure the database and mail transport, then generate the app key:

    ```sh
    php artisan key:generate
    ```

3. For an initial administrator, set `SEEDTRACK_ADMIN_USERNAME`, `SEEDTRACK_ADMIN_EMAIL`, and a strong `SEEDTRACK_ADMIN_PASSWORD` in `.env`. The password is hashed by the seeder. Then create tables and initial roles/reference data:

    ```sh
    php artisan migrate --seed
    ```

    Leave the admin settings blank to create no privileged account. Self-registered users are assigned the `Staff` role. Never commit `.env` or real credentials.

4. Build assets and run Laravel:

    ```sh
    npm run build
    php artisan serve
    ```

    During development, run `npm run dev` in a second terminal. Open the URL reported by `php artisan serve`.

## Workflows

- Fortify provides username/password login, staff-only registration, password reset, and session logout.
- Admin/Manager permissions cover request creation and approval, inventory management, and analytics. Staff can view requests and inventory and dispatch approved requests.
- Request creation stores a requester, request, and seed line item in one transaction. Dispatch checks the approved state, scanned barcode, requested weight, and locked inventory inside a transaction before updating stock and request status.
- The root Blade template is `resources/views/app.blade.php`; React pages live in `resources/js/Pages` and use Laravel routes with Inertia forms for server-side validation feedback.
- Roles and permissions are defined in `database/seeders/RolesAndPermissionsSeeder.php`; domain/reference demo data is in `SeedTrackDataSeeder.php`.

## Verification

```sh
php artisan test
npm run build
```

Feature tests that use a database require a working PDO driver. SQLite is configured for the test suite in `phpunit.xml`; enable `pdo_sqlite` or point test configuration at an isolated MySQL test database.
