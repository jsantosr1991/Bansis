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
            $table->enum('genero', ['MASCULINO', 'FEMENINO'])->nullable()->after('apodo');
            $table->boolean('tiene_discapacidad')->default(false)->after('genero');
            $table->string('discapacidad_detalle')->nullable()->after('tiene_discapacidad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_empleo', function (Blueprint $table) {
            $table->dropColumn(['genero', 'tiene_discapacidad', 'discapacidad_detalle']);
        });
    }
};
