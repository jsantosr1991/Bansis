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
        Schema::table('solicitudes_empleo', function (Blueprint $table) {
            // Usamos DB::statement para MySQL ya que Doctrine DBAL no maneja bien ENUM cambios nativos en todas las versiones
            DB::statement("ALTER TABLE solicitudes_empleo MODIFY COLUMN estado_solicitud ENUM('PENDIENTE', 'EN_REVISION', 'APROBADO', 'RECHAZADO', 'CONTRATADO') DEFAULT 'PENDIENTE'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_empleo', function (Blueprint $table) {
            DB::statement("ALTER TABLE solicitudes_empleo MODIFY COLUMN estado_solicitud ENUM('PENDIENTE', 'EN_EVALUACION', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE'");
        });
    }
};
