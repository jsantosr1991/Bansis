<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SoporteComentario extends Model
{
    use HasFactory;

    protected $table = 'soporte_comentarios';

    protected $fillable = [
        'solicitud_id',
        'user_id',
        'mensaje'
    ];

    /**
     * Relación con la solicitud a la que pertenece.
     */
    public function solicitud()
    {
        return $this->belongsTo(SolicitudSoporte::class, 'solicitud_id');
    }

    /**
     * Relación con el usuario que escribió el comentario.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
