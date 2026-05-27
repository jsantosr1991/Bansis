<?php

namespace App\Http\Controllers;

use App\Models\SolicitudSoporte;
use App\Models\SoporteComentario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class SoporteController extends Controller
{
    /**
     * Listado de solicitudes (Sistemas ve todo, otros ven lo propio).
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = SolicitudSoporte::with(['user', 'empresa']);

        $verTodas = $request->query('todas') === 'true';

        // Si explícitamente se piden todas y el usuario es admin o sistemas, no aplicamos filtro
        if ($verTodas && in_array($user->group_id, [1, 2])) {
            // Ver todas las solicitudes
        } else {
            // Por defecto, o si no tiene permisos, solo ve sus propias solicitudes
            $query->where('created_by', $user->id);
        }

        $solicitudes = $query->orderBy('created_at', 'desc')->get();
        return response()->json($solicitudes);
    }

    /**
     * Crear una nueva solicitud.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tipo_solicitud' => 'required|in:MANT,HARD,CONS,SOFT,RED,OTRO',
            'titulo' => 'required|string|max:150',
            'descripcion' => 'required|string',
            'tipo_personalizado' => 'required_if:tipo_solicitud,OTRO|nullable|string|max:150',
            'foto' => 'nullable|image|max:5120',
        ]);

        $user = Auth::user();

        $gruposMap = [
            1 => 'Administradores',
            2 => 'Sistemas',
            3 => 'Mayordomo',
            4 => 'Jefes',
            5 => 'Fitosanitario',
            6 => 'Gerencia',
            7 => 'Certificaciones',
            8 => 'Empacadora',
            9 => 'RRHH',
            10 => 'Bodega',
        ];

        // Obtener nombre del área desde el mapeo
        $areaNombre = $gruposMap[$user->group_id] ?? 'Sin Área';

        // Manejo de la foto/evidencia
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('storage/fotos_soporte');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }

            $file->move($destinationPath, $fileName);
            // Evitamos problemas de .env y subcarpetas (como Wamp) usando root() del request original
            $fotoPath = rtrim($request->root(), '/') . '/storage/fotos_soporte/' . $fileName;
        }

        $solicitud = SolicitudSoporte::create([
            'tipo_solicitud' => $request->tipo_solicitud,
            'tipo_personalizado' => $request->tipo_personalizado,
            'titulo' => strtoupper($request->titulo),
            'descripcion' => $request->descripcion,
            'estado' => 'pendiente',
            'area_solicitante' => $areaNombre,
            'empresa_id' => $user->empresa_id,
            'foto_path' => $fotoPath,
            'created_by' => $user->id,
            'visto_por_sistemas' => false,
            'visto_por_solicitante' => true, // El creador ya la vio al crearla
        ]);

        return response()->json([
            'message' => 'Solicitud creada con éxito',
            'data' => $solicitud
        ], 201);
    }

    /**
     * Detalle de la solicitud y marcas de lectura.
     */
    public function show($id)
    {
        $user = Auth::user();
        $solicitud = SolicitudSoporte::with(['user', 'comentarios.user'])->findOrFail($id);

        // Seguridad: El usuario solo ve sus propias solicitudes o si es sistemas/admin
        if (!in_array($user->group_id, [1, 2]) && $solicitud->created_by != $user->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        // Marcas de visto
        if (in_array($user->group_id, [1, 2])) {
            $solicitud->visto_por_sistemas = true;
        }

        if ($solicitud->created_by == $user->id) {
            $solicitud->visto_por_solicitante = true;
        }

        $solicitud->save();

        return response()->json($solicitud);
    }

    /**
     * Cambiar el estado a Resuelto (Solo Sistemas).
     */
    public function close(Request $request, $id)
    {
        $user = Auth::user();

        // Solo administradores (1) y sistemas (2) pueden cerrar
        if (!in_array($user->group_id, [1, 2])) {
            return response()->json(['error' => 'Acción no permitida'], 403);
        }

        $solicitud = SolicitudSoporte::findOrFail($id);
        $solicitud->estado = 'resuelto';
        $solicitud->fecha_resuelto = Carbon::now();
        $solicitud->updated_by = $user->id;
        $solicitud->visto_por_solicitante = false; // Notificar al usuario que ya se resolvió
        $solicitud->save();

        return response()->json(['message' => 'Solicitud resuelta con éxito']);
    }

    /**
     * Obtener mensajes para el hilo de chat.
     */
    public function getMessages($id)
    {
        $user = Auth::user();
        $solicitud = SolicitudSoporte::findOrFail($id);

        // Seguridad
        if (!in_array($user->group_id, [1, 2]) && $solicitud->created_by != $user->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $mensajes = SoporteComentario::with('user')
            ->where('solicitud_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($mensajes);
    }

    /**
     * Enviar un nuevo mensaje al chat.
     */
    public function postMessage(Request $request, $id)
    {
        $request->validate(['mensaje' => 'required|string']);
        $user = Auth::user();
        $solicitud = SolicitudSoporte::findOrFail($id);

        // Seguridad
        if (!in_array($user->group_id, [1, 2]) && $solicitud->created_by != $user->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $comentario = SoporteComentario::create([
            'solicitud_id' => $id,
            'user_id' => $user->id,
            'mensaje' => $request->mensaje
        ]);

        // Resetear marcas de "visto" para notificar a la otra parte
        if (in_array($user->group_id, [1, 2])) {
            // Sistemas escribió -> El usuario tiene novedad
            $solicitud->visto_por_solicitante = false;
        } else {
            // El usuario escribió -> Sistemas tiene novedad
            $solicitud->visto_por_sistemas = false;
        }
        $solicitud->save();
        $comentario->load('user');

        return response()->json($comentario, 201);
    }

    /**
     * Obtener lista de materiales del inventario (Híbrido: carga inicial y búsqueda).
     */
    /*  public function getMaterials(Request $request)
     {
         $term = $request->query('term');

         $query = DB::table('materials')
             ->select('id', 'name', 'descripcion', 'stock');

         if ($term) {
             $query->where(function ($q) use ($term) {
                 $q->where('name', 'LIKE', "%{$term}%")
                     ->orWhere('descripcion', 'LIKE', "%{$term}%");
             });
         }

         // Primero los que tienen stock, luego alfabéticamente
         $materiales = $query->orderBy('stock', 'desc')
             ->orderBy('name', 'asc')
             ->limit(100)
             ->get();
         return response()->json($materiales);
     } */
    public function getMaterials(Request $request)
    {
        $term = $request->query('term');

        $query = DB::table('inventario_productos as p')
            ->leftJoin('inventario_stock as s', 'p.id', '=', 's.producto_id')
            ->select(
                'p.id',
                'p.nombre as name',
                'p.descripcion',
                DB::raw('COALESCE(SUM(s.cantidad_actual),0) as stock')
            )
            ->where('p.estado', 1)
            ->groupBy('p.id', 'p.nombre', 'p.descripcion');

        if ($term) {
            $query->where(function ($q) use ($term) {
                $q->where('p.nombre', 'LIKE', "%{$term}%")
                    ->orWhere('p.descripcion', 'LIKE', "%{$term}%");
            });
        }

        $materiales = $query
            ->orderByDesc('stock')
            ->orderBy('p.nombre')
            ->limit(100)
            ->get();

        return response()->json($materiales);
    }
    /**
     * Despachar múltiples materiales para una solicitud de soporte.
     */
    /*  public function dispatchMaterial(Request $request, $id)
     {
         $request->validate([
             'materiales' => 'required|array|min:1',
             'materiales.*.id' => 'required|integer',
             'materiales.*.cantidad' => 'required|integer|min:1'
         ]);

         $user = Auth::user();
         $solicitud = SolicitudSoporte::findOrFail($id);

         // Solo personal de sistemas o admin puede despachar
         if (!in_array($user->group_id, [1, 2])) {
             return response()->json(['error' => 'Acción no permitida'], 403);
         }

         try {
             return DB::transaction(function () use ($request, $id, $user, $solicitud) {
                 $items = $request->materiales;
                 $detallesDespacho = [];

                 foreach ($items as $item) {
                     $materialId = $item['id'];
                     $cantidad = $item['cantidad'];

                     // 1. Obtener material y bloquear fila
                     $material = DB::table('materials')->where('id', $materialId)->lockForUpdate()->first();

                     if (!$material) {
                         throw new \Exception("Material ID {$materialId} no encontrado");
                     }

                     if ($material->stock < $cantidad) {
                         throw new \Exception("Stock insuficiente para '{$material->name}'. Disponible: {$material->stock}");
                     }

                     // 2. Restar stock
                     DB::table('materials')->where('id', $materialId)->decrement('stock', $cantidad);

                     // 3. Registrar en tabla histórica
                     DB::table('soporte_materiales_consumo')->insert([
                         'solicitud_id' => $id,
                         'material_id' => $materialId,
                         'cantidad' => $cantidad,
                         'stock_previo' => $material->stock,
                         'user_id' => $user->id,
                         'created_at' => now()
                     ]);

                     $detallesDespacho[] = "🔹 {$cantidad} x **{$material->name}**";
                 }

                 // 4. Notificar automáticamente en el chat con un único mensaje consolidado y premium
                 $detalleTexto = implode("\n", $detallesDespacho);
                 $mensajeTexto = "📄 **SISTEMAS - NOTIFICACIÓN DE DESPACHO DE INSUMOS**\n" .
                     "--------------------------------------------------\n" .
                     "Se hace de su conocimiento que se han entregado satisfactoriamente los siguientes insumos relacionados a su solicitud:\n\n" .
                     "{$detalleTexto}";

                 $comentario = SoporteComentario::create([
                     'solicitud_id' => $id,
                     'user_id' => $user->id,
                     'mensaje' => $mensajeTexto
                 ]);

                 // Notificar al usuario solicitante
                 $solicitud->visto_por_solicitante = false;
                 $solicitud->save();

                 return response()->json([
                     'message' => 'Materiales despachados con éxito',
                     'comentario' => $comentario->load('user')
                 ]);
             });
         } catch (\Exception $e) {
             return response()->json(['error' => $e->getMessage()], 400);
         }
     } */
    public function dispatchMaterial(Request $request, $id)
    {
        $request->validate([
            'materiales' => 'required|array|min:1',
            'materiales.*.id' => 'required|integer',
            'materiales.*.cantidad' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $solicitud = SolicitudSoporte::findOrFail($id);

        if (!in_array($user->group_id, [1, 2])) {
            return response()->json(['error' => 'Acción no permitida'], 403);
        }

        try {

            return DB::transaction(function () use ($request, $id, $user, $solicitud) {

                $items = $request->materiales;
                $detallesDespacho = [];

                foreach ($items as $item) {

                    $productoId = $item['id'];
                    $cantidad = $item['cantidad'];
                    $bodegaId = 1; // 🔥 ajusta si manejas múltiples bodegas

                    // 🔒 STOCK REAL
                    $stock = DB::table('inventario_stock')
                        ->where('producto_id', $productoId)
                        ->where('bodega_id', $bodegaId)
                        ->lockForUpdate()
                        ->first();

                    $stockActual = $stock->cantidad_actual ?? 0;

                    if ($stockActual < $cantidad) {
                        throw new \Exception("Stock insuficiente. Disponible: {$stockActual}");
                    }

                    $nuevoStock = $stockActual - $cantidad;

                    // 📌 MOVIMIENTO
                    DB::table('inventario_movimientos')->insert([
                        'producto_id' => $productoId,
                        'bodega_id' => $bodegaId,
                        'tipo' => 'SALIDA',
                        'cantidad' => $cantidad,
                        'motivo' => 'SOPORTE',
                        'documento' => 'SOL-' . $id,
                        'usuario_id' => $user->id,
                        'fecha' => now(),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);

                    // 📦 STOCK
                    DB::table('inventario_stock')
                        ->where('producto_id', $productoId)
                        ->where('bodega_id', $bodegaId)
                        ->update([
                            'cantidad_actual' => $nuevoStock
                        ]);

                    // 📘 KARDEX
                    DB::table('inventario_kardex')->insert([
                        'producto_id' => $productoId,
                        'bodega_id' => $bodegaId,
                        'fecha' => now(),
                        'tipo' => 'SALIDA',
                        'cantidad' => $cantidad,
                        'stock_anterior' => $stockActual,
                        'stock_nuevo' => $nuevoStock
                    ]);

                    // 🧾 👉 AQUÍ ESTABA TU FALTA 🔥
                    DB::table('soporte_materiales_consumo')->insert([
                        'solicitud_id' => $id,
                        'material_id' => $productoId, // ahora es producto_id
                        'cantidad' => $cantidad,
                        'stock_previo' => $stockActual,
                        'user_id' => $user->id,
                        'created_at' => now()
                    ]);

                    // 🧠 nombre producto
                    $producto = DB::table('inventario_productos')
                        ->where('id', $productoId)
                        ->first();

                    $detallesDespacho[] = "🔹 {$cantidad} x **{$producto->nombre}**";
                }

                // 📩 MENSAJE
                $detalleTexto = implode("\n", $detallesDespacho);

                $mensajeTexto = "📄 **SISTEMAS - DESPACHO DE INSUMOS**\n" .
                    "----------------------------------------\n" .
                    "Se han entregado los siguientes materiales:\n\n" .
                    $detalleTexto;

                $comentario = SoporteComentario::create([
                    'solicitud_id' => $id,
                    'user_id' => $user->id,
                    'mensaje' => $mensajeTexto
                ]);

                $solicitud->visto_por_solicitante = false;
                $solicitud->save();

                return response()->json([
                    'message' => 'Materiales despachados correctamente',
                    'comentario' => $comentario->load('user')
                ]);
            });

        } catch (\Exception $e) {

            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
