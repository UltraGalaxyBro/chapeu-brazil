<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::updateOrCreate(
            ['email' => 'pablonogueira1996@gmail.com'],
            [
                'name' => 'Pablo Nogueira',
                'email_verified_at' => now(),
                'password' => Hash::make('Pableira21!'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'jimmyxd7@hotmail.com'],
            [
                'name' => 'Jimmy Henry',
                'email_verified_at' => now(),
                'password' => Hash::make('admin'),
            ]
        );
    }
}
