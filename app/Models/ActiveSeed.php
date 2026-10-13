<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ActiveSeed extends Model
{
    use HasFactory;

    protected $fillable = [
        'gid_id',
        'name',
        'current_weight',
        'viability',
        'barcode',
        'stock_on_hand',
        'location',
        'availability',
    ];

    protected function casts(): array
    {
        return [
            'current_weight' => 'decimal:2',
            'viability' => 'decimal:1',
        ];
    }

    public function gid(): BelongsTo
    {
        return $this->belongsTo(Gid::class);
    }

    public function requestLineItems(): HasMany
    {
        return $this->hasMany(RequestLineItem::class);
    }
}
