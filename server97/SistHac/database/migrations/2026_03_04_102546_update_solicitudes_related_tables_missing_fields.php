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
        // Actualización de Experiencias Laborales
        Schema::table('solicitudes_experiencias', function (Blueprint $table) {
            $table->string('area', 100)->nullable()->after('empresa');
            $table->string('jefe_inmediato', 150)->nullable()->after('cargo');
            $table->date('fecha_inicio')->nullable()->after('jefe_inmediato');
            $table->date('fecha_fin')->nullable()->after('fecha_inicio');
            // Nota: 'tiempo' ya existe pero es un string concatenado por el backend antiguo.
            // Mantendremos 'tiempo' por compatibilidad pero usaremos las nuevas columnas.
        });

        // Actualización de Cursos
        Schema::table('solicitudes_cursos', function (Blueprint $table) {
            $table->integer('duracion')->nullable()->after('nombre_curso');
        });

        // Actualización de Cónyuges Anteriores
        Schema::table('solicitudes_conyuges_anteriores', function (Blueprint $table) {
            $table->string('domicilio', 255)->nullable()->after('nombre');
            $table->string('ocupacion', 150)->nullable()->after('domicilio');
            $table->integer('edad')->nullable()->after('ocupacion');
            $table->string('genero', 20)->nullable()->after('edad');
            $table->string('estado', 20)->nullable()->after('genero');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_experiencias', function (Blueprint $table) {
            $table->dropColumn(['area', 'jefe_inmediato', 'fecha_inicio', 'fecha_fin']);
        });

        Schema::table('solicitudes_cursos', function (Blueprint $table) {
            $table->dropColumn('duracion');
        });

        Schema::table('solicitudes_conyuges_anteriores', function (Blueprint $table) {
            $table->dropColumn(['domicilio', 'ocupacion', 'edad', 'genero', 'estado']);
        });
    }
};
