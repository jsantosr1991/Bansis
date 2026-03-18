<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Asistencia extends Controller
{
  public function VAsistenciaMM(Request $request)
  {
      $fechai = $request->input('fecha');
      $idcompany = $request->input('idhacienda');

      $asistencia = DB::connection('sqlOC')->select('SET NOCOUNT ON;EXEC GetAsistMM ?,?', [$fechai, $idcompany]);

      return response()->json($asistencia);

  }
    public function VAsistenciaG(Request $request)
    {
        $fechai = $request->input('fecha');
        $idcompany = $request->input('idhacienda');

        $asistencia = DB::connection('sqlOC')->select('SET NOCOUNT ON;EXEC GetAsistSISTHAC ?,?', [$fechai, $idcompany]);

        return response()->json($asistencia);
    }
    public function ViewFaltasPermisos(Request $request)
    {
        $fecha = $request->input('fecha');
        $hac = $request->input('idhacienda');
        $sql = DB::connection('sqlOC')->select('SET NOCOUNT ON;EXEC GetFaltasPermisos ?,?',[$hac,$fecha]);

        return response()->json($sql);
    }
    public function ViewdiasCorte(Request $request)
    {
        $fecha = $request->input('fecha');
        $idhacienda = $request->input('idhacienda');
//ver dias de corte
        $asistencia = DB::connection('mysqlrrhh')
            ->select('SELECT fecha,estado,idempresa FROM dia_corte WHERE idempresa = ? and fecha =?', [$idhacienda, $fecha]);
        return response()->json($asistencia);

    }

    public function V_Empresas()
    {
        $emp = DB::connection('mysqlrrhh')->select('SELECT * FROM v_empresas_hacienda');
        return response()->json($emp);
    }
}
