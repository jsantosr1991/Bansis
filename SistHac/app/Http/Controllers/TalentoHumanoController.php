<?php

namespace App\Http\Controllers;

use App\Models\SolicitudEmpleo;
use App\Services\EcuadorIdentificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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
            $solicitudes = SolicitudEmpleo::select('id', 'codigo_solicitud', 'fecha_entrevista', 'nombres', 'apellido_paterno', 'apellido_materno', 'cedula', 'company_name', 'estado_solicitud')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($solicitudes);
        }
        catch (\Exception $e) {
            Log::error('Error al listar solicitudes: ' . $e->getMessage());
            return response()->json(['error' => 'No se pudo obtener el listado'], 500);
        }
    }

    /**
     * Valida si un número de cédula ya existe en el sistema.
     * Útil para prevenir duplicados durante la creación y edición.
     * 
     * @param Request $request cedula y opcionalmente exclude_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function validarCedula(Request $request, EcuadorIdentificationService $idService)
    {
        $cedula = $request->query('cedula');
        $excludeId = $request->query('exclude_id');

        if (!$cedula) {
            return response()->json(['exists' => false, 'valid' => false]);
        }

        // 1. Validar Algorítmicamente
        $isValid = $idService->validateCedulaAlgorithmic($cedula);
        if (!$isValid) {
            return response()->json([
                'exists' => false,
                'valid' => false,
                'message' => 'El número de cédula no es válido algorítmicamente.'
            ]);
        }

        try {
            // 2. Verificar duplicado local
            $query = SolicitudEmpleo::where('cedula', $cedula);

            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }

            $duplicado = $query->first(['id', 'codigo_solicitud', 'nombres', 'apellido_paterno', 'apellido_materno']);

            if ($duplicado) {
                return response()->json([
                    'exists' => true,
                    'valid' => true,
                    'solicitud' => [
                        'id' => $duplicado->id,
                        'codigo' => $duplicado->codigo_solicitud,
                        'nombre_completo' => "{$duplicado->nombres} {$duplicado->apellido_paterno} {$duplicado->apellido_materno}"
                    ],
                    'message' => 'Esta cédula ya está registrada en el sistema.'
                ]);
            }

            // 3. Consultar SRI (Nombre completo)
            $sriData = $idService->getSriData($cedula);

            return response()->json([
                'exists' => false,
                'valid' => true,
                'sri_data' => $sriData,
                'message' => 'Cédula válida y disponible.'
            ]);
        }
        catch (\Exception $e) {
            Log::error('Error en validarCedula: ' . $e->getMessage());
            return response()->json(['error' => 'Error al validar documento'], 500);
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
            // NUEVA CONEXIÓN: Conexión a base de datos externa de producción (mysqlrrhh) PARA CONSULTAS SOLAMENTE
            // SOLO LECTURA, no modificar ni eliminar datos en erp_hac
            $labores = DB::connection('mysqlrrhh')
                 ->table('fuerza_laboral')
                 ->whereIn('GRUPO', $grupos)
                 ->whereNotNull('nombre_labor')
                 ->where('nombre_labor', '!=', '')
                 ->select('nombre_labor')
                 ->distinct()
                 ->orderBy('nombre_labor', 'asc')
                 ->pluck('nombre_labor');

            /* 
             * COMENTADO: Consulta a la tabla copiada en la base de datos local (sistemahacienda)
             * Se deja aquí comentado por si se requiere volver a usar la DB local.
             * 
             * $labores = DB::table('fuerza_laboral')
             *     ->whereIn('GRUPO', $grupos)
             *     ->whereNotNull('nombre_labor')
             *     ->where('nombre_labor', '!=', '')
             *     ->select('nombre_labor')
             *     ->distinct()
             *     ->orderBy('nombre_labor', 'asc')
             *     ->pluck('nombre_labor');
             */

            return response()->json($labores);
        }
        catch (\Exception $e) {
            Log::error('Error al consultar labores (local/copia): ' . $e->getMessage());
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
        }
        catch (\Exception $e) {
            Log::error('Error al consultar empresas: ' . $e->getMessage());
            return response()->json([], 500);
        }
    }

    /**
     * Convierte recursivamente todos los valores de un array a mayúsculas.
     * Ignora campos específicos como 'correo' o IDs.
     * 
     * @param array $data
     * @return array
     */
    private function convertToUppercase($data)
    {
        if (!is_array($data)) {
            return is_string($data) ? strtoupper($data) : $data;
        }

        foreach ($data as $key => $value) {
            // No convertir correos, IDs, fechas o booleanos
            if (in_array($key, ['correo', 'id', 'company_id', 'responsable_id', 'usuario_id', 'fecha', 'fecha_ingreso', 'fecha_entrevista', 'fecha_nacimiento', 'aplica'])) {
                continue;
            }

            if (is_array($value)) {
                $data[$key] = $this->convertToUppercase($value);
            }
            else if (is_string($value)) {
                $data[$key] = strtoupper($value);
            }
        }

        return $data;
    }

    /**
     * Genera un código de solicitud automático: SOL-YYYY-NNNN
     * 
     * @return string
     */
    private function generateCodigoSolicitud()
    {
        $anio = date('Y');
        $ultimoSecuencial = SolicitudEmpleo::where('codigo_solicitud', 'like', "SOL-{$anio}-%")
            ->max(DB::raw("CAST(SUBSTRING(codigo_solicitud, -4) AS UNSIGNED)"));
        $nuevoSecuencial = str_pad(($ultimoSecuencial ?? 0) + 1, 4, '0', STR_PAD_LEFT);
        return "SOL-{$anio}-{$nuevoSecuencial}";
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
                // EXTRACCIÓN Y CONVERSIÓN A MAYÚSCULAS
                $allInput = $this->convertToUppercase($request->all());

                $datosAdmin = $allInput['datosAdministrativos'] ?? [];
                $datosPers = $allInput['datosPersonales'] ?? [];
                $doc = $allInput['documentacion'] ?? [];
                $datosRef = $allInput['datosReferenciales'] ?? [];
                $estadoCivil = $allInput['estadoCivil'] ?? [];
                $datosFam = $allInput['datosFamiliares'] ?? [];
                $datosEdu = $allInput['datosEducativos'] ?? [];
                $expLab = $allInput['experienciaLaboral'] ?? [];
                $salud = $allInput['saludPersonal'] ?? [];
                $entrevista = $allInput['datosEntrevistador'] ?? [];

                // Obtener el nombre de la empresa para redundancia histórica
                $companyName = null;
                if (!empty($datosAdmin['company_id'])) {
                    $companyName = DB::table('empresa')->where('id', $datosAdmin['company_id'])->value('nombre');
                }

                // Generar código de solicitud automático
                $codigoSolicitud = $this->generateCodigoSolicitud();

                $solicitudData = [
                    'codigo_solicitud' => $codigoSolicitud,
                    // SECCIÓN 1: DATOS ADMINISTRATIVOS
                    'company_id' => $datosAdmin['company_id'] ?? null,
                    'company_name' => $companyName,
                    'area' => $datosAdmin['area'] ?? '',
                    'labor' => $datosAdmin['labor'] ?? '',
                    'fecha_ingreso' => $datosAdmin['fechaIngreso'] ?? null,

                    'usa_banco_guayaquil' => data_get($datosAdmin, 'banking_info.usa_banco_guayaquil'),
                    'banco_numero_cuenta' => data_get($datosAdmin, 'banking_info.numero_cuenta'),
                    'banco_tipo_cuenta' => data_get($datosAdmin, 'banking_info.tipo_cuenta'),
                    'banco_titular' => data_get($datosAdmin, 'banking_info.titular'),

                    'fecha_revision_guayaquil' => data_get($datosAdmin, 'fechas_control.fecha_revision_guayaquil'),
                    'reingreso_fecha' => data_get($datosAdmin, 'fechas_control.reingreso_fecha'),
                    'fecha_salida' => data_get($datosAdmin, 'fechas_control.fecha_salida'),

                    'condiciones_tipo_contrato' => data_get($datosAdmin, 'condiciones.tipo_contrato'),
                    'condiciones_transporte' => data_get($datosAdmin, 'condiciones.transporte'),
                    'condiciones_recorrido' => data_get($datosAdmin, 'condiciones.recorrido'),
                    'condiciones_recorrido_otro' => data_get($datosAdmin, 'condiciones.recorrido_otro'),
                    'condiciones_vehiculo' => data_get($datosAdmin, 'condiciones.vehiculo'),
                    'condiciones_licencia' => data_get($datosAdmin, 'condiciones.licencia'),
                    'condiciones_licencia_tipo' => data_get($datosAdmin, 'condiciones.licencia_tipo'),
                    'condiciones_acumulacion_decimos' => data_get($datosAdmin, 'condiciones.acumulacion_decimos'),
                    'condiciones_semana_completa' => data_get($datosAdmin, 'condiciones.semana_completa'),
                    'condiciones_solo_proceso' => data_get($datosAdmin, 'condiciones.solo_proceso'),
                    'condiciones_almuerzo' => data_get($datosAdmin, 'condiciones.almuerzo'),

                    'responsable_id' => data_get($datosAdmin, 'control_interno.responsable_id'),
                    'responsable_nombre' => data_get($datosAdmin, 'control_interno.responsable_nombre'),
                    'responsable_grupo' => data_get($datosAdmin, 'control_interno.responsable_grupo'),
                    'fecha_entrevista' => $this->parseDate(data_get($datosAdmin, 'control_interno.fecha_entrevista')),

                    // SECCIÓN 2: DATOS PERSONALES
                    'apellido_paterno' => $datosPers['apellidoPaterno'] ?? '',
                    'apellido_materno' => $datosPers['apellidoMaterno'] ?? '',
                    'nombres' => $datosPers['nombres'] ?? '',
                    'cedula' => $datosPers['cedula'] ?? null,
                    'apodo' => $datosPers['apodo'] ?? null,
                    'genero' => $datosPers['genero'] ?? null,
                    'tiene_discapacidad' => filter_var($datosPers['tieneDiscapacidad'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'discapacidad_detalle' => $datosPers['discapacidadDetalle'] ?? null,
                    'pais_nacimiento' => $datosPers['paisNacimiento'] ?? null,
                    'pais_nacimiento_otro' => $datosPers['paisNacimientoOtro'] ?? null,
                    'provincia_nacimiento' => $datosPers['provinciaNacimiento'] ?? null,
                    'provincia_nacimiento_otro' => $datosPers['provinciaNacimientoOtro'] ?? null,
                    'canton_nacimiento' => $datosPers['cantonNacimiento'] ?? null,
                    'canton_nacimiento_otro' => $datosPers['cantonNacimientoOtro'] ?? null,
                    'canton_codigo' => $datosPers['cantonCodigo'] ?? null,
                    'fecha_nacimiento' => $datosPers['fechaNacimiento'] ?? null,
                    'edad' => $datosPers['edad'] ?? null,
                    'tipo_sangre' => $datosPers['tipoSangre'] ?? null,
                    'estatura' => $datosPers['estatura'] ?? null,
                    'peso' => $datosPers['peso'] ?? null,
                    'religion' => $datosPers['religion'] ?? null,
                    'correo' => $datosPers['correo'] ?? null,
                    'vacuna_covid_1' => $datosPers['vacunaCovid1'] ?? null,
                    'vacuna_covid_2' => $datosPers['vacunaCovid2'] ?? null,
                    'vacuna_covid_3' => $datosPers['vacunaCovid3'] ?? null,
                    'afiliado_iess' => $datosPers['afiliadoIess'] ?? null,

                    // SECCIÓN 3: DOCUMENTACIÓN
                    'doc_cedula_cant' => $doc['cedula_cant'] ?? null,
                    'doc_certificado_votacion_cant' => $doc['certificado_votacion_cant'] ?? null,
                    'doc_libreta_militar_cant' => $doc['libreta_militar_cant'] ?? null,
                    'doc_certificado_iess_cant' => $doc['certificado_iess_cant'] ?? null,
                    'doc_certificado_laboral_cant' => $doc['certificado_laboral_cant'] ?? null,
                    'doc_fotos_cant' => $doc['fotos_cant'] ?? null,

                    // SECCIÓN 4: DATOS REFERENCIALES
                    'referencial_direccion' => $datosRef['direccion'] ?? null,
                    'referencial_ciudad' => $datosRef['ciudad'] ?? null,
                    'referencial_ciudad_otro' => $datosRef['ciudadOtro'] ?? null,
                    'referencial_ciudad_codigo' => $datosRef['ciudadCodigo'] ?? null,
                    'referencial_provincia' => $datosRef['provincia'] ?? null,
                    'referencial_provincia_otro' => $datosRef['provinciaOtro'] ?? null,
                    'referencial_telefono_principal' => $datosRef['telefono_principal'] ?? null,
                    'referencial_telefono_secundario' => $datosRef['telefono_secundario'] ?? null,
                    'referencial_vivienda_material' => $datosRef['vivienda_material'] ?? null,
                    'referencial_vivienda_condicion' => $datosRef['vivienda_condicion'] ?? null,
                    'referencial_cantidad_familiares' => $datosRef['cantidad_familiares'] ?? 0,
                    'referencial_familiares_relacion' => $datosRef['familiares_relacion'] ?? null,
                    'referencial_telefono_emergencia' => $datosRef['telefono_emergencia'] ?? null,
                    'referencial_nombre_contacto_emergencia' => $datosRef['nombre_contacto_emergencia'] ?? null,
                    'referencial_servicio_agua' => data_get($datosRef, 'servicios_basicos.agua'),
                    'referencial_servicio_luz' => data_get($datosRef, 'servicios_basicos.luz'),
                    'referencial_servicio_telefono' => data_get($datosRef, 'servicios_basicos.telefono'),

                    'estado_solicitud' => $request->input('estado_solicitud', 'PENDIENTE'),

                    // SECCIÓN 5: ESTADO CIVIL
                    'estado_civil' => $estadoCivil['estado_civil'] ?? null,
                    'estado_civil_tiempo_valor' => $estadoCivil['tiempo_estado_civil_valor'] ?? null,
                    'estado_civil_tiempo_unidad' => $estadoCivil['tiempo_estado_civil_unidad'] ?? null,
                    'estado_civil_tipo_matrimonio' => $estadoCivil['tipo_matrimonio'] ?? null,
                    'estado_civil_demandas' => $estadoCivil['demandas'] ?? null,
                    'estado_civil_compromisos_anteriores' => $estadoCivil['compromisos_anteriores'] ?? 0,

                    // SECCIÓN 6: DATOS FAMILIARES PRINCIPALES
                    'padre_nombre' => data_get($datosFam, 'padre.nombre'),
                    'padre_estado' => data_get($datosFam, 'padre.estado'),
                    'padre_edad' => data_get($datosFam, 'padre.edad'),
                    'padre_domicilio' => data_get($datosFam, 'padre.domicilio'),
                    'padre_ocupacion' => data_get($datosFam, 'padre.ocupacion'),

                    'madre_nombre' => data_get($datosFam, 'madre.nombre'),
                    'madre_estado' => data_get($datosFam, 'madre.estado'),
                    'madre_edad' => data_get($datosFam, 'madre.edad'),
                    'madre_domicilio' => data_get($datosFam, 'madre.domicilio'),
                    'madre_ocupacion' => data_get($datosFam, 'madre.ocupacion'),

                    'conyuge_nombre' => data_get($datosFam, 'conyuge_actual.nombre'),
                    'conyuge_estado' => data_get($datosFam, 'conyuge_actual.estado'),
                    'conyuge_edad' => data_get($datosFam, 'conyuge_actual.edad'),
                    'conyuge_domicilio' => data_get($datosFam, 'conyuge_actual.domicilio'),
                    'conyuge_ocupacion' => data_get($datosFam, 'conyuge_actual.ocupacion'),

                    // SECCIÓN 7: DATOS EDUCATIVOS
                    'edu_nivel_maximo' => $datosEdu['nivel_maximo'] ?? null,
                    'edu_inicial_institucion' => data_get($datosEdu, 'inicial.institucion'),
                    'edu_inicial_anio' => data_get($datosEdu, 'inicial.anio'),
                    'edu_basica_institucion' => data_get($datosEdu, 'basica.institucion'),
                    'edu_basica_grado' => data_get($datosEdu, 'basica.grado'),
                    'edu_basica_anio' => data_get($datosEdu, 'basica.anio'),
                    'edu_bachillerato_institucion' => data_get($datosEdu, 'bachillerato.institucion'),
                    'edu_bachillerato_titulo' => data_get($datosEdu, 'bachillerato.titulo'),
                    'edu_bachillerato_anio' => data_get($datosEdu, 'bachillerato.anio'),
                    'edu_superior_institucion' => data_get($datosEdu, 'superior.institucion'),
                    'edu_superior_tipo' => data_get($datosEdu, 'superior.tipo'),
                    'edu_superior_nivel' => data_get($datosEdu, 'superior.nivel'),
                    'edu_superior_carrera' => data_get($datosEdu, 'superior.carrera_programa'),
                    'edu_superior_estado' => data_get($datosEdu, 'superior.estado'),
                    'edu_superior_anio' => data_get($datosEdu, 'superior.anio'),

                    // SECCIÓN 9: EXPERIENCIA LABORAL HEADER
                    'exp_sin_experiencia' => $expLab['sin_experiencia'] ?? null,
                    'exp_descripcion_labores' => $expLab['descripcion_labores'] ?? null,

                    // SECCIÓN 11: SALUD PERSONAL
                    'salud_operaciones' => data_get($salud, 'operaciones.aplica'),
                    'salud_operaciones_detalle' => data_get($salud, 'operaciones.detalle'),
                    'salud_fracturas' => data_get($salud, 'fracturas.aplica'),
                    'salud_fracturas_detalle' => data_get($salud, 'fracturas.detalle'),
                    'salud_quemaduras' => data_get($salud, 'quemaduras.aplica'),
                    'salud_quemaduras_detalle' => data_get($salud, 'quemaduras.detalle'),
                    'salud_accidentes_laborales' => data_get($salud, 'accidentes_laborales.aplica'),
                    'salud_accidentes_laborales_detalle' => data_get($salud, 'accidentes_laborales.detalle'),
                    'salud_otros_antecedentes' => $salud['otros_antecedentes'] ?? null,
                    'salud_deporte' => $salud['deporte'] ?? null,
                    'salud_actividad_social' => $salud['actividad_social'] ?? null,

                    // SECCIÓN 12: OBSERVACIONES (Mapeo de la primera si existe en store simplificado)
                    // Generalmente las observaciones se guardan en su propia relación abajo

                    // SECCIÓN 13: APROBACIÓN
                    'aprobado_por' => data_get($entrevista, 'aprobacion.aprobado_por'),
                    'aprobacion_grupo' => data_get($entrevista, 'aprobacion.grupo'),
                    'aprobacion_fecha' => $this->parseDate(data_get($entrevista, 'aprobacion.fecha')),
                ];

                $solicitud = SolicitudEmpleo::create($solicitudData);

                // 2. Guardar relaciones con mapeo detallado

                // Hermanos (Sección 6)
                if (isset($datosFam['hermanos']) && is_array($datosFam['hermanos'])) {
                    foreach ($datosFam['hermanos'] as $h) {
                        $solicitud->hermanos()->create([
                            'nombre' => $h['nombre'] ?? null,
                            'genero' => $h['genero'] ?? null,
                            'estado' => $h['estado'] ?? null,
                            'edad' => $h['edad'] ?? null,
                            'domicilio' => $h['domicilio'] ?? null,
                            'ocupacion' => $h['ocupacion'] ?? null,
                        ]);
                    }
                }

                // Hijos (Sección 6)
                if (isset($datosFam['hijos']) && is_array($datosFam['hijos'])) {
                    foreach ($datosFam['hijos'] as $h) {
                        $solicitud->hijos()->create([
                            'nombre' => $h['nombre'] ?? null,
                            'edad' => $h['edad'] ?? null,
                            'ocupacion' => $h['ocupacion'] ?? null,
                            'discapacidad' => filter_var($h['discapacidad'] ?? false, FILTER_VALIDATE_BOOLEAN),
                            'descripcion_discapacidad' => $h['descripcion_discapacidad'] ?? null,
                        ]);
                    }
                }

                // Cónyuges Anteriores (Sección 6)
                if (isset($datosFam['conyuges_anteriores']) && is_array($datosFam['conyuges_anteriores'])) {
                    foreach ($datosFam['conyuges_anteriores'] as $c) {
                        $solicitud->conyugesAnteriores()->create([
                            'nombre' => $c['nombre'] ?? null,
                            'domicilio' => $c['domicilio'] ?? null,
                            'ocupacion' => $c['ocupacion'] ?? null,
                            'edad' => $c['edad'] ?? null,
                            'genero' => $c['genero'] ?? null,
                            'estado' => $c['estado'] ?? null,
                        ]);
                    }
                }

                // Cursos (Sección 7)
                if (isset($datosEdu['cursos']) && is_array($datosEdu['cursos'])) {
                    foreach ($datosEdu['cursos'] as $c) {
                        $solicitud->cursos()->create([
                            'institucion' => $c['institucion'] ?? null,
                            'nombre_curso' => $c['nombre'] ?? $c['nombre_curso'] ?? null,
                            'duracion' => $c['duracion'] ?? null,
                            'anio' => $c['anio'] ?? null,
                        ]);
                    }
                }

                // Experiencias Laborales (Sección 8)
                if (isset($expLab['experiencias']) && is_array($expLab['experiencias'])) {
                    foreach ($expLab['experiencias'] as $e) {
                        $solicitud->experiencias()->create([
                            'empresa' => $e['empresa'] ?? null,
                            'area' => $e['area'] ?? null,
                            'cargo' => $e['cargo'] ?? null,
                            'jefe_inmediato' => $e['jefe_inmediato'] ?? null,
                            'fecha_inicio' => $e['fecha_inicio'] ?? null,
                            'fecha_fin' => $e['fecha_fin'] ?? null,
                            'causa_salida' => $e['motivo_salida'] ?? $e['causa_salida'] ?? null,
                            'tiempo' => ($e['fecha_inicio'] ?? '') . ' - ' . ($e['actualmente'] ? 'ACTUAL' : ($e['fecha_fin'] ?? '')),
                        ]);
                    }
                }

                // Referencias Laborales (Sección 9)
                if ($request->has('referenciasLaborales') && is_array($request->referenciasLaborales)) {
                    foreach ($request->referenciasLaborales as $r) {
                        $solicitud->referenciasLaborales()->create([
                            'empresa' => $r['empresa'] ?? null,
                            'contacto_nombre' => $r['nombre'] ?? null,
                            'cargo' => $r['cargo'] ?? null,
                            'telefono' => $r['telefono'] ?? null,
                        ]);
                    }
                }

                // Referencias Personales (Sección 10)
                if ($request->has('referenciasPersonales') && is_array($request->referenciasPersonales)) {
                    foreach ($request->referenciasPersonales as $r) {
                        $solicitud->referenciasPersonales()->create([
                            'nombre' => $r['nombre'] ?? null,
                            'telefono' => $r['telefono'] ?? null,
                            'ocupacion' => $r['cargo'] ?? $r['ocupacion'] ?? null,
                            'empresa' => $r['empresa'] ?? null,
                            'cargo' => $r['cargo'] ?? null,
                        ]);
                    }
                }

                // Familiares en la Empresa (Sección 10)
                if ($request->has('familiaresEnEmpresa') && is_array($request->familiaresEnEmpresa)) {
                    foreach ($request->familiaresEnEmpresa as $f) {
                        $solicitud->familiaresEmpresa()->create([
                            'nombre' => $f['nombre'] ?? null,
                            'empresa' => $f['empresa'] ?? null,
                            'cargo' => $f['cargo'] ?? null,
                            'parentesco' => $f['parentesco'] ?? null,
                            'area' => $f['area'] ?? null,
                            'telefono' => $f['telefono'] ?? null,
                        ]);
                    }
                }

                // Observaciones (Sección 12)
                if ($request->has('observaciones') && is_array($request->observaciones)) {
                    foreach ($request->observaciones as $o) {
                        $solicitud->observaciones()->create([
                            'tipo' => $o['tipo'] ?? null,
                            'comentario' => $o['comentario'] ?? null,
                            'usuario_nombre' => $o['usuario'] ?? null,
                            'fecha' => $o['fecha'] ?? now(),
                        ]);
                    }
                }

                return response()->json([
                    'message' => 'Solicitud guardada correctamente',
                    'id' => $solicitud->id
                ], 201);
            });
        }
        catch (\Exception $e) {
            Log::error('Error al guardar solicitud: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al procesar la solicitud',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Normaliza un valor guardado en MAYÚSCULAS a su formato original esperado por el frontend.
     * Los selects del frontend usan valores en Title Case (ej: 'Campo', 'Ecuador', 'Ahorro')
     * pero el método convertToUppercase los guarda como 'CAMPO', 'ECUADOR', 'AHORRO'.
     * 
     * @param string|null $value Valor almacenado (posiblemente en MAYÚSCULAS).
     * @param array $validOptions Opciones válidas del select del frontend.
     * @return string|null El valor normalizado o el original si no se encuentra.
     */
    private function normalizeSelectValue($value, $validOptions)
    {
        if (empty($value))
            return $value;

        // Primero buscar coincidencia exacta
        if (in_array($value, $validOptions))
            return $value;

        // Buscar coincidencia case-insensitive
        foreach ($validOptions as $option) {
            if (strtoupper($option) === strtoupper($value)) {
                return $option;
            }
        }

        // Si no se encuentra en las opciones, devolver ucwords como fallback
        return ucwords(strtolower($value));
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

            // Opciones válidas de los selects del frontend
            $areasValidas = ['Campo', 'Empacadora', 'Administración'];
            $paisesValidos = ['Ecuador', 'Colombia', 'Perú', 'Venezuela', 'Argentina', 'Chile', 'Otros'];
            $provinciasEcuador = [
                'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas',
                'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo',
                'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas',
                'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe', 'Otros'
            ];
            $tiposCuenta = ['Ahorro', 'Corriente'];
            $recorridos = ['Naranjito', 'Milagro', 'Marcelino Maridueña', 'KM 26', 'Puente Payo', 'Otros'];
            $materialesVivienda = ['Cemento', 'Mixto', 'Cabaña'];
            $empresasValidas = [
                'Agrícola e Industrial Primobanano S.A.',
                'Sociedad Fiduciaria e Inmobiliaria C.A.',
                'Agricola Las Villas S.A.',
                'Valores y Administraciones S.A.',
                'Gamaunion S.A.'
            ];

            // Obtener labores válidas desde producción para el área actual para asegurar emparejamiento exacto en el frontend
            $mapeo = [
                'Campo' => ['DOMESTICO', 'FITOS', 'LABORES CAMPO', 'CAÑA', 'BOSQUE', 'GANADO', 'CACAO', 'COSECHA', 'AREAS DE APOYO'],
                'Empacadora' => ['EMPAQUE'],
                'Administración' => ['ADMINISTRACION']
            ];
            $areaNormalizada = $this->normalizeSelectValue($solicitud->area, $areasValidas);
            $grupos = $mapeo[$areaNormalizada] ?? [];
            $laboresValidas = [];
            if (!empty($grupos)) {
                try {
                    $laboresValidas = DB::connection('mysqlrrhh')
                        ->table('fuerza_laboral')
                        ->whereIn('GRUPO', $grupos)
                        ->whereNotNull('nombre_labor')
                        ->where('nombre_labor', '!=', '')
                        ->pluck('nombre_labor')
                        ->toArray();
                } catch (\Exception $e) {
                    // Ignore, fallback handled below
                }
            }

            // RE-ESTRUCTURACIÓN DEL JSON PARA QUE EL FRONTEND PUEDA PATCHEAR EL FORMULARIO
            $data = [
                'id' => $solicitud->id,
                'codigo_solicitud' => $solicitud->codigo_solicitud,
                'datosAdministrativos' => [
                    'company_id' => $solicitud->company_id,
                    'company_name' => $solicitud->company_name,
                    'area' => $areaNormalizada,
                    'labor' => $this->normalizeSelectValue($solicitud->labor, $laboresValidas),
                    'fechaIngreso' => $solicitud->fecha_ingreso,
                    'banking_info' => [
                        'usa_banco_guayaquil' => (bool)$solicitud->usa_banco_guayaquil,
                        'numero_cuenta' => $solicitud->banco_numero_cuenta,
                        'tipo_cuenta' => $this->normalizeSelectValue($solicitud->banco_tipo_cuenta, $tiposCuenta),
                        'titular' => $solicitud->banco_titular,
                    ],
                    'fechas_control' => [
                        'fecha_revision_guayaquil' => $solicitud->fecha_revision_guayaquil,
                        'reingreso_fecha' => $solicitud->reingreso_fecha,
                        'fecha_salida' => $solicitud->fecha_salida,
                    ],
                    'condiciones' => [
                        'tipo_contrato' => $solicitud->condiciones_tipo_contrato,
                        'transporte' => (bool)$solicitud->condiciones_transporte,
                        'recorrido' => $this->normalizeSelectValue($solicitud->condiciones_recorrido, $recorridos),
                        'recorrido_otro' => $solicitud->condiciones_recorrido_otro,
                        'vehiculo' => (bool)$solicitud->condiciones_vehiculo,
                        'licencia' => (bool)$solicitud->condiciones_licencia,
                        'licencia_tipo' => $solicitud->condiciones_licencia_tipo,
                        'acumulacion_decimos' => (bool)$solicitud->condiciones_acumulacion_decimos,
                        'semana_completa' => (bool)$solicitud->condiciones_semana_completa,
                        'solo_proceso' => (bool)$solicitud->condiciones_solo_proceso,
                        'almuerzo' => (bool)$solicitud->condiciones_almuerzo,
                    ],
                    'control_interno' => [
                        'fecha_entrevista' => $solicitud->fecha_entrevista,
                        'responsable_id' => $solicitud->responsable_id,
                        'responsable_nombre' => $solicitud->responsable_nombre,
                        'responsable_grupo' => $solicitud->responsable_grupo,
                    ]
                ],
                'datosPersonales' => [
                    'apellidoPaterno' => $solicitud->apellido_paterno,
                    'apellidoMaterno' => $solicitud->apellido_materno,
                    'nombres' => $solicitud->nombres,
                    'cedula' => $solicitud->cedula,
                    'apodo' => $solicitud->apodo,
                    'genero' => $solicitud->genero,
                    'tieneDiscapacidad' => (bool)$solicitud->tiene_discapacidad,
                    'discapacidadDetalle' => $solicitud->discapacidad_detalle,
                    'paisNacimiento' => $this->normalizeSelectValue($solicitud->pais_nacimiento, $paisesValidos),
                    'paisNacimientoOtro' => $solicitud->pais_nacimiento_otro,
                    'provinciaNacimiento' => $this->normalizeSelectValue($solicitud->provincia_nacimiento, $provinciasEcuador),
                    'provinciaNacimientoOtro' => $solicitud->provincia_nacimiento_otro,
                    'cantonNacimiento' => $this->normalizeSelectValue($solicitud->canton_nacimiento, []), // Canton names vary, normalize to Title Case
                    'cantonNacimientoOtro' => $solicitud->canton_nacimiento_otro,
                    'cantonCodigo' => $solicitud->canton_codigo,
                    'fechaNacimiento' => $solicitud->fecha_nacimiento,
                    'edad' => $solicitud->edad,
                    'tipoSangre' => $solicitud->tipo_sangre,
                    'estatura' => $solicitud->estatura,
                    'peso' => $solicitud->peso,
                    'religion' => $solicitud->religion,
                    'correo' => $solicitud->correo,
                    'vacunaCovid1' => (bool)$solicitud->vacuna_covid_1,
                    'vacunaCovid2' => (bool)$solicitud->vacuna_covid_2,
                    'vacunaCovid3' => (bool)$solicitud->vacuna_covid_3,
                    'afiliadoIess' => (bool)$solicitud->afiliado_iess,
                ],
                'documentacion' => [
                    'cedula_cant' => $solicitud->doc_cedula_cant,
                    'certificado_votacion_cant' => $solicitud->doc_certificado_votacion_cant,
                    'libreta_militar_cant' => $solicitud->doc_libreta_militar_cant,
                    'certificado_iess_cant' => $solicitud->doc_certificado_iess_cant,
                    'certificado_laboral_cant' => $solicitud->doc_certificado_laboral_cant,
                    'fotos_cant' => $solicitud->doc_fotos_cant,
                ],
                'datosReferenciales' => [
                    'direccion' => $solicitud->referencial_direccion,
                    'ciudad' => $this->normalizeSelectValue($solicitud->referencial_ciudad, []),
                    'ciudadOtro' => $solicitud->referencial_ciudad_otro,
                    'ciudadCodigo' => $solicitud->referencial_ciudad_codigo,
                    'provincia' => $this->normalizeSelectValue($solicitud->referencial_provincia, $provinciasEcuador),
                    'provinciaOtro' => $solicitud->referencial_provincia_otro,
                    'telefono_principal' => $solicitud->referencial_telefono_principal,
                    'telefono_secundario' => $solicitud->referencial_telefono_secundario,
                    'vivienda_material' => $this->normalizeSelectValue($solicitud->referencial_vivienda_material, $materialesVivienda),
                    'vivienda_condicion' => strtoupper($solicitud->referencial_vivienda_condicion),
                    'cantidad_familiares' => $solicitud->referencial_cantidad_familiares,
                    'familiares_relacion' => $solicitud->referencial_familiares_relacion,
                    'telefono_emergencia' => $solicitud->referencial_telefono_emergencia,
                    'nombre_contacto_emergencia' => $solicitud->referencial_nombre_contacto_emergencia,
                    'servicios_basicos' => [
                        'agua' => (bool)$solicitud->referencial_servicio_agua,
                        'luz' => (bool)$solicitud->referencial_servicio_luz,
                        'telefono' => (bool)$solicitud->referencial_servicio_telefono,
                    ]
                ],
                'estadoCivil' => [
                    'estado_civil' => strtoupper($solicitud->estado_civil),
                    'tiempo_estado_civil_valor' => $solicitud->estado_civil_tiempo_valor,
                    'tiempo_estado_civil_unidad' => strtoupper($solicitud->estado_civil_tiempo_unidad),
                    'tipo_matrimonio' => strtoupper($solicitud->estado_civil_tipo_matrimonio),
                    'demandas' => $solicitud->estado_civil_demandas,
                    'compromisos_anteriores' => $solicitud->estado_civil_compromisos_anteriores,
                ],
                'datosFamiliares' => [
                    'padre' => [
                        'nombre' => $solicitud->padre_nombre,
                        'estado' => $solicitud->padre_estado,
                        'edad' => $solicitud->padre_edad,
                        'domicilio' => $solicitud->padre_domicilio,
                        'ocupacion' => $solicitud->padre_ocupacion,
                    ],
                    'madre' => [
                        'nombre' => $solicitud->madre_nombre,
                        'estado' => $solicitud->madre_estado,
                        'edad' => $solicitud->madre_edad,
                        'domicilio' => $solicitud->madre_domicilio,
                        'ocupacion' => $solicitud->madre_ocupacion,
                    ],
                    'conyuge_actual' => [
                        'nombre' => $solicitud->conyuge_nombre,
                        'estado' => $solicitud->conyuge_estado,
                        'edad' => $solicitud->conyuge_edad,
                        'domicilio' => $solicitud->conyuge_domicilio,
                        'ocupacion' => $solicitud->conyuge_ocupacion,
                    ],
                    'hermanos' => $solicitud->hermanos->map(function ($h) {
                return [
                'nombre' => $h->nombre,
                'genero' => $h->genero ?? 'MASCULINO',
                'estado' => $h->estado ?? 'VIVO',
                'edad' => $h->edad,
                'domicilio' => $h->domicilio,
                'ocupacion' => $h->ocupacion,
                ];
            }),
                    'hijos' => $solicitud->hijos->map(function ($h) {
                return [
                'nombre' => $h->nombre,
                'edad' => $h->edad,
                'ocupacion' => $h->ocupacion,
                'discapacidad' => (bool)$h->discapacidad,
                'descripcion_discapacidad' => $h->descripcion_discapacidad,
                ];
            }),
                    'conyuges_anteriores' => $solicitud->conyugesAnteriores->map(function ($c) {
                return [
                'nombre' => $c->nombre,
                'domicilio' => $c->domicilio,
                'ocupacion' => $c->ocupacion,
                'edad' => $c->edad,
                'genero' => $c->genero ?? 'FEMENINO',
                'estado' => $c->estado ?? 'VIVO',
                ];
            }),
                ],
                'datosEducativos' => [
                    'nivel_maximo' => $solicitud->edu_nivel_maximo,
                    'inicial' => [
                        'institucion' => $solicitud->edu_inicial_institucion,
                        'anio' => $solicitud->edu_inicial_anio,
                    ],
                    'basica' => [
                        'institucion' => $solicitud->edu_basica_institucion,
                        'ultimo_grado' => $solicitud->edu_basica_grado,
                        'anio' => $solicitud->edu_basica_anio,
                    ],
                    'bachillerato' => [
                        'institucion' => $solicitud->edu_bachillerato_institucion,
                        'titulo' => $solicitud->edu_bachillerato_titulo,
                        'anio' => $solicitud->edu_bachillerato_anio,
                    ],
                    'superior' => [
                        'institucion' => $solicitud->edu_superior_institucion,
                        'tipo' => $solicitud->edu_superior_tipo,
                        'nivel' => $solicitud->edu_superior_nivel,
                        'carrera_programa' => $solicitud->edu_superior_carrera,
                        'estado' => $solicitud->edu_superior_estado,
                        'anio' => $solicitud->edu_superior_anio,
                    ],
                    'cursos' => $solicitud->cursos->map(function ($c) {
                return [
                'nombre' => $c->nombre_curso,
                'institucion' => $c->institucion,
                'duracion' => $c->duracion,
                'anio' => $c->anio,
                ];
            }),
                ],
                'experienciaLaboral' => [
                    'sin_experiencia' => (bool)$solicitud->exp_sin_experiencia,
                    'descripcion_labores' => $solicitud->exp_descripcion_labores,
                    'experiencias' => $solicitud->experiencias->map(function ($e) {
                return [
                'empresa' => $e->empresa,
                'area' => $e->area,
                'cargo' => $e->cargo,
                'jefe_inmediato' => $e->jefe_inmediato,
                'fecha_inicio' => $e->fecha_inicio ?? (str_contains($e->tiempo ?? '', '-') ? trim(explode('-', $e->tiempo)[0]) : $e->tiempo),
                'fecha_fin' => $e->fecha_fin ?? (str_contains($e->tiempo ?? '', '-') ? trim(explode('-', $e->tiempo)[1] ?? '') : ''),
                'motivo_salida' => $e->motivo_salida ?? $e->causa_salida,
                'actualmente' => (bool)$e->actualmente || str_contains(strtoupper($e->tiempo ?? ''), 'ACTUAL'),
                ];
            }),
                ],
                'saludPersonal' => [
                    'operaciones' => [
                        'aplica' => (bool)$solicitud->salud_operaciones,
                        'detalle' => $solicitud->salud_operaciones_detalle
                    ],
                    'fracturas' => [
                        'aplica' => (bool)$solicitud->salud_fracturas,
                        'detalle' => $solicitud->salud_fracturas_detalle
                    ],
                    'quemaduras' => [
                        'aplica' => (bool)$solicitud->salud_quemaduras,
                        'detalle' => $solicitud->salud_quemaduras_detalle
                    ],
                    'accidentes_laborales' => [
                        'aplica' => (bool)$solicitud->salud_accidentes_laborales,
                        'detalle' => $solicitud->salud_accidentes_laborales_detalle
                    ],
                    'otros_antecedentes' => $solicitud->salud_otros_antecedentes,
                    'deporte' => $solicitud->salud_deporte,
                    'actividad_social' => $solicitud->salud_actividad_social
                ],
                'referenciasLaborales' => $solicitud->referenciasLaborales->map(function ($r) {
                return [
                'empresa' => $r->empresa,
                'nombre' => $r->nombre ?? $r->contacto_nombre,
                'cargo' => $r->cargo,
                'telefono' => $r->telefono
                ];
            }),
                'referenciasPersonales' => $solicitud->referenciasPersonales->map(function ($r) {
                return [
                'nombre' => $r->nombre,
                'cargo' => $r->cargo ?? $r->ocupacion,
                'empresa' => $r->empresa,
                'telefono' => $r->telefono
                ];
            }),
                'familiaresEnEmpresa' => $solicitud->familiaresEmpresa->map(function ($f) use ($empresasValidas) {
                return [
                'nombre' => $f->nombre,
                'empresa' => $this->normalizeSelectValue($f->empresa, $empresasValidas),
                'cargo' => $f->cargo,
                'parentesco' => $f->parentesco,
                'area' => $f->area,
                'telefono' => $f->telefono
                ];
            }),
                'observaciones' => $solicitud->observaciones->map(function ($o) {
                return [
                'id' => $o->id,
                'tipo' => $o->tipo,
                'comentario' => $o->comentario,
                'usuario' => $o->usuario ?? $o->usuario_nombre,
                'fecha' => $o->fecha
                ];
            }),
                'datosEntrevistador' => [
                    'entrevistador' => [
                        'nombre' => $solicitud->responsable_nombre,
                        'grupo' => $solicitud->responsable_grupo,
                        'fecha' => $solicitud->fecha_entrevista
                    ],
                    'aprobacion' => [
                        'estado' => $solicitud->estado_solicitud,
                        'aprobado_por' => $solicitud->aprobado_por,
                        'grupo' => $solicitud->aprobacion_grupo,
                        'fecha' => $solicitud->aprobacion_fecha,
                    ]
                ]
            ];

            return response()->json($data);
        }
        catch (\Exception $e) {
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

            // REGLA DE NEGOCIO: No permitir edición si ya fue aprobado 
            if ($solicitud->estado_solicitud === 'APROBADO') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede editar una solicitud en estado APROBADO.'
                ], 403);
            }

            return DB::transaction(function () use ($request, $solicitud, $id) {

                // EXTRACCIÓN Y CONVERSIÓN A MAYÚSCULAS
                $allInput = $this->convertToUppercase($request->all());

                // EXTRACCIÓN Y MAPEO (Idéntico a store pero para actualización)
                // Usamos mapeo condicional para permitir guardado progresivo por secciones.
                $solicitudData = [];

                // Si no tiene código, generarlo ahora (para registros antiguos)
                if (empty($solicitud->codigo_solicitud)) {
                    $solicitudData['codigo_solicitud'] = $this->generateCodigoSolicitud();
                }

                if (isset($allInput['datosAdministrativos'])) {
                    $datosAdmin = $allInput['datosAdministrativos'];

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
                        $solicitudData['banco_tipo_cuenta'] = $datosAdmin['banking_info']['tipo_cuenta'] ?? $solicitud->banco_tipo_cuenta;
                        $solicitudData['banco_titular'] = $datosAdmin['banking_info']['titular'] ?? $solicitud->banco_titular;
                    }

                    if (isset($datosAdmin['fechas_control'])) {
                        $solicitudData['fecha_revision_guayaquil'] = $datosAdmin['fechas_control']['fecha_revision_guayaquil'] ?? $solicitud->fecha_revision_guayaquil;
                        if (array_key_exists('reingreso_fecha', $datosAdmin['fechas_control']))
                            $solicitudData['reingreso_fecha'] = $datosAdmin['fechas_control']['reingreso_fecha'];
                        if (array_key_exists('fecha_salida', $datosAdmin['fechas_control']))
                            $solicitudData['fecha_salida'] = $datosAdmin['fechas_control']['fecha_salida'];
                    }

                    if (isset($datosAdmin['condiciones'])) {
                        $solicitudData['condiciones_tipo_contrato'] = $datosAdmin['condiciones']['tipo_contrato'] ?? $solicitud->condiciones_tipo_contrato;
                        $solicitudData['condiciones_transporte'] = $datosAdmin['condiciones']['transporte'] ?? $solicitud->condiciones_transporte;
                        $solicitudData['condiciones_recorrido'] = $datosAdmin['condiciones']['recorrido'] ?? $solicitud->condiciones_recorrido;
                        if (array_key_exists('recorrido_otro', $datosAdmin['condiciones']))
                            $solicitudData['condiciones_recorrido_otro'] = $datosAdmin['condiciones']['recorrido_otro'];
                        $solicitudData['condiciones_vehiculo'] = $datosAdmin['condiciones']['vehiculo'] ?? $solicitud->condiciones_vehiculo;
                        $solicitudData['condiciones_licencia'] = $datosAdmin['condiciones']['licencia'] ?? $solicitud->condiciones_licencia;
                        if (array_key_exists('licencia_tipo', $datosAdmin['condiciones']))
                            $solicitudData['condiciones_licencia_tipo'] = $datosAdmin['condiciones']['licencia_tipo'];
                        $solicitudData['condiciones_acumulacion_decimos'] = $datosAdmin['condiciones']['acumulacion_decimos'] ?? $solicitud->condiciones_acumulacion_decimos;
                        $solicitudData['condiciones_semana_completa'] = $datosAdmin['condiciones']['semana_completa'] ?? $solicitud->condiciones_semana_completa;
                        $solicitudData['condiciones_solo_proceso'] = $datosAdmin['condiciones']['solo_proceso'] ?? $solicitud->condiciones_solo_proceso;
                        $solicitudData['condiciones_almuerzo'] = $datosAdmin['condiciones']['almuerzo'] ?? $solicitud->condiciones_almuerzo;
                    }

                    if (isset($datosAdmin['control_interno'])) {
                        if (array_key_exists('responsable_id', $datosAdmin['control_interno']))
                            $solicitudData['responsable_id'] = $datosAdmin['control_interno']['responsable_id'];
                        if (array_key_exists('responsable_nombre', $datosAdmin['control_interno']))
                            $solicitudData['responsable_nombre'] = $datosAdmin['control_interno']['responsable_nombre'];
                        if (array_key_exists('responsable_grupo', $datosAdmin['control_interno']))
                            $solicitudData['responsable_grupo'] = $datosAdmin['control_interno']['responsable_grupo'];
                        if (array_key_exists('fecha_entrevista', $datosAdmin['control_interno']))
                            $solicitudData['fecha_entrevista'] = $this->parseDate($datosAdmin['control_interno']['fecha_entrevista']);
                    }
                }

                if (isset($allInput['datosPersonales'])) {
                    $datosPers = $allInput['datosPersonales'];
                    $solicitudData['apellido_paterno'] = $datosPers['apellidoPaterno'] ?? $solicitud->apellido_paterno;
                    $solicitudData['apellido_materno'] = $datosPers['apellidoMaterno'] ?? $solicitud->apellido_materno;
                    $solicitudData['nombres'] = $datosPers['nombres'] ?? $solicitud->nombres;
                    $solicitudData['cedula'] = $datosPers['cedula'] ?? $solicitud->cedula;
                    if (array_key_exists('apodo', $datosPers))
                        $solicitudData['apodo'] = $datosPers['apodo'];
                    $solicitudData['genero'] = $datosPers['genero'] ?? $solicitud->genero;
                    $solicitudData['tiene_discapacidad'] = isset($datosPers['tieneDiscapacidad']) ? filter_var($datosPers['tieneDiscapacidad'], FILTER_VALIDATE_BOOLEAN) : $solicitud->tiene_discapacidad;
                    if (array_key_exists('discapacidadDetalle', $datosPers))
                        $solicitudData['discapacidad_detalle'] = $datosPers['discapacidadDetalle'];
                    $solicitudData['pais_nacimiento'] = $datosPers['paisNacimiento'] ?? $solicitud->pais_nacimiento;
                    if (array_key_exists('paisNacimientoOtro', $datosPers))
                        $solicitudData['pais_nacimiento_otro'] = $datosPers['paisNacimientoOtro'];
                    $solicitudData['provincia_nacimiento'] = $datosPers['provinciaNacimiento'] ?? $solicitud->provincia_nacimiento;
                    if (array_key_exists('provinciaNacimientoOtro', $datosPers))
                        $solicitudData['provincia_nacimiento_otro'] = $datosPers['provinciaNacimientoOtro'];
                    if (array_key_exists('cantonNacimiento', $datosPers))
                        $solicitudData['canton_nacimiento'] = $datosPers['cantonNacimiento'];
                    if (array_key_exists('cantonNacimientoOtro', $datosPers))
                        $solicitudData['canton_nacimiento_otro'] = $datosPers['cantonNacimientoOtro'];
                    if (array_key_exists('cantonCodigo', $datosPers))
                        $solicitudData['canton_codigo'] = $datosPers['cantonCodigo'];
                    $solicitudData['fecha_nacimiento'] = $datosPers['fechaNacimiento'] ?? $solicitud->fecha_nacimiento;
                    $solicitudData['edad'] = $datosPers['edad'] ?? $solicitud->edad;
                    $solicitudData['tipo_sangre'] = $datosPers['tipoSangre'] ?? $solicitud->tipo_sangre;
                    $solicitudData['estatura'] = $datosPers['estatura'] ?? $solicitud->estatura;
                    $solicitudData['peso'] = $datosPers['peso'] ?? $solicitud->peso;
                    if (array_key_exists('religion', $datosPers))
                        $solicitudData['religion'] = $datosPers['religion'];
                    $solicitudData['correo'] = $datosPers['correo'] ?? $solicitud->correo;
                    if (array_key_exists('vacunaCovid1', $datosPers))
                        $solicitudData['vacuna_covid_1'] = filter_var($datosPers['vacunaCovid1'], FILTER_VALIDATE_BOOLEAN);
                    if (array_key_exists('vacunaCovid2', $datosPers))
                        $solicitudData['vacuna_covid_2'] = filter_var($datosPers['vacunaCovid2'], FILTER_VALIDATE_BOOLEAN);
                    if (array_key_exists('vacunaCovid3', $datosPers))
                        $solicitudData['vacuna_covid_3'] = filter_var($datosPers['vacunaCovid3'], FILTER_VALIDATE_BOOLEAN);
                    $solicitudData['afiliado_iess'] = $datosPers['afiliadoIess'] ?? $solicitud->afiliado_iess;
                }

                if (isset($allInput['documentacion'])) {
                    $doc = $allInput['documentacion'];
                    $solicitudData['doc_cedula_cant'] = $doc['cedula_cant'] ?? $solicitud->doc_cedula_cant;
                    $solicitudData['doc_certificado_votacion_cant'] = $doc['certificado_votacion_cant'] ?? $solicitud->doc_certificado_votacion_cant;
                    if (array_key_exists('libreta_militar_cant', $doc))
                        $solicitudData['doc_libreta_militar_cant'] = $doc['libreta_militar_cant'];
                    if (array_key_exists('certificado_iess_cant', $doc))
                        $solicitudData['doc_certificado_iess_cant'] = $doc['certificado_iess_cant'];
                    if (array_key_exists('certificado_laboral_cant', $doc))
                        $solicitudData['doc_certificado_laboral_cant'] = $doc['certificado_laboral_cant'];
                    if (array_key_exists('fotos_cant', $doc))
                        $solicitudData['doc_fotos_cant'] = $doc['fotos_cant'];
                }

                if (isset($allInput['datosReferenciales'])) {
                    $datosRef = $allInput['datosReferenciales'];
                    $solicitudData['referencial_direccion'] = $datosRef['direccion'] ?? $solicitud->referencial_direccion;
                    $solicitudData['referencial_ciudad'] = $datosRef['ciudad'] ?? $solicitud->referencial_ciudad;
                    if (array_key_exists('ciudadOtro', $datosRef))
                        $solicitudData['referencial_ciudad_otro'] = $datosRef['ciudadOtro'];
                    if (array_key_exists('ciudadCodigo', $datosRef))
                        $solicitudData['referencial_ciudad_codigo'] = $datosRef['ciudadCodigo'];
                    if (array_key_exists('provincia', $datosRef))
                        $solicitudData['referencial_provincia'] = $datosRef['provincia'];
                    if (array_key_exists('provinciaOtro', $datosRef))
                        $solicitudData['referencial_provincia_otro'] = $datosRef['provinciaOtro'];
                    $solicitudData['referencial_telefono_principal'] = $datosRef['telefono_principal'] ?? $solicitud->referencial_telefono_principal;
                    if (array_key_exists('telefono_secundario', $datosRef))
                        $solicitudData['referencial_telefono_secundario'] = $datosRef['telefono_secundario'];
                    $solicitudData['referencial_vivienda_material'] = $datosRef['vivienda_material'] ?? $solicitud->referencial_vivienda_material;
                    $solicitudData['referencial_vivienda_condicion'] = $datosRef['vivienda_condicion'] ?? $solicitud->referencial_vivienda_condicion;
                    $solicitudData['referencial_cantidad_familiares'] = $datosRef['cantidad_familiares'] ?? $solicitud->referencial_cantidad_familiares;
                    $solicitudData['referencial_familiares_relacion'] = $datosRef['familiares_relacion'] ?? $solicitud->referencial_familiares_relacion;
                    $solicitudData['referencial_telefono_emergencia'] = $datosRef['telefono_emergencia'] ?? $solicitud->referencial_telefono_emergencia;
                    $solicitudData['referencial_nombre_contacto_emergencia'] = $datosRef['nombre_contacto_emergencia'] ?? $solicitud->referencial_nombre_contacto_emergencia;

                    if (isset($datosRef['servicios_basicos'])) {
                        if (array_key_exists('agua', $datosRef['servicios_basicos']))
                            $solicitudData['referencial_servicio_agua'] = filter_var($datosRef['servicios_basicos']['agua'], FILTER_VALIDATE_BOOLEAN);
                        if (array_key_exists('luz', $datosRef['servicios_basicos']))
                            $solicitudData['referencial_servicio_luz'] = filter_var($datosRef['servicios_basicos']['luz'], FILTER_VALIDATE_BOOLEAN);
                        if (array_key_exists('telefono', $datosRef['servicios_basicos']))
                            $solicitudData['referencial_servicio_telefono'] = filter_var($datosRef['servicios_basicos']['telefono'], FILTER_VALIDATE_BOOLEAN);
                    }
                }

                if (isset($allInput['estadoCivil'])) {
                    $estadoCivil = $allInput['estadoCivil'];
                    $solicitudData['estado_civil'] = $estadoCivil['estado_civil'] ?? $solicitud->estado_civil;
                    if (array_key_exists('tiempo_estado_civil_valor', $estadoCivil))
                        $solicitudData['estado_civil_tiempo_valor'] = $estadoCivil['tiempo_estado_civil_valor'];
                    if (array_key_exists('tiempo_estado_civil_unidad', $estadoCivil))
                        $solicitudData['estado_civil_tiempo_unidad'] = $estadoCivil['tiempo_estado_civil_unidad'];
                    // Columnas correctas en la BD: estado_civil_tipo_matrimonio, estado_civil_demandas, estado_civil_compromisos_anteriores
                    if (array_key_exists('tipo_matrimonio', $estadoCivil))
                        $solicitudData['estado_civil_tipo_matrimonio'] = $estadoCivil['tipo_matrimonio'];
                    if (array_key_exists('demandas', $estadoCivil))
                        $solicitudData['estado_civil_demandas'] = $estadoCivil['demandas'];
                    if (array_key_exists('compromisos_anteriores', $estadoCivil))
                        $solicitudData['estado_civil_compromisos_anteriores'] = $estadoCivil['compromisos_anteriores'];
                }

                if (isset($allInput['datosFamiliares'])) {
                    $datosFam = $allInput['datosFamiliares'];

                    Log::info('Actualizando datos familiares para solicitud ' . $id);

                    if (isset($datosFam['padre'])) {
                        $p = $datosFam['padre'];
                        if (array_key_exists('nombre', $p))
                            $solicitudData['padre_nombre'] = $p['nombre'];
                        if (array_key_exists('estado', $p))
                            $solicitudData['padre_estado'] = $p['estado'];
                        if (array_key_exists('edad', $p))
                            $solicitudData['padre_edad'] = $p['edad'];
                        if (array_key_exists('domicilio', $p))
                            $solicitudData['padre_domicilio'] = $p['domicilio'];
                        if (array_key_exists('ocupacion', $p))
                            $solicitudData['padre_ocupacion'] = $p['ocupacion'];
                    }

                    if (isset($datosFam['madre'])) {
                        $m = $datosFam['madre'];
                        if (array_key_exists('nombre', $m))
                            $solicitudData['madre_nombre'] = $m['nombre'];
                        if (array_key_exists('estado', $m))
                            $solicitudData['madre_estado'] = $m['estado'];
                        if (array_key_exists('edad', $m))
                            $solicitudData['madre_edad'] = $m['edad'];
                        if (array_key_exists('domicilio', $m))
                            $solicitudData['madre_domicilio'] = $m['domicilio'];
                        if (array_key_exists('ocupacion', $m))
                            $solicitudData['madre_ocupacion'] = $m['ocupacion'];
                    }

                    if (isset($datosFam['conyuge_actual'])) {
                        $c = $datosFam['conyuge_actual'];
                        if (array_key_exists('nombre', $c))
                            $solicitudData['conyuge_nombre'] = $c['nombre'];
                        if (array_key_exists('estado', $c))
                            $solicitudData['conyuge_estado'] = $c['estado'];
                        if (array_key_exists('edad', $c))
                            $solicitudData['conyuge_edad'] = $c['edad'];
                        if (array_key_exists('domicilio', $c))
                            $solicitudData['conyuge_domicilio'] = $c['domicilio'];
                        if (array_key_exists('ocupacion', $c))
                            $solicitudData['conyuge_ocupacion'] = $c['ocupacion'];
                    }

                    if (isset($datosFam['hermanos']) && is_array($datosFam['hermanos'])) {
                        $solicitud->hermanos()->delete();
                        foreach ($datosFam['hermanos'] as $h) {
                            $solicitud->hermanos()->create([
                                'nombre' => $h['nombre'],
                                'genero' => $h['genero'] ?? null,
                                'estado' => $h['estado'] ?? null,
                                'edad' => $h['edad'] ?? null,
                                'domicilio' => $h['domicilio'] ?? null,
                                'ocupacion' => $h['ocupacion'] ?? null
                            ]);
                        }
                    }

                    if (isset($datosFam['hijos']) && is_array($datosFam['hijos'])) {
                        $solicitud->hijos()->delete();
                        foreach ($datosFam['hijos'] as $h) {
                            $solicitud->hijos()->create([
                                'nombre' => $h['nombre'],
                                'edad' => $h['edad'] ?? null,
                                'ocupacion' => $h['ocupacion'] ?? null,
                                'discapacidad' => filter_var($h['discapacidad'] ?? false, FILTER_VALIDATE_BOOLEAN),
                                'descripcion_discapacidad' => $h['descripcion_discapacidad'] ?? null
                            ]);
                        }
                    }

                    if (isset($datosFam['conyuges_anteriores']) && is_array($datosFam['conyuges_anteriores'])) {
                        $solicitud->conyugesAnteriores()->delete();
                        foreach ($datosFam['conyuges_anteriores'] as $c) {
                            $solicitud->conyugesAnteriores()->create([
                                'nombre' => $c['nombre'],
                                'domicilio' => $c['domicilio'] ?? null,
                                'ocupacion' => $c['ocupacion'] ?? null,
                                'edad' => $c['edad'] ?? null,
                                'genero' => $c['genero'] ?? null,
                                'estado' => $c['estado'] ?? null,
                            ]);
                        }
                    }
                }

                if (isset($allInput['datosEducativos'])) {
                    $datosEdu = $allInput['datosEducativos'];
                    $solicitudData['edu_nivel_maximo'] = $datosEdu['nivel_maximo'] ?? $solicitud->edu_nivel_maximo;

                    if (isset($datosEdu['inicial'])) {
                        if (array_key_exists('institucion', $datosEdu['inicial']))
                            $solicitudData['edu_inicial_institucion'] = $datosEdu['inicial']['institucion'];
                        if (array_key_exists('anio', $datosEdu['inicial']))
                            $solicitudData['edu_inicial_anio'] = $datosEdu['inicial']['anio'];
                    }
                    if (isset($datosEdu['basica'])) {
                        if (array_key_exists('institucion', $datosEdu['basica']))
                            $solicitudData['edu_basica_institucion'] = $datosEdu['basica']['institucion'];
                        if (array_key_exists('grado', $datosEdu['basica']))
                            $solicitudData['edu_basica_grado'] = $datosEdu['basica']['grado'];
                        if (array_key_exists('anio', $datosEdu['basica']))
                            $solicitudData['edu_basica_anio'] = $datosEdu['basica']['anio'];
                    }
                    if (isset($datosEdu['bachillerato'])) {
                        if (array_key_exists('institucion', $datosEdu['bachillerato']))
                            $solicitudData['edu_bachillerato_institucion'] = $datosEdu['bachillerato']['institucion'];
                        if (array_key_exists('titulo', $datosEdu['bachillerato']))
                            $solicitudData['edu_bachillerato_titulo'] = $datosEdu['bachillerato']['titulo'];
                        if (array_key_exists('anio', $datosEdu['bachillerato']))
                            $solicitudData['edu_bachillerato_anio'] = $datosEdu['bachillerato']['anio'];
                    }
                    if (isset($datosEdu['superior'])) {
                        if (array_key_exists('institucion', $datosEdu['superior']))
                            $solicitudData['edu_superior_institucion'] = $datosEdu['superior']['institucion'];
                        if (array_key_exists('tipo', $datosEdu['superior']))
                            $solicitudData['edu_superior_tipo'] = $datosEdu['superior']['tipo'];
                        if (array_key_exists('nivel', $datosEdu['superior']))
                            $solicitudData['edu_superior_nivel'] = $datosEdu['superior']['nivel'];
                        if (array_key_exists('carrera_programa', $datosEdu['superior']))
                            $solicitudData['edu_superior_carrera'] = $datosEdu['superior']['carrera_programa'];
                        if (array_key_exists('estado', $datosEdu['superior']))
                            $solicitudData['edu_superior_estado'] = $datosEdu['superior']['estado'];
                        if (array_key_exists('anio', $datosEdu['superior']))
                            $solicitudData['edu_superior_anio'] = $datosEdu['superior']['anio'];
                    }

                    if (isset($datosEdu['cursos']) && is_array($datosEdu['cursos'])) {
                        $solicitud->cursos()->delete();
                        foreach ($datosEdu['cursos'] as $c) {
                            $solicitud->cursos()->create([
                                'institucion' => $c['institucion'],
                                'nombre_curso' => $c['nombre'] ?? $c['nombre_curso'] ?? null,
                                'duracion' => $c['duracion'] ?? null,
                                'anio' => $c['anio']
                            ]);
                        }
                    }
                }

                if (isset($allInput['experienciaLaboral'])) {
                    $expLab = $allInput['experienciaLaboral'];
                    $solicitudData['exp_sin_experiencia'] = $expLab['sin_experiencia'] ?? $solicitud->exp_sin_experiencia;
                    $solicitudData['exp_descripcion_labores'] = $expLab['descripcion_labores'] ?? $solicitud->exp_descripcion_labores;

                    if (isset($expLab['experiencias']) && is_array($expLab['experiencias'])) {
                        $solicitud->experiencias()->delete();
                        foreach ($expLab['experiencias'] as $e) {
                            $solicitud->experiencias()->create([
                                'empresa' => $e['empresa'],
                                'area' => $e['area'] ?? null,
                                'cargo' => $e['cargo'] ?? null,
                                'jefe_inmediato' => $e['jefe_inmediato'] ?? null,
                                'fecha_inicio' => $e['fecha_inicio'] ?? null,
                                'fecha_fin' => $e['fecha_fin'] ?? null,
                                'causa_salida' => $e['motivo_salida'] ?? $e['causa_salida'] ?? null,
                                'tiempo' => ($e['fecha_inicio'] ?? '') . ' - ' . ($e['actualmente'] ? 'ACTUAL' : ($e['fecha_fin'] ?? ''))
                            ]);
                        }
                    }
                }

                if (isset($allInput['saludPersonal'])) {
                    $salud = $allInput['saludPersonal'];
                    $solicitudData['salud_operaciones'] = isset($salud['operaciones']['aplica']) ? filter_var($salud['operaciones']['aplica'], FILTER_VALIDATE_BOOLEAN) : $solicitud->salud_operaciones;
                    if (array_key_exists('detalle', $salud['operaciones'] ?? []))
                        $solicitudData['salud_operaciones_detalle'] = $salud['operaciones']['detalle'];
                        
                    $solicitudData['salud_fracturas'] = isset($salud['fracturas']['aplica']) ? filter_var($salud['fracturas']['aplica'], FILTER_VALIDATE_BOOLEAN) : $solicitud->salud_fracturas;
                    if (array_key_exists('detalle', $salud['fracturas'] ?? []))
                        $solicitudData['salud_fracturas_detalle'] = $salud['fracturas']['detalle'];
                        
                    $solicitudData['salud_quemaduras'] = isset($salud['quemaduras']['aplica']) ? filter_var($salud['quemaduras']['aplica'], FILTER_VALIDATE_BOOLEAN) : $solicitud->salud_quemaduras;
                    if (array_key_exists('detalle', $salud['quemaduras'] ?? []))
                        $solicitudData['salud_quemaduras_detalle'] = $salud['quemaduras']['detalle'];
                        
                    $solicitudData['salud_accidentes_laborales'] = isset($salud['accidentes_laborales']['aplica']) ? filter_var($salud['accidentes_laborales']['aplica'], FILTER_VALIDATE_BOOLEAN) : $solicitud->salud_accidentes_laborales;
                    if (array_key_exists('detalle', $salud['accidentes_laborales'] ?? []))
                        $solicitudData['salud_accidentes_laborales_detalle'] = $salud['accidentes_laborales']['detalle'];
                        
                    if (array_key_exists('otros_antecedentes', $salud))
                        $solicitudData['salud_otros_antecedentes'] = $salud['otros_antecedentes'];
                    if (array_key_exists('deporte', $salud))
                        $solicitudData['salud_deporte'] = $salud['deporte'];
                    if (array_key_exists('actividad_social', $salud))
                        $solicitudData['salud_actividad_social'] = $salud['actividad_social'];
                }

                if (isset($allInput['datosEntrevistador'])) {
                    $entrevista = $allInput['datosEntrevistador'];
                    if (array_key_exists('aprobacion', $entrevista)) {
                        $aprob = $entrevista['aprobacion'];
                        if (array_key_exists('aprobado_por', $aprob))
                            $solicitudData['aprobado_por'] = $aprob['aprobado_por'];
                        if (array_key_exists('grupo', $aprob))
                            $solicitudData['aprobacion_grupo'] = $aprob['grupo'];
                        if (array_key_exists('fecha', $aprob))
                            $solicitudData['aprobacion_fecha'] = $aprob['fecha'];
                    }
                }

                if (isset($allInput['referenciasLaborales']) && is_array($allInput['referenciasLaborales'])) {
                    $solicitud->referenciasLaborales()->delete();
                    foreach ($allInput['referenciasLaborales'] as $r) {
                        $solicitud->referenciasLaborales()->create([
                            'empresa' => $r['empresa'] ?? null,
                            'contacto_nombre' => $r['contacto_nombre'] ?? ($r['nombre'] ?? null),
                            'cargo' => $r['cargo'] ?? null,
                            'telefono' => $r['telefono'] ?? null,
                        ]);
                    }
                }

                if (isset($allInput['referenciasPersonales']) && is_array($allInput['referenciasPersonales'])) {
                    $solicitud->referenciasPersonales()->delete();
                    foreach ($allInput['referenciasPersonales'] as $r) {
                        $solicitud->referenciasPersonales()->create([
                            'nombre' => $r['nombre'] ?? null,
                            'telefono' => $r['telefono'] ?? null,
                            'ocupacion' => $r['cargo'] ?? $r['ocupacion'] ?? null,
                            'empresa' => $r['empresa'] ?? null,
                            'cargo' => $r['cargo'] ?? null,
                        ]);
                    }
                }

                if (isset($allInput['familiaresEnEmpresa']) && is_array($allInput['familiaresEnEmpresa'])) {
                    $solicitud->familiaresEmpresa()->delete();
                    foreach ($allInput['familiaresEnEmpresa'] as $f) {
                        $solicitud->familiaresEmpresa()->create([
                            'nombre' => $f['nombre'] ?? null,
                            'empresa' => $f['empresa'] ?? null,
                            'cargo' => $f['cargo'] ?? null,
                            'parentesco' => $f['parentesco'] ?? null,
                            'area' => $f['area'] ?? null,
                            'telefono' => $f['telefono'] ?? null,
                        ]);
                    }
                }

                if (isset($allInput['observaciones']) && is_array($allInput['observaciones'])) {
                    $solicitud->observaciones()->delete();
                    foreach ($allInput['observaciones'] as $o) {
                        $solicitud->observaciones()->create(['tipo' => $o['tipo'], 'comentario' => $o['comentario'], 'usuario_nombre' => $o['usuario_nombre'] ?? ($o['usuario'] ?? null), 'fecha' => $o['fecha'] ?? now()]);
                    }
                }

                $solicitud->update($solicitudData);

                return response()->json(['message' => 'Solicitud actualizada correctamente']);
            });
        }
        catch (\Exception $e) {
            Log::error('Error al actualizar solicitud: ' . $e->getMessage());
            return response()->json(['error' => 'No se pudo actualizar la solicitud', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza el estado de una solicitud y ejecuta la contratación si el estado es APROBADO.
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|string|in:BORRADOR,PENDIENTE,EN_REVISION,APROBADO,RECHAZADO',
            'aprobado_por' => 'nullable|string|max:100',
            'aprobacion_grupo' => 'nullable|string|max:100'
        ]);

        $nuevoEstado = $request->input('estado');
        $aprobadoPor = $request->input('aprobado_por', 'SISTEMA');
        $aprobacionGrupo = $request->input('aprobacion_grupo', 'TALENTO HUMANO');

        try {
            return DB::transaction(function () use ($id, $nuevoEstado, $aprobadoPor, $aprobacionGrupo) {
                $solicitud = SolicitudEmpleo::findOrFail($id);
                $estadoActual = $solicitud->estado_solicitud;

                // 1. Validar transiciones permitidas
                $transiciones = [
                    'BORRADOR' => ['PENDIENTE', 'EN_REVISION', 'RECHAZADO'],
                    'PENDIENTE' => ['EN_REVISION', 'RECHAZADO'],
                    'EN_REVISION' => ['APROBADO', 'RECHAZADO'],
                    'APROBADO' => [], // Estado terminal: no se puede cambiar si ya fue aprobado/contratado
                    'RECHAZADO' => ['PENDIENTE', 'EN_REVISION'], // Solo administrador podría, pero el middleware ya filtra
                ];

                if (!in_array($nuevoEstado, $transiciones[$estadoActual] ?? [])) {
                    return response()->json([
                        'success' => false,
                        'message' => "Transición de estado no permitida: de {$estadoActual} a {$nuevoEstado}"
                    ], 422);
                }

                // --- VALIDACIÓN DE CAMPOS OBLIGATORIOS PARA EN_REVISION ---
                if ($nuevoEstado === 'EN_REVISION') {
                    $seccionesFaltantes = $this->validarCamposObligatorios($solicitud);
                    if (!empty($seccionesFaltantes)) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Faltan datos obligatorios para enviar a revisión.',
                            'missing_sections' => $seccionesFaltantes
                        ], 422);
                    }
                }

                // Tracking de aprobación/rechazo
                if (in_array($nuevoEstado, ['APROBADO', 'RECHAZADO'])) {
                    $solicitud->aprobado_por = $aprobadoPor;
                    $solicitud->aprobacion_grupo = $aprobacionGrupo;
                    $solicitud->aprobacion_fecha = now();
                }

                // 2. Si el nuevo estado es APROBADO, ejecutar lógica de aprobacion (inserción en rh_mtrab)
                if ($nuevoEstado === 'APROBADO') {
                    // Verificar si ya existe en rh_mtrab por cédula en SQL Server
                    $existe = DB::connection('sql_prueba')->table('rh_mtrab')
                        ->where('NUM_CEDULA', $solicitud->cedula)
                        ->exists();

                    if ($existe) {
                        return response()->json([
                            'success' => false,
                            'message' => 'El aspirante ya se encuentra registrado como trabajador en rh_mtrab (Cédula duplicada).'
                        ], 409);
                    }

                    // Obtener nuevo COD_TRABAJ (MAX + 1) en SQL Server
                    $ultimoCod = DB::connection('sql_prueba')->table('rh_mtrab')->max('COD_TRABAJ');
                    $nuevoCod = ($ultimoCod ?? 0) + 1;

                    // Mapeo de tipos de contrato a IDs numéricos para rh_mtrab
                    $mappingContratos = [
                        'A PRUEBA' => 1,
                        'CONTRATO PRODUCTIVO' => 2,
                        'EVENTUAL' => 3,
                        'PASANTE' => 4,
                        'PLAZO FIJO' => 5,
                        'POR TEMPORADA' => 6,
                        'DESTAJO' => 7
                    ];

                    $tipoContratoId = $mappingContratos[$solicitud->condiciones_tipo_contrato] ?? 0;

                    // Formatear nombres: APELLIDOS NOMBRES (Estándar de Talento Humano)
                    $nombreCorto = strtoupper($solicitud->apellido_paterno . ' ' . $solicitud->apellido_materno . ' ' . $solicitud->nombres);

                    // Extraer nombres individuales
                    $nombresArray = explode(' ', trim($solicitud->nombres));
                    $nombre1 = $nombresArray[0] ?? '';
                    $nombre2 = isset($nombresArray[1]) ? implode(' ', array_slice($nombresArray, 1)) : '';

                    // Insertar en rh_mtrab (Base de datos SQL Server)
                    DB::connection('sql_prueba')->table('rh_mtrab')->insert([
                        'cod_trabaj' => $nuevoCod,
                        'num_cedula' => $solicitud->cedula,
                        'apellido_1' => strtoupper($solicitud->apellido_paterno ?? ''),
                        'apellido_2' => strtoupper($solicitud->apellido_materno ?? ''),
                        'nombre_1' => strtoupper($nombre1),
                        'nombre_2' => strtoupper($nombre2),
                        'nombre_corto' => $nombreCorto,
                        'fec_nacimiento' => $solicitud->fecha_nacimiento ? Carbon::parse($solicitud->fecha_nacimiento)->format('Ymd') : null,
                        'sexo' => $solicitud->genero === 'MASCULINO' ? 'M' : 'F',
                        'cod_estciv' => match(strtoupper($solicitud->estado_civil)) {
                            'SOLTERO', 'SOLTERA' => '0',
                            'CASADO', 'CASADA'   => '1',
                            'DIVORCIADO', 'DIVORCIADA' => '2',
                            'VIUDO', 'VIUDA'     => '3',
                            'UNION LIBRE', 'UNIÓN LIBRE' => '4',
                            default => '0'
                        },
                        'cod_ciu_nac' => $solicitud->canton_codigo ?? '0',
                        'cod_ciu_dom' => $solicitud->referencial_ciudad_codigo ?? '0',
                        'direccion' => mb_substr($solicitud->referencial_direccion ?? '', 0, 50),
                        'telefono' => $solicitud->referencial_telefono_secundario,
                        'celular' => $solicitud->referencial_telefono_principal,
                        'mail' => $solicitud->correo,
                        'sangre' => $solicitud->tipo_sangre,
                        'discapacitado' => $solicitud->tiene_discapacidad ? '1' : '0',
                        'vivecon' => mb_substr($solicitud->referencial_familiares_relacion ?? '', 0, 50),
                        'observacion' => '',
                        'fec_ingreso' => $solicitud->fecha_ingreso ? Carbon::parse($solicitud->fecha_ingreso)->format('Ymd') : now()->format('Ymd'),
                        'estado' => 'A', // Activo
                        'usuario' => auth()->id() ?? 0,
                        'fec_sistema' => now()->format('Ymd H:i:s'),
                        'hobies' => strtoupper($solicitud->salud_deporte ?? ''),
                    ]);
                }

                // 3. Actualizar estado en la tabla de solicitudes
                $solicitud->estado_solicitud = $nuevoEstado;
                $solicitud->save();

                return response()->json([
                    'success' => true,
                    'message' => "Estado actualizado a {$nuevoEstado} correctamente" . ($nuevoEstado === 'APROBADO' ? ". El postulante ha sido registrado como trabajador en rh_mtrab." : ".")
                ]);
            });
        }
        catch (\Exception $e) {
            Log::error('Error en updateEstado: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error interno al procesar el cambio de estado.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Elimina una solicitud si no ha sido aprobada/contratada aún.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $solicitud = SolicitudEmpleo::findOrFail($id);

            // REGLA DE NEGOCIO: No permitir eliminación si ya fue aprobado (contratado)
            if ($solicitud->estado_solicitud === 'APROBADO') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar una solicitud en estado APROBADO.'
                ], 403);
            }

            $solicitud->delete();

            return response()->json([
                'success' => true,
                'message' => 'Solicitud eliminada correctamente.'
            ]);
        }
        catch (\Exception $e) {
            Log::error('Error al eliminar solicitud: ' . $e->getMessage());
            return response()->json(['error' => 'No se pudo eliminar la solicitud'], 500);
        }
    }

    /**
     * Parsea una fecha recibida del frontend (potencialmente en formato ISO) 
     * a un formato que MySQL acepte.
     */
    private function parseDate($date)
    {
        if (empty($date))
            return null;
        try {
            return Carbon::parse($date)->toDateTimeString();
        }
        catch (\Exception $e) {
            return $date; // Retornar original si falla (fallback)
        }
    }

    /**
     * Valida que los campos obligatorios principales estén completos antes 
     * de permitir que la solicitud pase a estado EN_REVISION.
     * 
     * @param SolicitudEmpleo $solicitud La instancia de la solicitud a validar.
     * @return array de strings con los nombres legibles de las secciones incompletas. (Vacío si todo es válido).
     */
    private function validarCamposObligatorios($solicitud)
    {
        $faltantes = [];

        // 1. Datos Administrativos
        if (empty($solicitud->company_id) || empty($solicitud->area) || empty($solicitud->labor)) {
            $faltantes[] = 'Sección 1: Datos Administrativos';
        }

        // 2. Datos Personales
        $hasCantonNacimiento = (!empty($solicitud->canton_nacimiento) && $solicitud->canton_nacimiento !== 'Otros') ||
                               (!empty($solicitud->canton_nacimiento_otro));

        if (empty($solicitud->nombres) || empty($solicitud->apellido_paterno) || empty($solicitud->cedula) ||
        empty($solicitud->fecha_nacimiento) || empty($solicitud->genero) || !$hasCantonNacimiento) {
            $faltantes[] = 'Sección 2: Datos Personales';
        }

        // 3. Documentación
        if (($solicitud->doc_cedula_cant ?: 0) < 1 || ($solicitud->doc_certificado_votacion_cant ?: 0) < 1) {
            $faltantes[] = 'Sección 3: Documentación';
        }

        // 4. Datos Referenciales (Domicilio y Contacto)
        $hasPhone = !empty($solicitud->referencial_telefono_principal) || !empty($solicitud->referencial_telefono_secundario);
        $hasCiudadDomicilio = (!empty($solicitud->referencial_ciudad) && $solicitud->referencial_ciudad !== 'Otros') ||
                              (!empty($solicitud->referencial_ciudad_otro));

        if (empty($solicitud->referencial_direccion) || !$hasPhone || empty($solicitud->referencial_familiares_relacion) || !$hasCiudadDomicilio) {
            $faltantes[] = 'Sección 4: Datos Referenciales';
        }

        // 5. Estado Civil
        if (empty($solicitud->estado_civil)) {
            $faltantes[] = 'Sección 5: Estado Civil';
        }

        // 6. Datos Familiares (Padre, Madre y Cónyuge si aplica)
        $faltanteFamiliares = false;
        // Validar Padre y Madre (Siempre obligatorios)
        if (empty($solicitud->padre_nombre) || empty($solicitud->padre_estado) ||
        empty($solicitud->madre_nombre) || empty($solicitud->madre_estado)) {
            $faltanteFamiliares = true;
        }

        // Validar Cónyuge (Solo si aplica según Estado Civil)
        if (!empty($solicitud->estado_civil)) {
            $estadoCivil = strtoupper($solicitud->estado_civil);
            if (in_array($estadoCivil, ['CASADO', 'UNION LIBRE', 'UNIÓN LIBRE'])) {
                if (empty($solicitud->conyuge_nombre) || empty($solicitud->conyuge_estado)) {
                    $faltanteFamiliares = true;
                }
            }
        }

        if ($faltanteFamiliares) {
            $faltantes[] = 'Sección 6: Datos Familiares';
        }

        // 7. Datos Educativos
        if (empty($solicitud->edu_nivel_maximo)) {
            $faltantes[] = 'Sección 7: Datos Educativos';
        }

        // 8. Experiencia Laboral
        if (!$solicitud->exp_sin_experiencia && $solicitud->experiencias()->count() === 0) {
            $faltantes[] = 'Sección 8: Experiencia Laboral';
        }

        // 9. Referencias Laborales
        if (!$solicitud->exp_sin_experiencia && $solicitud->referenciasLaborales()->count() === 0) {
            $faltantes[] = 'Sección 9: Referencias Laborales';
        }

        // 10. Referencias Personales
        if ($solicitud->referenciasPersonales()->count() === 0) {
            $faltantes[] = 'Sección 10: Referencias Personales';
        }

        return $faltantes;
    }

    /**
     * Retorna el listado único de provincias para los selects.
     */
    public function getProvincias()
    {
        $provincias = DB::table('cat_geografia')
            ->select('provincia_codigo as codigo', 'provincia_nombre as nombre')
            ->distinct()
            ->orderBy('nombre')
            ->get();
            
        return response()->json($provincias);
    }

    /**
     * Retorna los cantones filtrados por código de provincia.
     */
    public function getCantones($provinciaCodigo)
    {
        $cantones = DB::table('cat_geografia')
            ->where('provincia_codigo', $provinciaCodigo)
            ->select('canton_codigo as codigo', 'canton_nombre as nombre')
            ->orderBy('nombre')
            ->get();
            
        return response()->json($cantones);
    }
}
