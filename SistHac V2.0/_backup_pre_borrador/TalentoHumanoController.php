<?php

namespace App\Http\Controllers;

use App\Models\SolicitudEmpleo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * TalentoHumanoController
 * 
 * Gestiona el ciclo de vida de las Solicitudes de Empleo, incluyendo la persistencia transaccional
 * de datos complejos y la consulta de labores externas.
 * 
 * SEGURIDAD:
 * - Escritura: Únicamente en la base de datos 'sistemahacienda' (local/copia).
 * - Lectura: Consulta de labores en la conexión 'mysqlrrhh' (PRODUCCIÓN - SOLO LECTURA).
 */
class TalentoHumanoController extends Controller
{
    /**
     * Obtiene el listado resumido de todas las solicitudes.
     * Ideal para tablas de administración con paginación o búsqueda rápida.
     * 
     * @return \Illuminate\Http\JsonResponse Listado de solicitudes con campos básicos.
     */
    public function index()
    {
        try {
            // fecha_entrevista = fecha de ingreso registrada automáticamente en Control Interno (Sección 1)
            $solicitudes = SolicitudEmpleo::select('id', 'fecha_entrevista', 'nombres', 'apellido_paterno', 'apellido_materno', 'cedula', 'company_name', 'estado_solicitud')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($solicitudes);
        } catch (\Exception $e) {
            Log::error('Error al listar solicitudes: ' . $e->getMessage());
            return response()->json(['error' => 'No se pudo obtener el listado'], 500);
        }
    }

    /**
     * Consulta el catálogo de labores desde una base de datos externa de producción.
     * ADVERTENCIA: Esta conexión ('mysqlrrhh') es estrictamente de solo lectura.
     * 
     * @param Request $request Contiene el parámetro 'area' (Campo, Empacadora, Administración).
     * @return \Illuminate\Http\JsonResponse Lista de nombres de labores únicas.
     */
    public function getLabores(Request $request)
    {
        $area = $request->query('area');

        // Mapeo de Área a Grupos en la base de datos erp_hac
        $mapeo = [
            'Campo' => ['DOMESTICO', 'FITOS', 'LABORES CAMPO', 'CAÑA', 'BOSQUE', 'GANADO', 'CACAO', 'COSECHA', 'AREAS DE APOYO'],
            'Empacadora' => ['EMPAQUE'],
            'Administración' => ['ADMINISTRACION'] // Tilde
        ];

        $grupos = $mapeo[$area] ?? [];

        if (empty($grupos)) {
            return response()->json([]);
        }

        try {
            // Consulta de solo lectura a erp_hac
            $labores = DB::connection('mysqlrrhh')
                ->table('fuerza_laboral')
                ->whereIn('GRUPO', $grupos)
                ->whereNotNull('nombre_labor')
                ->where('nombre_labor', '!=', '')
                ->select('nombre_labor')
                ->distinct()
                ->orderBy('nombre_labor', 'asc')
                ->pluck('nombre_labor');

            return response()->json($labores);
        } catch (\Exception $e) {
            Log::error('Error al consultar labores en erp_hac: ' . $e->getMessage());
            return response()->json([], 500);
        }
    }

    /**
     * Consulta el catálogo de empresas disponibles en la base de datos local.
     * Estas empresas son las que se pueden seleccionar en la Sección 1 de la ficha.
     * 
     * @return \Illuminate\Http\JsonResponse Lista de empresas (id y nombre).
     */
    public function getEmpresas()
    {
        try {
            // Nombres exactos en la base de datos (según inspección)
            $nombresPermitidos = [
                'AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.',
                'SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A.',
                'AGRICOLA LAS VILLAS S.A.',
                'VALORES Y ADMINISTRACIONES S.A.',
                'GAMAUNION S.A.'
            ];

            // Solo traemos id y nombre de las empresas activas que coincidan con la lista
            $empresas = DB::table('empresa')
                ->where('estado', 'A')
                ->whereIn('nombre', $nombresPermitidos)
                ->select('id', 'nombre')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($empresas);
        } catch (\Exception $e) {
            Log::error('Error al consultar empresas: ' . $e->getMessage());
            return response()->json([], 500);
        }
    }

    /**
     * Guarda una nueva solicitud de empleo con todos sus datos relacionados.
     * Realiza un mapeo manual exhaustivo para asegurar que los datos anidados del frontend
     * coincidan con las columnas planas de la base de datos.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                // EXTRACCIÓN Y MAPEO MANUAL DEL JSON ANIDADO AL ESQUEMA PLANO
                $datosAdmin = $request->input('datosAdministrativos', []);
                $datosPers = $request->input('datosPersonales', []);
                $doc = $request->input('documentacion', []);
                $datosRef = $request->input('datosReferenciales', []);
                $estadoCivil = $request->input('estadoCivil', []);
                $datosFam = $request->input('datosFamiliares', []);
                $datosEdu = $request->input('datosEducativos', []);
                $expLab = $request->input('experienciaLaboral', []);
                $salud = $request->input('saludPersonal', []);
                $entrevista = $request->input('datosEntrevistador', []);

                // Obtener el nombre de la empresa para redundancia histórica
                $companyName = null;
                if (!empty($datosAdmin['company_id'])) {
                    $companyName = DB::table('empresa')->where('id', $datosAdmin['company_id'])->value('nombre');
                }

                $solicitudData = [
                    // SECCIÓN 1: DATOS ADMINISTRATIVOS
                    'company_id'    => $datosAdmin['company_id'] ?? null,
                    'company_name'  => $companyName,
                    'area'          => $datosAdmin['area'] ?? '',
                    'labor'         => $datosAdmin['labor'] ?? '',
                    'fecha_ingreso' => $datosAdmin['fechaIngreso'] ?? null,
                    
                    'usa_banco_guayaquil' => $datosAdmin['banking_info']['usa_banco_guayaquil'] ?? false,
                    'banco_numero_cuenta' => $datosAdmin['banking_info']['numero_cuenta'] ?? null,
                    'banco_tipo_cuenta'   => $datosAdmin['banking_info']['tipo_cuenta'] ?? null,
                    'banco_titular'       => $datosAdmin['banking_info']['titular'] ?? null,
                    
                    'fecha_revision_guayaquil' => $datosAdmin['fechas_control']['fecha_revision_guayaquil'] ?? null,
                    'reingreso_fecha'          => $datosAdmin['fechas_control']['reingreso_fecha'] ?? null,
                    'fecha_salida'             => $datosAdmin['fechas_control']['fecha_salida'] ?? null,
                    
                    'condiciones_tipo_contrato'       => $datosAdmin['condiciones']['tipo_contrato'] ?? null,
                    'condiciones_transporte'          => $datosAdmin['condiciones']['transporte'] ?? false,
                    'condiciones_recorrido'           => $datosAdmin['condiciones']['recorrido'] ?? null,
                    'condiciones_recorrido_otro'      => $datosAdmin['condiciones']['recorrido_otro'] ?? null,
                    'condiciones_vehiculo'            => $datosAdmin['condiciones']['vehiculo'] ?? false,
                    'condiciones_licencia'            => $datosAdmin['condiciones']['licencia'] ?? false,
                    'condiciones_licencia_tipo'       => $datosAdmin['condiciones']['licencia_tipo'] ?? null,
                    'condiciones_acumulacion_decimos' => $datosAdmin['condiciones']['acumulacion_decimos'] ?? false,
                    'condiciones_semana_completa'     => $datosAdmin['condiciones']['semana_completa'] ?? false,
                    'condiciones_solo_proceso'        => $datosAdmin['condiciones']['solo_proceso'] ?? false,
                    'condiciones_almuerzo'            => $datosAdmin['condiciones']['almuerzo'] ?? false,

                    'responsable_id'     => $datosAdmin['control_interno']['responsable_id'] ?? null,
                    'responsable_nombre' => $datosAdmin['control_interno']['responsable_nombre'] ?? null,
                    'responsable_grupo'  => $datosAdmin['control_interno']['responsable_grupo'] ?? null,
                    'fecha_entrevista'   => $datosAdmin['control_interno']['fecha_entrevista'] ?? null,

                    // SECCIÓN 2: DATOS PERSONALES
                    'apellido_paterno' => $datosPers['apellidoPaterno'] ?? '',
                    'apellido_materno' => $datosPers['apellidoMaterno'] ?? '',
                    'nombres'          => $datosPers['nombres'] ?? '',
                    'cedula'           => $datosPers['cedula'] ?? null, // Campo nuevo añadido vía migración
                    'apodo'            => $datosPers['apodo'] ?? null,
                    'pais_nacimiento'           => $datosPers['paisNacimiento'] ?? null,
                    'pais_nacimiento_otro'      => $datosPers['paisNacimientoOtro'] ?? null,
                    'provincia_nacimiento'      => $datosPers['provinciaNacimiento'] ?? null,
                    'provincia_nacimiento_otro' => $datosPers['provinciaNacimientoOtro'] ?? null,
                    'fecha_nacimiento' => $datosPers['fechaNacimiento'] ?? null,
                    'edad'             => $datosPers['edad'] ?? null,
                    'tipo_sangre'      => $datosPers['tipoSangre'] ?? null,
                    'estatura'         => $datosPers['estatura'] ?? null,
                    'peso'             => $datosPers['peso'] ?? null,
                    'religion'         => $datosPers['religion'] ?? null,
                    'correo'           => $datosPers['correo'] ?? null,
                    'vacuna_covid_1'   => $datosPers['vacunaCovid1'] ?? false,
                    'vacuna_covid_2'   => $datosPers['vacunaCovid2'] ?? false,
                    'vacuna_covid_3'   => $datosPers['vacunaCovid3'] ?? false,
                    'afiliado_iess'    => $datosPers['afiliadoIess'] ?? null,

                    // SECCIÓN 3: DOCUMENTACIÓN
                    'doc_cedula_cant'              => $doc['cedula_cant'] ?? 0,
                    'doc_certificado_votacion_cant' => $doc['certificado_votacion_cant'] ?? 0,
                    'doc_libreta_militar_cant'     => $doc['libreta_militar_cant'] ?? 0,
                    'doc_certificado_iess_cant'    => $doc['certificado_iess_cant'] ?? 0,
                    'doc_certificado_laboral_cant' => $doc['certificado_laboral_cant'] ?? 0,
                    'doc_fotos_cant'               => $doc['fotos_cant'] ?? 0,

                    // SECCIÓN 4: DATOS REFERENCIALES
                    'referencial_direccion'                 => $datosRef['direccion'] ?? null,
                    'referencial_ciudad'                    => $datosRef['ciudad'] ?? null,
                    'referencial_telefono_principal'        => $datosRef['telefono_principal'] ?? null,
                    'referencial_telefono_secundario'       => $datosRef['telefono_secundario'] ?? null,
                    'referencial_vivienda_material'         => $datosRef['vivienda_material'] ?? null,
                    'referencial_vivienda_condicion'        => $datosRef['vivienda_condicion'] ?? null,
                    'referencial_cantidad_familiares'       => $datosRef['cantidad_familiares'] ?? 0,
                    'referencial_familiares_relacion'       => $datosRef['familiares_relacion'] ?? null,
                    'referencial_telefono_emergencia'       => $datosRef['telefono_emergencia'] ?? null,
                    'referencial_nombre_contacto_emergencia' => $datosRef['nombre_contacto_emergencia'] ?? null,
                    'referencial_servicio_agua'             => $datosRef['servicios_basicos']['agua'] ?? false,
                    'referencial_servicio_luz'              => $datosRef['servicios_basicos']['luz'] ?? false,
                    'referencial_servicio_telefono'         => $datosRef['servicios_basicos']['telefono'] ?? false,

                    // SECCIÓN 5: ESTADO CIVIL
                    'estado_civil'                        => $estadoCivil['estado_civil'] ?? null,
                    'estado_civil_tiempo_valor'           => $estadoCivil['tiempo_estado_civil_valor'] ?? null,
                    'estado_civil_tiempo_unidad'          => $estadoCivil['tiempo_estado_civil_unidad'] ?? null,
                    'estado_civil_tipo_matrimonio'        => $estadoCivil['tipo_matrimonio'] ?? null,
                    'estado_civil_demandas'               => $estadoCivil['demandas'] ?? null,
                    'estado_civil_compromisos_anteriores' => $estadoCivil['compromisos_anteriores'] ?? 0,

                    // SECCIÓN 6: DATOS FAMILIARES PRINCIPALES
                    'padre_nombre'    => $datosFam['padre']['nombre'] ?? null,
                    'padre_estado'    => $datosFam['padre']['estado'] ?? null,
                    'padre_edad'      => $datosFam['padre']['edad'] ?? null,
                    'padre_domicilio' => $datosFam['padre']['domicilio'] ?? null,
                    'padre_ocupacion' => $datosFam['padre']['ocupacion'] ?? null,
                    
                    'madre_nombre'    => $datosFam['madre']['nombre'] ?? null,
                    'madre_estado'    => $datosFam['madre']['estado'] ?? null,
                    'madre_edad'      => $datosFam['madre']['edad'] ?? null,
                    'madre_domicilio' => $datosFam['madre']['domicilio'] ?? null,
                    'madre_ocupacion' => $datosFam['madre']['ocupacion'] ?? null,
                    
                    'conyuge_nombre'    => $datosFam['conyuge_actual']['nombre'] ?? null,
                    'conyuge_estado'    => $datosFam['conyuge_actual']['estado'] ?? null,
                    'conyuge_edad'      => $datosFam['conyuge_actual']['edad'] ?? null,
                    'conyuge_domicilio' => $datosFam['conyuge_actual']['domicilio'] ?? null,
                    'conyuge_ocupacion' => $datosFam['conyuge_actual']['ocupacion'] ?? null,

                    // SECCIÓN 7: DATOS EDUCATIVOS
                    'edu_nivel_maximo'             => $datosEdu['nivel_maximo'] ?? null,
                    'edu_inicial_institucion'      => $datosEdu['inicial']['institucion'] ?? null,
                    'edu_inicial_anio'             => $datosEdu['inicial']['anio'] ?? null,
                    'edu_basica_institucion'       => $datosEdu['basica']['institucion'] ?? null,
                    'edu_basica_grado'             => $datosEdu['basica']['grado'] ?? null,
                    'edu_basica_anio'              => $datosEdu['basica']['anio'] ?? null,
                    'edu_bachillerato_institucion' => $datosEdu['bachillerato']['institucion'] ?? null,
                    'edu_bachillerato_titulo'      => $datosEdu['bachillerato']['titulo'] ?? null,
                    'edu_bachillerato_anio'        => $datosEdu['bachillerato']['anio'] ?? null,
                    'edu_superior_institucion'    => $datosEdu['superior']['institucion'] ?? null,
                    'edu_superior_tipo'           => $datosEdu['superior']['tipo'] ?? null,
                    'edu_superior_nivel'          => $datosEdu['superior']['nivel'] ?? null,
                    'edu_superior_carrera'        => $datosEdu['superior']['carrera_programa'] ?? null,
                    'edu_superior_estado'         => $datosEdu['superior']['estado'] ?? null,
                    'edu_superior_anio'           => $datosEdu['superior']['anio'] ?? null,

                    // SECCIÓN 9: EXPERIENCIA LABORAL HEADER
                    'exp_sin_experiencia'     => $expLab['sin_experiencia'] ?? false,
                    'exp_descripcion_labores' => $expLab['descripcion_labores'] ?? null,

                    // SECCIÓN 11: SALUD PERSONAL
                    'salud_operaciones'                  => $salud['operaciones']['aplica'] ?? false,
                    'salud_operaciones_detalle'          => $salud['operaciones']['detalle'] ?? null,
                    'salud_fracturas'                    => $salud['fracturas']['aplica'] ?? false,
                    'salud_fracturas_detalle'            => $salud['fracturas']['detalle'] ?? null,
                    'salud_quemaduras'                   => $salud['quemaduras']['aplica'] ?? false,
                    'salud_quemaduras_detalle'           => $salud['quemaduras']['detalle'] ?? null,
                    'salud_accidentes_laborales'         => $salud['accidentes_laborales']['aplica'] ?? false,
                    'salud_accidentes_laborales_detalle' => $salud['accidentes_laborales']['detalle'] ?? null,
                    'salud_otros_antecedentes'           => $salud['otros_antecedentes'] ?? null,
                    'salud_deporte'                      => $salud['deporte'] ?? null,
                    'salud_actividad_social'             => $salud['actividad_social'] ?? null,

                    // SECCIÓN 13: APROBACIÓN
                    'aprobado_por'     => $entrevista['aprobacion']['aprobado_por'] ?? null,
                    'aprobacion_grupo' => $entrevista['aprobacion']['grupo'] ?? null,
                    'aprobacion_fecha' => $entrevista['aprobacion']['fecha'] ?? null,
                ];

                $solicitud = SolicitudEmpleo::create($solicitudData);

                // 2. Guardar relaciones con mapeo detallado
                
                // Hermanos (Sección 6)
                if (isset($datosFam['hermanos']) && is_array($datosFam['hermanos'])) {
                    foreach ($datosFam['hermanos'] as $h) {
                        $solicitud->hermanos()->create([
                            'nombre'    => $h['nombre'] ?? null,
                            'genero'    => $h['genero'] ?? null,
                            'estado'    => $h['estado'] ?? null,
                            'ocupacion' => $h['ocupacion'] ?? null,
                        ]);
                    }
                }

                // Hijos (Sección 6)
                if (isset($datosFam['hijos']) && is_array($datosFam['hijos'])) {
                    foreach ($datosFam['hijos'] as $h) {
                        $solicitud->hijos()->create([
                            'nombre'    => $h['nombre'] ?? null,
                            'edad'      => $h['edad'] ?? null,
                            'ocupacion' => $h['ocupacion'] ?? null,
                        ]);
                    }
                }

                // Cónyuges Anteriores (Sección 6)
                if (isset($datosFam['conyuges_anteriores']) && is_array($datosFam['conyuges_anteriores'])) {
                    foreach ($datosFam['conyuges_anteriores'] as $c) {
                        $solicitud->conyugesAnteriores()->create([
                            'nombre' => $c['nombre'] ?? null,
                        ]);
                    }
                }

                // Cursos (Sección 7)
                if (isset($datosEdu['cursos']) && is_array($datosEdu['cursos'])) {
                    foreach ($datosEdu['cursos'] as $c) {
                        $solicitud->cursos()->create([
                            'institucion'  => $c['institucion'] ?? null,
                            // El frontend envía 'nombre', se mapea a 'nombre_curso' en BD
                            'nombre_curso' => $c['nombre'] ?? $c['nombre_curso'] ?? null,
                            'anio'         => $c['anio'] ?? null,
                        ]);
                    }
                }

                // Experiencias Laborales (Sección 8)
                if (isset($expLab['experiencias']) && is_array($expLab['experiencias'])) {
                    foreach ($expLab['experiencias'] as $e) {
                        $solicitud->experiencias()->create([
                            'empresa'      => $e['empresa'] ?? null,
                            'cargo'        => $e['area'] ?? null, 
                            'causa_salida' => $e['motivo_salida'] ?? null,
                            'tiempo'       => ($e['fecha_inicio'] ?? '') . ' - ' . ($e['fecha_fin'] ?? 'Actual'),
                        ]);
                    }
                }

                // Referencias Laborales (Sección 9)
                if ($request->has('referenciasLaborales') && is_array($request->referenciasLaborales)) {
                    foreach ($request->referenciasLaborales as $r) {
                        $solicitud->referenciasLaborales()->create([
                            'empresa'         => $r['empresa'] ?? null,
                            'contacto_nombre' => $r['nombre'] ?? null,
                            'telefono'        => $r['telefono'] ?? null,
                        ]);
                    }
                }

                // Referencias Personales (Sección 10)
                if ($request->has('referenciasPersonales') && is_array($request->referenciasPersonales)) {
                    foreach ($request->referenciasPersonales as $r) {
                        $solicitud->referenciasPersonales()->create([
                            'nombre'    => $r['nombre'] ?? null,
                            'telefono'  => $r['telefono'] ?? null,
                            'ocupacion' => $r['cargo'] ?? null,
                        ]);
                    }
                }

                // Familiares en la Empresa (Sección 10)
                if ($request->has('familiaresEnEmpresa') && is_array($request->familiaresEnEmpresa)) {
                    foreach ($request->familiaresEnEmpresa as $f) {
                        $solicitud->familiaresEmpresa()->create([
                            'nombre'     => $f['nombre'] ?? null,
                            'empresa'    => $f['empresa'] ?? null,
                            'cargo'      => $f['cargo'] ?? null,
                            'parentesco' => $f['parentesco'] ?? null,
                            'telefono'   => $f['telefono'] ?? null,
                        ]);
                    }
                }

                // Observaciones (Sección 12)
                if ($request->has('observaciones') && is_array($request->observaciones)) {
                    foreach ($request->observaciones as $o) {
                        $solicitud->observaciones()->create([
                            'tipo'           => $o['tipo'] ?? null,
                            'comentario'     => $o['comentario'] ?? null,
                            'usuario_nombre' => $o['usuario'] ?? null,
                            'fecha'          => $o['fecha'] ?? now(),
                        ]);
                    }
                }

                return response()->json([
                    'message' => 'Solicitud guardada correctamente',
                    'id'      => $solicitud->id
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('Error al guardar solicitud: ' . $e->getMessage());
            return response()->json([
                'error'   => 'Error al procesar la solicitud',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Recupera una solicitud específica y reconstruye la estructura JSON anidada.
     * Este método es vital para que el frontend pueda "parchear" los formularios reactivos
     * con la estructura de datos original.
     * 
     * @param int $id Identificador único de la solicitud.
     * @return \Illuminate\Http\JsonResponse Datos anidados de la solicitud.
     */
    public function show($id)
    {
        try {
            $solicitud = SolicitudEmpleo::with([
                'hermanos', 'hijos', 'conyugesAnteriores', 'cursos', 
                'experiencias', 'referenciasLaborales', 'referenciasPersonales', 
                'familiaresEmpresa', 'observaciones'
            ])->findOrFail($id);

            // RE-ESTRUCTURACIÓN DEL JSON PARA QUE EL FRONTEND PUEDA PATCHEAR EL FORMULARIO
            $data = [
                'id' => $solicitud->id,
                'datosAdministrativos' => [
                    'company_id'   => $solicitud->company_id,
                    'company_name' => $solicitud->company_name,
                    'area'         => $solicitud->area,
                    'labor'        => $solicitud->labor,
                    'fechaIngreso' => $solicitud->fecha_ingreso,
                    'banking_info' => [
                        'usa_banco_guayaquil' => (bool)$solicitud->usa_banco_guayaquil,
                        'numero_cuenta'       => $solicitud->banco_numero_cuenta,
                        'tipo_cuenta'         => $solicitud->banco_tipo_cuenta,
                        'titular'             => $solicitud->banco_titular,
                    ],
                    'fechas_control' => [
                        'fecha_revision_guayaquil' => $solicitud->fecha_revision_guayaquil,
                        'reingreso_fecha'          => $solicitud->reingreso_fecha,
                        'fecha_salida'             => $solicitud->fecha_salida,
                    ],
                    'condiciones' => [
                        'tipo_contrato'       => $solicitud->condiciones_tipo_contrato,
                        'transporte'          => (bool)$solicitud->condiciones_transporte,
                        'recorrido'           => $solicitud->condiciones_recorrido,
                        'recorrido_otro'      => $solicitud->condiciones_recorrido_otro,
                        'vehiculo'            => (bool)$solicitud->condiciones_vehiculo,
                        'licencia'            => (bool)$solicitud->condiciones_licencia,
                        'licencia_tipo'       => $solicitud->condiciones_licencia_tipo,
                        'acumulacion_decimos' => (bool)$solicitud->condiciones_acumulacion_decimos,
                        'semana_completa'     => (bool)$solicitud->condiciones_semana_completa,
                        'solo_proceso'        => (bool)$solicitud->condiciones_solo_proceso,
                        'almuerzo'            => (bool)$solicitud->condiciones_almuerzo,
                    ],
                    'control_interno' => [
                        'fecha_entrevista'   => $solicitud->fecha_entrevista,
                        'responsable_id'     => $solicitud->responsable_id,
                        'responsable_nombre' => $solicitud->responsable_nombre,
                        'responsable_grupo'  => $solicitud->responsable_grupo,
                    ]
                ],
                'datosPersonales' => [
                    'apellidoPaterno' => $solicitud->apellido_paterno,
                    'apellidoMaterno' => $solicitud->apellido_materno,
                    'nombres'         => $solicitud->nombres,
                    'cedula'          => $solicitud->cedula,
                    'apodo'           => $solicitud->apodo,
                    'paisNacimiento'           => $solicitud->pais_nacimiento,
                    'paisNacimientoOtro'      => $solicitud->pais_nacimiento_otro,
                    'provinciaNacimiento'      => $solicitud->provincia_nacimiento,
                    'provinciaNacimientoOtro' => $solicitud->provincia_nacimiento_otro,
                    'fechaNacimiento' => $solicitud->fecha_nacimiento,
                    'edad'             => $solicitud->edad,
                    'tipoSangre'      => $solicitud->tipo_sangre,
                    'estatura'         => $solicitud->estatura,
                    'peso'             => $solicitud->peso,
                    'religion'         => $solicitud->religion,
                    'correo'           => $solicitud->correo,
                    'vacunaCovid1'     => (bool)$solicitud->vacuna_covid_1,
                    'vacunaCovid2'     => (bool)$solicitud->vacuna_covid_2,
                    'vacunaCovid3'     => (bool)$solicitud->vacuna_covid_3,
                    'afiliadoIess'     => (bool)$solicitud->afiliado_iess,
                ],
                'documentacion' => [
                    'cedula_cant'               => $solicitud->doc_cedula_cant,
                    'certificado_votacion_cant' => $solicitud->doc_certificado_votacion_cant,
                    'libreta_militar_cant'      => $solicitud->doc_libreta_militar_cant,
                    'certificado_iess_cant'     => $solicitud->doc_certificado_iess_cant,
                    'certificado_laboral_cant'  => $solicitud->doc_certificado_laboral_cant,
                    'fotos_cant'                => $solicitud->doc_fotos_cant,
                ],
                'datosReferenciales' => [
                    'direccion'                  => $solicitud->referencial_direccion,
                    'ciudad'                     => $solicitud->referencial_ciudad,
                    'telefono_principal'         => $solicitud->referencial_telefono_principal,
                    'telefono_secundario'        => $solicitud->referencial_telefono_secundario,
                    'vivienda_material'          => $solicitud->referencial_vivienda_material,
                    'vivienda_condicion'         => $solicitud->referencial_vivienda_condicion,
                    'cantidad_familiares'        => $solicitud->referencial_cantidad_familiares,
                    'familiares_relacion'        => $solicitud->referencial_familiares_relacion,
                    'telefono_emergencia'        => $solicitud->referencial_telefono_emergencia,
                    'nombre_contacto_emergencia' => $solicitud->referencial_nombre_contacto_emergencia,
                    'servicios_basicos' => [
                        'agua'     => (bool)$solicitud->referencial_servicio_agua,
                        'luz'      => (bool)$solicitud->referencial_servicio_luz,
                        'telefono' => (bool)$solicitud->referencial_servicio_telefono,
                    ]
                ],
                'estadoCivil' => [
                    'estado_civil'               => $solicitud->estado_civil,
                    'tiempo_estado_civil_valor'  => $solicitud->estado_civil_tiempo_valor,
                    'tiempo_estado_civil_unidad' => $solicitud->estado_civil_tiempo_unidad,
                    'tipo_matrimonio'            => $solicitud->estado_civil_tipo_matrimonio,
                    'demandas'                   => $solicitud->estado_civil_demandas,
                    'compromisos_anteriores'     => $solicitud->estado_civil_compromisos_anteriores,
                ],
                'datosFamiliares' => [
                    'padre' => [
                        'nombre'    => $solicitud->padre_nombre,
                        'estado'    => $solicitud->padre_estado,
                        'edad'      => $solicitud->padre_edad,
                        'domicilio' => $solicitud->padre_domicilio,
                        'ocupacion' => $solicitud->padre_ocupacion,
                    ],
                    'madre' => [
                        'nombre'    => $solicitud->madre_nombre,
                        'estado'    => $solicitud->madre_estado,
                        'edad'      => $solicitud->madre_edad,
                        'domicilio' => $solicitud->madre_domicilio,
                        'ocupacion' => $solicitud->madre_ocupacion,
                    ],
                    'conyuge_actual' => [
                        'nombre'    => $solicitud->conyuge_nombre,
                        'estado'    => $solicitud->conyuge_estado,
                        'edad'      => $solicitud->conyuge_edad,
                        'domicilio' => $solicitud->conyuge_domicilio,
                        'ocupacion' => $solicitud->conyuge_ocupacion,
                    ],
                    'hermanos'             => $solicitud->hermanos,
                    'hijos'                => $solicitud->hijos,
                    'conyuges_anteriores' => $solicitud->conyugesAnteriores,
                ],
                'datosEducativos' => [
                    'nivel_maximo' => $solicitud->edu_nivel_maximo,
                    'inicial' => [
                        'institucion' => $solicitud->edu_inicial_institucion,
                        'anio'        => $solicitud->edu_inicial_anio,
                    ],
                    'basica' => [
                        'institucion' => $solicitud->edu_basica_institucion,
                        'ultimo_grado' => $solicitud->edu_basica_grado,
                        'anio'        => $solicitud->edu_basica_anio,
                    ],
                    'bachillerato' => [
                        'institucion' => $solicitud->edu_bachillerato_institucion,
                        'titulo'      => $solicitud->edu_bachillerato_titulo,
                        'anio'        => $solicitud->edu_bachillerato_anio,
                    ],
                    'superior' => [
                        'institucion'      => $solicitud->edu_superior_institucion,
                        'tipo'             => $solicitud->edu_superior_tipo,
                        'nivel'            => $solicitud->edu_superior_nivel,
                        'carrera_programa' => $solicitud->edu_superior_carrera,
                        'estado'           => $solicitud->edu_superior_estado,
                        'anio'             => $solicitud->edu_superior_anio,
                    ],
                    // Mapear 'nombre_curso' (BD) a 'nombre' (frontend) para patchValue correcto
                    'cursos' => $solicitud->cursos->map(function ($c) {
                        return [
                            'nombre'      => $c->nombre_curso,
                            'institucion' => $c->institucion,
                            'duracion'    => null, // Campo visual del frontend, no se almacena en BD
                            'anio'        => $c->anio,
                        ];
                    }),
                ],
                'experienciaLaboral' => [
                    'sin_experiencia'     => (bool)$solicitud->exp_sin_experiencia,
                    'descripcion_labores' => $solicitud->exp_descripcion_labores,
                    'experiencias'        => $solicitud->experiencias,
                ],
                'referenciasLaborales'  => $solicitud->referenciasLaborales,
                'referenciasPersonales' => $solicitud->referenciasPersonales,
                'familiaresEnEmpresa'   => $solicitud->familiaresEmpresa,
                'observaciones'         => $solicitud->observaciones,
                'datosEntrevistador' => [
                    'aprobacion' => [
                        'estado'       => $solicitud->estado_solicitud,
                        'aprobado_por' => $solicitud->aprobado_por,
                        'grupo'        => $solicitud->aprobacion_grupo,
                        'fecha'        => $solicitud->aprobacion_fecha,
                    ]
                ]
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error al mostrar solicitud: ' . $e->getMessage());
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }
    }

    /**
     * Actualiza una solicitud existente y sus registros relacionados.
     * Sigue la misma lógica de mapeo manual que store() para asegurar consistencia.
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $solicitud = SolicitudEmpleo::findOrFail($id);

            // REGLA DE NEGOCIO: No permitir edición si ya fue contratado
            if ($solicitud->estado_solicitud === 'CONTRATADO') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede editar una solicitud en estado CONTRATADO.'
                ], 403);
            }

            return DB::transaction(function () use ($request, $solicitud) {

                // EXTRACCIÓN Y MAPEO (Idéntico a store pero para actualización)
                // Usamos mapeo condicional para permitir guardado progresivo por secciones.
                $solicitudData = [];

                if ($request->has('datosAdministrativos')) {
                    $datosAdmin = $request->input('datosAdministrativos');
                    
                    if (isset($datosAdmin['company_id'])) {
                        $solicitudData['company_id'] = $datosAdmin['company_id'];
                        $solicitudData['company_name'] = DB::table('empresa')
                            ->where('id', $datosAdmin['company_id'])->value('nombre');
                    }

                    $solicitudData['area'] = $datosAdmin['area'] ?? $solicitud->area;
                    $solicitudData['labor'] = $datosAdmin['labor'] ?? $solicitud->labor;
                    $solicitudData['fecha_ingreso'] = $datosAdmin['fechaIngreso'] ?? $solicitud->fecha_ingreso;

                    if (isset($datosAdmin['banking_info'])) {
                        $solicitudData['usa_banco_guayaquil'] = $datosAdmin['banking_info']['usa_banco_guayaquil'] ?? $solicitud->usa_banco_guayaquil;
                        $solicitudData['banco_numero_cuenta'] = $datosAdmin['banking_info']['numero_cuenta'] ?? $solicitud->banco_numero_cuenta;
                        $solicitudData['banco_tipo_cuenta']   = $datosAdmin['banking_info']['tipo_cuenta'] ?? $solicitud->banco_tipo_cuenta;
                        $solicitudData['banco_titular']       = $datosAdmin['banking_info']['titular'] ?? $solicitud->banco_titular;
                    }

                    if (isset($datosAdmin['fechas_control'])) {
                        $solicitudData['fecha_revision_guayaquil'] = $datosAdmin['fechas_control']['fecha_revision_guayaquil'] ?? $solicitud->fecha_revision_guayaquil;
                        $solicitudData['reingreso_fecha']          = $datosAdmin['fechas_control']['reingreso_fecha'] ?? $solicitud->reingreso_fecha;
                        $solicitudData['fecha_salida']             = $datosAdmin['fechas_control']['fecha_salida'] ?? $solicitud->fecha_salida;
                    }

                    if (isset($datosAdmin['condiciones'])) {
                        $solicitudData['condiciones_tipo_contrato']       = $datosAdmin['condiciones']['tipo_contrato'] ?? $solicitud->condiciones_tipo_contrato;
                        $solicitudData['condiciones_transporte']          = $datosAdmin['condiciones']['transporte'] ?? $solicitud->condiciones_transporte;
                        $solicitudData['condiciones_recorrido']           = $datosAdmin['condiciones']['recorrido'] ?? $solicitud->condiciones_recorrido;
                        $solicitudData['condiciones_recorrido_otro']      = $datosAdmin['condiciones']['recorrido_otro'] ?? $solicitud->condiciones_recorrido_otro;
                        $solicitudData['condiciones_vehiculo']            = $datosAdmin['condiciones']['vehiculo'] ?? $solicitud->condiciones_vehiculo;
                        $solicitudData['condiciones_licencia']            = $datosAdmin['condiciones']['licencia'] ?? $solicitud->condiciones_licencia;
                        $solicitudData['condiciones_licencia_tipo']       = $datosAdmin['condiciones']['licencia_tipo'] ?? $solicitud->condiciones_licencia_tipo;
                        $solicitudData['condiciones_acumulacion_decimos'] = $datosAdmin['condiciones']['acumulacion_decimos'] ?? $solicitud->condiciones_acumulacion_decimos;
                        $solicitudData['condiciones_semana_completa']     = $datosAdmin['condiciones']['semana_completa'] ?? $solicitud->condiciones_semana_completa;
                        $solicitudData['condiciones_solo_proceso']        = $datosAdmin['condiciones']['solo_proceso'] ?? $solicitud->condiciones_solo_proceso;
                        $solicitudData['condiciones_almuerzo']            = $datosAdmin['condiciones']['almuerzo'] ?? $solicitud->condiciones_almuerzo;
                    }

                    if (isset($datosAdmin['control_interno'])) {
                        $solicitudData['responsable_id']     = $datosAdmin['control_interno']['responsable_id'] ?? $solicitud->responsable_id;
                        $solicitudData['responsable_nombre'] = $datosAdmin['control_interno']['responsable_nombre'] ?? $solicitud->responsable_nombre;
                        $solicitudData['responsable_grupo']  = $datosAdmin['control_interno']['responsable_grupo'] ?? $solicitud->responsable_grupo;
                        $solicitudData['fecha_entrevista']   = $datosAdmin['control_interno']['fecha_entrevista'] ?? $solicitud->fecha_entrevista;
                    }
                }

                if ($request->has('datosPersonales')) {
                    $datosPers = $request->input('datosPersonales');
                    $solicitudData['apellido_paterno'] = $datosPers['apellidoPaterno'] ?? $solicitud->apellido_paterno;
                    $solicitudData['apellido_materno'] = $datosPers['apellidoMaterno'] ?? $solicitud->apellido_materno;
                    $solicitudData['nombres']          = $datosPers['nombres'] ?? $solicitud->nombres;
                    $solicitudData['cedula']           = $datosPers['cedula'] ?? $solicitud->cedula;
                    $solicitudData['apodo']            = $datosPers['apodo'] ?? $solicitud->apodo;
                    $solicitudData['pais_nacimiento']           = $datosPers['paisNacimiento'] ?? $solicitud->pais_nacimiento;
                    $solicitudData['pais_nacimiento_otro']      = $datosPers['paisNacimientoOtro'] ?? $solicitud->pais_nacimiento_otro;
                    $solicitudData['provincia_nacimiento']      = $datosPers['provinciaNacimiento'] ?? $solicitud->provincia_nacimiento;
                    $solicitudData['provincia_nacimiento_otro'] = $datosPers['provinciaNacimientoOtro'] ?? $solicitud->provincia_nacimiento_otro;
                    $solicitudData['fecha_nacimiento'] = $datosPers['fechaNacimiento'] ?? $solicitud->fecha_nacimiento;
                    $solicitudData['edad']             = $datosPers['edad'] ?? $solicitud->edad;
                    $solicitudData['tipo_sangre']      = $datosPers['tipoSangre'] ?? $solicitud->tipo_sangre;
                    $solicitudData['estatura']         = $datosPers['estatura'] ?? $solicitud->estatura;
                    $solicitudData['peso']             = $datosPers['peso'] ?? $solicitud->peso;
                    $solicitudData['religion']         = $datosPers['religion'] ?? $solicitud->religion;
                    $solicitudData['correo']           = $datosPers['correo'] ?? $solicitud->correo;
                    $solicitudData['vacuna_covid_1']   = $datosPers['vacunaCovid1'] ?? $solicitud->vacuna_covid_1;
                    $solicitudData['vacuna_covid_2']   = $datosPers['vacunaCovid2'] ?? $solicitud->vacuna_covid_2;
                    $solicitudData['vacuna_covid_3']   = $datosPers['vacunaCovid3'] ?? $solicitud->vacuna_covid_3;
                    $solicitudData['afiliado_iess']    = $datosPers['afiliadoIess'] ?? $solicitud->afiliado_iess;
                }

                if ($request->has('documentacion')) {
                    $doc = $request->input('documentacion');
                    $solicitudData['doc_cedula_cant']               = $doc['cedula_cant'] ?? $solicitud->doc_cedula_cant;
                    $solicitudData['doc_certificado_votacion_cant'] = $doc['certificado_votacion_cant'] ?? $solicitud->doc_certificado_votacion_cant;
                    $solicitudData['doc_libreta_militar_cant']      = $doc['libreta_militar_cant'] ?? $solicitud->doc_libreta_militar_cant;
                    $solicitudData['doc_certificado_iess_cant']     = $doc['certificado_iess_cant'] ?? $solicitud->doc_certificado_iess_cant;
                    $solicitudData['doc_certificado_laboral_cant']  = $doc['certificado_laboral_cant'] ?? $solicitud->doc_certificado_laboral_cant;
                    $solicitudData['doc_fotos_cant']                = $doc['fotos_cant'] ?? $solicitud->doc_fotos_cant;
                }

                if ($request->has('datosReferenciales')) {
                    $datosRef = $request->input('datosReferenciales');
                    $solicitudData['referencial_direccion']                 = $datosRef['direccion'] ?? $solicitud->referencial_direccion;
                    $solicitudData['referencial_ciudad']                    = $datosRef['ciudad'] ?? $solicitud->referencial_ciudad;
                    $solicitudData['referencial_telefono_principal']        = $datosRef['telefono_principal'] ?? $solicitud->referencial_telefono_principal;
                    $solicitudData['referencial_telefono_secundario']       = $datosRef['telefono_secundario'] ?? $solicitud->referencial_telefono_secundario;
                    $solicitudData['referencial_vivienda_material']         = $datosRef['vivienda_material'] ?? $solicitud->referencial_vivienda_material;
                    $solicitudData['referencial_vivienda_condicion']        = $datosRef['vivienda_condicion'] ?? $solicitud->referencial_vivienda_condicion;
                    $solicitudData['referencial_cantidad_familiares']       = $datosRef['cantidad_familiares'] ?? $solicitud->referencial_cantidad_familiares;
                    $solicitudData['referencial_familiares_relacion']       = $datosRef['familiares_relacion'] ?? $solicitud->referencial_familiares_relacion;
                    $solicitudData['referencial_telefono_emergencia']       = $datosRef['telefono_emergencia'] ?? $solicitud->referencial_telefono_emergencia;
                    $solicitudData['referencial_nombre_contacto_emergencia'] = $datosRef['nombre_contacto_emergencia'] ?? $solicitud->referencial_nombre_contacto_emergencia;
                    
                    if (isset($datosRef['servicios_basicos'])) {
                        $solicitudData['referencial_servicio_agua']     = $datosRef['servicios_basicos']['agua'] ?? $solicitud->referencial_servicio_agua;
                        $solicitudData['referencial_servicio_luz']      = $datosRef['servicios_basicos']['luz'] ?? $solicitud->referencial_servicio_luz;
                        $solicitudData['referencial_servicio_telefono'] = $datosRef['servicios_basicos']['telefono'] ?? $solicitud->referencial_servicio_telefono;
                    }
                }

                if ($request->has('estadoCivil')) {
                    $estadoCivil = $request->input('estadoCivil');
                    $solicitudData['estado_civil']               = $estadoCivil['estado_civil'] ?? $solicitud->estado_civil;
                    $solicitudData['estado_civil_tiempo_valor']  = $estadoCivil['tiempo_estado_civil_valor'] ?? $solicitud->estado_civil_tiempo_valor;
                    $solicitudData['estado_civil_tiempo_unidad'] = $estadoCivil['tiempo_estado_civil_unidad'] ?? $solicitud->estado_civil_tiempo_unidad;
                    // Columnas correctas en la BD: estado_civil_tipo_matrimonio, estado_civil_demandas, estado_civil_compromisos_anteriores
                    $solicitudData['estado_civil_tipo_matrimonio']        = $estadoCivil['tipo_matrimonio'] ?? $solicitud->estado_civil_tipo_matrimonio;
                    $solicitudData['estado_civil_demandas']               = $estadoCivil['demandas'] ?? $solicitud->estado_civil_demandas;
                    $solicitudData['estado_civil_compromisos_anteriores'] = $estadoCivil['compromisos_anteriores'] ?? $solicitud->estado_civil_compromisos_anteriores;
                }

                if ($request->has('datosFamiliares')) {
                    $datosFam = $request->input('datosFamiliares');
                    
                    if (isset($datosFam['padre'])) {
                        $solicitudData['padre_nombre']    = $datosFam['padre']['nombre'] ?? $solicitud->padre_nombre;
                        $solicitudData['padre_estado']    = $datosFam['padre']['estado'] ?? $solicitud->padre_estado;
                        $solicitudData['padre_edad']      = $datosFam['padre']['edad'] ?? $solicitud->padre_edad;
                        $solicitudData['padre_domicilio'] = $datosFam['padre']['domicilio'] ?? $solicitud->padre_domicilio;
                        $solicitudData['padre_ocupacion'] = $datosFam['padre']['ocupacion'] ?? $solicitud->padre_ocupacion;
                    }
                    
                    if (isset($datosFam['madre'])) {
                        $solicitudData['madre_nombre']    = $datosFam['madre']['nombre'] ?? $solicitud->madre_nombre;
                        $solicitudData['madre_estado']    = $datosFam['madre']['estado'] ?? $solicitud->madre_estado;
                        $solicitudData['madre_edad']      = $datosFam['madre']['edad'] ?? $solicitud->madre_edad;
                        $solicitudData['madre_domicilio'] = $datosFam['madre']['domicilio'] ?? $solicitud->madre_domicilio;
                        $solicitudData['madre_ocupacion'] = $datosFam['madre']['ocupacion'] ?? $solicitud->madre_ocupacion;
                    }
                    
                    if (isset($datosFam['conyuge_actual'])) {
                        $solicitudData['conyuge_nombre']    = $datosFam['conyuge_actual']['nombre'] ?? $solicitud->conyuge_nombre;
                        $solicitudData['conyuge_estado']    = $datosFam['conyuge_actual']['estado'] ?? $solicitud->conyuge_estado;
                        $solicitudData['conyuge_edad']      = $datosFam['conyuge_actual']['edad'] ?? $solicitud->conyuge_edad;
                        $solicitudData['conyuge_domicilio'] = $datosFam['conyuge_actual']['domicilio'] ?? $solicitud->conyuge_domicilio;
                        $solicitudData['conyuge_ocupacion'] = $datosFam['conyuge_actual']['ocupacion'] ?? $solicitud->conyuge_ocupacion;
                    }

                    if (isset($datosFam['hermanos']) && is_array($datosFam['hermanos'])) {
                        $solicitud->hermanos()->delete();
                        foreach ($datosFam['hermanos'] as $h) {
                            $solicitud->hermanos()->create(['nombre' => $h['nombre'], 'genero' => $h['genero'] ?? null, 'estado' => $h['estado'] ?? null, 'ocupacion' => $h['ocupacion'] ?? null]);
                        }
                    }

                    if (isset($datosFam['hijos']) && is_array($datosFam['hijos'])) {
                        $solicitud->hijos()->delete();
                        foreach ($datosFam['hijos'] as $h) {
                            $solicitud->hijos()->create(['nombre' => $h['nombre'], 'edad' => $h['edad'] ?? null, 'ocupacion' => $h['ocupacion'] ?? null]);
                        }
                    }

                    if (isset($datosFam['conyuges_anteriores']) && is_array($datosFam['conyuges_anteriores'])) {
                        $solicitud->conyugesAnteriores()->delete();
                        foreach ($datosFam['conyuges_anteriores'] as $c) {
                            $solicitud->conyugesAnteriores()->create(['nombre' => $c['nombre']]);
                        }
                    }
                }

                if ($request->has('datosEducativos')) {
                    $datosEdu = $request->input('datosEducativos');
                    $solicitudData['edu_nivel_maximo'] = $datosEdu['nivel_maximo'] ?? $solicitud->edu_nivel_maximo;
                    
                    if (isset($datosEdu['inicial'])) {
                        $solicitudData['edu_inicial_institucion'] = $datosEdu['inicial']['institucion'] ?? $solicitud->edu_inicial_institucion;
                        $solicitudData['edu_inicial_anio']        = $datosEdu['inicial']['anio'] ?? $solicitud->edu_inicial_anio;
                    }
                    if (isset($datosEdu['basica'])) {
                        $solicitudData['edu_basica_institucion'] = $datosEdu['basica']['institucion'] ?? $solicitud->edu_basica_institucion;
                        $solicitudData['edu_basica_grado']       = $datosEdu['basica']['grado'] ?? $solicitud->edu_basica_grado;
                        $solicitudData['edu_basica_anio']        = $datosEdu['basica']['anio'] ?? $solicitud->edu_basica_anio;
                    }
                    if (isset($datosEdu['bachillerato'])) {
                        $solicitudData['edu_bachillerato_institucion'] = $datosEdu['bachillerato']['institucion'] ?? $solicitud->edu_bachillerato_institucion;
                        $solicitudData['edu_bachillerato_titulo']      = $datosEdu['bachillerato']['titulo'] ?? $solicitud->edu_bachillerato_titulo;
                        $solicitudData['edu_bachillerato_anio']        = $datosEdu['bachillerato']['anio'] ?? $solicitud->edu_bachillerato_anio;
                    }
                    if (isset($datosEdu['superior'])) {
                        $solicitudData['edu_superior_institucion'] = $datosEdu['superior']['institucion'] ?? $solicitud->edu_superior_institucion;
                        $solicitudData['edu_superior_tipo']        = $datosEdu['superior']['tipo'] ?? $solicitud->edu_superior_tipo;
                        $solicitudData['edu_superior_nivel']       = $datosEdu['superior']['nivel'] ?? $solicitud->edu_superior_nivel;
                        $solicitudData['edu_superior_carrera']     = $datosEdu['superior']['carrera_programa'] ?? $solicitud->edu_superior_carrera;
                        $solicitudData['edu_superior_estado']      = $datosEdu['superior']['estado'] ?? $solicitud->edu_superior_estado;
                        $solicitudData['edu_superior_anio']        = $datosEdu['superior']['anio'] ?? $solicitud->edu_superior_anio;
                    }

                    if (isset($datosEdu['cursos']) && is_array($datosEdu['cursos'])) {
                        $solicitud->cursos()->delete();
                        foreach ($datosEdu['cursos'] as $c) {
                            // El frontend envía 'nombre', se mapea a 'nombre_curso' en BD
                            $solicitud->cursos()->create(['institucion' => $c['institucion'], 'nombre_curso' => $c['nombre'] ?? $c['nombre_curso'] ?? null, 'anio' => $c['anio']]);
                        }
                    }
                }

                if ($request->has('experienciaLaboral')) {
                    $expLab = $request->input('experienciaLaboral');
                    $solicitudData['exp_sin_experiencia']     = $expLab['sin_experiencia'] ?? $solicitud->exp_sin_experiencia;
                    $solicitudData['exp_descripcion_labores'] = $expLab['descripcion_labores'] ?? $solicitud->exp_descripcion_labores;

                    if (isset($expLab['experiencias']) && is_array($expLab['experiencias'])) {
                        $solicitud->experiencias()->delete();
                        foreach ($expLab['experiencias'] as $e) {
                            $solicitud->experiencias()->create([
                                'empresa' => $e['empresa'], 'cargo' => $e['cargo'] ?? ($e['area'] ?? null), 
                                'causa_salida' => $e['causa_salida'] ?? ($e['motivo_salida'] ?? null), 
                                'tiempo' => $e['tiempo'] ?? (($e['fecha_inicio'] ?? '') . ' - ' . ($e['fecha_fin'] ?? ''))
                            ]);
                        }
                    }
                }

                if ($request->has('saludPersonal')) {
                    $salud = $request->input('saludPersonal');
                    $solicitudData['salud_operaciones']                  = $salud['operaciones']['aplica'] ?? $solicitud->salud_operaciones;
                    $solicitudData['salud_operaciones_detalle']          = $salud['operaciones']['detalle'] ?? $solicitud->salud_operaciones_detalle;
                    $solicitudData['salud_fracturas']                    = $salud['fracturas']['aplica'] ?? $solicitud->salud_fracturas;
                    $solicitudData['salud_fracturas_detalle']            = $salud['fracturas']['detalle'] ?? $solicitud->salud_fracturas_detalle;
                    $solicitudData['salud_quemaduras']                   = $salud['quemaduras']['aplica'] ?? $solicitud->salud_quemaduras;
                    $solicitudData['salud_quemaduras_detalle']           = $salud['quemaduras']['detalle'] ?? $solicitud->salud_quemaduras_detalle;
                    $solicitudData['salud_accidentes_laborales']         = $salud['accidentes_laborales']['aplica'] ?? $solicitud->salud_accidentes_laborales;
                    $solicitudData['salud_accidentes_laborales_detalle'] = $salud['accidentes_laborales']['detalle'] ?? $solicitud->salud_accidentes_laborales_detalle;
                    $solicitudData['salud_otros_antecedentes']           = $salud['otros_antecedentes'] ?? $solicitud->salud_otros_antecedentes;
                    $solicitudData['salud_deporte']                      = $salud['deporte'] ?? $solicitud->salud_deporte;
                    $solicitudData['salud_actividad_social']             = $salud['actividad_social'] ?? $solicitud->salud_actividad_social;
                }

                if ($request->has('datosEntrevistador')) {
                    $entrevista = $request->input('datosEntrevistador');
                    $solicitudData['aprobado_por']     = $entrevista['aprobacion']['aprobado_por'] ?? $solicitud->aprobado_por;
                    $solicitudData['aprobacion_grupo'] = $entrevista['aprobacion']['grupo'] ?? $solicitud->aprobacion_grupo;
                    $solicitudData['aprobacion_fecha'] = $entrevista['aprobacion']['fecha'] ?? $solicitud->aprobacion_fecha;
                }

                if ($request->has('referenciasLaborales') && is_array($request->referenciasLaborales)) {
                    $solicitud->referenciasLaborales()->delete();
                    foreach ($request->referenciasLaborales as $r) {
                        $solicitud->referenciasLaborales()->create(['empresa' => $r['empresa'], 'contacto_nombre' => $r['contacto_nombre'] ?? ($r['nombre'] ?? null), 'telefono' => $r['telefono']]);
                    }
                }

                if ($request->has('referenciasPersonales') && is_array($request->referenciasPersonales)) {
                    $solicitud->referenciasPersonales()->delete();
                    foreach ($request->referenciasPersonales as $r) {
                        $solicitud->referenciasPersonales()->create(['nombre' => $r['nombre'], 'telefono' => $r['telefono'], 'ocupacion' => $r['ocupacion'] ?? ($r['cargo'] ?? null)]);
                    }
                }

                if ($request->has('familiaresEnEmpresa') && is_array($request->familiaresEnEmpresa)) {
                    $solicitud->familiaresEmpresa()->delete();
                    foreach ($request->familiaresEnEmpresa as $f) {
                        $solicitud->familiaresEmpresa()->create(['nombre' => $f['nombre'], 'empresa' => $f['empresa'], 'cargo' => $f['cargo'], 'parentesco' => $f['parentesco'], 'telefono' => $f['telefono']]);
                    }
                }

                if ($request->has('observaciones') && is_array($request->observaciones)) {
                    $solicitud->observaciones()->delete();
                    foreach ($request->observaciones as $o) {
                        $solicitud->observaciones()->create(['tipo' => $o['tipo'], 'comentario' => $o['comentario'], 'usuario_nombre' => $o['usuario_nombre'] ?? ($o['usuario'] ?? null), 'fecha' => $o['fecha'] ?? now()]);
                    }
                }

                $solicitud->update($solicitudData);

                return response()->json(['message' => 'Solicitud actualizada correctamente']);
            });
        } catch (\Exception $e) {
            Log::error('Error al actualizar solicitud: ' . $e->getMessage());
            return response()->json(['error' => 'No se pudo actualizar la solicitud', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza el estado de una solicitud y ejecuta la contratación si el estado es CONTRATADO.
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|string|in:PENDIENTE,EN_REVISION,APROBADO,RECHAZADO,CONTRATADO'
        ]);

        $nuevoEstado = $request->input('estado');

        try {
            return DB::transaction(function () use ($id, $nuevoEstado) {
                $solicitud = SolicitudEmpleo::findOrFail($id);
                $estadoActual = $solicitud->estado_solicitud;

                // 1. Validar transiciones permitidas
                $transiciones = [
                    'PENDIENTE'   => ['EN_REVISION', 'RECHAZADO'],
                    'EN_REVISION' => ['APROBADO', 'RECHAZADO'],
                    'APROBADO'    => ['CONTRATADO'],
                    'RECHAZADO'   => ['PENDIENTE'], // Solo administrador podría, pero el middleware ya filtra
                    'CONTRATADO'  => [] // No se puede cambiar si ya está contratado
                ];

                if (!in_array($nuevoEstado, $transiciones[$estadoActual] ?? [])) {
                    return response()->json([
                        'success' => false,
                        'message' => "Transición de estado no permitida: de {$estadoActual} a {$nuevoEstado}"
                    ], 422);
                }

                // 2. Si el nuevo estado es CONTRATADO, ejecutar lógica de inserción en rh_mtrab
                if ($nuevoEstado === 'CONTRATADO') {
                    // Verificar si ya existe en rh_mtrab por cédula
                    $existe = DB::table('rh_mtrab')
                        ->where('NUM_CEDULA', $solicitud->cedula)
                        ->exists();

                    if ($existe) {
                        return response()->json([
                            'success' => false,
                            'message' => 'El aspirante ya se encuentra registrado como trabajador en rh_mtrab (Cédula duplicada).'
                        ], 409);
                    }

                    // Obtener nuevo COD_TRABAJ (MAX + 1)
                    $ultimoCod = DB::table('rh_mtrab')->max('COD_TRABAJ');
                    $nuevoCod = ($ultimoCod ?? 0) + 1;

                    // Mapeo de tipos de contrato a IDs numéricos para rh_mtrab
                    $mappingContratos = [
                        'A PRUEBA'            => 1,
                        'CONTRATO PRODUCTIVO' => 2,
                        'EVENTUAL'            => 3,
                        'PASANTE'             => 4,
                        'PLAZO FIJO'          => 5,
                        'POR TEMPORADA'       => 6,
                        'DESTAJO'             => 7
                    ];

                    $tipoContratoId = $mappingContratos[$solicitud->condiciones_tipo_contrato] ?? 0;

                    // Formatear nombres: APELLIDOS NOMBRES (Estándar de Talento Humano)
                    $nombreCorto = strtoupper($solicitud->apellido_paterno . ' ' . $solicitud->apellido_materno . ' ' . $solicitud->nombres);
                    
                    // Extraer nombres individuales
                    $nombresArray = explode(' ', trim($solicitud->nombres));
                    $nombre1 = $nombresArray[0] ?? '';
                    $nombre2 = isset($nombresArray[1]) ? implode(' ', array_slice($nombresArray, 1)) : '';

                    // Insertar en rh_mtrab (Base de datos local sistemahacienda)
                    DB::table('rh_mtrab')->insert([
                        'COD_TRABAJ'   => $nuevoCod,
                        'NUM_CEDULA'   => $solicitud->cedula,
                        'APELLIDO_1'   => strtoupper($solicitud->apellido_paterno),
                        'APELLIDO_2'   => strtoupper($solicitud->apellido_materno),
                        'NOMBRE_1'     => strtoupper($nombre1),
                        'NOMBRE_2'     => strtoupper($nombre2),
                        'NOMBRE_CORTO' => $nombreCorto,
                        'FEC_INGRESO'  => $solicitud->fecha_ingreso ?? now(),
                        'COD_EMPRESA'  => $solicitud->company_id,
                        'EMPRESA'      => $solicitud->company_name,
                        'ESTADO'       => 'A', // Activo
                        'COD_HACIENDA' => null, 
                        'codcargo'     => null, 
                        'nomcargo'     => $solicitud->labor,
                        'SUELDO'       => 0, 
                        'TIP_ROL'      => 1, // Por defecto Semanal/Mensual
                        'TIP_CONTRATO' => $tipoContratoId,
                        'SOLO_CORTE'   => 0,
                        'usuariosub'   => auth()->id() ?? 0,
                        'fechasub'     => now(),
                        'edad'         => $solicitud->edad,
                        'fec_nacimiento'=> $solicitud->fecha_nacimiento
                    ]);
                }

                // 3. Actualizar estado en la tabla de solicitudes
                $solicitud->estado_solicitud = $nuevoEstado;
                $solicitud->save();

                return response()->json([
                    'success' => true,
                    'message' => "Estado actualizado a {$nuevoEstado} correctamente" . ($nuevoEstado === 'CONTRATADO' ? " e insertado en rh_mtrab." : ".")
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error en updateEstado: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error interno al procesar el cambio de estado.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Elimina una solicitud si no ha sido contratada aún.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $solicitud = SolicitudEmpleo::findOrFail($id);

            // REGLA DE NEGOCIO: No permitir eliminación si ya fue contratado
            if ($solicitud->estado_solicitud === 'CONTRATADO') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar una solicitud en estado CONTRATADO.'
                ], 403);
            }

            $solicitud->delete();

            return response()->json([
                'success' => true,
                'message' => 'Solicitud eliminada correctamente.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar solicitud: ' . $e->getMessage());
            return response()->json(['error' => 'No se pudo eliminar la solicitud'], 500);
        }
    }
}
