<?php

namespace App\Console;

use App\Console\Commands\SyncTareasDiarias;
use App\Console\Commands\SyncTareasDiariasSofca;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected $commands = [
        SyncTareasDiarias::class,
        SyncTareasDiariasSofca::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        // Ejecutar todos los días a medianoche
        $schedule->command('privilegios:desactivar')->daily();
        $schedule->command('app:sync-tareas-diarias')
            ->cron('0 4,12,17 * * *')
            ->withoutOverlapping()
            ->onOneServer()
            ->appendOutputTo(storage_path('logs/sync-tareas.log'));
        $schedule->command('app:sync-tareas-diarias-sofca')
            ->cron('0 4,12,17 * * *')
            ->withoutOverlapping()
            ->onOneServer()
            ->appendOutputTo(storage_path('logs/sync-tareas.log'));

        $schedule->command('app:sync-calendar-dole')->weekly();


    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
