<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventarioMovimientoController extends Controller
{

    private function success($data = null, $message = 'OK', $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'error' => null
        ], $code);
    }

    private function error($message = 'Error', $error = null, $code = 500)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => null,
            'error' => $error
        ], $code);
    }


    // 🔄 REGISTRAR MOVIMIENTO
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {

            $request->validate([
                'producto_id' => 'required|exists:inventario_productos,id',
                'bodega_id' => 'required|exists:inventario_bodegas,id',
                'tipo' => 'required|in:INGRESO,SALIDA,AJUSTE',
                'cantidad' => 'required|numeric|min:0.01',
            ]);

            $productoId = $request->producto_id;
            $bodegaId = $request->bodega_id;
            $cantidad = $request->cantidad;
            $tipo = $request->tipo;

            $stock = DB::table('inventario_stock')
                ->where('producto_id', $productoId)
                ->where('bodega_id', $bodegaId)
                ->lockForUpdate()
                ->first();

            $stockActual = $stock->cantidad_actual ?? 0;

            if ($tipo === 'SALIDA' && $stockActual < $cantidad) {
                throw new \Exception("Stock insuficiente");
            }

            $nuevoStock = match ($tipo) {
                'INGRESO' => $stockActual + $cantidad,
                'SALIDA' => $stockActual - $cantidad,
                'AJUSTE' => $cantidad
            };

            DB::table('inventario_movimientos')->insert([
                'producto_id' => $productoId,
                'bodega_id' => $bodegaId,
                'tipo' => $tipo,
                'cantidad' => $cantidad,
                'motivo' => $request->motivo,
                'documento' => $request->documento,
                'usuario_id' => auth()->id() ?? 1,
                'fecha' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);

            if ($stock) {
                DB::table('inventario_stock')
                    ->where('id', $stock->id)
                    ->update(['cantidad_actual' => $nuevoStock]);
            } else {
                DB::table('inventario_stock')->insert([
                    'producto_id' => $productoId,
                    'bodega_id' => $bodegaId,
                    'cantidad_actual' => $nuevoStock
                ]);
            }

            DB::table('inventario_kardex')->insert([
                'producto_id' => $productoId,
                'bodega_id' => $bodegaId,
                'fecha' => now(),
                'tipo' => $tipo,
                'cantidad' => $cantidad,
                'stock_anterior' => $stockActual,
                'stock_nuevo' => $nuevoStock
            ]);

            DB::commit();

            return $this->success([
                'stock' => $nuevoStock
            ], 'Movimiento registrado');

        } catch (\Throwable $e) {

            DB::rollBack();

            return $this->error('Error al registrar movimiento', $e->getMessage());
        }
    }

    // 📦 LISTAR PRODUCTOS + STOCK
    public function productos()
    {
        $data = DB::table('inventario_productos as p')
            ->leftJoin('inventario_stock as s', 'p.id', '=', 's.producto_id')
            ->leftJoin('inventario_bodegas as b', 'b.id', '=', 's.bodega_id')
            ->select(
                'p.id',
                'p.nombre',
                'p.codigo',
                'p.descripcion',
                's.bodega_id',
                'b.nombre as bodega',
                's.cantidad_actual as stock'
            )
            ->where('p.estado', 1)
            ->get();

        return $this->success($data);
    }
    public function categorias()
    {
        $data = DB::table('inventario_categorias')
            ->select(['id', 'nombre'])
            ->get();

        return $this->success($data);
    }

    public function bodegas()
    {
        $data = DB::table('inventario_bodegas')
            ->select(['id', 'nombre'])
            ->get();

        return $this->success($data);
    }


    // ➕ CREAR PRODUCTO
    public function crearProducto(Request $request)
    {
        DB::beginTransaction();

        try {

            $request->validate([
                'nombre' => 'required|string|max:150',
                'categoria_id' => 'required|exists:inventario_categorias,id',
                'stock_inicial' => 'nullable|numeric|min:0',
                'bodega_id' => 'nullable|exists:inventario_bodegas,id',

                // 🔥 NUEVO (IMAGEN)
                'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048'
            ]);

            // 📸 GUARDAR IMAGEN (SIN AFECTAR LO DEMÁS)
            $rutaImagen = null;

            if ($request->hasFile('imagen')) {
                $rutaImagen = $request->file('imagen')->store('productos', 'public');
            }

            $productoId = DB::table('inventario_productos')->insertGetId([
                'codigo' => $request->codigo ? strtoupper($request->codigo) : null,
                'nombre' => strtoupper($request->nombre),
                'descripcion' => $request->descripcion ? strtoupper($request->descripcion) : null,
                'categoria_id' => $request->categoria_id,
                'unidad' => $request->unidad ?? 'unidad',
                'stock_minimo' => $request->stock_minimo ?? 0,

                // 🔥 NUEVO CAMPO
                'imagen' => $rutaImagen,

                'estado' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // ✅ STOCK INICIAL (INTACTO)
            if ($request->stock_inicial > 0) {

                $bodegaId = $request->bodega_id ?? 1;
                $cantidad = $request->stock_inicial;

                // 1. MOVIMIENTO
                DB::table('inventario_movimientos')->insert([
                    'producto_id' => $productoId,
                    'bodega_id' => $bodegaId,
                    'tipo' => 'INGRESO',
                    'cantidad' => $cantidad,
                    'motivo' => 'STOCK INICIAL',
                    'usuario_id' => auth()->id() ?? 1,
                    'fecha' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // 2. STOCK
                DB::table('inventario_stock')->insert([
                    'producto_id' => $productoId,
                    'bodega_id' => $bodegaId,
                    'cantidad_actual' => $cantidad
                ]);

                // 3. KARDEX
                DB::table('inventario_kardex')->insert([
                    'producto_id' => $productoId,
                    'bodega_id' => $bodegaId,
                    'fecha' => now(),
                    'tipo' => 'INGRESO',
                    'cantidad' => $cantidad,
                    'stock_anterior' => 0,
                    'stock_nuevo' => $cantidad
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Producto creado correctamente',
                'data' => [
                    'id' => $productoId,
                    // 🔥 OPCIONAL (para frontend)
                    'imagen' => $rutaImagen
                ]
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al crear producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 📊 STOCK POR PRODUCTO
    public function stock($productoId, $bodegaId = null)
    {
        $query = DB::table('inventario_stock')
            ->where('producto_id', $productoId);

        if ($bodegaId) {
            $query->where('bodega_id', $bodegaId);
        }

        return response()->json($query->get());
    }

    // 📊 STOCK GENERAL
    public function stockGeneral()
    {
        return response()->json(
            DB::table('inventario_stock as s')
                ->join('inventario_productos as p', 'p.id', '=', 's.producto_id')
                ->join('inventario_bodegas as b', 'b.id', '=', 's.bodega_id')
                ->select(
                    'p.id',
                    'p.nombre',
                    'p.codigo',
                    's.bodega_id as bodega_id',
                    'b.nombre as bodega',
                    's.cantidad_actual'
                )
                ->get()
        );
    }

    // 📘 KARDEX
    public function kardex($productoId)
    {
        return response()->json(
            DB::table('inventario_kardex')
                ->where('producto_id', $productoId)
                ->orderBy('fecha', 'desc')
                ->get()
        );
    }

    // 🔄 HISTORIAL DE MOVIMIENTOS
    public function movimientos()
    {
        $data = DB::table('inventario_movimientos')
            ->orderBy('fecha', 'desc')
            ->limit(200)
            ->get();

        return $this->success($data);
    }

    public function asignarProducto(Request $request)
    {
        DB::beginTransaction();

        try {

            $request->validate([
                'producto_id' => 'required|exists:inventario_productos,id',
                'usuario_recibe_id' => 'required|integer',
                'cantidad' => 'required|numeric|min:1',
                'observacion' => 'nullable|string',
                'bodega_id' => 'required|exists:inventario_bodegas,id'
            ]);

            $productoId = $request->producto_id;
            $bodegaId = $request->bodega_id;
            $cantidad = $request->cantidad;

            // 🔒 BLOQUEAR STOCK
            $stock = DB::table('inventario_stock')
                ->where('producto_id', $productoId)
                ->where('bodega_id', $bodegaId)
                ->lockForUpdate()
                ->first();

            $stockActual = $stock->cantidad_actual ?? 0;

            if ($stockActual < $cantidad) {
                throw new \Exception("Stock insuficiente para asignar");
            }

            $nuevoStock = $stockActual - $cantidad;

            // 📉 DESCONTAR STOCK
            DB::table('inventario_stock')
                ->where('id', $stock->id)
                ->update([
                    'cantidad_actual' => $nuevoStock
                ]);

            // 📦 MOVIMIENTO (SALIDA)
            DB::table('inventario_movimientos')->insert([
                'producto_id' => $productoId,
                'bodega_id' => $bodegaId,
                'tipo' => 'SALIDA',
                'cantidad' => $cantidad,
                'motivo' => 'ASIGNACIÓN A USUARIO',
                'usuario_id' => auth()->id() ?? 1,
                'fecha' => now(),
                'created_at' => now(),
                'updated_at' => now()
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

            // 🧾 REGISTRO DE ASIGNACIÓN (CLAVE 🔥)
            DB::table('inventario_asignaciones')->insert([
                'producto_id' => $productoId,
                'cantidad' => $cantidad,
                'usuario_recibe_id' => $request->usuario_recibe_id,
                'usuario_entrega_id' => auth()->id() ?? 1,
                'fecha' => now(),
                'observacion' => strtoupper($request->observacion),
                'created_at' => now(),
                'updated_at' => now()
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Producto asignado correctamente'
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al asignar producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function historialAsignaciones()
    {
        $data = DB::table('inventario_asignaciones as a')
            ->join('inventario_productos as p', 'p.id', '=', 'a.producto_id')
            ->join('v_usuarios as ur', 'ur.codempleado', '=', 'a.usuario_recibe_id')
            ->join('v_usuarios as ue', 'ue.id', '=', 'a.usuario_entrega_id')
            ->select(
                'a.id',
                'p.nombre as producto',
                'a.cantidad',
                'ur.NOMBRE_CORTO as usuario_recibe',
                'ue.NOMBRE_CORTO as usuario_entrega',
                'a.fecha',
                'a.observacion'
            )
            ->orderByDesc('a.fecha')
            ->get();

        return response()->json($data);
    }
    public function devolverProducto(Request $request)
    {
        DB::beginTransaction();

        try {

            $request->validate([
                'producto_id' => 'required',
                'cantidad' => 'required|numeric|min:1',
                'bodega_id' => 'required'
            ]);

            $productoId = $request->producto_id;
            $bodegaId = $request->bodega_id;
            $cantidad = $request->cantidad;

            // 📈 SUMAR STOCK
            $stock = DB::table('inventario_stock')
                ->where('producto_id', $productoId)
                ->where('bodega_id', $bodegaId)
                ->lockForUpdate()
                ->first();

            $stockActual = $stock->cantidad_actual ?? 0;
            $nuevoStock = $stockActual + $cantidad;

            DB::table('inventario_stock')
                ->updateOrInsert(
                    [
                        'producto_id' => $productoId,
                        'bodega_id' => $bodegaId
                    ],
                    [
                        'cantidad_actual' => $nuevoStock
                    ]
                );

            // 📦 MOVIMIENTO (INGRESO)
            DB::table('inventario_movimientos')->insert([
                'producto_id' => $productoId,
                'bodega_id' => $bodegaId,
                'tipo' => 'INGRESO',
                'cantidad' => $cantidad,
                'motivo' => 'DEVOLUCIÓN DE USUARIO',
                'usuario_id' => auth()->id() ?? 1,
                'fecha' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Producto devuelto correctamente'
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error en devolución',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}