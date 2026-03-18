<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolicitudHermano extends Model {
    protected $table = 'solicitudes_hermanos';
    protected $guarded = ['id'];
}

// Nota: Para ahorrar espacio y archivos, podemos agrupar modelos simples o crearlos individualmente.
// Laravel prefiere archivos individuales. Crearé los más importantes.
