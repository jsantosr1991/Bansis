<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Migrar registros existentes de CONTRATADO a APROBADO
        DB::table('solicitudes_empleo')
            ->where('estado_solicitud', 'CONTRATADO')
            ->update(['estado_solicitud' => 'APROBADO']);

        // 2. Modificar el ENUM para eliminar CONTRATADO
        DB::statement("ALTER TABLE solicitudes_empleo MODIFY COLUMN estado_solicitud ENUM('BORRADOR', 'PENDIENTE', 'EN_REVISION', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Volver a incluir CONTRATADO en el ENUM
        DB::statement("ALTER TABLE solicitudes_empleo MODIFY COLUMN estado_solicitud ENUM('BORRADOR', 'PENDIENTE', 'EN_REVISION', 'APROBADO', 'RECHAZADO', 'CONTRATADO') DEFAULT 'PENDIENTE'");
    }
};
