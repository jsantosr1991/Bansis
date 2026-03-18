<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PrivilegiosTemporales extends Controller
{
    public function index()
    {
        $data = DB::table('privilegios_temporales as pt')
            ->join('users as u', 'u.id', '=', 'pt.usuario_id')
            ->join('rols as r', 'r.id', '=', 'pt.rol_delegado_id')
            ->join('users as o', 'o.id', '=', 'pt.otorgado_por')
            ->select(
                'pt.*',
                'u.username as usuario',
                'r.name as rol_delegado',
                'o.username as otorgado_por'
            )
            ->orderByDesc('pt.fecha_inicio')
            ->get();

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'usuario_id' => 'required|integer',
            'rol_delegado_id' => 'required|integer',
            'otorgado_por' => 'required|integer',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'usuario' => 'required|string',
        ]);

        DB::table('privilegios_temporales')->insert([
            'usuario_id' => $request->usuario_id,
            'rol_delegado_id' => $request->rol_delegado_id,
           // 'otorgado_por' => Auth::id(),
            'otorgado_por' => $request->otorgado_por,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'activo' => 1,
            'created_at' => now(),
            'updated_at' => now(),
            'usuario' => $request->usuario
        ]);

        return response()->json(['message' => 'Privilegio temporal otorgado correctamente.']);
    }

    public function desactivar($id)
    {
        DB::table('privilegios_temporales')
            ->where('idSerial', $id)
            ->update([
                'activo' => 0,
                'updated_at' => now(),
            ]);

        return response()->json(['message' => 'Privilegio temporal desactivado.']);
    }

    // ✅ Verifica si el usuario tiene un rol temporal activo (para usar en login)
    public function obtenerRolTemporalActivo($usuarioId)
    {
        $hoy = Carbon::now();

        $rol = DB::table('privilegios_temporales')
            ->where('usuario_id', $usuarioId)
            ->where('activo', 1)
            ->where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->orderByDesc('fecha_inicio')
            ->first();

        return $rol;
    }

}
