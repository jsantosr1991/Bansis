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
        Schema::create('soporte_tecnico', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo_solicitud', ['MANT', 'HARD', 'CONS', 'SOFT', 'RED', 'OTRO']);
            $table->string('tipo_personalizado', 150)->nullable(); // Obligatorio en el front si es OTRO
            $table->string('titulo', 150);
            $table->text('descripcion');
            $table->enum('estado', ['pendiente', 'resuelto'])->default('pendiente');
            $table->string('area_solicitante', 150)->nullable();
            $table->integer('empresa_id')->nullable();
            $table->string('foto_path', 255)->nullable();
            $table->boolean('visto_por_sistemas')->default(false);
            $table->boolean('visto_por_solicitante')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('fecha_resuelto')->nullable();
            $table->timestamps();

            // Foreign keys (ajustar según la tabla de usuarios existente)
            $table->foreign('created_by')->references('id')->on('users')->onDelete('restrict');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('soporte_tecnico');
    }
};
