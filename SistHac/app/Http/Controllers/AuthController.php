<?php

namespace App\Http\Controllers;

use App\Models\FakeUser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = DB::table('users')
            ->where('username', $request->username)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }
       // $fechaSimulada = Carbon::createFromDate(2025, 11, 5, 'America/Bogota');
     //   $hoy = $fechaSimulada->toDateString();
     $hoy = Carbon::now('America/Bogota')->toDateString();

        $privilegioTemporal = DB::table('privilegios_temporales')
            ->where('usuario_id', $user->id)
            ->where('activo', 1)
            ->whereDate('fecha_inicio', '<=', $hoy)
            ->whereDate('fecha_fin', '>=', $hoy)
            ->first();



        Log::info('⏰ Comparación privilegio temporal', [
            'hoy' => $hoy,
            'privilegioTemporal' => $privilegioTemporal ? 'Encontrado' : 'No encontrado'
        ]);

        // ⚙️ Si tiene rol delegado activo, reemplazar rol_id temporalmente
        $rolTemporal = false;
        if ($privilegioTemporal) {
            $user->rol_id = $privilegioTemporal->rol_delegado_id;
            $rolTemporal = true;
        }

        // Crea manualmente un "user-like" array para JWT
        $customUser = [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email ?? null,
            'password' => $user->password,
            'rol_id' => $user->rol_id,
            'group_id'=> $user->group_id,
            'codempleado'=> $user->codempleado,
            'empe_nom'=> $user->empe_nom,
            'empresa_id'=> $user->empresa_id,
        ];

        $token = JWTAuth::fromUser(new FakeUser($customUser));

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'message' => 'Login exitoso',
            'username' => $user->username,
            'email' => $user->email,
            'group_id' => $user->group_id,
            'rol_id' => $user->rol_id,
            'codempleado' => $user->codempleado,
            'empe_nom'=> $user->empe_nom,
            'empresa_id'=> $user->empresa_id,
            'rol_temporal' => $rolTemporal,
            'fecha_inicio_privilegio' => $privilegioTemporal->fecha_inicio ?? null,
            'fecha_fin_privilegio' => $privilegioTemporal->fecha_fin ?? null,
        ]);
    }

    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function me(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }

            $hoy = Carbon::now('America/Lima')->toDateString();

            $privilegioTemporal = DB::table('privilegios_temporales')
                ->where('usuario_id', $user->id)
                ->where('activo', 1)
                ->whereRaw('fecha_inicio <= ?', [$hoy])
                ->whereRaw('fecha_fin >= ?', [$hoy])
                ->first();

            $rolTemporal = false;
            if ($privilegioTemporal) {
                $user->rol_id = $privilegioTemporal->rol_delegado_id;
                $rolTemporal = true;
                $user->fecha_inicio_privilegio = $privilegioTemporal->fecha_inicio;
                $user->fecha_fin_privilegio = $privilegioTemporal->fecha_fin;
            }

            Log::info('👤 Información usuario "me"', [
                'user_id' => $user->id,
                'rol_id' => $user->rol_id,
                'rol_temporal' => $rolTemporal
            ]);

            $user->rol_temporal = $rolTemporal;

            return response()->json($user);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Token inválido'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token expirado'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token no encontrado'], 401);
        }
    }
}
