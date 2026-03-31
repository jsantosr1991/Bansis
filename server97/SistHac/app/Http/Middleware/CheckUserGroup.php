<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserGroup
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string[] ...$groups
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // IDs obtenidos de la vista v_grupos:
        // 1: ADMINISTRADOR
        // 9: RRHH
        $allowedGroups = [1, 9];

        if (!in_array($user->group_id, $allowedGroups)) {
            return response()->json([
                'error' => 'No autorizado. Se requiere pertenecer al grupo RRHH o ADMINISTRADOR.'
            ], 403);
        }

        return $next($request);
    }
}
