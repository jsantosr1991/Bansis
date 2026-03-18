import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HojasaldosService} from '../../services/hojasaldos.service';
import {UserService} from '../../services/user.service';
import {AuthserviceService} from '../../services/authservice.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matascaidas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './matascaidas.component.html',
  styleUrl: './matascaidas.component.css'
})
export class MatascaidasComponent implements OnInit {
  today: Date = new Date();
  codEmpleado = '';
  user: string | null = '';
  anio: number = 0;

  array = [] as any;
  semana = '';

  Mayordomo = [] as any;
  gridForm!: FormGroup;
  idhaciendaSeleccionada: any = null;  // Guarda el valor seleccionado del select
  idmayordomoSeleccionado: any = null;  // Guarda el valor seleccionado del select
  haciendas: { id: any, nombre: string }[] = [];  // Lista de haciendas para el select
  nombreHaciendaSeleccionado: string = '';
  // Columnas fijas
  columns: any [] = [];

  // Las filas (mayordomos) se llenan desde el servicio
  rows: string[] = [];

  constructor(private fb: FormBuilder,
              private servicio: HojasaldosService,
              private userService: UserService,
              private router: Router, // 👈 agrega esto
              protected permisoService: AuthserviceService) {
  }

  ngOnInit(): void {
    this.semanaMatascaidas();
    this.user = this.userService.getUsername();
    this.anio = this.today.getFullYear();
    this.today

    // Obtener el ID de la hacienda desde el token del usuario
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();  // ajusta el método según tu implementación
    // console.log("Hacienda seleccionada desde el token:", this.idhaciendaSeleccionada);

    this.gridForm = this.fb.group({});

    this.haciendas = [
      {id: 1, nombre: 'PRIMOBANANO'},

      {id: 8, nombre: 'SOFCABANANO'}
    ];
    this.onHaciendaSeleccionada();
  }

  semanaMatascaidas() {
    this.servicio.obtenerSemanaMatasCaidas().subscribe((data: any[]) => {
      this.semana = data[0]?.semana;
      this.cintasMatascaidas(this.semana)

    })
  }

  cintasMatascaidas(semana: any) {

    this.servicio.obtenerCintasMataCaidas(semana).subscribe((data: any[]) => {

      this.columns = data.map(item => ({
        codigo: item.idcalendar,
        color: item.color
      }));
      this.columns = this.columns.reverse();

      if (this.rows.length > 0) {
        this.buildGridForm()
      }
    })
  }

  onHaciendaSeleccionada(): void {
    if (!this.idhaciendaSeleccionada) return;

    this.obtenerNombreHacienda();
    this.codEmpleado = this.userService.getCodEmpleado() || '';

    // 🔹 Primero obtenemos los mayordomos, y cuando lleguen filtramos
    this.userService.getAdministrativos().subscribe(respuesta => {
      const mayordomos = 3;
      // Filtramos solo los mayordomos (group_id = 3)
      const respuestaFiltrada = respuesta.filter(item => item.group_id === mayordomos);
      //  console.log("respuesta filtrada:",respuestaFiltrada);
      // 🔹 Aquí filtramos por la empresa/hacienda seleccionada
      // ⚠️ Usa el nombre del campo que tu backend devuelve (por ejemplo "codhacienda" o "idempresa")
    //  console.log("idhahcienda:", this.idhaciendaSeleccionada)

      this.Mayordomo = respuestaFiltrada.filter(
        m => m.empresa_id.toString() === this.idhaciendaSeleccionada
      );

     // console.log('Mayordomos de la hacienda:', this.Mayordomo);

      // 🔹 Luego, obtenemos los lotes
      this.servicio.obtenerLotesMayordomo(this.idhaciendaSeleccionada).subscribe(respuesta => {
        let respuestaFiltradaLotes = respuesta;

        if (!this.permisoService.tieneGrupo('administradores') || !this.permisoService.tieneGrupo('sistemas') ) {
          respuestaFiltradaLotes = respuesta.filter(
            item => item.codempleado === this.codEmpleado.toString()
          );
        }

        // 🔹 Lotes únicos
        const LotesUnicos = [...new Set(respuestaFiltradaLotes.map(item => item.lote.trim()))];
        this.rows = LotesUnicos;

        if (this.columns.length > 0) {
          this.buildGridForm();
        }
      });
    });
  }
  trackByRow(index: number, row: any) {
    return row;
  }

  onMayordomoSeleccionado(): void {
    if (!this.idmayordomoSeleccionado || !this.idhaciendaSeleccionada) return;

    this.servicio.obtenerLotesMayordomo(this.idhaciendaSeleccionada).subscribe(respuesta => {
      const respuestaFiltrada = respuesta.filter(
        item => item.codempleado === this.idmayordomoSeleccionado.toString()
      );

      const LotesUnicos = [...new Set(respuestaFiltrada.map(item => item.lote.trim()))];
      this.rows = LotesUnicos;

      if (this.columns.length > 0) {
        this.buildGridForm();
      }
    });
  }

  onSubmit(): void {
    if (this.gridForm.valid) {
      const gridData = this.getGridData();

      // Agrega información adicional que tu backend pueda necesitar
      const payload = {
        semana: this.semana,
        anio: this.anio,
        user: this.user,
        codEmpleado: this.codEmpleado,
        idHacienda: this.idhaciendaSeleccionada,
        nombreHacienda:this.nombreHaciendaSeleccionado,
        datos: gridData
      };
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas guardar los cambios?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const idGuardado =  1; // ID simulado
          // Aquí va tu lógica de guardado o envío
          this.servicio.guardar(payload).subscribe({
            next: (resp) => {
              Swal.fire({
                icon: 'success',
                title: 'Guardado correctamente',
                text: 'Los datos se han guardado con éxito'


              }).then(() => {
                this.router.navigate(['/imprimir', resp.id]);
                this.gridForm.reset();
              });

            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar la información'
              });
            }
         });
        }
      });

    // console.log('Enviando al backend:', payload);
   //  console.log('Datos guardados:', gridData);
    }
  }

  getGridData(): any[] {
    const gridData: any[] = [];

    this.rows.forEach(row => {
      this.columns.forEach(column => {
        const controlName = `${row}${column.codigo}`;
        const value = this.gridForm.get(controlName)?.value;

        // Solo enviamos si hay un valor
        if (value && value.trim() !== '') {
          gridData.push({
            lote: row,
            codigo: column.codigo,
            danio: 66,
            cantidad: value
          });
        }
      });
    });

    return gridData;
  }

  onInputChange(row: string, column: string): void {
  //  console.log(`Cambio en la celda ${row}-${column}`);
  }

  getBackgroundColor(nombreColor: string) {
    const colores: any = {
      CAFE: 'brown',
      NEGRO: 'black',
      AZUL: 'blue',
      ROJO: 'red',
      VERDE: 'green',
      AMARILLO: 'yellow',
      BLANCO: 'white',
      NARANJA: 'orange',
      LILA: 'purple'
    };
    return colores[nombreColor] || {background: nombreColor, text: 'black'};
  }

  private buildGridForm(): void {
    this.gridForm = this.fb.group({});

    this.rows.forEach(row => {
      this.columns.forEach(column => {
        const controlName = `${row}${column.codigo}`;
        this.gridForm.addControl(controlName, this.fb.control(''));
      })
    })
  }

  obtenerNombreHacienda():void{
    const hacienda = this.haciendas.find(
      h => h.id === Number(this.idhaciendaSeleccionada)
    );
    this.nombreHaciendaSeleccionado = hacienda ? hacienda.nombre : '';
  }

}

