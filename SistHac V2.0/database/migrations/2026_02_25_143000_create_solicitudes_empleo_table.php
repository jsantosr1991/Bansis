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
        Schema::create('solicitudes_empleo', function (Blueprint $group) {
            $group->id();
            $group->string('codigo_solicitud', 50)->unique()->nullable();
            $group->enum('estado_solicitud', ['PENDIENTE', 'EN_EVALUACION', 'APROBADO', 'RECHAZADO'])->default('PENDIENTE');

            // SECCIÓN 1: DATOS ADMINISTRATIVOS
            $group->integer('company_id');
            $group->string('area', 100);
            $group->string('labor', 100);
            $group->date('fecha_ingreso');
            
            // Info Bancaria
            $group->boolean('usa_banco_guayaquil')->default(false);
            $group->string('banco_numero_cuenta', 20)->nullable();
            $group->string('banco_tipo_cuenta', 20)->nullable();
            $group->string('banco_titular', 120)->nullable();
            
            // Fechas de Control
            $group->date('fecha_revision_guayaquil')->nullable();
            $group->date('reingreso_fecha')->nullable();
            $group->date('fecha_salida')->nullable();
            
            // Condiciones
            $group->string('condiciones_tipo_contrato', 80)->nullable();
            $group->boolean('condiciones_transporte')->default(false);
            $group->string('condiciones_recorrido', 100)->nullable();
            $group->string('condiciones_recorrido_otro', 100)->nullable();
            $group->boolean('condiciones_vehiculo')->default(false);
            $group->boolean('condiciones_licencia')->default(false);
            $group->string('condiciones_licencia_tipo', 10)->nullable();
            $group->boolean('condiciones_acumulacion_decimos')->default(false);
            $group->boolean('condiciones_semana_completa')->default(false);
            $group->boolean('condiciones_solo_proceso')->default(false);
            $group->boolean('condiciones_almuerzo')->default(false);
            
            // Control Interno
            $group->integer('responsable_id')->nullable();
            $group->string('responsable_nombre', 100)->nullable();
            $group->string('responsable_grupo', 100)->nullable();
            $group->date('fecha_entrevista')->nullable();

            // SECCIÓN 2: DATOS PERSONALES
            $group->string('apellido_paterno', 100);
            $group->string('apellido_materno', 100);
            $group->string('nombres', 100);
            $group->string('apodo', 50)->nullable();
            $group->string('pais_nacimiento', 100)->nullable();
            $group->string('pais_nacimiento_otro', 100)->nullable();
            $group->string('provincia_nacimiento', 100)->nullable();
            $group->string('provincia_nacimiento_otro', 100)->nullable();
            $group->date('fecha_nacimiento');
            $group->integer('edad')->nullable();
            $group->string('tipo_sangre', 10)->nullable();
            $group->decimal('estatura', 4, 2)->nullable();
            $group->decimal('peso', 5, 2)->nullable();
            $group->string('religion', 100)->nullable();
            $group->string('correo', 150)->nullable();
            $group->boolean('vacuna_covid_1')->default(false);
            $group->boolean('vacuna_covid_2')->default(false);
            $group->boolean('vacuna_covid_3')->default(false);
            $group->string('afiliado_iess', 10)->nullable();

            // SECCIÓN 3: DOCUMENTACIÓN
            $group->integer('doc_cedula_cant')->default(0);
            $group->integer('doc_certificado_votacion_cant')->default(0);
            $group->integer('doc_libreta_militar_cant')->default(0);
            $group->integer('doc_certificado_iess_cant')->default(0);
            $group->integer('doc_certificado_laboral_cant')->default(0);
            $group->integer('doc_fotos_cant')->default(0);

            // SECCIÓN 4: DATOS REFERENCIALES
            $group->string('referencial_direccion', 255)->nullable();
            $group->string('referencial_ciudad', 100)->nullable();
            $group->string('referencial_telefono_principal', 20)->nullable();
            $group->string('referencial_telefono_secundario', 20)->nullable();
            $group->string('referencial_vivienda_material', 100)->nullable();
            $group->string('referencial_vivienda_condicion', 100)->nullable();
            $group->integer('referencial_cantidad_familiares')->default(0);
            $group->string('referencial_familiares_relacion', 255)->nullable();
            $group->string('referencial_telefono_emergencia', 20)->nullable();
            $group->string('referencial_nombre_contacto_emergencia', 150)->nullable();
            $group->boolean('referencial_servicio_agua')->default(false);
            $group->boolean('referencial_servicio_luz')->default(false);
            $group->boolean('referencial_servicio_telefono')->default(false);

            // SECCIÓN 5: ESTADO CIVIL
            $group->string('estado_civil', 50)->nullable();
            $group->integer('estado_civil_tiempo_valor')->nullable();
            $group->string('estado_civil_tiempo_unidad', 20)->nullable();
            $group->string('estado_civil_tipo_matrimonio', 50)->nullable();
            $group->string('estado_civil_demandas', 10)->nullable();
            $group->integer('estado_civil_compromisos_anteriores')->default(0);

            // SECCIÓN 6: DATOS FAMILIARES PRINCIPALES
            $group->string('padre_nombre', 150)->nullable();
            $group->string('padre_estado', 20)->nullable();
            $group->integer('padre_edad')->nullable();
            $group->string('padre_domicilio', 255)->nullable();
            $group->string('padre_ocupacion', 150)->nullable();
            
            $group->string('madre_nombre', 150)->nullable();
            $group->string('madre_estado', 20)->nullable();
            $group->integer('madre_edad')->nullable();
            $group->string('madre_domicilio', 255)->nullable();
            $group->string('madre_ocupacion', 150)->nullable();
            
            $group->string('conyuge_nombre', 150)->nullable();
            $group->string('conyuge_estado', 20)->nullable();
            $group->integer('conyuge_edad')->nullable();
            $group->string('conyuge_domicilio', 255)->nullable();
            $group->string('conyuge_ocupacion', 150)->nullable();

            // SECCIÓN 7: DATOS EDUCATIVOS
            $group->string('edu_nivel_maximo', 100)->nullable();
            $group->string('edu_inicial_institucion', 150)->nullable();
            $group->integer('edu_inicial_anio')->nullable();
            $group->string('edu_basica_institucion', 150)->nullable();
            $group->string('edu_basica_grado', 100)->nullable();
            $group->integer('edu_basica_anio')->nullable();
            $group->string('edu_bachillerato_institucion', 150)->nullable();
            $group->string('edu_bachillerato_titulo', 150)->nullable();
            $group->integer('edu_bachillerato_anio')->nullable();
            $group->string('edu_superior_institucion', 150)->nullable();
            $group->string('edu_superior_tipo', 50)->nullable();
            $group->string('edu_superior_nivel', 100)->nullable();
            $group->string('edu_superior_carrera', 150)->nullable();
            $group->string('edu_superior_estado', 50)->nullable();
            $group->integer('edu_superior_anio')->nullable();

            // SECCIÓN 9: EXPERIENCIA LABORAL HEADER
            $group->boolean('exp_sin_experiencia')->default(false);
            $group->text('exp_descripcion_labores')->nullable();

            // SECCIÓN 11: SALUD PERSONAL
            $group->boolean('salud_operaciones')->default(false);
            $group->text('salud_operaciones_detalle')->nullable();
            $group->boolean('salud_fracturas')->default(false);
            $group->text('salud_fracturas_detalle')->nullable();
            $group->boolean('salud_quemaduras')->default(false);
            $group->text('salud_quemaduras_detalle')->nullable();
            $group->boolean('salud_accidentes_laborales')->default(false);
            $group->text('salud_accidentes_laborales_detalle')->nullable();
            $group->text('salud_otros_antecedentes')->nullable();
            $group->string('salud_deporte', 255)->nullable();
            $group->string('salud_actividad_social', 255)->nullable();

            // SECCIÓN 13: APROBACIÓN FINAL
            $group->string('aprobado_por', 100)->nullable();
            $group->string('aprobacion_grupo', 100)->nullable();
            $group->date('aprobacion_fecha')->nullable();

            $group->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes_empleo');
    }
};
