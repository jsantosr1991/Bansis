export interface Asistencia {
  FECHA: string;
  HoraE: string | null;
  HoraS: string | null;
  COD_TRABAJ: string;
  NUM_CEDULA: string;
  NOMBRE_CORTO: string;
  EMPRESA: string;
  COD_EMPRESA: string;
  SOLO_CORTE: string;
  es_lotero: string;
  nomcargo: string;
  codcargo: string;
  asis: string;
  FechaI: string | null;
  FechaF: string | null;
  OBSERVACION: string ;
}
export interface DiasCorteI{
  fecha: string;
  estado: string;
  idempresa:number;
}
