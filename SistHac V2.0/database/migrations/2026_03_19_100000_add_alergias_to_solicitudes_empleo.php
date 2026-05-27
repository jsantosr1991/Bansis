<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('solicitudes_empleo', function (Blueprint $row) {
            $row->boolean('salud_alergias')->default(false)->after('salud_otros_antecedentes');
            $row->text('salud_alergias_detalle')->nullable()->after('salud_alergias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_empleo', function (Blueprint $row) {
            $row->dropColumn(['salud_alergias', 'salud_alergias_detalle']);
        });
    }
};
