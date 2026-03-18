<?php

namespace App\Http\Controllers;

use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BodegaHacienda extends Controller
{
    public function GetSolicitudPedidos()
    {

        $sql = DB::connection('mysql')->select('select  *,
    (CantidadDigitada - IFNULL(TotalDespachado,0)) AS pendiente
    from solicitud_bodega where despachado = 0 and estado = 1'); ;
        return response()->json($sql);
    }

    public function despachar(Request $request)
    {
        $db = DB::connection('mysql');
        $db->beginTransaction();

        try {

            $request->validate([
                'Documento' => 'required|string',
                'detalle'   => 'required|array|min:1',
                'detalle.*.linea' => 'required|integer',
                'detalle.*.CantidadDespachada' => 'required|integer|min:0'
            ]);

            $documento = trim($request->Documento);

            foreach ($request->detalle as $item) {

                $linea = $db->table('solicitud_bodega')
                    ->where('Documento', $documento)
                    ->where('linea', $item['linea'])
                    ->lockForUpdate()
                    ->first();

                if (!$linea) {
                    throw new \Exception(
                        'Linea no encontrada: ' . $item['linea']
                    );
                }

                $cantidadSolicitada = (int) $linea->CantidadDigitada;
                $totalAnterior      = (int) ($linea->TotalDespachado ?? 0);
                $cantidadNueva      = (int) $item['CantidadDespachada'];

                // ?? No despachar líneas ya completas
                if ($totalAnterior >= $cantidadSolicitada) {
                    continue;
                }

                $nuevoTotal = $totalAnterior + $cantidadNueva;

                // ?? VALIDACIÓN FUERTE
                if ($nuevoTotal > $cantidadSolicitada) {
                    throw new \Exception(
                        'Cantidad excede lo solicitado para ' . $item['linea']
                    );
                }

                // ? ACTUALIZACIÓN CORRECTA (ACUMULADA)
                $db->table('solicitud_bodega')
                    ->where('Documento', $documento)
                    ->where('linea', $item['linea'])
                    ->update([
                        'TotalDespachado' => $nuevoTotal,
                        'updated_at'      => now()
                    ]);
            }

            // ?? ¿Quedan pendientes?
            $existenPendientes = $db->table('solicitud_bodega')
                ->where('Documento', $documento)
                ->whereRaw('IFNULL(TotalDespachado,0) < CantidadDigitada')
                ->exists();

            // ?? ESTADO GLOBAL DEL DOCUMENTO
            $db->table('solicitud_bodega')
                ->where('Documento', $documento)
                ->update([
                    'despachado' => $existenPendientes ? 0 : 1,
                    'estado'     => $existenPendientes ? 1 : 2, // 1=Pendiente, 2=Completo
                    'updated_at' => now()
                ]);

            $db->commit();

            return response()->json([
                'message'    => 'Despacho registrado correctamente',
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
        $idhacienda = $request->input('idhacienda');


        $db = DB::connection('mysql')
            ->select('CALL Get_PedidosDespachados (?,?)', [$fechai,$idhacienda]);
        return response()->json($db);




    }

    public function ultimaFechaDespacho()
    {

        $fecha =DB::table('solicitud_bodega')
            ->Where('despachado',1)
            ->max(DB::raw('DATE(updated_at)'));

        return response() ->json([
            'fecha'=>$fecha
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


}
