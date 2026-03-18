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
            $table->string('apellido_paterno', 100)->nullable()->change();
            $table->string('apellido_materno', 100)->nullable()->change();
            $table->string('nombres', 100)->nullable()->change();
            $table->date('fecha_nacimiento')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_empleo', function (Blueprint $table) {
            $table->string('apellido_paterno', 100)->nullable(false)->change();
            $table->string('apellido_materno', 100)->nullable(false)->change();
            $table->string('nombres', 100)->nullable(false)->change();
            $table->date('fecha_nacimiento')->nullable(false)->change();
        });
    }
};
