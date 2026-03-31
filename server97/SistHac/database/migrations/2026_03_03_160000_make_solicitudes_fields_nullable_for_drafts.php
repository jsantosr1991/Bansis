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
        Schema::table('solicitudes_empleo', function (Blueprint $table) {
            // 1. Ampliar el ENUM para incluir 'BORRADOR'
            DB::statement("ALTER TABLE solicitudes_empleo MODIFY COLUMN estado_solicitud ENUM('BORRADOR', 'PENDIENTE', 'EN_REVISION', 'APROBADO', 'RECHAZADO', 'CONTRATADO') DEFAULT 'PENDIENTE'");

            // 2. Hacer campos obligatorios nullable para permitir borradores
            $table->string('apellido_paterno', 100)->nullable()->change();
            $table->string('apellido_materno', 100)->nullable()->change();
            $table->string('nombres', 100)->nullable()->change();
            $table->string('area', 100)->nullable()->change();
            $table->string('labor', 100)->nullable()->change();
            $table->date('fecha_ingreso')->nullable()->change();
            $table->date('fecha_nacimiento')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_empleo', function (Blueprint $table) {
            // Revertir a PENDIENTE por defecto y quitar BORRADOR
            DB::statement("ALTER TABLE solicitudes_empleo MODIFY COLUMN estado_solicitud ENUM('PENDIENTE', 'EN_REVISION', 'APROBADO', 'RECHAZADO', 'CONTRATADO') DEFAULT 'PENDIENTE'");

            // Revertir a NOT NULL (Precaución: esto puede fallar si hay nulos en la BD)
            $table->string('apellido_paterno', 100)->nullable(false)->change();
            $table->string('apellido_materno', 100)->nullable(false)->change();
            $table->string('nombres', 100)->nullable(false)->change();
            $table->string('area', 100)->nullable(false)->change();
            $table->string('labor', 100)->nullable(false)->change();
            $table->date('fecha_ingreso')->nullable(false)->change();
            $table->date('fecha_nacimiento')->nullable(false)->change();
        });
    }
};
