<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Agregar columnas faltantes a hermanos y referencias laborales.
     * - solicitudes_hermanos: edad, domicilio
     * - solicitudes_referencias_laborales: cargo
     */
    public function up(): void
    {
        Schema::table('solicitudes_hermanos', function (Blueprint $table) {
            if (!Schema::hasColumn('solicitudes_hermanos', 'edad')) {
                $table->integer('edad')->nullable()->after('estado');
            }
            if (!Schema::hasColumn('solicitudes_hermanos', 'domicilio')) {
                $table->string('domicilio', 255)->nullable()->after('edad');
            }
        });

        Schema::table('solicitudes_referencias_laborales', function (Blueprint $table) {
            if (!Schema::hasColumn('solicitudes_referencias_laborales', 'cargo')) {
                $table->string('cargo', 150)->nullable()->after('contacto_nombre');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_hermanos', function (Blueprint $table) {
            $table->dropColumn(['edad', 'domicilio']);
        });

        Schema::table('solicitudes_referencias_laborales', function (Blueprint $table) {
            $table->dropColumn('cargo');
        });
    }
};
