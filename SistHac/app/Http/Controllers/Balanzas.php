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
}
