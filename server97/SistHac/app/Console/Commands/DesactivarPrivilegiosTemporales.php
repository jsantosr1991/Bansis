<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DesactivarPrivilegiosTemporales extends Command
{
    protected $signature = 'privilegios:desactivar';
    protected $description = 'Desactiva privilegios temporales que han expirado';

    public function handle()
    {
        $hoy = Carbon::now('America/Lima')->toDateString();

        $actualizados = DB::table('privilegios_temporales')
            ->where('activo', 1)
            ->where('fecha_fin', '<', $hoy)
            ->update(['activo' => 0]);

        Log::info("Privilegios temporales desactivados automáticamente", [
            'fecha' => $hoy,
            'cantidad' => $actualizados
        ]);

        $this->info("Privilegios expirados desactivados: $actualizados");
    }
}
