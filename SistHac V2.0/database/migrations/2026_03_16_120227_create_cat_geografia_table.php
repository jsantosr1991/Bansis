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
        Schema::create('cat_geografia', function (Blueprint $table) {
            $table->id();
            $table->string('provincia_codigo')->index();
            $table->string('provincia_nombre');
            $table->string('canton_codigo')->unique();
            $table->string('canton_nombre');
            $table->string('telefono_fijo_codigo')->nullable();
            $table->string('institucion_transito')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cat_geografia');
    }
};
