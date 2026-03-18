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
        Schema::create('solicitudes_hermanos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitud_id')->constrained('solicitudes_empleo')->onDelete('cascade');
            $table->string('nombre', 150)->nullable();
            $table->string('genero', 20)->nullable();
            $table->string('estado', 20)->nullable();
            $table->string('ocupacion', 150)->nullable();
            $table->timestamps();
        });

        Schema::create('solicitudes_hijos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitud_id')->constrained('solicitudes_empleo')->onDelete('cascade');
            $table->string('nombre', 150)->nullable();
            $table->string('genero', 20)->nullable();
            $table->string('estado', 20)->nullable();
            $table->integer('edad')->nullable();
            $table->string('ocupacion', 150)->nullable();
            $table->timestamps();
        });

        Schema::create('solicitudes_conyuges_anteriores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitud_id')->constrained('solicitudes_empleo')->onDelete('cascade');
            $table->string('nombre', 150)->nullable();
            $table->string('causa_separacion', 255)->nullable();
            $table->timestamps();
        });

        Schema::create('solicitudes_cursos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitud_id')->constrained('solicitudes_empleo')->onDelete('cascade');
            $table->string('institucion', 150)->nullable();
            $table->string('nombre_curso', 150)->nullable();
            $table->integer('anio')->nullable();
            $table->timestamps();
        });

        Schema::create('solicitudes_experiencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitud_id')->constrained('solicitudes_empleo')->onDelete('cascade');
            $table->string('empresa', 150)->nullable();
            $table->string('cargo', 100)->nullable();
            $table->string('tiempo', 50)->nullable();
            $table->string('causa_salida', 255)->nullable();
            $table->decimal('sueldo_ultima_remun', 10, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('solicitudes_referencias_laborales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitud_id')->constrained('solicitudes_empleo')->onDelete('cascade');
            $table->string('empresa', 150)->nullable();
            $table->string('contacto_nombre', 150)->nullable();
            $table->string('telefono', 20)->nullable();
            $table->timestamps();
        });

        Schema::create('solicitudes_referencias_personales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitud_id')->constrained('solicitudes_empleo')->onDelete('cascade');
            $table->string('nombre', 150)->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('ocupacion', 150)->nullable();
            $table->string('tiempo_conocerse', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('solicitudes_familiares_empresa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitud_id')->constrained('solicitudes_empleo')->onDelete('cascade');
            $table->string('nombre', 150)->nullable();
            $table->string('empresa', 100)->nullable();
            $table->string('cargo', 100)->nullable();
            $table->string('parentesco', 50)->nullable();
            $table->string('telefono', 20)->nullable();
            $table->timestamps();
        });

        Schema::create('solicitudes_observaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitud_id')->constrained('solicitudes_empleo')->onDelete('cascade');
            $table->string('tipo', 50)->nullable();
            $table->text('comentario')->nullable();
            $table->string('usuario_nombre', 100)->nullable();
            $table->dateTime('fecha')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes_observaciones');
        Schema::dropIfExists('solicitudes_familiares_empresa');
        Schema::dropIfExists('solicitudes_referencias_personales');
        Schema::dropIfExists('solicitudes_referencias_laborales');
        Schema::dropIfExists('solicitudes_experiencias');
        Schema::dropIfExists('solicitudes_cursos');
        Schema::dropIfExists('solicitudes_conyuges_anteriores');
        Schema::dropIfExists('solicitudes_hijos');
        Schema::dropIfExists('solicitudes_hermanos');
    }
};
