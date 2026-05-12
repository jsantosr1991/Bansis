import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HojasaldosService } from '../../services/hojasaldos.service';
import { UserService } from '../../services/user.service';
import { AuthserviceService } from '../../services/authservice.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

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
  semanaBloqueada: boolean = false;
  array = [] as any;
  semana = '';

  Mayordomo = [] as any;
  gridForm!: FormGroup;
  idhaciendaSeleccionada: any = null;  // Guarda el valor seleccionado del select
  idmayordomoSeleccionado: any = null;  // Guarda el valor seleccionado del select
  haciendas: { id: any, nombre: string }[] = [];  // Lista de haciendas para el select
  nombreHaciendaSeleccionado: string = '';
  // Columnas fijas
  columns: any[] = [];

  // Las filas (mayordomos) se llenan desde el servicio
  rows: string[] = [];

  constructor(private fb: FormBuilder,
    private servicio: HojasaldosService,
    private userService: UserService,
    private router: Router, // 👈 agrega esto
    protected permisoService: AuthserviceService,
    private alertService: AlertService) {
  }

  ngOnInit(): void {

    this.user = this.userService.getUsername() ?? '';
    this.anio = this.today.getFullYear();

    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();

    this.gridForm = this.fb.group({});

    this.haciendas = [
      { id: 1, nombre: 'PRIMOBANANO' },
      { id: 8, nombre: 'SOFCABANANO' }
    ];

    this.onHaciendaSeleccionada();

    this.semanaMatascaidas(); // 👈 AL FINAL
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

        if (!this.permisoService.tieneGrupo('administradores') || !this.permisoService.tieneGrupo('sistemas')) {
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

    // 🔥 VALIDACIÓN SEMANA BLOQUEADA
    if (this.semanaBloqueada) {
      this.alertService.warning('No puedes guardar. La semana ya está registrada');
      return;
    }

    // 🔥 VALIDAR FORM VACÍO
    const gridData = this.getGridData();

    if (!gridData.length) {
      this.alertService.warning('Debe ingresar al menos un valor');
      return;
    }

    const payload = {
      semana: this.semana,
      anio: this.anio,
      user: this.user,
      codEmpleado: this.codEmpleado,
      idHacienda: this.idhaciendaSeleccionada,
      nombreHacienda: this.nombreHaciendaSeleccionado,
      datos: gridData
    };

    // 🔥 CONFIRMACIÓN PRO
    this.alertService.confirm(
      '¿Guardar información?',
      'Se registrarán los datos ingresados'
    ).then(result => {

      if (!result.isConfirmed) return;

      // 🔥 LOADING PRO
      this.alertService.loading('Guardando información...');

      this.servicio.guardar(payload).subscribe({
        next: () => {

          this.alertService.close();

          this.alertService.successModal(
            'Guardado correctamente',
            'Los datos fueron registrados con éxito'
          ).then(() => {
            this.router.navigate(['/balanza/historicomatascaidas']);
            this.gridForm.reset();
          });

        },
        error: (err) => {

          this.alertService.close();

          if (err.status === 400) {
            this.alertService.warning(err.error.mensaje);

            this.semanaBloqueada = true;

            return;
          }

          this.alertService.modalError(
            'Error',
            'No se pudo guardar la información'
          );
        }
      });

    });
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
    return colores[nombreColor] || { background: nombreColor, text: 'black' };
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

  obtenerNombreHacienda(): void {
    const hacienda = this.haciendas.find(
      h => h.id === Number(this.idhaciendaSeleccionada)
    );
    this.nombreHaciendaSeleccionado = hacienda ? hacienda.nombre : '';
  }

  validarSemana(): void {

    if (!this.semana || !this.idhaciendaSeleccionada) return;

    this.servicio.validarSemana({
      semana: this.semana,
      anio: this.anio,
      idHacienda: this.idhaciendaSeleccionada,
      codEmpleado: this.codEmpleado
    }).subscribe({
      next: (resp: any) => {

        if (resp.existe) {

          this.semanaBloqueada = true;

          this.alertService.warning(`⚠️ Ya registraste la semana ${this.semana}`);

        } else {

          this.semanaBloqueada = false;
        }
      },
      error: () => {
        this.alertService.error('Error al validar la semana');
      }
    });
  }

  semanaMatascaidas() {
    this.servicio.obtenerSemanaMatasCaidas().subscribe((data: any[]) => {

      this.semana = data[0]?.semana;

      // 🔥 VALIDAR AUTOMÁTICAMENTE
      setTimeout(() => {
        this.validarSemana();
      }, 0);

      this.cintasMatascaidas(this.semana);
    });
  }
  onSemanaChange(): void {
    this.semana = this.gridForm.get('semana')?.value;

    this.validarSemana();
    this.cintasMatascaidas(this.semana);
  }
}

