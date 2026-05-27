<?php

namespace App\Http\Controllers;

use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class BodegaHacienda extends Controller
{


    public function GetSolicitudPedidos()
    {

        $sql = DB::connection('mysql')->select('select  *
    from v_solicitudesbodega');
        ;
        return response()->json($sql);
    }

    public function GetDetalleProducto(Request $request)
    {
        $usuario = $request->input('usuario');
        $DOC = $request->input('Document');
        $db = DB::connection('mysql')
            ->select('CALL Get_DetalleProducto (?,?)', [$DOC, $usuario,]);
        return response()->json($db);

    }


    public function despachar(Request $request)
    {
        $db = DB::connection('mysql');
        $db->beginTransaction();

        try {

            $request->validate([
                'Documento' => 'required|string',
                'cerrar' => 'required|boolean', // 🔥 NUEVO
                'detalle' => 'required|array|min:1',
                'detalle.*.linea' => 'required|integer',
                'detalle.*.CantidadDespachada' => 'required|decimal:0,2|min:0',
                'detalle.*.comentario' => 'nullable|string|max:255',
            ]);

            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                throw new \Exception('Usuario no autenticado');
            }

            $usuarioId = $user->id;
            $username = $user->username;
            $documento = trim($request->Documento);
            $cerrar = $request->cerrar;

            foreach ($request->detalle as $item) {

                $linea = $db->table('solicitud_bodega')
                    ->where('Documento', $documento)
                    ->where('linea', $item['linea'])
                    ->lockForUpdate()
                    ->first();

                if (!$linea) {
                    throw new \Exception('Línea no encontrada: ' . $item['linea']);
                }

                $cantidadSolicitada = round((float) $linea->CantidadDigitada, 2);
                $totalAnterior = round((float) ($linea->TotalDespachado ?? 0), 2);
                $cantidadNueva = round((float) $item['CantidadDespachada'], 2);

                if ($totalAnterior >= $cantidadSolicitada) {
                    continue;
                }

                $nuevoTotal = round($totalAnterior + $cantidadNueva, 2);

                if ($nuevoTotal > $cantidadSolicitada) {
                    throw new \Exception(
                        'Cantidad excede lo solicitado para línea ' . $item['linea']
                    );
                }

                // 🔥 LÓGICA NUEVA
                if ($cerrar) {

                    // 🔒 CIERRE FORZADO SOLO A LO INCOMPLETO
                    if ($nuevoTotal >= $cantidadSolicitada) {
                        $estado = 2; // ya estaba completo
                    } else {
                        $estado = 3; // lo cierro incompleto
                    }

                    $despachado = 1;

                } else {

                    // 🔥 SI EL USUARIO TOCÓ LA LÍNEA → YA ES PARCIAL
                    if ($nuevoTotal < $cantidadSolicitada) {
                        $estado = 1; // 👈 CLAVE: aunque sea 0
                        $despachado = $nuevoTotal > 0 ? 1 : 0;

                    } else {
                        $estado = 2;
                        $despachado = 1;
                    }
                }

                $db->table('solicitud_bodega')
                    ->where('Documento', $documento)
                    ->where('linea', $item['linea'])
                    ->update([
                        'TotalDespachado' => $nuevoTotal,
                        'despachado' => $despachado,
                        'estado' => $estado,
                        'updated_at' => now()
                    ]);

                $db->table('auditoria_despachos')->insert([
                    'documento' => $documento,
                    'linea' => $item['linea'],
                    'codProd' => $linea->codProd,
                    'cantidad_despachada' => $cantidadNueva,
                    'usuario_id' => $usuarioId,
                    'usuario_nombre' => $username,
                    'fecha_despacho' => now(),
                    'tipo' => $cerrar ? 'CIERRE' : (($estado == 2) ? 'COMPLETO' : 'PARCIAL'),
                    'comentario' => $item['comentario'] ?? null,
                    'created_at' => now()
                ]);
            }

            $existenPendientes = $db->table('solicitud_bodega')
                ->where('Documento', $documento)
                ->whereRaw('IFNULL(TotalDespachado,0) < CantidadDigitada')
                ->exists();
            // 🔥 VALIDAR SI HUBO ALGÚN MOVIMIENTO
            $huboMovimiento = $db->table('solicitud_bodega')
                ->where('Documento', $documento)
                ->whereRaw('IFNULL(TotalDespachado,0) > 0')
                ->exists();

            // 🔥 DEFINIR ESTADO GLOBAL
            if ($cerrar) {

                if ($nuevoTotal >= $cantidadSolicitada) {
                    // ✔ ya estaba completo
                    $estado = 2;
                    $despachado = 1;

                } else {
                    // 🔒 quedó pendiente pero decides cerrar
                    $estado = 3;
                    $despachado = 1;
                }

            } else {

                if ($nuevoTotal == 0) {
                    $estado = 0;
                    $despachado = 0;

                } elseif ($nuevoTotal < $cantidadSolicitada) {
                    $estado = 1; // parcial
                    $despachado = 1;

                } else {
                    $estado = 2; // completo
                    $despachado = 1;
                }
            }

            $db->commit();

            return response()->json([
                'message' => 'Despacho registrado correctamente',
                'cerrado' => $cerrar,
                'despachado' => $existenPendientes ? 0 : 1
            ]);

        } catch (\Throwable $e) {

            $db->rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function GetSolicitudDespachados(Request $request)
    {
        $fechai = $request->input('fechai');
        $idhacienda = $request->input('idhac');
        $DOC = $request->input('Document');


        $db = DB::connection('mysql')
            ->select('CALL Get_PedidosDespachados (?,?,?)', [$fechai, $idhacienda, $DOC]);
        return response()->json($db);

    }

    public function GetComprobarDespachados(Request $request)
    {
        $fechai = $request->input('fechai');
        $fechaf = $request->input('fechaf');
        $idhacienda = $request->input('idhacienda');


        $db = DB::connection('mysql')
            ->select('CALL Get_ComprobarPedidos (?,?,?)', [$fechai, $fechaf, $idhacienda]);
        return response()->json($db);

    }

    public function ultimaFechaDespacho()
    {

        $fecha = DB::table('solicitud_bodega')
            ->Where('despachado', 1)
            ->max(DB::raw('DATE(updated_at)'));

        return response()->json([
            'fecha' => $fecha
        ]);

    }

    public function ultimaFechaDespachoPorHacienda()
    {
        $fechas = DB::table('solicitud_bodega')
            ->select(
                'idhacienda',
                DB::raw('MAX(DATE(updated_at)) AS fecha')
            )
            ->where('despachado', 1)
            ->groupBy('idhacienda')
            ->get();

        return response()->json($fechas);
    }

    // 🔥 TOTAL FUNDAS (pre + fut)
    private $dbProduccion = 'sql94';
    protected $dbEnfunde = 'sql94B'; // 👈 nueva conexión = 'sql94B';
    private $dbLocal = 'mysql';
    private $dbrrhh = 'mysqlrrhh';
    /* =========================
     * HACIENDA → TABLA
     * ========================= */
    private function getTablaEnfunde($idhacienda)
    {
        $map = [
            1 => 'enfunde_primo',
            3 => 'enfunde_sofca',
        ];

        return $map[$idhacienda] ?? 'enfunde_primo';
    }

    /* =========================
     * OBTENER IDCALENDAR (CLAVE)
     * ========================= */
    private function getIdCalendar($semana, $periodo, $anio)
    {
        return DB::connection($this->dbProduccion)
            ->table('calendario_dole')
            ->where('semana', $semana)
            ->where('periodo', $periodo)
            ->whereRaw("(SUBSTRING(CONVERT(VARCHAR, idcalendar),1,3) + 1800) = ?", [$anio])
            ->orderBy('fecha')
            ->value('idcalendar');
    }

    /* =========================
     * SEMANA ANTERIOR
     * ========================= */
    private function semanaAnterior($semana, $periodo, $anio)
    {
        if ($semana == 1) {
            return [
                'semana' => 52,
                'periodo' => $periodo,
                'anio' => $anio - 1
            ];
        }

        return [
            'semana' => $semana - 1,
            'periodo' => $periodo,
            'anio' => $anio
        ];
    }

    /* =========================
     * TOTAL FUNDAS (SOLO 1 COLOR)
     * ========================= */
    private function totalFundas($semana, $periodo, $anio, $idhacienda)
    {
        return DB::connection($this->dbEnfunde)
            ->table('v_enf_x_cinta')
            ->where([
                'semana' => $semana,
                'periodo' => $periodo,
                'idhacienda' => $idhacienda
            ])
            ->whereRaw("(CAST(LEFT(CAST(idcalendar AS VARCHAR),3) AS INT) + 1800) = ?", [$anio])
            ->sum('tot') ?? 0;
    }

    /* =========================
     * PRODUCCIÓN POR SECCIÓN (BASE)
     * ========================= */
    private function produccionPorSeccionBase($semana, $periodo, $anio, $idhacienda)
    {
        return DB::connection($this->dbEnfunde)
            ->table('v_enf_x_cinta')
            ->where([
                'semana' => $semana,
                'periodo' => $periodo,
                'idhacienda' => $idhacienda
            ])
            ->whereRaw("(CAST(LEFT(CAST(idcalendar AS VARCHAR),3) AS INT) + 1800) = ?", [$anio])
            ->select(
                DB::raw("
                RIGHT('00' + LEFT(lote, LEN(lote) - 1), 2) 
                + RIGHT(lote, 1) as en_seccion
            "),
                DB::raw('SUM(tot) as fundas')
            )
            ->groupBy(DB::raw("
            RIGHT('00' + LEFT(lote, LEN(lote) - 1), 2) 
            + RIGHT(lote, 1)
        "))
            ->get();
    }

    /* =========================
     * CREAR SEMANA
     * ========================= */
    public function crearSemana(Request $request)
    {
        DB::connection($this->dbLocal)->beginTransaction();

        try {

            $this->crearSemanaInterno(
                $request->semana,
                $request->periodo,
                $request->anio,
                $request->idhacienda
            );

            DB::connection($this->dbLocal)->commit();

            return response()->json(['ok' => true]);

        } catch (\Exception $e) {

            DB::connection($this->dbLocal)->rollBack();

            return response()->json([
                'ok' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /* =========================
     * CERRAR SEMANA
     * ========================= */
    public function cerrarSemana(Request $request)
    {
        DB::connection($this->dbLocal)->beginTransaction();

        try {

            $semana = $request->semana;
            $periodo = $request->periodo;
            $anio = $request->anio;
            $idhacienda = $request->idhacienda;

            // =====================================================
            // 🔵 TOTAL REAL
            // =====================================================
            $totalReal = $this->totalFundas($semana, $periodo, $anio, $idhacienda);

            // =====================================================
            // 🔴 PERSONAS
            // =====================================================
            $personas = DB::connection($this->dbLocal)
                ->table('bodega_control_rollos_persona')
                ->where(compact('semana', 'periodo', 'anio', 'idhacienda'))
                ->get();

            // =====================================================
            // 🔵 CERRAR SEMANA
            // =====================================================
            DB::connection($this->dbLocal)
                ->table('bodega_semanas_control')
                ->where(compact('semana', 'periodo', 'anio', 'idhacienda'))
                ->update([
                    'total_fundas_reales' => $totalReal,
                    'estado' => 'cerrada'
                ]);

            // =====================================================
            // 🔥 GUARDAR HISTÓRICO
            // =====================================================
            foreach ($personas as $p) {

                $diferencia = ($p->rollos_entregados + $p->arrastre_anterior) - $p->rollos_estimados;

                $motivo = DB::connection($this->dbLocal)
                    ->table('bodega_movimientos_rollos')
                    ->where('idcontrol', $p->id)
                    ->whereNotNull('motivo')
                    ->orderByDesc('id')
                    ->value('motivo');

                DB::connection($this->dbLocal)
                    ->table('bodega_historial_arrastre')
                    ->insert([
                        'idhacienda' => $idhacienda,
                        'semana' => $semana,
                        'periodo' => $periodo,
                        'anio' => $anio,
                        'idlotero' => $p->idlotero,
                        'nombre' => $p->nombre,
                        'rollos_estimados' => $p->rollos_estimados,
                        'rollos_entregados' => $p->rollos_entregados,
                        'arrastre_anterior' => $p->arrastre_anterior,
                        'diferencia' => $diferencia,
                        'tipo' => $diferencia >= 0 ? 'sobrante' : 'faltante',
                        'motivo' => $diferencia > 0 ? $motivo : null,
                        'created_at' => now()
                    ]);
            }

            // =====================================================
            // 🔥 CREAR SIGUIENTE SEMANA (FIX REAL)
            // =====================================================
            $next = $this->semanaSiguiente($semana, $periodo, $anio);

            $control = DB::connection($this->dbLocal)
                ->table('bodega_semanas_control')
                ->where([
                    'semana' => $next['semana'],
                    'periodo' => $next['periodo'],
                    'anio' => $next['anio'],
                    'idhacienda' => $idhacienda
                ])
                ->first();

            // 🔥 VALIDACIÓN INTELIGENTE (NO SOLO EXISTS)
            if (
                !$control
            ) {

                // 🔥 CREAR SEMANA (PROMEDIO SI NO HAY DATA)
                $this->crearSemanaInterno(
                    $next['semana'],
                    $next['periodo'],
                    $next['anio'],
                    $idhacienda
                );

                // 🔥 APLICAR ARRASTRE
                foreach ($personas as $p) {

                    $diferencia = ($p->rollos_entregados + $p->arrastre_anterior) - $p->rollos_estimados;

                    DB::connection($this->dbLocal)
                        ->table('bodega_control_rollos_persona')
                        ->where([
                            'semana' => $next['semana'],
                            'periodo' => $next['periodo'],
                            'anio' => $next['anio'],
                            'idhacienda' => $idhacienda,
                            'idlotero' => $p->idlotero
                        ])
                        ->update([
                            'arrastre_anterior' => round($diferencia, 2)
                        ]);
                }
            }

            DB::connection($this->dbLocal)->commit();

            return response()->json(['ok' => true]);

        } catch (\Exception $e) {

            DB::connection($this->dbLocal)->rollBack();

            return response()->json([
                'ok' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function semanaSiguiente($semana, $periodo, $anio)
    {
        // 🔥 obtener idcalendar actual
        $actual = DB::connection($this->dbProduccion)
            ->table('calendario_dole')
            ->where('semana', $semana)
            ->where('periodo', $periodo)
            ->whereRaw("(SUBSTRING(CONVERT(VARCHAR, idcalendar),1,3) + 1800) = ?", [$anio])
            ->orderBy('fecha')
            ->first();

        if (!$actual) {
            throw new \Exception("No existe semana actual en calendario");
        }

        // 🔥 buscar la siguiente SEMANA distinta (NO día)
        $next = DB::connection($this->dbProduccion)
            ->table('calendario_dole')
            ->where('fecha', '>', $actual->fecha)
            ->where(function ($q) use ($semana, $periodo) {
                $q->where('semana', '!=', $semana)
                    ->orWhere('periodo', '!=', $periodo);
            })
            ->orderBy('fecha')
            ->first();

        if (!$next) {
            throw new \Exception("No se encontró la siguiente semana en calendario");
        }

        return [
            'semana' => $next->semana,
            'periodo' => $next->periodo,
            'anio' => intval(substr($next->idcalendar, 0, 3)) + 1800
        ];
    }

    /* =========================
     * ESTADO ACTUAL
     * ========================= */


    public function estadoActual(Request $request)
    {
        // =====================================================
        // 🔵 DESPACHOS
        // =====================================================
        $data = DB::connection($this->dbLocal)
            ->table('bodega_despachos_rollos')
            ->where([
                'semana' => $request->semana,
                'periodo' => $request->periodo,
                'anio' => $request->anio,
                'idhacienda' => $request->idhacienda
            ])
            ->orderBy('seccion')
            ->get();

        if ($data->isEmpty()) {
            return $data;
        }

        // =====================================================
        // 🔵 PERSONAS CONTROL
        // =====================================================
        $controlPersonas = DB::connection($this->dbLocal)
            ->table('bodega_control_rollos_persona')
            ->where([
                'semana' => $request->semana,
                'periodo' => $request->periodo,
                'anio' => $request->anio,
                'idhacienda' => $request->idhacienda
            ])
            ->orderBy('id')
            ->get();

        // =====================================================
        // 🔥 MOVIMIENTOS
        // =====================================================
        $movimientosPersona = DB::connection($this->dbLocal)
            ->table('bodega_movimientos_rollos as m')
            ->join('bodega_control_rollos_persona as c', 'm.idcontrol', '=', 'c.id')
            ->where([
                'c.semana' => $request->semana,
                'c.periodo' => $request->periodo,
                'c.anio' => $request->anio,
                'c.idhacienda' => $request->idhacienda
            ])
            ->select(
                'c.idlotero',
                DB::raw('SUM(m.rollos) as total')
            )
            ->groupBy('c.idlotero')
            ->get()
            ->mapWithKeys(function ($item) {

                $key = empty($item->idlotero)
                    ? 'SIN_ASIGNACION'
                    : $item->idlotero;

                return [$key => $item];
            });

        // =====================================================
        // 🔥 MAP PERSONAS
        // =====================================================
        $mapPersonas = [];

        foreach ($controlPersonas as $p) {

            $key = empty($p->idlotero)
                ? 'SIN_ASIGNACION'
                : $p->idlotero;

            $mapPersonas[$key] = $p;
        }

        // =====================================================
        // 🔥 RECORRER DESPACHOS
        // =====================================================
        $resultado = [];

        foreach ($data as $d) {

            $rollos = $d->rollos_entregados;

            // =====================================================
            // 🔵 BUSCAR PERSONA CON DISPONIBLE
            // =====================================================
            $personaEncontrada = null;

            foreach ($controlPersonas as $p) {

                $usado = collect($resultado)
                    ->where('idlotero', $p->idlotero)
                    ->sum('rollos_entregados');

                $disponible = $p->rollos_estimados - $usado;

                if ($disponible <= 0) {
                    continue;
                }

                if ($disponible >= $rollos) {

                    $personaEncontrada = $p;
                    break;
                }
            }

            // =====================================================
            // 🔴 SIN ASIGNACIÓN
            // =====================================================
            if (!$personaEncontrada) {

                $personaEncontrada = $mapPersonas['SIN_ASIGNACION'] ?? null;
            }

            // =====================================================
            // 🔥 DATOS
            // =====================================================
            $idlotero = $personaEncontrada->idlotero ?? null;

            $key = empty($idlotero)
                ? 'SIN_ASIGNACION'
                : $idlotero;

            $entregado = $movimientosPersona[$key]->total ?? 0;

            $arrastre = $personaEncontrada->arrastre_anterior ?? 0;

            $resultado[] = [

                'id' => $d->id,

                'idlotero' => $idlotero,

                'seccion' => $d->seccion,

                'fundas' => $d->fundas,

                'rollos_entregados' => $d->rollos_entregados,

                'entregado_real' => $entregado,

                'diferencia' => ($entregado + $arrastre) - $d->rollos_entregados,

                'arrastre_anterior' => $arrastre,

                'nombre' => $personaEncontrada->nombre ?? 'SIN ASIGNACIÓN',

                'idcontrol' => $personaEncontrada->id ?? null,

                'tiene_reemplazo' => $personaEncontrada->tiene_reemplazo ?? 0,

                'reemplazo_idlotero' => $personaEncontrada->reemplazo_idlotero ?? null,

                'reemplazo_nombre' => $personaEncontrada->reemplazo_nombre ?? null,

                'motivo_reemplazo' => $personaEncontrada->motivo_reemplazo ?? null,
            ];
        }

        return collect($resultado);
    }




    /* =========================
     * PRODUCCIÓN POR SECCIÓN (CONSULTA)
     * ========================= */
    public function produccionPorSeccion(Request $request)
    {
        return $this->produccionPorSeccionBase(
            $request->semana,
            $request->periodo,
            $request->anio,
            $request->idhacienda
        );
    }

    /* =========================
     * SEMANA POR FECHA
     * ========================= */
    public function getSemanaPorFecha(Request $request)
    {
        return DB::connection($this->dbProduccion)
            ->table('calendario_dole')
            ->whereDate('fecha', $request->fecha)
            ->select('semana', 'periodo')
            ->first();
    }

    /* =========================
     * ESTADO SEMANA
     * ========================= */
    public function estadoSemana(Request $request)
    {
        $row = DB::connection($this->dbLocal)
            ->table('bodega_semanas_control')
            ->where([
                'semana' => $request->semana,
                'periodo' => $request->periodo,
                'anio' => $request->anio,
                'idhacienda' => $request->idhacienda
            ])
            ->select('estado', 'es_promedio')
            ->first();

        $esReal = $this->enfundeEsReal(
            $request->semana,
            $request->periodo,
            $request->anio,
            $request->idhacienda
        );

        return [
            ...(array) $row,
            'es_real_enfunde' => $esReal
        ];
    }
    private function ultimasSemanasConProduccion($semana, $periodo, $anio, $idhacienda, $limite = 3)
    {
        $result = [];

        $actual = [
            'semana' => $semana,
            'periodo' => $periodo,
            'anio' => $anio
        ];

        while (count($result) < $limite) {

            $actual = $this->semanaAnterior($actual['semana'], $actual['periodo'], $actual['anio']);

            $total = $this->totalFundas(
                $actual['semana'],
                $actual['periodo'],
                $actual['anio'],
                $idhacienda
            );

            if ($total > 0) {
                $result[] = [
                    ...$actual,
                    'total' => $total
                ];
            }

            // 🔴 seguridad (evitar loop infinito)
            if ($actual['anio'] < ($anio - 2))
                break;
        }

        return $result;
    }
    private function promedioTotalFundas($semanas)
    {
        if (count($semanas) === 0)
            return 0;

        $total = array_sum(array_column($semanas, 'total'));

        return $total / count($semanas);
    }
    private function promedioPorSeccion($semanas, $idhacienda)
    {
        $acumulado = [];

        foreach ($semanas as $s) {

            $data = $this->produccionPorSeccionBase(
                $s['semana'],
                $s['periodo'],
                $s['anio'],
                $idhacienda
            );

            foreach ($data as $d) {

                if (!isset($acumulado[$d->en_seccion])) {
                    $acumulado[$d->en_seccion] = 0;
                }

                $acumulado[$d->en_seccion] += $d->fundas;
            }
        }

        // 🔥 dividir entre número de semanas
        $promedio = [];

        foreach ($acumulado as $seccion => $total) {
            $promedio[] = (object) [
                'en_seccion' => $seccion,
                'fundas' => $total / count($semanas)
            ];
        }

        return collect($promedio);
    }
    public function totalFundasActual(Request $request)
    {
        $total = $this->totalFundas(
            $request->semana,
            $request->periodo,
            $request->anio,
            $request->idhacienda
        );

        return response()->json($total);
    }
    // por personas rollos

    private function getEstimadoPorPersona($semana, $periodo, $anio, $idhacienda)
    {
        // 🔵 1. TRAER DESPACHOS (LOCAL)
        $despachos = DB::connection($this->dbLocal)
            ->table('bodega_despachos_rollos')
            ->where([
                'semana' => $semana,
                'periodo' => $periodo,
                'anio' => $anio,
                'idhacienda' => $idhacienda
            ])
            ->select('seccion', 'rollos_entregados')
            ->get();

        if ($despachos->isEmpty()) {
            return collect();
        }

        // 🔵 2. NORMALIZAR SECCIONES
        $secciones = $despachos->pluck('seccion')->map(function ($s) {
            return trim(strtoupper($s));
        });

        // 🟣 3. TRAER PERSONAS (EXTERNO)
        $empresa = $this->getEmpresaPorHacienda($idhacienda);
        $personas = DB::connection($this->dbrrhh)
            ->table(DB::raw("
        (
            SELECT 
                COD_TRABAJ,
                NOMBRE_CORTO,
                UPPER(LTRIM(RTRIM(lote))) as lote,
                COD_EMPRESA
            FROM v_loteros_amarre
        ) as t
    "))
            ->whereIn('COD_EMPRESA', $empresa) // ✅ FILTRO POR EMPRESA
            ->whereIn('t.lote', $secciones)
            ->selectRaw('
        MIN(t.COD_TRABAJ) as idlotero,
        MIN(t.NOMBRE_CORTO) as nombre,
        t.lote,
        t.COD_EMPRESA
    ')
            ->groupBy('t.lote', 't.COD_EMPRESA') // ✅ CLAVE CORRECTA
            ->get();



        // 🔴 SI NO HAY PERSONAS → USAR SECCIONES COMO FALLBACK
        if ($personas->isEmpty()) {
            return $despachos->map(function ($d) {
                return (object) [
                    'idlotero' => $d->seccion,
                    'nombre' => 'SIN NOMBRE',
                    'rollos_estimados' => $d->rollos_entregados
                ];
            });
        }

        // 🟡 4. MAPA DE DESPACHOS
        $empresa = $this->getEmpresaPorHacienda($idhacienda);

        $mapDespachos = $despachos->keyBy(function ($d) {
            return trim(strtoupper($d->seccion));

        });



        // 🟢 5. MAPA DE PERSONAS POR LOTE
        $mapPersonas = [];

        foreach ($personas as $p) {

            $loteKey = trim(strtoupper($p->lote));

            $mapPersonas[$loteKey] = [
                'idlotero' => $p->idlotero,
                'nombre' => $p->nombre
            ];
        }

        // 🟣 6. AGRUPAR RESULTADO FINAL
        $resultado = [];

        $sinAsignacion = 0;

        foreach ($despachos as $d) {

            $loteKey = trim(strtoupper($d->seccion));

            $rollos = $d->rollos_entregados;

            // =====================================================
            // 🔵 TIENE PERSONA
            // =====================================================
            if (isset($mapPersonas[$loteKey])) {

                $persona = $mapPersonas[$loteKey];

                if (!isset($resultado[$persona['idlotero']])) {

                    $resultado[$persona['idlotero']] = [
                        'idlotero' => $persona['idlotero'],
                        'nombre' => $persona['nombre'],
                        'rollos_estimados' => 0
                    ];
                }

                $resultado[$persona['idlotero']]['rollos_estimados'] += $rollos;

            } else {

                // =====================================================
                // 🔴 SIN ASIGNACIÓN
                // =====================================================
                $sinAsignacion += $rollos;
            }
        }

        // =====================================================
// 🔥 AGREGAR REGISTRO GLOBAL SIN ASIGNACIÓN
// =====================================================
        if ($sinAsignacion > 0) {

            $resultado['SIN_ASIGNACION'] = [
                'idlotero' => null,
                'nombre' => 'SIN ASIGNACIÓN',
                'rollos_estimados' => round($sinAsignacion, 2)
            ];
        }

        // 🔥 ARRAY → COLLECTION OBJETOS
        return collect(array_values($resultado))->map(function ($item) {
            return (object) $item;
        });


    }
    private function getArrastreAnterior($semana, $periodo, $anio, $idhacienda, $idlotero)
    {
        $prev = $this->semanaAnterior($semana, $periodo, $anio);

        $query = DB::connection($this->dbLocal)
            ->table('bodega_control_rollos_persona')
            ->where([
                'idhacienda' => $idhacienda,
                'semana' => $prev['semana'],
                'periodo' => $prev['periodo'],
                'anio' => $prev['anio']
            ]);

        // 🔥 SI ES SIN ASIGNACIÓN
        if (empty($idlotero)) {

            $query->where(function ($q) {
                $q->whereNull('idlotero')
                    ->orWhere('nombre', 'SIN ASIGNACIÓN');
            });

        } else {

            $query->where('idlotero', $idlotero);
        }

        return $query->value('diferencia') ?? 0;
    }
    public function guardarEntrega(Request $request)
    {
        foreach ($request->data as $item) {

            $arrastre = $item['arrastre_anterior'];
            $estimado = $item['rollos_estimados'];
            $entregado = $item['rollos_entregados'];

            $diferencia = ($entregado + $arrastre) - $estimado;

            DB::connection($this->dbLocal)
                ->table('bodega_control_rollos_persona')
                ->where('id', $item['id'])
                ->update([
                    'rollos_entregados' => $entregado,
                    'diferencia' => round($diferencia, 2)
                ]);
        }

        return response()->json(['ok' => true]);
    }


    public function getMovimientosPorPersona($idcontrol)
    {
        return DB::connection($this->dbLocal)
            ->table('bodega_movimientos_rollos')
            ->where('idcontrol', $idcontrol)
            ->orderBy('fecha')
            ->get();
    }


    private function generarControlPersonasInterno($semana, $periodo, $anio, $idhacienda)
    {
        // 🔴 EVITAR DUPLICADOS
        $existe = DB::connection($this->dbLocal)
            ->table('bodega_control_rollos_persona')
            ->where([
                'semana' => $semana,
                'periodo' => $periodo,
                'anio' => $anio,
                'idhacienda' => $idhacienda
            ])
            ->exists();

        if ($existe)
            return;

        // 🔵 TRAER DESPACHOS POR SECCIÓN
        $despachos = DB::connection($this->dbLocal)
            ->table('bodega_despachos_rollos')
            ->where([
                'semana' => $semana,
                'periodo' => $periodo,
                'anio' => $anio,
                'idhacienda' => $idhacienda
            ])
            ->get();

        if ($despachos->isEmpty()) {

            $arrastre = $this->getArrastreAnterior(
                $semana,
                $periodo,
                $anio,
                $idhacienda,
                null
            );

            DB::connection($this->dbLocal)
                ->table('bodega_control_rollos_persona')
                ->insert([
                    'idhacienda' => $idhacienda,
                    'semana' => $semana,
                    'periodo' => $periodo,
                    'anio' => $anio,
                    'idlotero' => null,
                    'nombre' => 'SIN ASIGNACIÓN',
                    'rollos_estimados' => 0,
                    'arrastre_anterior' => round($arrastre, 2),
                    'rollos_entregados' => 0,
                    'diferencia' => round($arrastre, 2)
                ]);

            return;
        }

        // 🔵 INTENTAR PERSONAS
        $personas = $this->getEstimadoPorPersona($semana, $periodo, $anio, $idhacienda);

        // 🟡 SI NO HAY PERSONAS → USAR SECCIONES
        if ($personas->isEmpty()) {

            foreach ($despachos as $d) {

                DB::connection($this->dbLocal)
                    ->table('bodega_control_rollos_persona')
                    ->insert([
                        'idhacienda' => $idhacienda,
                        'semana' => $semana,
                        'periodo' => $periodo,
                        'anio' => $anio,
                        'idlotero' => $d->seccion, // 🔥 usamos sección como ID
                        'nombre' => 'SIN ASIGNACIÓN',
                        'rollos_estimados' => round($d->rollos_entregados, 2),
                        'arrastre_anterior' => 0,
                        'rollos_entregados' => 0,
                        'diferencia' => 0
                    ]);
            }

            return;
        }

        // 🔵 CASO NORMAL (CON PERSONAS)
        foreach ($personas as $p) {

            $arrastre = $this->getArrastreAnterior(
                $semana,
                $periodo,
                $anio,
                $idhacienda,
                $p->idlotero
            );

            DB::connection($this->dbLocal)
                ->table('bodega_control_rollos_persona')
                ->insert([
                    'idhacienda' => $idhacienda,
                    'semana' => $semana,
                    'periodo' => $periodo,
                    'anio' => $anio,
                    'idlotero' => $p->idlotero,
                    'nombre' => $p->nombre,
                    'rollos_estimados' => round($p->rollos_estimados, 2),
                    'arrastre_anterior' => round($arrastre, 2),
                    'rollos_entregados' => 0,
                    'diferencia' => 0
                ]);
        }
    }
    private function getEmpresaPorHacienda($idhacienda)
    {
        $map = [
            1 => [1],        // PRIMO
            3 => [3, 8],     // 🔥 SOFCA usa 3 pero datos están en 8 también
            8 => [3, 8]      // 🔥 por si acaso también lo cubres
        ];

        return $map[$idhacienda] ?? [];
    }
    public function despachoPorPersona(Request $request)
    {
        DB::beginTransaction();

        try {

            $request->validate([
                'idhacienda' => 'required|integer',
                'idlotero' => 'required',
                'rollos' => 'required|numeric|min:0.01',
                'semana' => 'required|integer',
                'periodo' => 'required',
                'anio' => 'required|integer',
                'motivo' => 'nullable|string'
            ]);


            $cantidad = floatval($request->rollos);

            // 🔥 DESPACHOS (SOLO PARA CÁLCULO)
            $despachos = DB::table('bodega_despachos_rollos')
                ->where('idhacienda', $request->idhacienda)
                ->where('semana', $request->semana)
                ->where('periodo', $request->periodo)
                ->where('anio', $request->anio)
                ->orderBy('seccion') // FIFO
                ->get();

            if ($despachos->isEmpty()) {
                return response()->json([
                    'ok' => false,
                    'error' => 'No existen despachos'
                ]);
            }

            $totalEstimado = $despachos->sum('rollos_entregados');

            // =====================================================
            // 🔵 CONTROL ÚNICO POR PERSONA
            // =====================================================
            $control = DB::table('bodega_control_rollos_persona')
                ->where('idhacienda', $request->idhacienda)
                ->where('semana', $request->semana)
                ->where('periodo', $request->periodo)
                ->where('anio', $request->anio)
                ->where('idlotero', $request->idlotero)
                ->first();

            if (!$control) {

                $diferencia = ($cantidad + 0) - $totalEstimado;

                $idcontrol = DB::table('bodega_control_rollos_persona')->insertGetId([
                    'idhacienda' => $request->idhacienda,
                    'semana' => $request->semana,
                    'periodo' => $request->periodo,
                    'anio' => $request->anio,
                    'idlotero' => $request->idlotero,
                    'nombre' => $request->nombre,
                    'rollos_estimados' => $totalEstimado,
                    'rollos_entregados' => $cantidad,
                    'arrastre_anterior' => 0,
                    'diferencia' => round($diferencia, 2),
                    'actualizado_en' => now()
                ]);

            } else {

                $idcontrol = $control->id;

                $nuevoEntregado = $control->rollos_entregados + $cantidad;

                $diferencia = ($nuevoEntregado + $control->arrastre_anterior) - $control->rollos_estimados;

                DB::table('bodega_control_rollos_persona')
                    ->where('id', $idcontrol)
                    ->update([
                        'rollos_entregados' => $nuevoEntregado,
                        'diferencia' => round($diferencia, 2),
                        'actualizado_en' => now()
                    ]);
            }


            // =====================================================
            // 🔥 FIFO (SOLO CÁLCULO, NO GUARDA)
            // =====================================================
            $restante = $control ? ($control->rollos_entregados + $cantidad) : $cantidad;

            foreach ($despachos as $d) {

                if ($restante <= 0)
                    break;

                $capacidad = $d->rollos_entregados;

                if ($restante >= $capacidad) {
                    $restante -= $capacidad;
                } else {
                    $restante = 0;
                }
            }

            // 🔥 MOTIVO FINAL
            $motivoFinal = $request->motivo ?? '';

            // 🔥 SI EXISTE REEMPLAZO
            if (!empty($request->idreemplazo)) {

                $reemplazo = DB::connection($this->dbrrhh)
                    ->table('v_rrhh_mtrab')
                    ->where('COD_TRABAJ', $request->idreemplazo)
                    ->select(DB::raw('LTRIM(RTRIM(NOMBRE_CORTO)) as nombre'))
                    ->first();

                if ($reemplazo) {

                    $textoReemplazo = 'REEMPLAZO: ' . $reemplazo->nombre;

                    $motivoFinal = $motivoFinal
                        ? $textoReemplazo . ' | ' . $motivoFinal
                        : $textoReemplazo;
                }

            }

            DB::table('bodega_movimientos_rollos')->insert([

                'idcontrol' => $idcontrol,

                'fecha' => now(),

                'rollos' => $cantidad,

                'tipo' => 'entrega',

                'motivo' => $motivoFinal,

                'created_at' => now()

            ]);



            return response()->json([
                'ok' => true
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'ok' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function personas($idhacienda)
    {
        $empresa = $this->getEmpresaPorHacienda($idhacienda);

        return DB::connection($this->dbrrhh)
            ->table('v_rrhh_mtrab')
            ->whereIn('COD_EMPRESA', $empresa)
            ->distinct()
            ->select(
                'COD_TRABAJ as idlotero',
                DB::raw('LTRIM(RTRIM(NOMBRE_CORTO)) as nombre')
            )
            ->orderBy('nombre')
            ->get();
    }
    public function asignarPersona(Request $request)
    {
        DB::connection($this->dbLocal)->beginTransaction();

        try {

            $request->validate([
                'idhacienda' => 'required',
                'semana' => 'required',
                'periodo' => 'required',
                'anio' => 'required',
                'idlotero' => 'required',
                'nombre' => 'required',
                'rollos' => 'required|numeric|min:0.01'
            ]);

            // 🔍 BUSCAR SI YA EXISTE
            $control = DB::connection($this->dbLocal)
                ->table('bodega_control_rollos_persona')
                ->where([
                    'idhacienda' => $request->idhacienda,
                    'semana' => $request->semana,
                    'periodo' => $request->periodo,
                    'anio' => $request->anio,
                    'idlotero' => $request->idlotero
                ])
                ->first();

            if ($control) {

                DB::connection($this->dbLocal)
                    ->table('bodega_control_rollos_persona')
                    ->where('id', $control->id)
                    ->update([
                        'rollos_estimados' => DB::raw("rollos_estimados + {$request->rollos}")
                    ]);

            } else {

                DB::connection($this->dbLocal)
                    ->table('bodega_control_rollos_persona')
                    ->insert([
                        'idhacienda' => $request->idhacienda,
                        'semana' => $request->semana,
                        'periodo' => $request->periodo,
                        'anio' => $request->anio,
                        'idlotero' => $request->idlotero,
                        'nombre' => $request->nombre,
                        'rollos_estimados' => $request->rollos,
                        'rollos_entregados' => 0,
                        'arrastre_anterior' => 0,
                        'diferencia' => 0,
                        'actualizado_en' => now()
                    ]);
            }

            // 🔥 RESTAR DE "SIN ASIGNACIÓN"
            DB::connection($this->dbLocal)
                ->table('bodega_control_rollos_persona')
                ->where([
                    'idhacienda' => $request->idhacienda,
                    'semana' => $request->semana,
                    'periodo' => $request->periodo,
                    'anio' => $request->anio
                ])
                ->where(function ($q) {
                    $q->whereNull('idlotero')
                        ->orWhere('nombre', 'SIN ASIGNACIÓN');
                })
                ->update([
                    'rollos_estimados' => DB::raw("rollos_estimados - {$request->rollos}")
                ]);

            DB::commit();

            return response()->json(['ok' => true]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'ok' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function enfundeCerrado($semana, $periodo, $anio, $idhacienda)
    {
        $tabla = $this->getTablaEnfunde($idhacienda);
        $idcalendar = $this->getIdCalendar($semana, $periodo, $anio);

        if (!$idcalendar)
            return false;

        // 🔥 si existe al menos uno SIN en_cantfut → NO está cerrado
        $pendientes = DB::connection($this->dbProduccion)
            ->table($tabla)
            ->where('en_color', $idcalendar)
            ->where(function ($q) {
                $q->whereNull('en_cantfut')
                    ->orWhere('en_cantfut', 0);
            })
            ->count();

        return $pendientes == 0;
    }


    private function crearSemanaInterno($semana, $periodo, $anio, $idhacienda)
    {
        $totalFundas = $this->totalFundas($semana, $periodo, $anio, $idhacienda);
        $esPromedio = false;

        if ($totalFundas <= 0) {

            $semanasValidas = $this->ultimasSemanasConProduccion(
                $semana,
                $periodo,
                $anio,
                $idhacienda,
                3
            );

            // 🔥 AQUÍ EL FIX CLAVE
            if (count($semanasValidas) === 0) {

                // ⚠️ NO LANZAR EXCEPCIÓN
                // usar fallback mínimo
                $totalFundas = 1;

                $secciones = collect([
                    (object) [
                        'en_seccion' => 'GENERAL',
                        'fundas' => 1
                    ]
                ]);

            } else {

                $totalFundas = $this->promedioTotalFundas($semanasValidas);
                $secciones = $this->promedioPorSeccion($semanasValidas, $idhacienda);
            }

            $esPromedio = true;

        } else {

            $secciones = $this->produccionPorSeccionBase(
                $semana,
                $periodo,
                $anio,
                $idhacienda
            );
        }

        $rollosTotales = $totalFundas / 90;

        if ($secciones->isEmpty() || $totalFundas <= 0) {

            $totalFundas = max($totalFundas, 1); // 🔥 nunca 0

            $secciones = collect([
                (object) [
                    'en_seccion' => 'GENERAL',
                    'fundas' => $totalFundas
                ]
            ]);
        }

        DB::connection($this->dbLocal)
            ->table('bodega_semanas_control')
            ->updateOrInsert(
                compact('semana', 'periodo', 'anio', 'idhacienda'),
                [
                    'total_fundas_estimadas' => $totalFundas,
                    'estado' => 'abierta',
                    'es_promedio' => $esPromedio
                ]
            );

        foreach ($secciones as $s) {

            $proporcion = $s->fundas / $totalFundas;
            $rollos = $rollosTotales * $proporcion;

            DB::connection($this->dbLocal)
                ->table('bodega_despachos_rollos')
                ->updateOrInsert(
                    [
                        'idhacienda' => $idhacienda,
                        'seccion' => $s->en_seccion,
                        'semana' => $semana,
                        'periodo' => $periodo,
                        'anio' => $anio
                    ],
                    [
                        'fundas' => round($s->fundas, 2),
                        'rollos_entregados' => round($rollos, 2)
                    ]
                );
        }
        // 🔥 SI NO SE INSERTÓ NADA → FORZAR
        $existeDespacho = DB::connection($this->dbLocal)
            ->table('bodega_despachos_rollos')
            ->where(compact('semana', 'periodo', 'anio', 'idhacienda'))
            ->exists();

        if (!$existeDespacho) {

            DB::connection($this->dbLocal)
                ->table('bodega_despachos_rollos')
                ->insert([
                    'idhacienda' => $idhacienda,
                    'seccion' => 'GENERAL',
                    'semana' => $semana,
                    'periodo' => $periodo,
                    'anio' => $anio,
                    'fundas' => 1,
                    'rollos_entregados' => 1
                ]);
        }

        $this->generarControlPersonasInterno($semana, $periodo, $anio, $idhacienda);
    }

    private function enfundeEsReal($semana, $periodo, $anio, $idhacienda)
    {
        $idcalendar = $this->getIdCalendar($semana, $periodo, $anio);

        if (!$idcalendar)
            return false;

        // 🔥 si existe al menos uno NO cerrado → NO es real
        $pendientes = DB::connection($this->dbEnfunde)
            ->table('HAC_ENFUNDES')
            ->where('idhacienda', $idhacienda)
            ->where('idcalendar', $idcalendar)
            ->where('cerrado', 0)
            ->count();

        return $pendientes == 0;
    }
    public function historialPersona(Request $request)
    {
        $request->validate([
            'idhacienda' => 'required|integer',
            'idlotero' => 'required',
        ]);

        $historialQuery = DB::connection($this->dbLocal)
            ->table('bodega_historial_arrastre')
            ->where('idhacienda', $request->idhacienda);

        // 🔥 SI ES SIN ASIGNACIÓN
        if (empty($request->idlotero)) {

            $historialQuery->where(function ($q) {
                $q->whereNull('idlotero')
                    ->orWhere('nombre', 'SIN ASIGNACIÓN');
            });

        } else {

            $historialQuery->where('idlotero', $request->idlotero);
        }

        $historial = $historialQuery
            ->orderByDesc('anio')
            ->orderByDesc('semana')
            ->get();

        // 🔴 MOVIMIENTOS (DETALLE REAL)
        $movimientosQuery = DB::connection($this->dbLocal)
            ->table('bodega_movimientos_rollos as m')
            ->join('bodega_control_rollos_persona as c', 'm.idcontrol', '=', 'c.id')
            ->where('c.idhacienda', $request->idhacienda);

        // 🔥 SIN ASIGNACIÓN
        if (empty($request->idlotero)) {

            $movimientosQuery->where(function ($q) {
                $q->whereNull('c.idlotero')
                    ->orWhere('c.nombre', 'SIN ASIGNACIÓN');
            });

        } else {

            $movimientosQuery->where('c.idlotero', $request->idlotero);
        }

        $movimientos = $movimientosQuery
            ->select(
                'm.fecha',
                'm.rollos',
                'm.tipo',
                'm.motivo',
                'c.semana',
                'c.periodo',
                'c.anio'
            )
            ->orderByDesc('c.semana')
            ->get();

        // 🟢 KPIs
        $totalEntregado = $historial->sum('rollos_entregados');
        $totalEstimado = $historial->sum('rollos_estimados');

        $cumplimiento = $totalEstimado > 0
            ? ($totalEntregado / $totalEstimado) * 100
            : 0;

        return response()->json([
            'historial' => $historial,
            'movimientos' => $movimientos,
            'resumen' => [
                'total_entregado' => $totalEntregado,
                'total_estimado' => $totalEstimado,
                'cumplimiento' => round($cumplimiento, 2)
            ]
        ]);
    }

    public function guardarReemplazo(Request $request)
    {
        $request->validate(['idhacienda' => 'required', 'semana' => 'required', 'periodo' => 'required', 'anio' => 'required', 'idlotero' => 'required', 'reemplazo_idlotero' => 'required',]);
        //BUSCAR PERSONA REEMPLAZO 
        $persona = DB::connection($this->dbrrhh)->table('v_rrhh_mtrab')->where('COD_TRABAJ', $request->reemplazo_idlotero)->select('COD_TRABAJ', DB::raw('LTRIM(RTRIM(NOMBRE_CORTO)) as nombre'))->first();
        if (!$persona) {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }
        DB::connection($this->dbLocal)->table('bodega_control_rollos_persona')
            ->where('idhacienda', $request->idhacienda)
            ->where('semana', $request->semana)->where('periodo', $request->periodo)
            ->where('anio', $request->anio)
            ->where(
                'idlotero',
                $request->idlotero
            )->update([
                    'tiene_reemplazo' => 1,
                    'reemplazo_idlotero' => $persona->COD_TRABAJ,
                    'reemplazo_nombre' => $persona->nombre,
                    'motivo_reemplazo' => $request->motivo_reemplazo,
                    'fecha_reemplazo' => now(),
                    'actualizado_en' => now()
                ]);


        return response()->json(['ok' => true]);
    }



}