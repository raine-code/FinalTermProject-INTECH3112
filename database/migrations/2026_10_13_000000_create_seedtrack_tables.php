<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('municipalities', function (Blueprint $table) {
            $table->id();
            $table->string('town', 100);
            $table->string('province', 100)->default('N/A');
            $table->timestamps();
        });

        Schema::create('requesters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('municipality_id')->constrained()->restrictOnDelete();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('agency', 150)->nullable();
            $table->string('email', 150)->unique();
            $table->timestamps();
        });

        Schema::create('gids', function (Blueprint $table) {
            $table->id();
            $table->string('accession_number', 20)->unique();
            $table->string('accession_name', 150);
            $table->timestamps();
        });

        Schema::create('active_seeds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gid_id')->nullable()->constrained('gids')->restrictOnDelete();
            $table->string('name', 150);
            $table->decimal('current_weight', 10, 2)->default(0);
            $table->decimal('viability', 4, 1)->default(0);
            $table->string('barcode', 100)->unique();
            $table->unsignedInteger('stock_on_hand')->default(0);
            $table->string('location', 100)->nullable();
            $table->enum('availability', ['AVAILABLE', 'UNAVAILABLE', 'RESERVED'])->default('AVAILABLE');
            $table->timestamps();
        });

        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_id')->constrained()->restrictOnDelete();
            $table->string('tracking_no', 50)->unique();
            $table->date('date_req');
            $table->date('deadline_date')->nullable();
            $table->decimal('weight_req', 10, 2);
            $table->string('study_title', 255);
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED', 'DISPATCHED'])->default('PENDING')->index();
            $table->date('date_approved')->nullable();
            $table->date('date_dispatched')->nullable();
            $table->timestamps();
        });

        Schema::create('request_line_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained()->cascadeOnDelete();
            $table->foreignId('active_seed_id')->constrained('active_seeds')->restrictOnDelete();
            $table->decimal('stock_out', 10, 2)->default(0);
            $table->timestamps();
            $table->unique(['request_id', 'active_seed_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('request_line_items');
        Schema::dropIfExists('requests');
        Schema::dropIfExists('active_seeds');
        Schema::dropIfExists('gids');
        Schema::dropIfExists('requesters');
        Schema::dropIfExists('municipalities');
    }
};
