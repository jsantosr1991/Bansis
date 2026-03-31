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
                'detalle.*.CantidadDespachada' => 'required|decimal:0,2|min:0'
            ]);
            // 🔐 Usuario autenticado (JWT)
                $user = JWTAuth::parseToken()->authenticate();
                if (!$user) {
                    throw new \Exception('Usuario no autenticado');
                }
                $usuarioId = $user->id;
                $username = $user->username;

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

              $cantidadSolicitada = round((float) $linea->CantidadDigitada, 2);
              $totalAnterior      = round((float) ($linea->TotalDespachado ?? 0), 2);
              $cantidadNueva      = round((float) $item['CantidadDespachada'], 2);

                // ?? No despachar líneas ya completas
                if ($totalAnterior >= $cantidadSolicitada) {
                    continue;
                }

                $nuevoTotal = round($totalAnterior + $cantidadNueva, 2);

                // ?? VALIDACIÓN FUERTE
                if ($nuevoTotal > $cantidadSolicitada) {
                    throw new \Exception(
                        'Cantidad excede lo solicitado para ' . $item['linea']
                    );
                }

                 // 🔑 Actualiza SOLO si hay cambio
                    if ($nuevoTotal != $totalAnterior) {

                            // ? ACTUALIZACIÓN CORRECTA (ACUMULADA)
                            $db->table('solicitud_bodega')
                                ->where('Documento', $documento)
                                ->where('linea', $item['linea'])
                                ->update([
                                    'TotalDespachado' => $nuevoTotal,
                                    'updated_at'      => now()
                                ]);
                                // 🧾 AUDITORÍA
                    $db->table('auditoria_despachos')->insert([
                        'documento'           => $documento,
                        'linea'               => $item['linea'],
                        'codProd'             => $linea->codProd, // ✅ AQUÍ
                        'cantidad_despachada' => $cantidadNueva,
                        'usuario_id'          => $usuarioId,
                        'usuario_nombre'      => $username,
                        'fecha_despacho'      => now(),
                        'tipo'                => ($nuevoTotal == $cantidadSolicitada) ? 'COMPLETO' : 'PARCIAL',
                        'created_at'          => now()
                    ]);

                    }
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
