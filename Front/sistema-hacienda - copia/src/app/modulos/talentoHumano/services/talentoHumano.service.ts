import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TalentoHumanoService {

    private apiUrl = environment.apiUrl;

    // Mock de datos para listas que aún no están en el back
    private bancos = ['Pichincha', 'Guayaquil', 'Pacifico', 'Produbanco'];
    private areas = ['Campo', 'Empacadora', 'Administración'];
    private paises = ['Ecuador', 'Colombia', 'Perú', 'Venezuela', 'Argentina', 'Chile', 'Otros'];

    private provinciasMap: { [key: string]: string[] } = {
        'Ecuador': [
            'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas',
            'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo',
            'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas',
            'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe', 'Otros'
        ],
        'Colombia': ['Antioquia', 'Bogotá D.C.', 'Valle del Cauca', 'Atlántico', 'Bolívar', 'Santander'],
        'Perú': ['Lima', 'Arequipa', 'La Libertad', 'Piura', 'Cusco', 'Callao'],
        'Venezuela': ['Zulia', 'Miranda', 'Carabobo', 'Distrito Capital', 'Aragua', 'Lara'],
        'Argentina': ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Ciudad Autónoma de Buenos Aires', 'Mendoza', 'Tucumán'],
        'Chile': ['Región Metropolitana de Santiago', 'Valparaíso', 'Biobío', 'Antofagasta', 'Araucanía'],
        'Otros': []
    };

    constructor(private http: HttpClient) { }

    getBancos(): Observable<string[]> {
        return of(this.bancos);
    }

    getAreas(): Observable<string[]> {
        return of(this.areas);
    }

    getPaises(): Observable<string[]> {
        return of(this.paises);
    }

    getProvinciasPorPais(pais: string): Observable<any[]> {
        if (pais === 'Ecuador') {
            return this.http.get<any[]>(`${this.apiUrl}/talento-humano/provincias`);
        }
        let provincias = this.provinciasMap[pais] || [];
        // Convert static array to expected object format for consistency
        return of(provincias.map(p => ({ codigo: p, nombre: p })));
    }

    getCantonesPorProvincia(provinciaCodigo: string): Observable<any[]> {
        if (!provinciaCodigo || provinciaCodigo === 'Otros') return of([]);
        return this.http.get<any[]>(`${this.apiUrl}/talento-humano/cantones/${provinciaCodigo}`);
    }

    /**
     * Verifica si una cédula ya existe en el sistema.
     * @param cedula Número de identificación a validar.
     * @param excludeId ID de la solicitud a excluir (opcional, para edición).
     */
    validarCedula(cedula: string, excludeId?: number): Observable<any> {
        let params: any = { cedula };
        if (excludeId) params.exclude_id = excludeId;
        return this.http.get(`${this.apiUrl}/talento-humano/validar-cedula`, { params });
    }

    /**
     * Obtiene el listado de empresas activas desde el catálogo oficial en el backend.
     * @returns Observable con el listado de empresas (id y nombre).
     */
    getEmpresas(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/talento-humano/empresas`);
    }

    getGrupos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/listagrupo`);
    }

    /**
     * Obtiene las labores disponibles para un área específica desde el backend.
     * Consulta una base de datos externa (erp_hac) de solo lectura.
     * @param area El área (Campo, Empacadora, Administración).
     * @returns Observable con el listado de labores obtenidas del ERP.
     */
    getLaboresPorArea(area: string): Observable<string[]> {
        if (!area) return of([]);
        return this.http.get<string[]>(`${this.apiUrl}/talento-humano/labores`, {
            params: { area }
        });
    }

    /**
     * Envía la solicitud de empleo completa al backend para su creación.
     * @param data Datos de la solicitud en formato anidado.
     * @returns Observable con la respuesta del servidor (incluye el ID generado).
     */
    guardarSolicitud(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/talento-humano/solicitudes`, data);
    }

    /**
     * Obtiene el listado de todas las solicitudes registradas en la base local.
     * @returns Observable con el arreglo de solicitudes simplificadas para la tabla.
     */
    getSolicitudes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/talento-humano/solicitudes`);
    }

    /**
     * Obtiene el detalle completo y re-anidado de una solicitud por su ID.
     * @param id Identificador único de la solicitud.
     * @returns Observable con el objeto de solicitud detallado para visualización/edición.
     */
    getSolicitud(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/talento-humano/solicitudes/${id}`);
    }

    /**
     * Actualiza una solicitud de empleo existente y sus relaciones.
     * @param id Identificador de la solicitud.
     * @param data Datos anidados actualizados del formulario.
     * @returns Observable con el resultado de la operación.
     */
    actualizarSolicitud(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/talento-humano/solicitudes/${id}`, data);
    }

    /**
     * Actualiza el estado de una solicitud de empleo y ejecuta contratación si aplica.
     * @param id Identificador de la solicitud.
     * @param estado Nuevo estado (PENDIENTE, EN_REVISION, APROBADO, RECHAZADO).
     * @returns Observable con la respuesta del servidor.
     */
    updateEstado(id: number, payload: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/talento-humano/solicitudes/${id}/estado`, payload);
    }

    /**
     * Elimina permanentemente una solicitud de empleo y sus tablas dependientes.
     * SEGURIDAD: Solo afecta a la base de datos de copia/local.
     * @param id Identificador de la solicitud a eliminar.
     * @returns Observable con el mensaje de éxito de la eliminación.
     */
    eliminarSolicitud(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/talento-humano/solicitudes/${id}`);
    }
}
