import { Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DatePipe, NgForOf, NgIf} from '@angular/common';
import {HojasaldosService} from '../../services/hojasaldos.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-imprimir',
  standalone: true,
  imports: [

    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './imprimir.component.html',
  styleUrl: './imprimir.component.css'
})
export class ImprimirComponent implements OnInit {
  today: Date = new Date();
  id!: number;

  datos: any = {
    cabecera: {},
    detalle: []
  };

  constructor(
    private route: ActivatedRoute,
    private imprimirService: HojasaldosService,
    private title: Title

  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const original = this.title.getTitle();
    this.title.setTitle('Reporte de Matas Caidas');
    this.imprimirService.imprimirPorId(this.id).subscribe({
      next: (resp) => {

        this.datos = resp;

        setTimeout(()=>{
          window.print();
          this.title.setTitle(original);
        },300);
      },
      error: () => {
        alert('No se pudo cargar la información');
      }
    });
  }

}
