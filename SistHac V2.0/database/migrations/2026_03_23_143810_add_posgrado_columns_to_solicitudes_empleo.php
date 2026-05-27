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
            $table->string('edu_posgrado_institucion')->nullable()->after('edu_superior_anio');
            $table->string('edu_posgrado_carrera')->nullable()->after('edu_posgrado_institucion');
            $table->string('edu_posgrado_estado')->nullable()->after('edu_posgrado_carrera');
            $table->integer('edu_posgrado_anio')->nullable()->after('edu_posgrado_estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_empleo', function (Blueprint $table) {
            $table->dropColumn([
                'edu_posgrado_institucion',
                'edu_posgrado_carrera',
                'edu_posgrado_estado',
                'edu_posgrado_anio'
            ]);
        });
    }
};
