<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudSoporte extends Model
{
    use HasFactory;

    protected $table = 'soporte_tecnico';

    protected $fillable = [
        'tipo_solicitud',
        'tipo_personalizado',
        'titulo',
        'descripcion',
        'estado',
        'area_solicitante',
        'empresa_id',
        'foto_path',
        'visto_por_sistemas',
        'visto_por_solicitante',
        'created_by',
        'updated_by',
        'fecha_resuelto'
    ];

    protected $casts = [
        'visto_por_sistemas' => 'boolean',
        'visto_por_solicitante' => 'boolean',
        'fecha_resuelto' => 'datetime'
    ];

    /**
     * Relación con el usuario que creó la solicitud.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relación con los comentarios (hilo de chat).
     */
    public function comentarios()
    {
        return $this->hasMany(SoporteComentario::class, 'solicitud_id');
    }

    /**
     * Relación con la empresa a la que pertenece el solicitante.
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }
}
