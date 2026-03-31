<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class UserController extends Controller
{
    public function listaEmpleados(Request $request){
        $search = trim($request->query('search', ''));

        // Si no hay parámetro de búsqueda, devuelve todos
        if ($search === '') {
            $users = DB::connection('mysqlrrhh')->select('select * from v_matrrhh');
            return response()->json($users);
        }

        // Si hay búsqueda, filtramos en la base de datos
        $users = DB::connection('mysqlrrhh')->select("
        select * from v_matrrhh
        where NOMBRE_1 like ?
           or APELLIDO_1 like ?
           or NUM_CEDULA like ?
    ", ["%$search%", "%$search%", "%$search%"]);

        return response()->json($users);
    }
    public function ListaEmpleadosAdministrativos(Request $request)
    {
        $search = trim($request->query('search', ''));

        // Si no hay parámetro de búsqueda, devuelve todos
        if ($search === '') {
            $users = DB::connection('mysql')->select('select * from v_administrativomm');
            return response()->json($users);
        }

        // Si hay búsqueda, filtramos en la base de datos
        $users = DB::connection('mysql')->select("
        select * from v_administrativomm
        where NOMBRE_1 like ?
           or APELLIDO_1 like ?
           or NUM_CEDULA like ?
    ", ["%$search%", "%$search%", "%$search%"]);

        return response()->json($users);
    }

    public function registrarUsuario(Request $request)
    {
        try {
            // 🧭 Validación de campos requeridos
            $request->validate([
                'email' => 'required|email|unique:users,email',
                'password' => 'required',
                'nombre' => 'required',
                'apellido' => 'required',
                'idRol' => 'required|integer',
                'idGrupo' => 'required|integer',
                'idEmpresa' => 'required|integer',
                'empresa' => 'required',
                'username' => 'required',
                'codEmpleado' => 'required',
            ]);

            // 🧹 Limpieza y normalización de datos
            $data = [
                'name'        => strtoupper(trim($request->nombre ?? $request->name)),
                'surname'     => strtoupper(trim($request->apellido ?? $request->surname)),
                'email'       => strtolower(trim($request->email)),
                'password'    => Hash::make(trim($request->password)),
                'rol_id'      => $request->idRol ?? $request->rol_id,
                'group_id'    => $request->idGrupo ?? $request->group_id,
                'empresa_id'  => $request->idEmpresa ?? $request->empresa_id,
                'empe_nom'    => strtoupper(trim($request->empresa ?? $request->empe_nom)),
                'username'    => strtoupper(trim($request->username)),
                'codempleado' => strtoupper(trim($request->codEmpleado ?? $request->codempleado)),
                'status'      => 1,
                'created_at'  => now(),
                'updated_at'  => now(),
            ];

            // 💾 Inserción
            $userId = DB::connection('mysql')->table('users')->insertGetId($data);

            // 🔍 Recuperar usuario recién creado
            $user = DB::connection('mysql')->table('users')->where('id', $userId)->first();

            return response()->json([
                'status' => 1,
                'message' => '✅ Usuario registrado exitosamente',
                'code' => 200,
                'user' => $user
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // ❌ Si faltan campos o hay errores de validación
            return response()->json([
                'status' => 0,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
                'code' => 422
            ], 422);

        } catch (\Exception $e) {
            // ⚠️ Cualquier otro error interno
            return response()->json([
                'status' => 0,
                'message' => 'Error al registrar usuario',
                'error' => $e->getMessage(),
                'code' => 500
            ], 500);
        }
    }
    /**
     * ✏️ Actualizar usuario existente
     */
  /*  public function actualizarUsuario(Request $request, $id)
    {
        try {
            // ✅ Validar solo los campos editables
            $request->validate([
                'email'    => 'required|email|unique:users,email,' . $id,
                'password' => 'nullable|string|min:6',
                'idRol'    => 'required|integer',
                'idGrupo'  => 'required|integer',
            ]);

            // 🔍 Verificar si existe
            $user = DB::connection('mysql')->table('users')->where('id', $id)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado',
                ], 404);
            }

            // 🧹 Armar solo los datos que se pueden actualizar
            $data = [
                'email'     => strtolower(trim($request->email)),
                'rol_id'    => $request->idRol,
                'group_id'  => $request->idGrupo,
                'updated_at'=> now(),
            ];

            // 🔐 Si se envía contraseña, actualízala
            if ($request->filled('password')) {
                $data['password'] = Hash::make(trim($request->password));
            }

            // 💾 Actualizar
            DB::connection('mysql')
                ->table('users')
                ->where('id', $id)
                ->update($data);

            // 🔄 Obtener usuario actualizado
            $updatedUser = DB::connection('mysql')
                ->table('users')
                ->where('id', $id)
                ->first();

            return response()->json([
                'success' => true,
                'message' => '✅ Usuario actualizado correctamente',
                'data' => $updatedUser,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario',
                'error' => $e->getMessage(),
            ], 500);
        }
    }*/
    public function actualizarUsuario(Request $request, $id)
    {
        try {
            // Opcional: valida SOLO lo que venga en la request
            $request->validate([
                'email'    => 'sometimes|email|unique:users,email,' . $id,
                'password' => 'sometimes|nullable|string|min:6',
                'idRol'    => 'sometimes|integer',
                'idGrupo'  => 'sometimes|integer',
                'status'   => 'sometimes|boolean',
            ]);

            // Verificar si el usuario existe
            $user = DB::connection('mysql')->table('users')->where('id', $id)->first();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado',
                ], 404);
            }

            // Armar data dinámicamente según lo que llegue
            $data = [];

            if ($request->has('email')) {
                $data['email'] = strtolower(trim($request->email));
            }

            if ($request->has('idRol')) {
                $data['rol_id'] = $request->idRol;
            }

            if ($request->has('idGrupo')) {
                $data['group_id'] = $request->idGrupo;
            }

            if ($request->has('status')) {
                $data['status'] = $request->status;
            }

            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            // Siempre actualizar updated_at
            if (!empty($data)) {
                $data['updated_at'] = now();
            }

            DB::connection('mysql')->table('users')->where('id', $id)->update($data);

            $updatedUser = DB::connection('mysql')->table('users')->where('id', $id)->first();

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado correctamente',
                'data' => $updatedUser,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //
    public function index()
    {
        $users = DB::connection('mysql')->select('select * from w_usersrols');
        return response()->json($users);


    }
    public function ListaAdminisstrativos()
    {
        $users = DB::connection('mysql')->select('select * from v_usuarios');
        return response()->json($users);
    }

    public function listaRol(){
        $users = DB::connection('mysql')->select('select * from v_rol');
        return response()->json($users);
    }
    public function listaGrupo(){
        $users = DB::connection('mysql')->select('select * from v_grupos');
        return response()->json($users);
    }
}
