<?php

namespace App\Http\Controllers;

use App\Models\FakeUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
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
            //sino existe o es incorrecta el password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        // Crea manualmente un "user-like" array para JWT
        $customUser = [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email ?? null,
            'password' => $user->password,
            'rol_id' => $user->rol_id,
            'group_id'=> $user->group_id
        ];

        $token = JWTAuth::fromUser(new \App\Models\FakeUser($customUser));

        return response()->json([
           'access_token' => $token,
            'token_type' => 'bearer',
           
            'message' => 'Login exitoso',
            'username' => $user->username,
            'email' => $user->email,
            'group_id' => $user->group_id,
            'rol_id' => $user->rol_id
        ]);
    }


    public function logout()
    {
       auth()->logout;

       return response()->json(['message' => 'sesion cerrada']);

    }



    public function me()
    {
        return response()->json(auth()->user());
    }
}
