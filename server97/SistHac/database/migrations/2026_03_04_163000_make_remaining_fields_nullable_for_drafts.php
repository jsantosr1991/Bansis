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
            // Sección 1: Datos Administrativos
            $table->integer('company_id')->nullable()->change();
            $table->boolean('usa_banco_guayaquil')->nullable()->change();
            
            // Condiciones
            $table->boolean('condiciones_transporte')->nullable()->change();
            $table->boolean('condiciones_vehiculo')->nullable()->change();
            $table->boolean('condiciones_licencia')->nullable()->change();
            $table->boolean('condiciones_acumulacion_decimos')->nullable()->change();
            $table->boolean('condiciones_semana_completa')->nullable()->change();
            $table->boolean('condiciones_solo_proceso')->nullable()->change();
            $table->boolean('condiciones_almuerzo')->nullable()->change();
            
            // Sección 2: Datos Personales (Booleans)
            $table->boolean('vacuna_covid_1')->nullable()->change();
            $table->boolean('vacuna_covid_2')->nullable()->change();
            $table->boolean('vacuna_covid_3')->nullable()->change();

            // Sección 3: Documentación (Integers can be null)
            $table->integer('doc_cedula_cant')->nullable()->change();
            $table->integer('doc_certificado_votacion_cant')->nullable()->change();
            $table->integer('doc_libreta_militar_cant')->nullable()->change();
            $table->integer('doc_certificado_iess_cant')->nullable()->change();
            $table->integer('doc_certificado_laboral_cant')->nullable()->change();
            $table->integer('doc_fotos_cant')->nullable()->change();

            // Sección 4: Datos Referenciales (Booleans)
            $table->boolean('referencial_servicio_agua')->nullable()->change();
            $table->boolean('referencial_servicio_luz')->nullable()->change();
            $table->boolean('referencial_servicio_telefono')->nullable()->change();

            // Sección 5: Estado Civil
            $table->integer('estado_civil_compromisos_anteriores')->nullable()->change();

            // Sección 9: Experiencia Laboral
            $table->boolean('exp_sin_experiencia')->nullable()->change();

            // Sección 11: Salud Personal
            $table->boolean('salud_operaciones')->nullable()->change();
            $table->boolean('salud_fracturas')->nullable()->change();
            $table->boolean('salud_quemaduras')->nullable()->change();
            $table->boolean('salud_accidentes_laborales')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicitudes_empleo', function (Blueprint $table) {
            $table->integer('company_id')->nullable(false)->change();
            $table->boolean('usa_banco_guayaquil')->nullable(false)->default(false)->change();
            $table->boolean('condiciones_transporte')->nullable(false)->default(false)->change();
            $table->boolean('condiciones_vehiculo')->nullable(false)->default(false)->change();
            $table->boolean('condiciones_licencia')->nullable(false)->default(false)->change();
            $table->boolean('condiciones_acumulacion_decimos')->nullable(false)->default(false)->change();
            $table->boolean('condiciones_semana_completa')->nullable(false)->default(false)->change();
            $table->boolean('condiciones_solo_proceso')->nullable(false)->default(false)->change();
            $table->boolean('condiciones_almuerzo')->nullable(false)->default(false)->change();
            $table->boolean('vacuna_covid_1')->nullable(false)->default(false)->change();
            $table->boolean('vacuna_covid_2')->nullable(false)->default(false)->change();
            $table->boolean('vacuna_covid_3')->nullable(false)->default(false)->change();
            $table->integer('doc_cedula_cant')->nullable(false)->default(0)->change();
            $table->integer('doc_certificado_votacion_cant')->nullable(false)->default(0)->change();
            $table->integer('doc_libreta_militar_cant')->nullable(false)->default(0)->change();
            $table->integer('doc_certificado_iess_cant')->nullable(false)->default(0)->change();
            $table->integer('doc_certificado_laboral_cant')->nullable(false)->default(0)->change();
            $table->integer('doc_fotos_cant')->nullable(false)->default(0)->change();
            $table->boolean('referencial_servicio_agua')->nullable(false)->default(false)->change();
            $table->boolean('referencial_servicio_luz')->nullable(false)->default(false)->change();
            $table->boolean('referencial_servicio_telefono')->nullable(false)->default(false)->change();
            $table->integer('estado_civil_compromisos_anteriores')->nullable(false)->default(0)->change();
            $table->boolean('exp_sin_experiencia')->nullable(false)->default(false)->change();
            $table->boolean('salud_operaciones')->nullable(false)->default(false)->change();
            $table->boolean('salud_fracturas')->nullable(false)->default(false)->change();
            $table->boolean('salud_quemaduras')->nullable(false)->default(false)->change();
            $table->boolean('salud_accidentes_laborales')->nullable(false)->default(false)->change();
        });
    }
};
