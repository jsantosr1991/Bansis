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
        Schema::table('solicitudes_hermanos', function (Blueprint $table) {
            $table->string('es_mayor_menor', 20)->nullable()->after('genero');
            $table->integer('numero_hermano')->nullable()->after('es_mayor_menor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_hermanos', function (Blueprint $table) {
            $table->dropColumn(['es_mayor_menor', 'numero_hermano']);
        });
    }
};
