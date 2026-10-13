<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SeedRequest extends Model
{
    use HasFactory;

    protected $table = 'requests';

    protected $fillable = [
        'requester_id',
        'tracking_no',
        'date_req',
        'deadline_date',
        'weight_req',
        'study_title',
        'status',
        'date_approved',
        'date_dispatched',
    ];

    protected function casts(): array
    {
        return [
            'date_req' => 'date:Y-m-d',
            'deadline_date' => 'date:Y-m-d',
            'date_approved' => 'date:Y-m-d',
            'date_dispatched' => 'date:Y-m-d',
            'weight_req' => 'decimal:2',
        ];
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(Requester::class);
    }

    public function lineItems(): HasMany
    {
        return $this->hasMany(RequestLineItem::class, 'request_id');
    }
}
