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
            $table->string('referencial_provincia', 100)->nullable()->after('provincia_nacimiento');
            $table->string('referencial_provincia_otro', 100)->nullable()->after('referencial_provincia');
            $table->string('referencial_ciudad_otro', 100)->nullable()->after('referencial_provincia_otro');
            $table->string('referencial_ciudad_codigo', 20)->nullable()->after('referencial_ciudad_otro');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_empleo', function (Blueprint $table) {
            $table->dropColumn([
                'referencial_provincia',
                'referencial_provincia_otro',
                'referencial_ciudad_otro',
                'referencial_ciudad_codigo'
            ]);
        });
    }
};
