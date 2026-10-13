<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Requester extends Model
{
    use HasFactory;

    protected $fillable = ['municipality_id', 'first_name', 'last_name', 'agency', 'email'];

    public function municipality(): BelongsTo
    {
        return $this->belongsTo(Municipality::class);
    }

    public function requests(): HasMany
    {
        return $this->hasMany(SeedRequest::class);
    }
}
