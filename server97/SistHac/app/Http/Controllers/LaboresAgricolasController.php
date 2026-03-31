<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class LaboresAgricolasController extends Controller
{
   public function LaboresAgricolasGeneral(Request $request)

    {
        //consulta 1
        $anio = $request->input('anio');
        $semana = $request->input('semana');
        $hac = $request->input('codhac');
        $db = DB::connection('mysqlrrhh')->select('CALL GetLaboresAgricolas (?,?,?) ', [$anio,$hac,$semana] );
       
         return response()->json($db);

    }


    public function LaboresAgricolasFertilizantes(Request $request)

    {
        //consulta 1
        $anio = $request->input('anio');
        $semana = $request->input('semana');
        $hac = $request->input('codhac');
        $db = DB::connection('mysql')->select('CALL Get_Fertilizantes (?,?,?) ', [$anio,$hac,$semana] );
       
         return response()->json($db);

    }


    
    public function guardarLabores(Request $request)
{
    $db = DB::connection('mysql');
    $db->beginTransaction();

    try {

        // ✅ 1. Validar
        $request->validate([
           
            'codhac' => 'required|integer',
            'anio' => 'required|integer',
            'semana' => 'required|integer',
            'periodo' => 'required|integer',
            'detalle' => 'required|array|min:1',
            'detalle.*.codlabor' => 'required|integer',
         
        ]);

        // ✅ 2. Insertar cabecera
        $laboresId = $db->table('labagricolascab')->insertGetId([
            'codhac' => $request->codhac,
            'codfinca' => $request->codfinca,
            'anio' => $request->anio,
            'semana' => $request->semana,
            'periodo' => $request->periodo,
            'created_at' => now()
        ]);

        // ✅ 3. Insertar detalle
        foreach ($request->detalle as $item) {
            $db->table('labagricolasdet')->insert([
                'idCabLab' => $laboresId,
                'codlabor' => $item['codlabor'],
                'nombre_labor' => $item['nombre_labor'],
                'cantidad_hecha' => $item['cantidad_hecha'],
                'has_hechas' => $item['has_hechas'],
                'medida_labor' => $item['medida_labor'],
                'seccion' => $item['seccion'],
                'iduser' => $item['iduser'],
                'created_at' => now()
            ]);
        }

        // ✅ 4. Confirmar transacción
        $db->commit();

        return response()->json([
            'success' => true,
            'message' => 'Registro guardado correctamente',
            'factura_id' => $laboresId
        ]);

    } catch (\Exception $e) {

        // ❌ Si algo falla, rollback
        $db->rollBack();

        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}

}
