<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo para la tabla 'empresa' ya existente en la base de datos.
 * NOTA: Esta tabla es administrada por otro módulo. Aquí solo la usamos de consulta.
 */
class Empresa extends Model
{
    use HasFactory;

    protected $table = 'empresa';

    // Desactivamos timestamps si la tabla original no los tiene en formato Laravel
    public $timestamps = false;

    protected $guarded = ['id'];

    /**
     * Relación: Una empresa puede tener muchas solicitudes de empleo.
     */
    public function solicitudes()
    {
        return $this->hasMany(SolicitudEmpleo::class, 'company_id');
    }
}
