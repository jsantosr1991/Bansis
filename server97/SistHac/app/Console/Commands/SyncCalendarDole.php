<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SyncCalendarDole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-calendar-dole';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza tabla de calendario Dole de MYSQL';

    /**
     * Execute the console command.
     */
    public function handle()
     {
       $this->info('Sincronizando calendario...');

    try {

        /*
        |--------------------------------------------------------------------------
        | 1️⃣ Traer todos los registros del servidor remoto
        |--------------------------------------------------------------------------
        */
        $rows = DB::connection('mysqlrrhh')
            ->table('sis_calendario_dole')
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
            ->table('sis_calendario_dole')
            ->upsert(
                $data,
                ['idcalendar', 'fecha'], // 👈 clave única real
                [
                                     
                    'semana',
                    'periodo',
                    'color',
                    
                    // todos los demás campos...
                ]
            );

        /*
        |--------------------------------------------------------------------------
        | 4️⃣ Eliminar registros que ya no existan en remoto
        |--------------------------------------------------------------------------
        */
        $idsRemotos = $rows->pluck('idcalendar')->toArray();

        DB::connection('mysql')
            ->table('sis_calendario_dole')
            ->whereNotIn('idcalendar', $idsRemotos)
            ->delete();

        $this->info('Sincronización completada correctamente.');

    } catch (\Throwable $e) {

        \Log::error('Error sincronizando calendario', [
            'error' => $e->getMessage()
        ]);

        $this->error('Error en sincronización.');
    }
    }
}
