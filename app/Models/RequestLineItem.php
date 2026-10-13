<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestLineItem extends Model
{
    use HasFactory;

    protected $fillable = ['request_id', 'active_seed_id', 'stock_out'];

    protected function casts(): array
    {
        return ['stock_out' => 'decimal:2'];
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(SeedRequest::class, 'request_id');
    }

    public function activeSeed(): BelongsTo
    {
        return $this->belongsTo(ActiveSeed::class);
    }
}
