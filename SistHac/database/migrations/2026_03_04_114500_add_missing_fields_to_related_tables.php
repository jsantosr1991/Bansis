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
        // Agregar campos a Referencias Personales
        Schema::table('solicitudes_referencias_personales', function (Blueprint $table) {
            if (!Schema::hasColumn('solicitudes_referencias_personales', 'empresa')) {
                $table->string('empresa', 150)->nullable()->after('ocupacion');
            }
            // 'cargo' ya suele ser alias de 'ocupacion', pero lo agregaremos para claridad si no existe
            if (!Schema::hasColumn('solicitudes_referencias_personales', 'cargo')) {
                $table->string('cargo', 150)->nullable()->after('empresa');
            }
        });

        // Agregar campos a Familiares en Empresa
        Schema::table('solicitudes_familiares_empresa', function (Blueprint $table) {
            if (!Schema::hasColumn('solicitudes_familiares_empresa', 'area')) {
                $table->string('area', 100)->nullable()->after('cargo');
            }
        });

        // Agregar campos a Hijos
        Schema::table('solicitudes_hijos', function (Blueprint $table) {
            if (!Schema::hasColumn('solicitudes_hijos', 'discapacidad')) {
                $table->boolean('discapacidad')->default(false)->after('ocupacion');
            }
            if (!Schema::hasColumn('solicitudes_hijos', 'descripcion_discapacidad')) {
                $table->string('descripcion_discapacidad', 255)->nullable()->after('discapacidad');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_referencias_personales', function (Blueprint $table) {
            $table->dropColumn(['empresa', 'cargo']);
        });

        Schema::table('solicitudes_familiares_empresa', function (Blueprint $table) {
            $table->dropColumn('area');
        });

        Schema::table('solicitudes_hijos', function (Blueprint $table) {
            $table->dropColumn(['discapacidad', 'descripcion_discapacidad']);
        });
    }
};
