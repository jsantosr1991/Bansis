<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // ? agregar esta línea

class SyncMatriz extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-matriz';

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
       $this->info('Sincronizando personal...');

    try {

        /*
        |--------------------------------------------------------------------------
        | 1️⃣ Traer todos los registros del servidor remoto
        |--------------------------------------------------------------------------
        */
        $rows = DB::connection('mysqlrrhh')
            ->table('rh_mtrab')
            ->get();

        if ($rows->isEmpty()) {
            $this->info('No hay registros.');
            return;
        }

        $this->info('Registros remotos: ' . $rows->count());

        /*
        |--------------------------------------------------------------------------
        | 2️⃣ Convertir a array
        |--------------------------------------------------------------------------
        */
        $data = $rows->map(fn($row) => (array) $row)->toArray();

        /*
        |--------------------------------------------------------------------------
        | 3️⃣ Upsert masivo
        |--------------------------------------------------------------------------
        */
        DB::connection('mysql')
            ->table('rh_mtrab')
            ->upsert(
                $data,
                ['COD_TRABAJ', 'COD_EMPRESA'], // 👈 clave única real
                [
                    'NUM_CEDULA',
                    'APELLIDO_1',
                    'APELLIDO_2',
                    'NOMBRE_1',
                    'NOMBRE_2',
                    'NOMBRE_CORTO',
                    'FEC_SALIDA',
                    'COD_LABOR',
                    'COD_HACIENDA',
                    'COD_CENTRO',
                    'COD_TIPO',
                    'HECTAREAS',
                    'ESTADO',
                  //  'COD_EMPRESA',
                    'EMPRESA',
                    'SUELDO',
                    'TIP_ROL',
                    'TIP_CONTRATO',
                    'SOLO_CORTE',
                    'FEC_INGRESO',
                    'fechasub',
                    'usuariosub',
                    'codcargo',
                    'nomcargo',
                    'edad',
                    'fec_nacimiento',
                    'es_lotero',
                    'fl_cargo',
                    // todos los demás campos...
                ]
            );

        /*
        |--------------------------------------------------------------------------
        | 4️⃣ Eliminar registros que ya no existan en remoto
        |--------------------------------------------------------------------------
        */
        $idsRemotos = $rows->pluck('COD_TRABAJ')->toArray();

        DB::connection('mysql')
            ->table('rh_mtrab')
            ->whereNotIn('COD_TRABAJ', $idsRemotos)
            ->delete();

        $this->info('Sincronización completada correctamente.');

    } catch (\Throwable $e) {

        \Log::error('Error sincronizando personal', [
            'error' => $e->getMessage()
        ]);

        $this->error('Error en sincronización.');
    }
    }
}
