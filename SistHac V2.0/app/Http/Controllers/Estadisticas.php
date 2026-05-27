<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Estadisticas extends Controller
{
    public function GetCalendarToday(Request $request)
    {
        $fecha = $request->input('fecha');

        $sql = DB::connection('sql94')->select('select * from calendario_dole where fecha = ?', [$fecha]);
        return response()->json($sql);
    }
    public function CintaCalendar(Request $request)
    {
        $fecha = $request->input('anio');
        $sql = DB::connection('sql94B')->select('SET NOCOUNT ON; EXEC Sp_GetCintasCalendar ?', [$fecha]);
        return response()->json($sql);
    }
    public function CintaCalendarEnfunde(Request $request)
    {
        $fecha = $request->input('anio');
        $sql = DB::connection('sql94B')->select('SET NOCOUNT ON; EXEC Sp_GetCintasCalendarEnfunde ?', [$fecha]);
        return response()->json($sql);
    }

    public function SaldosP(Request $request)
    {
        $cinta = $request->input('cinta');

        $sql = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC SaldosEnCosP ?', [$cinta]);
        return response()->json($sql);
    }
    public function SaldosSof(Request $request)
    {
        $cinta = $request->input('cinta');

        $sql = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC SaldosEnCosSof ?', [$cinta]);
        return response()->json($sql);
    }

    public function CosechaP(Request $request)
    {
        $cinta = $request->input('cinta');

        $sql = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC SP_GETCOSEHCAPRIMO ?', [$cinta]);
        return response()->json($sql);
    }
    public function CosechaS(Request $request)
    {
        $cinta = $request->input('cinta');

        $sql = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC SP_GETCOSEHCASOFCA ?', [$cinta]);
        return response()->json($sql);
    }

    public function LotesHistP(Request $request)
    {
        $lote = $request->input('lote');
        $cinta = $request->input('cinta');

        $sql = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC HistLoteP ?,?', [$lote, $cinta]);
        return response()->json($sql);
    }

    public function HistCinta(Request $request)
    {

        $cinta = $request->input('cinta');
        $hacienda = $request->input('hacienda');

        $sql = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC GetHistCintaxHa ?,?', [$cinta, $hacienda]);
        return response()->json($sql);
    }
    public function LotesHistP2(Request $request)
    {
        $lote = $request->input('lote');
        $cinta = $request->input('cinta');

        $sql = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC HistLotP2 ?,?', [$lote, $cinta]);
        return response()->json($sql);
    }

    public function HistCinta2(Request $request)
    {

        $cinta = $request->input('cinta');
        $hacienda = $request->input('hacienda');

        $sql = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC GetHistCintaxHa2 ?,?', [$cinta, $hacienda]);
        return response()->json($sql);
    }
    public function LotesHistS(Request $request)
    {
        $lote = $request->input('lote');
        $cinta = $request->input('cinta');

        $sql = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC HistLoteS ?,?', [$lote, $cinta]);
        return response()->json($sql);
    }

    public function LotesHistS2(Request $request)
    {
        $lote = $request->input('lote');
        $cinta = $request->input('cinta');

        $sql = DB::connection('sql94')->select('SET NOCOUNT ON; EXEC HistLotS2 ?,?', [$lote, $cinta]);
        return response()->json($sql);
    }
    public function EnfundeLoteroNuevo(Request $request)
    {
        $cinta = $request->input('cinta');
        $hacienda = $request->input('hacienda');
        $lote = $request->input('lote');
        $sql = DB::connection('sql94B')->select('SET NOCOUNT ON; EXEC Get_LoterosLote ?,?,?', [$cinta, $hacienda, $lote]);
        return response()->json($sql);
    }
    public function EnfundesLoteroXSemana(Request $request)
    {
        $cinta = $request->input('cinta');
        $hacienda = $request->input('hacienda');

        $sql = DB::connection('sql94B')->select('SET NOCOUNT ON; EXEC CINTA_ENFUNDE_LOTERO ?,?', [$cinta, $hacienda]);
        return response()->json($sql);
    }
    public function LoteroTerrestre(Request $request)
    {
        $hacienda = $request->input('hacienda');

        $sql = DB::connection('mysql2')->select('CALL Get_LoteroTerrestre (?)', [$hacienda]);
        return response()->json($sql);
    }



    public function RacimosRecusados(Request $request)
    {
        $idhacienda = $request->codhac;

        $semana = $request->semana;
        $periodo = $request->periodo;
        $anio = $request->anio;

        // NUEVOS
        $fecha = $request->fecha;

        $desde = $request->desde;
        $hasta = $request->hasta;

        $tipoFiltro = $request->tipoFiltro;

        $data = DB::connection('sql94')
            ->select(
                'EXEC Sp_Get_Recusados
                @codhac = ?,
                @semana = ?,
                @periodo = ?,
                @anio = ?,
                @fecha = ?,
                @desde = ?,
                @hasta = ?,
                @tipoFiltro = ?',
                [
                    $idhacienda,
                    $semana,
                    $periodo,
                    $anio,
                    $fecha,
                    $desde,
                    $hasta,
                    $tipoFiltro
                ]
            );

        return response()->json($data);
    }



}
