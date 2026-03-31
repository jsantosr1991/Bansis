<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Balanzas extends Controller
{
    public function HojaSaldos(Request $request)
    {
        $cinta = $request->input('codigo');
        $hacienda = $request->input('idhacienda');
        $query = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC ObtenerSaldosCinta ?,?', [$hacienda,$cinta]);;
        return response()->json($query);
    }

    public function HojaCaidas(Request $request)
    {
        $cinta = $request->input('codigo');
        $hacienda = $request->input('idhacienda');
        $query = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC Sp_GetMatasCaidas ?,?', [$hacienda,$cinta]);;
        return response()->json($query);
    }
    public function HojaSaldosEnfunde(Request $request)
    {
        $cinta = $request->input('codigo');
        $hacienda = $request->input('idhacienda');
        $query = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC Sp_GetEnfunde ?,?', [$hacienda,$cinta]);;
        return response()->json($query);
    }
    public function LotesMayordomo(Request $request)
    {

        $hacienda = $request->input('idhacienda');
        $query = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC GetLoteMayordomo ?', [$hacienda]);;
        return response()->json($query);
    }
    public function CalendarioMatasCaidas(Request $request)
    {

        $semana = $request->input('semana');
        $query = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC Sp_GetCalendarMatasCaidas ?', [$semana]);;
        return response()->json($query);
    }

    public function GetSemanaMataCaidas(Request $request)
    {

        $sql = DB::connection('sql94')->select('select * from W_SemanaCintaMataCaida');
        return response()->json($sql);
    }

     // 🔥 GUARDAR (lo que envía tu Angular)
/*     public function guardarmatascaidas(Request $request)
    {
        $db = DB::connection('mysql');
        $db->beginTransaction();

        try {

            // ✅ VALIDACIÓN
            $request->validate([
                'nombreHacienda' => 'required|string',
                'semana' => 'required|integer',
                'anio' => 'required|integer',
                'user' => 'required|string',
                'datos' => 'required|array|min:1',
                'datos.*.lote' => 'required|string',
                'datos.*.codigo' => 'required|string',
                'datos.*.cantidad' => 'required|numeric|min:0'
            ]);

            // ✅ INSERT CABECERA
            $cabeceraId = $db->table('matas_caidas_cab')->insertGetId([
                'nombrehacienda' => $request->nombreHacienda,
                'fecha'          => now(),
                'user'           => $request->user,
                'semana'         => $request->semana,
                'anio'           => $request->anio,
                'idHacienda'     => $request->idHacienda,
                'created_at'     => now()
            ]);

            // ✅ PREPARAR DETALLE (INSERT MASIVO)
            $detalleInsert = [];

            foreach ($request->datos as $item) {
                $detalleInsert[] = [
                    'cabecera_id' => $cabeceraId,
                    'pe_seccion'  => $item['lote'],     // lote → seccion
                    'pe_color'   => $item['codigo'],
                    'pe_dano'     => $item['danio'] ?? 0,
                    'pe_cant'     => $item['cantidad'],
                    'created_at'  => now()
                ];
            }

            // ✅ INSERT MASIVO
            $db->table('matas_caidas_det')->insert($detalleInsert);

            $db->commit();

            return response()->json([
                'message' => 'Guardado correctamente',
                'id' => $cabeceraId
            ]);

        } catch (\Exception $e) {

            $db->rollBack();

            return response()->json([
                'message' => 'Error al guardar',
                'error' => $e->getMessage()
            ], 500);
        }
    } */

        public function guardarmatascaidas(Request $request)
{
    $db = DB::connection('mysql');
    $db->beginTransaction();

    try {

        // ✅ VALIDACIÓN
        $request->validate([
            'nombreHacienda' => 'required|string',
            'semana' => 'required|integer',
            'anio' => 'required|integer',
            'user' => 'required|string',
            'datos' => 'required|array|min:1',
            'datos.*.lote' => 'required|string',
            'datos.*.codigo' => 'required|string',
            'datos.*.cantidad' => 'required|numeric|min:0'
        ]);

        // ✅ INSERT CABECERA (MYSQL)
        $cabeceraId = $db->table('matas_caidas_cab')->insertGetId([
            'nombrehacienda' => $request->nombreHacienda,
            'fecha'          => now(),
            'user'           => $request->user,
            'semana'         => $request->semana,
            'anio'           => $request->anio,
            'idHacienda'     => $request->idHacienda,
            'created_at'     => now()
        ]);

        // 🔥 DEFINIR TABLA DESTINO SEGÚN EMPRESA
        if ($request->idHacienda == 1) {
            $tablaDestino = 'perdidas_primo';
        } elseif ($request->idHacienda == 8) {
            $tablaDestino = 'perdidas_sofca';
        } else {
            throw new \Exception('Hacienda no válida');
        }

        // ✅ PREPARAR DETALLE (MYSQL + SQL SERVER)
        $detalleInsert = [];
        $sqlServerInsert = [];

        $fechaHoy = now(); // misma fecha para todos

        foreach ($request->datos as $item) {

            // 👉 MYSQL
            $detalleInsert[] = [
                'cabecera_id' => $cabeceraId,
                'pe_seccion'  => $item['lote'],
                'pe_color'    => $item['codigo'],
                'pe_dano'     => $item['danio'] ?? 0,
                'pe_cant'     => $item['cantidad'],
                'created_at'  => now()
            ];

            // 👉 SQL SERVER
          $idhacDestino = ($request->idHacienda == 8) ? 2 : $request->idHacienda;

            $sqlServerInsert[] = [
               
                'pe_haciend' => $idhacDestino, // 👈 aquí aplicas la regla
                'pe_fecha'   => $fechaHoy,
                'pe_color'   => $item['codigo'],
                'pe_dano'     => $item['danio'] ?? 0,
                'pe_cant'    => $item['cantidad'],
                'pe_seccion'    => $item['lote'],
            ];
        }

        // ✅ INSERT DETALLE MYSQL
        $db->table('matas_caidas_det')->insert($detalleInsert);

        // 🔥 EVITAR DUPLICADOS EN SQL SERVER

        // 1. Obtener existentes del día
        $existentes = DB::connection('sql_local')
            ->table($tablaDestino)
            ->whereDate('pe_fecha', $fechaHoy->toDateString())
            ->get(['pe_seccion', 'pe_color'])
            ->map(function ($item) {
                return $item->seccion . '-' . $item->pe_color;
            })
            ->toArray();

        // 2. Filtrar nuevos
        $nuevos = [];

        foreach ($sqlServerInsert as $row) {

            $key = $row['pe_seccion'] . '-' . $row['pe_color'];

            if (!in_array($key, $existentes)) {
                $nuevos[] = $row;
            }
        }

        // 3. Insertar solo los nuevos
        if (!empty($nuevos)) {
            DB::connection('sql_local')
                ->table($tablaDestino)
                ->insert($nuevos);
        }

        $db->commit();

        return response()->json([
            'message' => 'Guardado correctamente en MySQL y SQL Server',
            'insertados_sqlserver' => count($nuevos)
        ]);

    } catch (\Exception $e) {

        $db->rollBack();

        return response()->json([
            'message' => 'Error al guardar',
            'error' => $e->getMessage()
        ], 500);
    }
}

    // 🔥 VER DETALLE (para tu modal)
   public function verPorId($id)
{
    // ✅ CABECERA
    $cabecera = DB::table('matas_caidas_cab')
        ->where('id', $id)
        ->first();

    if (!$cabecera) {
        return response()->json([
            'message' => 'No existe el registro'
        ], 404);
    }

    // ✅ DETALLE CON JOIN
   $detalle = DB::select("
    
    SELECT
        cab.id,
        d.pe_seccion as lote,
        c.idcalendar as codigo,
        c.color AS color,
        SUM(d.pe_cant) AS cantidad
    FROM matas_caidas_cab cab
    INNER JOIN matas_caidas_det d
        ON cab.id = d.cabecera_id
    INNER JOIN (
        SELECT 
            idcalendar,
            MAX(idcalendar) AS codigo,
            MAX(color) AS color
        FROM sis_calendario_dole
        GROUP BY idcalendar
    ) c ON d.pe_color = c.idcalendar
    WHERE cab.id = ?
    GROUP BY 
        cab.id,
        d.pe_seccion,
        c.idcalendar,
        c.color
", [$id]);
    return response()->json([
        'cabecera' => [
            'nombrehacienda' => $cabecera->nombrehacienda
        ],
        'detalle' => $detalle
    ]);
}
    

    
    public function historicomatascaidas()
    {
         $sql = DB::connection('mysql')->select('select * from v_historial_matascaidas');
        return response()->json($sql);
    }

    public function obtenerInformeMatascaidas(Request $request)
    {
         $id = $request->input('idcab');
       
        $query = DB::connection('mysql')->select('CALL Get_Det_Matascaidas (?)', [$id]);;
        return response()->json($query);

    }

}


