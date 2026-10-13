<?php

namespace Database\Seeders;

use App\Models\ActiveSeed;
use App\Models\Gid;
use App\Models\Municipality;
use App\Models\Requester;
use App\Models\SeedRequest;
use Illuminate\Database\Seeder;

class SeedTrackDataSeeder extends Seeder
{
    public function run(): void
    {
        $municipalities = [];
        foreach (
            [
                ['Science City of Munoz', 'Nueva Ecija'],
                ['Cabanatuan City', 'Nueva Ecija'],
                ['San Jose City', 'Nueva Ecija'],
                ['Talavera', 'Nueva Ecija'],
                ['Guimba', 'Nueva Ecija'],
            ] as [$town, $province]
        ) {
            $municipalities[$town] = Municipality::firstOrCreate([
                'town' => $town,
                'province' => $province,
            ]);
        }

        $seeds = [];
        foreach (
            [
                ['PRRI000001', 'HINAMOG', '2023-01-0001-1', 80, 96.5, 80, 'T679'],
                ['PRRI000002', 'DINORADO', '2023-01-0002-1', 75, 95.0, 75, 'T680'],
                ['PRRI000003', 'IR64', '2023-01-0003-1', 52, 94.2, 60, 'T681'],
                ['PRRI000004', 'NSIC Rc 222', '2023-01-0004-1', 85, 98.1, 85, 'T682'],
                ['PRRI000005', 'PSB Rc18', '2023-01-0005-1', 40, 92.8, 40, 'T683'],
            ] as [$accession, $name, $barcode, $weight, $viability, $packets, $location]
        ) {
            $gid = Gid::updateOrCreate(
                ['accession_number' => $accession],
                ['accession_name' => $name],
            );
            $seeds[$accession] = ActiveSeed::updateOrCreate(
                ['barcode' => $barcode],
                [
                    'gid_id' => $gid->id,
                    'name' => $name,
                    'current_weight' => $weight,
                    'viability' => $viability,
                    'stock_on_hand' => $packets,
                    'location' => $location,
                    'availability' => 'AVAILABLE',
                ],
            );
        }

        $sampleRequests = [
            ['Malvin', 'Duldulao', 'DA-Philippine Rice Research Institute', 'malvin@philrice.gov.ph', 'Science City of Munoz', 'PRRI000001', 'PENDING', 10, 'Seed Germination Viability Study'],
            ['John', 'Santos', 'Central Luzon State University', 'john.santos@clsu.edu.ph', 'Cabanatuan City', 'PRRI000002', 'APPROVED', 5, 'Rice Drought Resistance Study'],
            ['Maria', 'Reyes', 'Department of Agriculture', 'maria.reyes@da.gov.ph', 'San Jose City', 'PRRI000003', 'DISPATCHED', 8, 'Genetic Diversity of Traditional Rice'],
        ];

        foreach ($sampleRequests as $index => [$first, $last, $agency, $email, $town, $accession, $status, $weight, $studyTitle]) {
            $requester = Requester::updateOrCreate(
                ['email' => $email],
                [
                    'municipality_id' => $municipalities[$town]->id,
                    'first_name' => $first,
                    'last_name' => $last,
                    'agency' => $agency,
                ],
            );

            $seed = $seeds[$accession];
            $tracking = now()->format('Y') . '-GBSR-' . str_pad((string) (9001 + $index), 4, '0', STR_PAD_LEFT);
            $record = SeedRequest::updateOrCreate(
                ['tracking_no' => $tracking],
                [
                    'requester_id' => $requester->id,
                    'date_req' => today()->subDays(3 - $index),
                    'deadline_date' => $index < 2 ? today()->addDays(3 + $index) : null,
                    'weight_req' => $weight,
                    'study_title' => $studyTitle,
                    'status' => $status,
                    'date_approved' => $status !== 'PENDING' ? today()->subDay() : null,
                    'date_dispatched' => $status === 'DISPATCHED' ? today() : null,
                ],
            );
            $record->lineItems()->updateOrCreate(
                ['active_seed_id' => $seed->id],
                ['stock_out' => $status === 'DISPATCHED' ? $weight : 0],
            );
        }
    }
}
