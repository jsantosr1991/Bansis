<?php

use App\Http\Controllers\Asistencia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BodegaHacienda;
use App\Http\Controllers\Estadisticas;
use App\Http\Controllers\PrivilegiosTemporales;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Balanzas;
use App\Http\Controllers\TalentoHumanoController;
use App\Http\Controllers\LaboresAgricolasController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SoporteController;
use App\Http\Controllers\InventarioMovimientoController;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/prueba', function () {
    return response()->json([
        'mensaje' => 'CONECTADO AL BACKEND LOCAL',
        'base_datos' => env('DB_DATABASE'),
        'host_db' => env('DB_HOST'),
        'ambiente' => 'PRUEBAS - TALENTO HUMANO',
        'estado' => 'SEGURO'
    ]);
});
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

});

// Talento Humano
Route::prefix('talento-humano')->group(function () {
    Route::get('/solicitudes', [TalentoHumanoController::class, 'index']);
    Route::get('/validar-cedula', [TalentoHumanoController::class, 'validarCedula']);
    Route::get('/solicitudes/{id}', [TalentoHumanoController::class, 'show']);
    Route::get('/labores', [TalentoHumanoController::class, 'getLabores']);
    Route::get('/empresas', [TalentoHumanoController::class, 'getEmpresas']);
    Route::post('/solicitudes', [TalentoHumanoController::class, 'store']);
    Route::post('/upload-foto', [TalentoHumanoController::class, 'uploadFoto']);
    Route::put('/solicitudes/{id}', [TalentoHumanoController::class, 'update']);
    Route::put('/solicitudes/{id}/estado', [TalentoHumanoController::class, 'updateEstado'])->middleware(['jwt.auth', 'check.group']);
    Route::post('/solicitudes/{id}/reingreso', [TalentoHumanoController::class, 'reingreso']);
    Route::delete('/solicitudes/{id}', [TalentoHumanoController::class, 'destroy']);
    Route::get('/provincias', [TalentoHumanoController::class, 'getProvincias']);
    Route::get('/cantones/{provinciaCodigo}', [TalentoHumanoController::class, 'getCantones']);
});

Route::group([
    'prefix' => 'auth'
], function () {
    // 🔓 Rutas públicas
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

    // 🔒 Rutas protegidas con JWT usando el guard api
    Route::middleware(['jwt.auth'])->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

    });


});
//Modulo Usuarios
Route::get('/users', [UserController::class, 'index']);
Route::get('/listaempleados', [UserController::class, 'listaEmpleados']); //lista de todos los empleados
Route::get('/listadminsitrativos', [UserController::class, 'ListaEmpleadosAdministrativos']); //obtener lista de todos los administrativos rrhmatrab
Route::get('/listarol', [UserController::class, 'listaRol']); //obtener lista de roles
Route::get('/listagrupo', [UserController::class, 'listaGrupo']); //obtener lista de grupos
Route::get('/getlistadminsitrativos', [UserController::class, 'ListaAdminisstrativos']);
Route::post('/registrarusuario', [UserController::class, 'registrarUsuario']); //registra nuevo usuario al sistema
Route::put('/actualizarusuario/{id}', [UserController::class, 'actualizarUsuario']);    //actualizar
//Nuevo
Route::post('/generar-username', [UserController::class, 'generarUsername']);



//otorgar permisos a usuarios
Route::get('/privilegios', [PrivilegiosTemporales::class, 'index']);
Route::post('/privilegios', [PrivilegiosTemporales::class, 'store']);
Route::post('/privilegios/desactivar/{id}', [PrivilegiosTemporales::class, 'desactivar']);

//Balanza
Route::post('/hojasaldos', [Balanzas::class, 'HojaSaldos']);
Route::post('/hojasaldoscaidas', [Balanzas::class, 'HojaCaidas']);
Route::post('/hojasaldosenfunde', [Balanzas::class, 'HojaSaldosEnfunde']);
Route::post('/getlotesmayordomos', [Balanzas::class, 'LotesMayordomo']);
//MATAS CAIDAS
Route::post('/getcalendarmatascaidas', [Balanzas::class, 'CalendarioMatasCaidas']);
Route::get('/getsemanamatascaidas', [Balanzas::class, 'GetSemanaMataCaidas']);
Route::post('/guardarmatascaidas', [Balanzas::class, 'GuardarMatasCaidas']);
Route::get('/historicomatascaidas', [Balanzas::class, 'historicomatascaidas']);
Route::get('/imprimirmatascaidas/{id}', [Balanzas::class, 'verPorId']);

Route::post('/informematascaidas', [Balanzas::class, 'obtenerInformeMatascaidas']);

//nuevo validar semana
Route::post('/validar-semana', [Balanzas::class, 'validarSemana']);


//LABORES AGRICOLAS
Route::post('/getlabagricolasgeneral', [LaboresAgricolasController::class, 'LaboresAgricolasGeneral']); //Ver labores agricolas
Route::post('/getlabagricolasfertilizante', [LaboresAgricolasController::class, 'LaboresAgricolasFertilizantes']); //Ver labores agricolas fertilizada
Route::post('/registrarlaboresagricolas', [LaboresAgricolasController::class, 'guardarLabores']); //Guardar Labores Agricolas

//ESTADISTICAS
Route::post('getsemcalendar', [Estadisticas::class, 'GetCalendarToday']); //obtener semana y periodo actual
Route::post('calendar', [Estadisticas::class, 'CintaCalendar']); //calendario cintas
Route::post('calendarenfunde', [Estadisticas::class, 'CintaCalendarEnfunde']); //calendario cintas Enfunde
Route::post('saldosp', [Estadisticas::class, 'SaldosP']); //SALDO FINAL ENFUNDADO - COSECHADO
Route::post('saldossof', [Estadisticas::class, 'SaldosSof']); //SALDO FINAL ENFUNDADO - COSECHADO -CAIDAS SOFCA
Route::post('cosechap', [Estadisticas::class, 'CosechaP']); ///cosecha primo
Route::post('cosechas', [Estadisticas::class, 'CosechaS']); ///cosecha SOFCA
Route::post('lotehistp', [Estadisticas::class, 'LotesHistP']); //ultimas 52 semanas de cosecha por lote
Route::post('histcinta', [Estadisticas::class, 'HistCinta']); //Peso promedio de la cinta hacia 52 semanas atras
Route::post('lotehistp2', [Estadisticas::class, 'LotesHistP2']); //ultimas 52 semanas de cosecha por lote del año anterior
Route::post('histcinta2', [Estadisticas::class, 'HistCinta2']); //Peso promedio de la cinta hacia 52 semanas atras del periodo anterior
Route::post('lotehists', [Estadisticas::class, 'LotesHistS']); //ultimas 52 semanas de cosecha por lote
Route::post('lotehists2', [Estadisticas::class, 'LotesHistS2']); //ultimas 52 semanas de cosecha por lote del año anterior
Route::post('enfloterocintas', [Estadisticas::class, 'EnfundeLoteroNuevo']); //CONSULTAR POR LOTE ENFUNDE DE LOTERO
Route::post('enfloterosemana', [Estadisticas::class, 'EnfundesLoteroXSemana']); //cantidades por lotero pre y fut
Route::post('getloteroterrestre', [Estadisticas::class, 'LoteroTerrestre']); //Lotero Terrestre
//recusados
Route::post('getracimosrecusados', [Estadisticas::class, 'RacimosRecusados']); //RACIMOS RECUSADOS POR LOTE



//ASISTENCIA
//MANDOS MEDIOS
Route::post('asistenciaMM', [Asistencia::class, 'VAsistenciaMM']);
Route::post('asistenciaGeneral', [Asistencia::class, 'VAsistenciaG']);// asistencia general con faltas y vacaciones por hacienda
Route::post('diascorte', [Asistencia::class, 'ViewdiasCorte']);// ver dias de corte
Route::post('viewfaltaspermisos', [Asistencia::class, 'ViewFaltasPermisos']); //ver faltas en el mes
Route::get('vempresashacienda', [Asistencia::class, 'V_Empresas']);
//BODEGA HACIENDA
Route::get('vsolicitudpedidos', [BodegaHacienda::class, 'GetSolicitudPedidos']);
Route::get('/vdetalle', [BodegaHacienda::class, 'GetDetalleProducto']);
Route::post('despachar', [BodegaHacienda::class, 'despachar']);// despachar
Route::post('getdepachar', [BodegaHacienda::class, 'GetSolicitudPedidos']);// obtener pedidos para despachar
Route::post('getdespacho', [BodegaHacienda::class, 'GetSolicitudDespachados']);// consultar items despachos
Route::post('getdespachocomprobar', [BodegaHacienda::class, 'GetComprobarDespachados']);// consultar despachos

Route::get('ultimafechadespacho', [BodegaHacienda::class, 'ultimaFechaDespacho']);
Route::get('ultimafechadespachoporhacienda', [BodegaHacienda::class, 'ultimaFechaDespachoPorHacienda']);//consulta por hacienda
//rollos

Route::post('rollos/crear-semana', [BodegaHacienda::class, 'crearSemana']);
Route::post('rollos/cerrar-semana', [BodegaHacienda::class, 'cerrarSemana']);
Route::get('rollos/estado', [BodegaHacienda::class, 'estadoActual']);
Route::get('rollos/por-seccion', [BodegaHacienda::class, 'produccionPorSeccion']);
Route::get('/rollos/total-fundas', [BodegaHacienda::class, 'totalFundasActual']);
// 🔥 PARA MODO AUTOMÁTICO (fecha → semana)
Route::get('rollos/semana', [BodegaHacienda::class, 'getSemanaPorFecha']);
// 🔥 ESTADO DE LA SEMANA
Route::get('rollos/estado-semana', [BodegaHacienda::class, 'estadoSemana']);
// 🟣 NUEVO: CONTROL POR PERSONA
/* =========================
 * PERSONAS PARA ASIGNAR LOTE
 * ========================= */
Route::get('rollos/personas/{idhacienda}', [BodegaHacienda::class, 'personas']);
Route::post('rollos/asignar-persona', [BodegaHacienda::class, 'asignarPersona']);

/* =========================
 * 🔥 NUEVO: MOVIMIENTOS DIARIOS
 * ========================= */
Route::get('rollos/movimientos/{idcontrol}', [BodegaHacienda::class, 'getMovimientosPorPersona']);
Route::post('rollos/despacho-persona', [BodegaHacienda::class, 'despachoPorPersona']);
//historico rollos
Route::post('/rollos/historial-persona', [BodegaHacienda::class, 'historialPersona']);

// 🔥 REEMPLAZO PERSONA
Route::post('/rollos/guardar-reemplazo', [BodegaHacienda::class, 'guardarReemplazo']);



//REPORTES JASPER

Route::get('/reporte-empleados', [ReportController::class, 'empleados']);
Route::post('/reporte-matascaidas', [ReportController::class, 'reportematascaidas']);

// SOPORTE TECNICO
Route::group(['prefix' => 'soporte-tecnico', 'middleware' => ['jwt.auth']], function () {
    Route::get('/', [SoporteController::class, 'index']);
    Route::post('/', [SoporteController::class, 'store']);
    Route::get('/{id}', [SoporteController::class, 'show']);
    Route::patch('/{id}/estado', [SoporteController::class, 'close']);
    Route::get('/{id}/mensajes', [SoporteController::class, 'getMessages']);
    Route::post('/{id}/mensajes', [SoporteController::class, 'postMessage']);

    // Rutas de materiales
    Route::get('/materiales/lista', [SoporteController::class, 'getMaterials']);
    Route::post('/{id}/despachar', [SoporteController::class, 'dispatchMaterial']);
});

Route::group(['prefix' => 'inventario', 'middleware' => ['jwt.auth']], function () {
    // 📦 PRODUCTOS
    Route::get('productos', [InventarioMovimientoController::class, 'productos']);
    Route::post('productos', [InventarioMovimientoController::class, 'crearProducto']);
    //CATEGOFIAS
    Route::get('categorias', [InventarioMovimientoController::class, 'categorias']);
    //BODEGAS
    Route::get('bodegas', [InventarioMovimientoController::class, 'bodegas']);
    // 🔄 MOVIMIENTOS
    Route::post('movimientos', [InventarioMovimientoController::class, 'store']);
    Route::get('movimientos', [InventarioMovimientoController::class, 'movimientos']);

    // 📊 STOCK
    Route::get('stock', [InventarioMovimientoController::class, 'stockGeneral']);
    Route::get('stock/{producto_id}', [InventarioMovimientoController::class, 'stock']);

    // 📘 KARDEX
    Route::get('kardex/{producto_id}', [InventarioMovimientoController::class, 'kardex']);

    // 🔹NUEVO ASIGNAR PRODUCTO A USUARIO
    Route::post('/asignar', [InventarioMovimientoController::class, 'asignarProducto']);

    // 🔹 HISTORIAL DE ASIGNACIONES
    Route::get('/asignaciones', [InventarioMovimientoController::class, 'historialAsignaciones']);

    // 🔹 DEVOLVER PRODUCTO
    Route::post('/devolver', [InventarioMovimientoController::class, 'devolverProducto']);

});

Route::group(['prefix' => 'labores', 'middleware' => ['jwt.auth']], function () {
    Route::post('/sp', [LaboresAgricolasController::class, 'getLaboresSP']);

    Route::post('/guardadas', [LaboresAgricolasController::class, 'getGuardadas']);

    Route::post('/guardar', [LaboresAgricolasController::class, 'guardarLabores']);

    Route::post('/cerrar', [LaboresAgricolasController::class, 'cerrarSemana']);
    Route::post('/reportesemanal', [LaboresAgricolasController::class, 'getSemanaLabores']); //reporte semanal de labores agricolas


});
