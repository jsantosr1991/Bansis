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
}
