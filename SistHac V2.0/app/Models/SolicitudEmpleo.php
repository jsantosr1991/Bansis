<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudEmpleo extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_empleo';

    protected $guarded = ['id'];

    /**
     * Relaciones con tablas secundarias
     */

    public function hermanos()
    {
        return $this->hasMany(SolicitudHermano::class, 'solicitud_id');
    }

    public function hijos()
    {
        return $this->hasMany(SolicitudHijo::class, 'solicitud_id');
    }

    public function conyugesAnteriores()
    {
        return $this->hasMany(SolicitudConyugeAnterior::class, 'solicitud_id');
    }

    public function cursos()
    {
        return $this->hasMany(SolicitudCurso::class, 'solicitud_id');
    }

    public function experiencias()
    {
        return $this->hasMany(SolicitudExperiencia::class, 'solicitud_id');
    }

    public function referenciasLaborales()
    {
        return $this->hasMany(SolicitudReferenciaLaboral::class, 'solicitud_id');
    }

    public function referenciasPersonales()
    {
        return $this->hasMany(SolicitudReferenciaPersonal::class, 'solicitud_id');
    }

    public function familiaresEmpresa()
    {
        return $this->hasMany(SolicitudFamiliarEmpresa::class, 'solicitud_id');
    }

    public function observaciones()
    {
        return $this->hasMany(SolicitudObservacion::class, 'solicitud_id')->orderBy('id', 'asc');
    }

    /**
     * Relación: Una solicitud pertenece a una empresa.
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'company_id');
    }
}
