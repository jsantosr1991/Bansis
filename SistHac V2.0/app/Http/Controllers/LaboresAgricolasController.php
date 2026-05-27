<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class LaboresAgricolasController extends Controller
{
    private function getUsuarioFiltro()
    {
        $user = auth()->user();

        $rolesAdmin = [1, 2];

        $esAdmin = in_array($user->rol_id, $rolesAdmin);

        return $esAdmin
            ? null
            : ($user->username ?? null);
    }

    // 🔹 Obtener tipo según usuario o request (admin)
    private function getTipoUsuario($requestTipo = null)
    {
        $user = auth()->user();

        $rolesAdmin = [1, 2];

        $esAdmin = in_array($user->rol_id, $rolesAdmin);

        if (!$requestTipo) {
            throw new \Exception('Debe enviar tipo');
        }

        if (!in_array($requestTipo, ['FITO', 'MMEDIOS'])) {
            throw new \Exception('Tipo inválido');
        }

        // 👑 ADMIN
        if ($esAdmin) {
            return $requestTipo;
        }

        // 🔒 USUARIO NORMAL
        return $requestTipo;
    }
    // 🔹 SP dinámico según tipo
    public function getLaboresSP(Request $request)
    {
        $anio = $request->input('anio');
        $semana = $request->input('semana');
        $hac = $request->input('codhac');

        $tipo = $this->getTipoUsuario($request->input('tipo'));

        /*
        |--------------------------------------------------------------------------
        | FITO
        |--------------------------------------------------------------------------
        */

        if ($tipo === 'FITO') {
            $hacConsulta = ($hac == 3) ? 2 : $hac;
            $data = DB::connection('mysqlrrhh')
                ->select('CALL GetLaboresAgricolas (?,?,?)', [
                    $anio,
                    $hacConsulta,
                    $semana
                ]);

            /*
            |--------------------------------------------------------------------------
            | FILTRAR CODIGOS QUE NO VAN EN FITO
            |--------------------------------------------------------------------------
            */

            $codigosMMedios = [
                2112,
                2116
            ];

            $data = collect($data)
                ->filter(function ($item) use ($codigosMMedios) {

                    $codLabor =
                        $item->codlabor
                        ?? $item->cod_labor
                        ?? 0;

                    return !in_array($codLabor, $codigosMMedios);

                })
                ->values();
        }

        /*
        |--------------------------------------------------------------------------
        | MMEDIOS
        |--------------------------------------------------------------------------
        */ else {


            /*
 |------------------------------------------------------------------
 | USUARIO
 |------------------------------------------------------------------
 | ADMIN = NULL
 | NORMAL = usuario logueado
 |------------------------------------------------------------------
 */

            $usuario = $this->getUsuarioFiltro();

            /*
            |------------------------------------------------------------------
            | CONSULTA FERTILIZANTES
            |------------------------------------------------------------------
            */

            $fertilizantes = DB::connection('mysql')
                ->select('CALL Get_Fertilizantes (?,?,?,?)', [

                    $anio,

                    $hac,

                    $semana,

                    $usuario

                ]);

            /*
            |--------------------------------------------------------------------------
            | COMPLETAR DATOS MANUALES
            |--------------------------------------------------------------------------
            */

            /*
|--------------------------------------------------------------------------
| NORMALIZAR FERTILIZANTES
|--------------------------------------------------------------------------
*/

            $fertilizantes = collect($fertilizantes)->map(function ($item) {

                /*
                |--------------------------------------------------------------------------
                | CODIGO FIJO DE LABOR
                |--------------------------------------------------------------------------
                */

                $item->codlabor = 1082;

                /*
                |--------------------------------------------------------------------------
                | NOMBRE FIJO DE LABOR
                |--------------------------------------------------------------------------
                */

                $item->nombre_labor = 'APLICACION FERTILIZANTE';
                // 🔥 PRODUCTO ORIGINAL
                $item->producto =
                    $item->nombre
                    ?? '';

                /*
                |--------------------------------------------------------------------------
                | CAMPOS NECESARIOS
                |--------------------------------------------------------------------------
                */

                $item->cantidad_hecha =
                    $item->cantidad
                    ?? 0;

                $item->has_hechas = 0;

                $item->medida_labor =
                    $item->medida
                    ?? '';

                $item->seccion = $item->seccion ?? '';

                return $item;

            });

            /*
            |--------------------------------------------------------------------------
            | CONSULTA FITO FILTRADA
            |--------------------------------------------------------------------------
            */
            $hacConsulta = ($hac == 3) ? 2 : $hac;
            $fito = DB::connection('mysqlrrhh')

                ->select('CALL GetLaboresAgricolas (?,?,?)', [
                    $anio,
                    $hacConsulta,
                    $semana
                ]);

            /*
            |--------------------------------------------------------------------------
            | SOLO CODIGOS QUE VAN EN MMEDIOS
            |--------------------------------------------------------------------------
            */

            $codigosMMedios = [
                2112,
                2116
            ];

            $fito = collect($fito)
                ->filter(function ($item) use ($codigosMMedios) {

                    $codLabor =
                        $item->codlabor
                        ?? $item->cod_labor
                        ?? 0;

                    return in_array($codLabor, $codigosMMedios);

                })
                ->values();

            /*
            |--------------------------------------------------------------------------
            | FUSIONAR CONSULTAS
            |--------------------------------------------------------------------------
            */

            $data = $fertilizantes
                ->concat($fito)
                ->values();
        }

        return response()->json([
            'tipo' => $tipo,
            'data' => $data
        ]);
    }

    // 🔹 Obtener datos guardados
    public function getGuardadas(Request $request)
    {
        $tipo = $this->getTipoUsuario($request->input('tipo'));

        $cab = DB::connection('mysql')
            ->table('labores_agricolas_cab')
            ->where('codhac', $request->codhac)
            ->where('anio', $request->anio)
            ->where('semana', $request->semana)
            ->where('tipo', $tipo)
            ->first();

        /*
        |--------------------------------------------------------------
        | NO EXISTE CABECERA
        |--------------------------------------------------------------
        */

        if (!$cab) {

            return response()->json([
                'exists' => false
            ]);
        }

        $user = auth()->user();

        $rolesAdmin = [1, 2];

        $esAdmin = in_array($user->rol_id, $rolesAdmin);

        /*
        |--------------------------------------------------------------
        | DETALLE
        |--------------------------------------------------------------
        */

        $detQuery = DB::connection('mysql')
            ->table('labores_agricolas_det')
            ->where('idCabLab', $cab->idCabLab);

        /*
 |--------------------------------------------------------------
 | USUARIO NORMAL
 |--------------------------------------------------------------
 | MMEDIOS:
 | - Fertilizantes SOLO del usuario
 | - Compartidas SI de todos
 |--------------------------------------------------------------
 */

        if (!$esAdmin) {

            /*
            |----------------------------------------------------------
            | FITO
            |----------------------------------------------------------
            */

            if ($tipo !== 'MMEDIOS') {

                $detQuery->where(
                    'iduser',
                    $user->username
                );

            }

            /*
            |----------------------------------------------------------
            | MMEDIOS
            |----------------------------------------------------------
            */ else {

                $detQuery->where(function ($q) use ($user) {

                    $q->where(function ($sub) use ($user) {

                        /*
                        |--------------------------------------------------
                        | FERTILIZANTES
                        |--------------------------------------------------
                        | SOLO DEL USUARIO
                        |--------------------------------------------------
                        */

                        $sub->where('codlabor', 1082)
                            ->where('iduser', $user->username);

                    })

                        ->orWhereIn('codlabor', [2112, 2116]);

                });

            }

        }
        $det = $detQuery
            ->get()
            ->map(function ($item) {

                $item->nombre = $item->nombre_labor;

                $item->cantidad = $item->cantidad_hecha;

                $item->medida = $item->medida_labor;

                $item->cod_labor = $item->codlabor;

                return $item;
            });

        /*
        |--------------------------------------------------------------
        | USUARIO YA CERRÓ
        |--------------------------------------------------------------
        */

        $usuarioCerrado = DB::connection('mysql')
            ->table('labores_agricolas_det')
            ->where('idCabLab', $cab->idCabLab)
            ->where('iduser', $user->username)
            ->where('estado', 'CERRADO')
            ->exists();

        /*
        |--------------------------------------------------------------
        | OTROS USUARIOS CERRADOS
        |--------------------------------------------------------------
        */

        $usuariosCerrados = DB::connection('mysql')
            ->table('labores_agricolas_det')
            ->select('iduser')
            ->where('idCabLab', $cab->idCabLab)
            ->where('estado', 'CERRADO')
            ->where('iduser', '!=', $user->username)
            ->distinct()
            ->pluck('iduser');

        /*
        |--------------------------------------------------------------
        | LABORES COMPARTIDAS YA GUARDADAS
        |--------------------------------------------------------------
        */

        $laboresCompartidas = DB::connection('mysql')
            ->table('labores_agricolas_det')
            ->where('idCabLab', $cab->idCabLab)
            ->whereIn('codlabor', [2112, 2116])
            ->distinct()
            ->pluck('codlabor');

        return response()->json([

            'exists' => true,

            'cabecera' => $cab,

            'detalle' => $det,

            'usuario_cerrado' => $usuarioCerrado,

            'usuarios_cerrados' => $usuariosCerrados,

            // 🔥 NUEVO
            'labores_compartidas' => $laboresCompartidas

        ]);
    }
    // 🔹 Guardar (crear o actualizar)
    public function guardarLabores(Request $request)
    {
        $db = DB::connection('mysql');

        $db->beginTransaction();

        try {

            $request->validate([

                'codhac' => 'required|integer',

                'anio' => 'required|integer',

                'semana' => 'required|integer',

                'periodo' => 'required|integer',

                'detalle' => 'required|array|min:1',

                'detalle.*.codlabor' => 'required|integer',

            ]);

            $tipo = $this->getTipoUsuario($request->input('tipo'));

            /*
            |--------------------------------------------------------------
            | BUSCAR CABECERA
            |--------------------------------------------------------------
            */

            $cab = $db->table('labores_agricolas_cab')
                ->where('codhac', $request->codhac)
                ->where('anio', $request->anio)
                ->where('semana', $request->semana)
                ->where('tipo', $tipo)
                ->first();

            /*
            |--------------------------------------------------------------
            | VALIDAR CABECERA CERRADA
            |--------------------------------------------------------------
            */

            if ($cab && $cab->estado === 'CERRADO') {

                return response()->json([
                    'success' => false,
                    'message' => 'La semana ya está cerrada'
                ], 400);

            }
            /*
|--------------------------------------------------------------
| VALIDAR SI USUARIO YA CERRÓ SU PARTE
|--------------------------------------------------------------
*/

            if ($cab && $tipo === 'MMEDIOS') {

                $usuarioCerrado = $db->table('labores_agricolas_det')
                    ->where('idCabLab', $cab->idCabLab)
                    ->where('iduser', auth()->user()->username)
                    ->where('estado', 'CERRADO')
                    ->exists();

                if ($usuarioCerrado) {

                    return response()->json([
                        'success' => false,
                        'message' => 'Usted ya cerró su parte y no puede modificarla'
                    ], 403);

                }

            }

            /*
            |--------------------------------------------------------------
            | VALIDAR SI EL USUARIO YA CERRÓ SU PARTE
            |--------------------------------------------------------------
            */

            if ($cab) {

                $usuarioCerrado = $db->table('labores_agricolas_det')
                    ->where('idCabLab', $cab->idCabLab)
                    ->where('iduser', auth()->user()->username)
                    ->where('estado', 'CERRADO')
                    ->exists();

                if ($usuarioCerrado) {

                    return response()->json([
                        'success' => false,
                        'message' => 'Usted ya cerró su parte y no puede modificarla'
                    ], 403);

                }

            }

            /*
            |--------------------------------------------------------------
            | CREAR CABECERA
            |--------------------------------------------------------------
            */

            if (!$cab) {

                $idCab = $db->table('labores_agricolas_cab')->insertGetId([

                    'codhac' => $request->codhac,

                    'anio' => $request->anio,

                    'semana' => $request->semana,

                    'periodo' => $request->periodo,

                    'tipo' => $tipo,

                    'estado' => 'BORRADOR',

                    'created_at' => now()

                ]);

            } else {

                $idCab = $cab->idCabLab;

                /*
                |--------------------------------------------------------------
                | ELIMINAR SOLO BORRADORES DEL USUARIO
                |--------------------------------------------------------------
                */

                $user = auth()->user();

                $rolesAdmin = [1, 2];

                $esAdmin = in_array($user->rol_id, $rolesAdmin);

                $deleteQuery = $db->table('labores_agricolas_det')
                    ->where('idCabLab', $idCab)
                    ->where('estado', 'BORRADOR');

                /*
                |--------------------------------------------------------------
                | USUARIO NORMAL
                |--------------------------------------------------------------
                */

                if (!$esAdmin) {

                    $deleteQuery->where(
                        'iduser',
                        $user->username
                    );

                }

                $deleteQuery->delete();

            }

            /*
            |--------------------------------------------------------------
            | INSERTAR DETALLE
            |--------------------------------------------------------------
            */

            foreach ($request->detalle as $item) {

                /*
                |--------------------------------------------------------------
                | DETECTAR FERTILIZANTES
                |--------------------------------------------------------------
                */

                $codActual =
                    $item['codlabor']
                    ?? $item['cod_labor']
                    ?? 0;

                $esFertilizante =
                    $tipo === 'MMEDIOS'
                    &&
                    (
                        empty($codActual)
                        ||
                        $codActual == 0
                    );

                /*
                |--------------------------------------------------------------
                | CODIGO LABOR
                |--------------------------------------------------------------
                */

                if ($esFertilizante) {

                    $codlabor = 1082;

                } else {

                    $codlabor =
                        $item['codlabor']
                        ?? $item['cod_labor']
                        ?? 0;

                }

                /*
                |--------------------------------------------------------------
                | NOMBRE LABOR
                |--------------------------------------------------------------
                */

                if ($esFertilizante) {

                    $nombreLabor = 'APLICACION FERTILIZANTE';

                } else {

                    $nombreLabor =
                        $item['nombre_labor']
                        ?? $item['nombre']
                        ?? '';

                }

                /*
                |--------------------------------------------------------------
                | CANTIDAD
                |--------------------------------------------------------------
                */

                $cantidad =
                    $item['cantidad_hecha']
                    ?? $item['cantidad']
                    ?? 0;

                /*
                |--------------------------------------------------------------
                | MEDIDA
                |--------------------------------------------------------------
                */

                $medida =
                    $item['medida_labor']
                    ?? $item['medida']
                    ?? '';

                /*
                |--------------------------------------------------------------
                | INSERT
                |--------------------------------------------------------------
                */

                $db->table('labores_agricolas_det')->insert([

                    'idCabLab' => $idCab,

                    'codlabor' => $codlabor,

                    'nombre_labor' => $nombreLabor,

                    'producto' => $item['producto'] ?? null,

                    'cantidad_hecha' => $cantidad,

                    'has_hechas' => $item['has_hechas'] ?? 0,

                    'medida_labor' => $medida,

                    'seccion' => $this->normalizarSeccion(
                        $item['seccion'] ?? '000'
                    ),

                    'iduser' => auth()->user()->username,

                    'estado' => 'BORRADOR',

                    'created_at' => now()

                ]);

            }

            $db->commit();

            return response()->json([

                'success' => true,

                'message' => 'Guardado correctamente',

                'idCabLab' => $idCab

            ]);

        } catch (\Exception $e) {

            $db->rollBack();

            return response()->json([

                'success' => false,

                'message' => $e->getMessage()

            ], 500);

        }
    }

    // 🔹 Cerrar semana
    public function cerrarSemana(Request $request)
    {
        $tipo = $this->getTipoUsuario($request->input('tipo'));

        $user = auth()->user();

        /*
|--------------------------------------------------------------
| MMEDIOS → CIERRE INDIVIDUAL
|--------------------------------------------------------------
*/

        if ($tipo === 'MMEDIOS') {

            /*
            |--------------------------------------------------------------
            | VALIDAR SI YA CERRÓ
            |--------------------------------------------------------------
            */

            $yaCerro = DB::connection('mysql')
                ->table('labores_agricolas_det')
                ->where('idCabLab', $request->idCabLab)
                ->where('iduser', $user->username)
                ->where('estado', 'CERRADO')
                ->exists();

            if ($yaCerro) {

                return response()->json([

                    'success' => false,

                    'message' => 'Usted ya cerró su parte'

                ], 403);

            }

            /*
            |--------------------------------------------------------------
            | CERRAR SOLO SU INFORMACIÓN
            |--------------------------------------------------------------
            */

            DB::connection('mysql')
                ->table('labores_agricolas_det')
                ->where('idCabLab', $request->idCabLab)
                ->where('iduser', $user->username)
                ->update([

                    'estado' => 'CERRADO'

                ]);

            /*
 |--------------------------------------------------------------
 | USUARIOS QUE HAN CERRADO
 |--------------------------------------------------------------
 */

            $usuariosCerrados = DB::connection('mysql')
                ->table('labores_agricolas_det')
                ->where('idCabLab', $request->idCabLab)
                ->where('estado', 'CERRADO')
                ->distinct()
                ->pluck('iduser')
                ->count();

            /*
            |--------------------------------------------------------------
            | TOTAL USUARIOS ESPERADOS
            |--------------------------------------------------------------
            | AJUSTA SEGÚN TU OPERACIÓN
            |--------------------------------------------------------------
            */

            $totalUsuariosEsperados = 2;

            /*
            |--------------------------------------------------------------
            | SI TODOS CERRARON
            |--------------------------------------------------------------
            */

            if ($usuariosCerrados >= $totalUsuariosEsperados) {

                DB::connection('mysql')
                    ->table('labores_agricolas_cab')
                    ->where('idCabLab', $request->idCabLab)
                    ->update([

                        'estado' => 'CERRADO'

                    ]);

            }

            return response()->json([

                'success' => true,

                'message' => 'Su parte fue cerrada correctamente'

            ]);

        }

        /*
        |--------------------------------------------------------------
        | FITO → CIERRE GLOBAL
        |--------------------------------------------------------------
        */

        DB::connection('mysql')
            ->table('labores_agricolas_cab')
            ->where('idCabLab', $request->idCabLab)
            ->where('tipo', $tipo)
            ->update([

                'estado' => 'CERRADO'

            ]);

        return response()->json([

            'success' => true

        ]);
    }

    // 🔹 Helper normalizar secciones
    private function normalizarSeccion($seccion)
    {
        return str_pad($seccion, 3, '0', STR_PAD_LEFT);
    }

    public function getSemanaLabores(Request $request)
    {
        $anio = $request->input('anio');
        $semana = $request->input('semana');
        $hac = $request->input('codhac');

        $lab = DB::connection('mysql')
            ->select('CALL SP_GET_SEMANA_LABORES (?,?,?)', [
                $hac,
                $semana,
                $anio


            ]);
        return response()->json(['success' => true, 'data' => $lab]);
    }
}
