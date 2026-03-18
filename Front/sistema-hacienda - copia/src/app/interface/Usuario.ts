export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  username: string;
  empresa: string;
  idRol: number;
  idGrupo: number;
  idEmpresa: number;
  codEmpleado: string;
}
