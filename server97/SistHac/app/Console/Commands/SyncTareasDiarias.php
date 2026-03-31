<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // ? agregar esta línea

class SyncTareasDiarias extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-tareas-diarias';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza solicitudes desde SQL Server a MySQL usando clave compuesta';


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('?? Iniciando sincronización de solicitudes...');

        try {
            $idhacienda = 1;
            /*
             |--------------------------------------------------------------------------
             | 1?? Obtener última fecha sincronizada desde MySQL
             |--------------------------------------------------------------------------
             */
            $ultimaFecha = DB::connection('mysql')
                ->table('solicitud_bodega')
                ->where('idhacienda', $idhacienda)
                ->max('FechaEmision');

            if (!$ultimaFecha) {
                // Si es la primera vez
                $ultimaFecha = now()->subDays(7)->toDateString();
                $this->info('?? No hay registros previos, sincronizando últimos 7 días');
            } else {
                $ultimaFecha = \Carbon\Carbon::parse($ultimaFecha)->toDateString();
                $this->info("?? Última fecha sincronizada: {$ultimaFecha}");
            }

            /*
             |--------------------------------------------------------------------------
             | 2?? Consulta a SQL Server (rango seguro)
             |--------------------------------------------------------------------------
             */
            $rows = DB::connection('sqlxassP')->select("select a.Documento,a.FechaEmision,a.Bodega codBodega,(select w.Nombre from PRIMOBANANO.dbo.SGI_Inv_Bodegas w where w.Id_Fila=a.Bodega) bodega,
 1 as idhacienda,'PRIMOBANANO' AS hacienda,b.linea, b.Codigo codProd,(select y.nombre from PRIMOBANANO.dbo.SGI_Inv_Productos y where y.codigo=b.Codigo )producto,b.CantidadDigitada,Precio_Unidad,precio Total,Comentario,Comentario2,uso,
(select x.Nombre from PRIMOBANANO.inv.Tbl_Tm_Solicitante x where x.Codigo=b.Solicitante )Solicitante,
(select z.Nombre from PRIMOBANANO.dbo.Erp_Inv_UnidadSolicitada z where z.Codigo=b.area) area,upper(SGI_Config.dbo.base64_decode(a.Usuario_Registro))                        usuario
from PRIMOBANANO.dbo.SGI_Inv_Sol_Com_Cab a, PRIMOBANANO.dbo.SGI_Inv_Sol_Com_Tra b
where  a.Id_Fila=b.Numero and a.FechaEmision >= ? and a.Bodega <> 0", [$ultimaFecha]);

            $this->info("?? Registros encontrados: " . count($rows));

            /*
             |--------------------------------------------------------------------------
             | 3?? Sincronizar con MySQL
             |--------------------------------------------------------------------------
             */
            foreach ($rows as $row) {

                $registro = DB::connection('mysql')
                    ->table('solicitud_bodega')
                    ->where('Documento', $row->Documento)
                    ->where('linea', $row->linea)
                    ->first();

                if ($registro) {

                    // ?? NO tocar registros ya despachados
                    if ((int)$registro->despachado === 1) {
                        continue;
                    }

                    DB::connection('mysql')
                        ->table('solicitud_bodega')
                        ->where('Documento', $row->Documento)
                        ->where('linea', $row->linea)
                        ->update([
                            'FechaEmision' => $row->FechaEmision,
                            'codBodega' => $row->codBodega,
                            'bodega' => $row->bodega,
                            'idhacienda' => $row->idhacienda,
                            'hacienda' => $row->hacienda,
                            'codProd' => $row->codProd,
                            'producto' => $row->producto,
                            'CantidadDigitada' => $row->CantidadDigitada,
                            'Comentario' => $row->Comentario,
                            'Comentario2' => $row->Comentario2,
                            'Solicitante' => $row->Solicitante,
                            'area' => $row->area,
                            'usuario' => $row->usuario,
                            'updated_at' => now(),
                        ]);

                } else {

                    DB::connection('mysql')
                        ->table('solicitud_bodega')
                        ->insert([
                            'Documento' => $row->Documento,
                            'linea' => $row->linea,
                            'FechaEmision' => $row->FechaEmision,
                            'codBodega' => $row->codBodega,
                            'bodega' => $row->bodega,
                            'idhacienda' => $row->idhacienda,
                            'hacienda' => $row->hacienda,
                            'codProd' => $row->codProd,
                            'producto' => $row->producto,
                            'CantidadDigitada' => $row->CantidadDigitada,
                            'Comentario' => $row->Comentario,
                            'Comentario2' => $row->Comentario2,
                            'Solicitante' => $row->Solicitante,
                            'area' => $row->area,
                            'usuario' => $row->usuario,
                            'TotalDespachado' => 0,
                            'despachado' => 0,
                            'estado' => 1,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                }
            }

            $this->info('? Sincronización completada correctamente');

        } catch (\Throwable $e) {

            Log::error('? Error sincronizando solicitudes', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $this->error('? Error durante la sincronización, revisa logs');
        }
    }



}
