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
            $table->date('padre_fecha_nacimiento')->nullable()->after('padre_estado');
            $table->date('madre_fecha_nacimiento')->nullable()->after('madre_estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_empleo', function (Blueprint $table) {
            $table->dropColumn(['padre_fecha_nacimiento', 'madre_fecha_nacimiento']);
        });
    }
};
