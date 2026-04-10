import {
  HojasaldosService
} from "./chunk-H6H3KZHT.js";
import {
  AuthserviceService
} from "./chunk-3TA73A5V.js";
import {
  require_sweetalert2_all
} from "./chunk-FTOV3S6L.js";
import {
  UserService
} from "./chunk-UHCEN6B7.js";
import {
  Router
} from "./chunk-IMONGHQ7.js";
import {
  EstadisticasService
} from "./chunk-FBF7TAZC.js";
import "./chunk-LTPV2N3O.js";
import {
  LoaderComponent
} from "./chunk-JMZPKJEB.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-2RHLRMSC.js";
import "./chunk-K2LMSEX6.js";
import {
  ChangeDetectorRef,
  CommonModule,
  DatePipe,
  NgForOf,
  NgIf,
  NgStyle,
  debounceTime,
  distinctUntilChanged,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵpureFunction2,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-KOB7DKR4.js";
import {
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-WYLQU5MV.js";

// src/app/modulos/HojaSaldo/hojadesaldo/hojadesaldo.component.ts
var _c0 = (a0, a1) => ({ "background-color": a0, "color": a1, "font-weight": "bold" });
function HojadesaldoComponent_option_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const hacienda_r1 = ctx.$implicit;
    \u0275\u0275property("value", hacienda_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(hacienda_r1.nombre);
  }
}
function HojadesaldoComponent_option_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("value", c_r2.codigo)("ngStyle", \u0275\u0275pureFunction2(4, _c0, ctx_r2.getColorByNombre(c_r2.color), ctx_r2.getContrasteColor(ctx_r2.getColorByNombre(c_r2.color))));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", c_r2.codigo, " - ", c_r2.color, " ");
  }
}
function HojadesaldoComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275element(1, "table", 18);
    \u0275\u0275elementEnd();
  }
}
var HojadesaldoComponent = class _HojadesaldoComponent {
  saldosService;
  fb;
  cdr;
  cintaService;
  userService;
  loading = false;
  datos = [];
  datosEnfunde = [];
  datosCaidas = [];
  secciones = [];
  datosPivotados = [];
  dataTable;
  codigos = [];
  anioDefault = (/* @__PURE__ */ new Date()).getFullYear();
  usuarioActual = "";
  haciendaSeleccionada = "";
  haciendas = [
    { id: 1, nombre: "PRIMOBANANO" },
    { id: 3, nombre: "SOFCABANANO" }
  ];
  filtroForm;
  constructor(saldosService, fb, cdr, cintaService, userService) {
    this.saldosService = saldosService;
    this.fb = fb;
    this.cdr = cdr;
    this.cintaService = cintaService;
    this.userService = userService;
    this.filtroForm = this.fb.group({
      idhacienda: [""],
      anio: new FormControl(this.anioDefault, [
        Validators.required,
        Validators.min(2020),
        Validators.max(this.anioDefault)
      ]),
      codigo: ["", [Validators.required, Validators.pattern("^[0-9]{1,5}$")]]
    });
  }
  ngOnInit() {
    this.usuarioActual = this.userService.getUsername() ?? "Invitado";
    this.cargarCodigo(this.anioDefault);
    this.filtroForm.get("anio")?.valueChanges.pipe(
      debounceTime(500),
      // espera que el usuario deje de escribir
      distinctUntilChanged()
      // evita repetir el mismo valor
    ).subscribe((anio) => {
      if (anio && anio.toString().length === 4) {
        this.cargarCodigo(anio);
        this.filtroForm.get("codigo")?.reset();
        this.verificarYConsultar();
      }
    });
    this.filtroForm.get("idhacienda")?.valueChanges.subscribe((id) => {
      const idNmu = Number(id);
      const hacienda = this.haciendas.find((h) => h.id === idNmu);
      this.haciendaSeleccionada = hacienda ? hacienda.nombre : "";
      this.verificarYConsultar();
    });
    this.filtroForm.get("codigo")?.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.verificarYConsultar();
    });
  }
  cargarCodigo(anio) {
    this.cintaService.calendar(anio).subscribe({
      next: (data) => {
        this.codigos = data;
      },
      error: (error) => {
        this.codigos = [];
      }
    });
  }
  verificarYConsultar() {
    const idhacienda = this.filtroForm.get("idhacienda")?.value;
    const codigo = this.filtroForm.get("codigo")?.value;
    if (idhacienda && codigo && codigo.toString().length === 5) {
      this.obtenerDatos(idhacienda, codigo);
    }
  }
  obtenerDatos(idhacienda, codigo) {
    this.loading = true;
    this.saldosService.obtenerEnfundeSaldos(idhacienda, codigo).subscribe({
      next: ({ saldos, metas, caidas }) => {
        this.datos = saldos;
        this.datosEnfunde = metas;
        this.datosCaidas = caidas;
        this.procesarSecciones();
        this.procesarDatos();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.reinicializarDataTable();
          this.loading = false;
        }, 0);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  procesarSecciones() {
    const seccionesSet = /* @__PURE__ */ new Set();
    this.datos.forEach((item) => seccionesSet.add(item.cs_seccion));
    this.secciones = Array.from(seccionesSet).sort();
  }
  procesarDatos() {
    const agrupado = {};
    const totalesPorColor = {};
    this.datos.forEach((item) => {
      const color = item.color;
      const fecha = item.cs_fecha;
      const cantidad = parseInt(item.cantidad, 10);
      if (!agrupado[color])
        agrupado[color] = [];
      let fila = agrupado[color].find((f) => f.fecha === fecha);
      if (!fila) {
        fila = { fecha, totalFecha: 0 };
        this.secciones.forEach((sec) => fila[sec] = 0);
        agrupado[color].push(fila);
      }
      fila[item.cs_seccion] += cantidad;
      fila.totalFecha += cantidad;
      if (!totalesPorColor[color]) {
        totalesPorColor[color] = { totalColor: 0 };
        this.secciones.forEach((sec) => totalesPorColor[color][sec] = 0);
      }
      totalesPorColor[color][item.cs_seccion] += cantidad;
      totalesPorColor[color].totalColor += cantidad;
    });
    this.datosPivotados = [];
    for (const color in agrupado) {
      const codigoColor = this.datos.find((d) => d.color === color)?.codigo || "";
      const filaCabecera = {
        color,
        codigo: codigoColor,
        fecha: "",
        esCabecera: true,
        total: ""
        // <-- agregar total vacío
      };
      this.secciones.forEach((sec) => filaCabecera[sec] = "");
      this.datosPivotados.push(filaCabecera);
      const metasPorColor = this.datosEnfunde.filter((m) => m.color === color);
      let totalMeta = 0;
      if (metasPorColor.length) {
        const filaMeta = {
          color,
          fecha: "ENFUNDE",
          total: metasPorColor.reduce((sum, m) => sum + parseInt(m.enfunde, 10), 0)
        };
        totalMeta = filaMeta.total;
        this.secciones.forEach((sec) => {
          const metaSeccion = metasPorColor.find((m) => m.cs_seccion === sec);
          filaMeta[sec] = metaSeccion ? parseInt(metaSeccion.enfunde, 10) : 0;
        });
        this.datosPivotados.push(filaMeta);
      }
      const caidasPorColor = this.datosCaidas.filter((c) => c.color === color);
      if (caidasPorColor.length) {
        const filaCaidas = {
          color,
          fecha: "CAIDAS",
          total: caidasPorColor.reduce((sum, c) => sum + parseInt(c.cantidad, 10), 0)
        };
        this.secciones.forEach((sec) => {
          const item = caidasPorColor.find((c) => c.pe_seccion === sec);
          filaCaidas[sec] = item ? parseInt(item.cantidad, 10) : 0;
        });
        this.datosPivotados.push(filaCaidas);
      }
      agrupado[color].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()).forEach((fila) => {
        fila.total = fila.totalFecha;
        this.datosPivotados.push(__spreadValues({ color, codigo: codigoColor }, fila));
      });
      const totalDatos = totalesPorColor[color].totalColor;
      this.datosPivotados.push(__spreadProps(__spreadValues({
        color,
        fecha: "TOTAL COSECHA"
      }, totalesPorColor[color]), {
        total: totalDatos
      }));
      if (totalMeta > 0) {
        const totalCaidas = caidasPorColor.reduce((sum, c) => sum + parseInt(c.cantidad, 10), 0);
        const totalTrabajo = totalDatos + totalCaidas;
        const filaDiferencia = {
          color,
          fecha: "SALDO",
          total: totalMeta - totalTrabajo
        };
        this.secciones.forEach((sec) => {
          const cosechaSeccion = totalesPorColor[color][sec] || 0;
          const caidaObj = caidasPorColor.find((c) => c.pe_seccion === sec);
          const caidaSeccion = caidaObj ? parseInt(caidaObj.cantidad, 10) : 0;
          const metaSeccionObj = this.datosEnfunde.find((m) => m.color === color && m.cs_seccion === sec);
          const metaSeccion = metaSeccionObj ? parseInt(metaSeccionObj.enfunde, 10) : 0;
          filaDiferencia[sec] = metaSeccion - (cosechaSeccion + caidaSeccion);
        });
        this.datosPivotados.push(filaDiferencia);
        if (totalMeta > 0) {
          const filaPorcentaje = {
            color,
            fecha: "RECOBRO",
            total: ((totalDatos + totalCaidas) / totalMeta * 100).toFixed(2) + "%"
          };
          this.secciones.forEach((sec) => {
            const cosechaSeccion = totalesPorColor[color][sec] || 0;
            const caidaObj = caidasPorColor.find((c) => c.pe_seccion === sec);
            const caidaSeccion = caidaObj ? parseInt(caidaObj.cantidad, 10) : 0;
            const metaSeccionObj = this.datosEnfunde.find((m) => m.color === color && m.cs_seccion === sec);
            const metaSeccion = metaSeccionObj ? parseInt(metaSeccionObj.enfunde, 10) : 0;
            filaPorcentaje[sec] = metaSeccion > 0 ? ((cosechaSeccion + caidaSeccion) / metaSeccion * 100).toFixed(2) + "%" : "0%";
          });
          this.datosPivotados.push(filaPorcentaje);
        }
      }
    }
  }
  reinicializarDataTable() {
    if (!this.datosPivotados || this.datosPivotados.length === 0)
      return;
    let colorVisto = {};
    this.datosPivotados.forEach((row) => {
      if (!["ENFUNDE", "TOTAL COSECHA", "SALDO", "CAIDAS", "RECOBRO"].includes(row.fecha)) {
        if (!colorVisto[row.color]) {
          row.mostrarColor = true;
          colorVisto[row.color] = true;
        } else {
          row.mostrarColor = false;
        }
      } else {
        row.mostrarColor = true;
      }
    });
    const columns = [
      {
        title: "Color",
        data: null,
        render: (data, type, row) => {
          const colorFondo = this.getColorByNombre(row.color);
          const colorTexto = this.getContrasteColor(colorFondo);
          if (row.fecha === "ENFUNDE")
            return `<div style="font-weight:bold; padding:2px 6px; border-radius:4px; display:inline-block;">ENFUNDE</div>`;
          if (row.fecha === "CAIDAS")
            return `<div style="font-weight:bold; padding:2px 6px; border-radius:4px; display:inline-block;">CAIDAS</div>`;
          if (["TOTAL COSECHA", "SALDO", "RECOBRO"].includes(row.fecha))
            return `<div style="font-weight:bold;">${row.fecha}</div>`;
          if (row.mostrarColor) {
            return `
            <div style="
              font-weight:bold;
              color:${colorTexto};
              background-color:${colorFondo};
              padding:3px 6px;
              border-radius:4px;
              display:inline-block;
              white-space:nowrap;
              line-height:1.1;
            ">
              ${row.color} ${row.codigo || ""}
            </div>
          `;
          } else {
            return `
            <div style="
              font-size: 0.85em;
              color: ${colorTexto};
              background-color: ${colorFondo};
              padding: 2px 6px;
              border-radius: 4px;
              display: inline-block;
            ">
              ${row.fecha}
            </div>
          `;
          }
        }
      },
      // Columnas de secciones
      ...this.secciones.map((sec) => ({ title: sec, data: sec, defaultContent: "" })),
      { title: "Total", data: "total", name: "total" }
    ];
    if ($.fn.DataTable.isDataTable("#tablaProduccion")) {
      $("#tablaProduccion").DataTable().clear().destroy();
      $("#tablaProduccion").empty();
    }
    this.dataTable = $("#tablaProduccion").DataTable({
      paging: true,
      ordering: false,
      dom: '<"d-flex justify-content-between align-items-center mb-2"<"length-div"l><"search-div"f>>Brtip',
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
      data: this.datosPivotados,
      columns,
      columnDefs: [{ targets: 0, orderable: false }],
      buttons: [
        { extend: "copyHtml5", text: '<i class="bi bi-clipboard"></i>', className: "btn btn-outline-primary btn-sm me-1", titleAttr: "Copiar" },
        {
          extend: "excelHtml5",
          text: '<i class="bi bi-file-earmark-excel"></i>',
          className: "btn btn-outline-success btn-sm me-1",
          titleAttr: "Exportar Excel",
          filename: () => {
            const fecha = /* @__PURE__ */ new Date();
            const dd = String(fecha.getDate()).padStart(2, "0");
            const mm = String(fecha.getMonth() + 1).padStart(2, "0");
            const yyyy = fecha.getFullYear();
            return `Hojadesaldo_${dd}${mm}${yyyy}`;
          },
          title: null,
          customize: (xlsx) => {
            const sheet = xlsx.xl.worksheets["sheet1.xml"];
            const sheetData = sheet.getElementsByTagName("sheetData")[0];
            const rows = sheetData.getElementsByTagName("row");
            const filasExtras = 5;
            for (let i = rows.length - 1; i >= 0; i--) {
              const row = rows[i];
              const r = parseInt(row.getAttribute("r") || "0");
              row.setAttribute("r", (r + filasExtras).toString());
              const cells = row.getElementsByTagName("c");
              for (let j = 0; j < cells.length; j++) {
                const ref = cells[j].getAttribute("r");
                if (ref) {
                  const col = ref.replace(/\d+/g, "");
                  cells[j].setAttribute("r", col + (r + filasExtras));
                }
              }
            }
            const fecha = /* @__PURE__ */ new Date();
            const fechaStr = fecha.toLocaleDateString();
            const horaStr = fecha.toLocaleTimeString();
            const hacienda = this.haciendaSeleccionada || "N/A";
            const usuario = this.usuarioActual || "N/A";
            const nuevasFilas = `
    <row r="1">
      <c t="inlineStr"><is><t>HOJA DE SALDOS</t></is></c>
    </row>
    <row r="2">
      <c t="inlineStr"><is><t>Hacienda:</t></is></c>
      <c t="inlineStr"><is><t>${hacienda}</t></is></c>
    </row>
    <row r="3">
      <c t="inlineStr"><is><t>Usuario:</t></is></c>
      <c t="inlineStr"><is><t>${usuario}</t></is></c>
    </row>
    <row r="4">
      <c t="inlineStr"><is><t>Fecha:</t></is></c>
      <c t="inlineStr"><is><t>${fechaStr} ${horaStr}</t></is></c>
    </row>
    <row r="5"></row>
  `;
            sheetData.insertAdjacentHTML("afterbegin", nuevasFilas);
          }
        },
        {
          extend: "pdfHtml5",
          text: '<i class="bi bi-file-earmark-pdf"></i>',
          className: "btn btn-outline-danger btn-sm me-1",
          titleAttr: "Exportar PDF",
          filename: () => {
            const fecha = /* @__PURE__ */ new Date();
            const dd = String(fecha.getDate()).padStart(2, "0");
            const mm = String(fecha.getMonth() + 1).padStart(2, "0");
            const yyyy = fecha.getFullYear();
            return `Hojadesaldo_${dd}${mm}${yyyy}`;
          },
          title: "HOJA DE SALDOS",
          orientation: "landscape",
          pageSize: "A2",
          exportOptions: { columns: ":visible" },
          /*  customize: function (doc:any) {
                    // Reducir márgenes al mínimo
                    doc.pageMargins = [10, 10, 10, 10]; // [izquierda, arriba, derecha, abajo] en puntos
          
                    // Ajustar el tamaño de la fuente
                    doc.defaultStyle.fontSize = 7; // puedes subirlo si los márgenes permiten
                    doc.styles.tableHeader.fontSize = 8;
          
                    // Ajustar el ancho de columnas de forma uniforme
                    var columnCount = doc.content[1].table.body[0].length;
                    doc.content[1].table.widths = Array(columnCount).fill('*');
                  }*/
          customize: (doc) => {
            const fecha = /* @__PURE__ */ new Date();
            const fechaStr = fecha.toLocaleDateString();
            const horaStr = fecha.toLocaleTimeString();
            doc.content.unshift({
              margin: [0, 0, 0, 10],
              alignment: "left",
              stack: [
                { text: `Hacienda: ${this.haciendaSeleccionada || "N/A"}`, bold: true },
                { text: `Usuario: ${this.usuarioActual}`, bold: true },
                { text: `Fecha: ${fechaStr} ${horaStr}`, bold: true }
              ]
            });
            doc.pageMargins = [10, 10, 10, 10];
            doc.defaultStyle = 7;
            doc.styles.tableHeader.fontSize = 8;
            const tabla = doc.content.find((c) => c.table);
            if (tabla && tabla.table && tabla.table.body?.length) {
              const columnCount = tabla.table.body[0].length;
              const widths = [];
              for (let i = 0; i < columnCount; i++) {
                if (i === 0)
                  widths.push(60);
                else if (i === columnCount - 1)
                  widths.push(60);
                else
                  widths.push(35);
              }
              tabla.table.width = widths;
            }
          }
        },
        {
          extend: "print",
          text: '<i class="bi bi-printer"></i>',
          className: "btn btn-outline-primary btn-sm me-1",
          titleAttr: "Imprimir",
          title: "Hoja de saldos"
        }
      ],
      createdRow: (row, data) => {
        const $row = $(row);
        const $celdas = $row.find("td");
        const primeraCelda = $celdas.eq(0);
        if (data.fecha === "ENFUNDE")
          $celdas.css({ "background-color": "#6badef", "font-weight": "bold" });
        else if (data.fecha === "TOTAL COSECHA")
          $row.addClass("fila-total");
        else if (data.fecha === "SALDO")
          $celdas.css({ "background-color": "#fff3cd", "color": "#856404", "font-weight": "bold" });
        else if (data.fecha === "CAIDAS")
          $celdas.css({ "background-color": "#8f8d8d", "font-weight": "bold" });
        else if (data.fecha === "RECOBRO") {
          $celdas.each((index, cell) => {
            if (index === 0)
              return;
            const val = parseFloat($(cell).text()) || 0;
            if (val > 100) {
              $(cell).css({ "color": "#842029", "font-weight": "bold" });
            } else {
              $(cell).css({ "color": "#090909", "font-weight": "bold" });
            }
          });
        } else
          primeraCelda.css({ "background-color": this.getColorByNombre(data.color) });
        $celdas.each((index, cell) => {
          if (index === 0)
            return;
          if (index === $celdas.length - 1)
            return;
          const text = $(cell).text().trim();
          if (!text.endsWith("%")) {
            const val = parseInt(text) || 0;
            if (val < 0)
              $(cell).css({ "color": "#842029", "font-weight": "bold" });
            else if (val > 0)
              $(cell).css({ "color": "#090909", "font-weight": "bold" });
            else
              $(cell).css({ "color": "inherit", "font-weight": "normal" });
          }
        });
      },
      footerCallback: (row, data, start, end, display) => {
        const api = $("#tablaProduccion").DataTable();
        this.secciones.forEach((sec, i) => {
          let total = 0;
          api.column(i + 2, { page: "current" }).nodes().each((cell) => {
            const text = $(cell).text().trim();
            if (!text.endsWith("%"))
              total += parseInt(text) || 0;
          });
          $(api.column(i + 2).footer()).html(total);
        });
        let totalGeneral = 0;
        const totalColumn = api.column("total:name", { page: "current" });
        if (totalColumn) {
          totalColumn.nodes().each((cell) => {
            const text = $(cell).text().trim();
            if (!text.endsWith("%"))
              totalGeneral += parseInt(text) || 0;
          });
          $(api.column("total:name").footer()).html(totalGeneral);
        }
      }
    });
    $("th").css({ position: "sticky", top: "0", "background-color": "#f8f9fa", "z-index": "10" });
  }
  getColorByNombre(color) {
    switch ((color || "").toLowerCase()) {
      case "rojo":
        return "#fa1f06";
      case "azul":
        return "#025bdf";
      case "verde":
        return "#168104";
      case "amarillo":
        return "#ffb319";
      case "cafe":
        return "#6e5244";
      case "lila":
        return "#5a26dd";
      case "negro":
        return "#1a110e";
      case "blanco":
        return "#ffffff";
      default:
        return "transparent";
    }
  }
  getContrasteColor(colorHex) {
    if (!colorHex)
      return "black";
    const hex = colorHex.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminancia > 186 ? "black" : "white";
  }
  static \u0275fac = function HojadesaldoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HojadesaldoComponent)(\u0275\u0275directiveInject(HojasaldosService), \u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(EstadisticasService), \u0275\u0275directiveInject(UserService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HojadesaldoComponent, selectors: [["app-hojadesaldo"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 23, vars: 6, consts: [[3, "loading"], [1, "container-fluid"], [1, "container", "my-3"], [1, "row", "g-3", 3, "formGroup"], [1, "col-md-4"], [1, "form-label"], ["formControlName", "idhacienda", 1, "form-select"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [1, "col-md-3", "col-lg-2"], ["type", "number", "formControlName", "anio", "min", "2020", 1, "form-control", 3, "max"], [1, "col-md-5", "col-lg-3", "col-auto"], ["formControlName", "codigo", 1, "form-select"], [3, "value", "ngStyle", 4, "ngFor", "ngForOf"], ["class", "table-responsive", 4, "ngIf"], [3, "value"], [3, "value", "ngStyle"], [1, "table-responsive"], ["id", "tablaProduccion", 1, "table", "table-bordered", "table-sm", "table-hover", "w-100"]], template: function HojadesaldoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-loader", 0);
      \u0275\u0275elementStart(1, "div", 1)(2, "div", 2)(3, "form", 3)(4, "div", 4)(5, "label", 5);
      \u0275\u0275text(6, "Hacienda");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "select", 6)(8, "option", 7);
      \u0275\u0275text(9, "Seleccione Hacienda");
      \u0275\u0275elementEnd();
      \u0275\u0275template(10, HojadesaldoComponent_option_10_Template, 2, 2, "option", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 9)(12, "label", 5);
      \u0275\u0275text(13, "A\xF1o");
      \u0275\u0275elementEnd();
      \u0275\u0275element(14, "input", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 11)(16, "label", 5);
      \u0275\u0275text(17, "Cinta Color");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "select", 12)(19, "option", 7);
      \u0275\u0275text(20, "Seleccione c\xF3digo");
      \u0275\u0275elementEnd();
      \u0275\u0275template(21, HojadesaldoComponent_option_21_Template, 2, 7, "option", 13);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(22, HojadesaldoComponent_div_22_Template, 2, 0, "div", 14);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("loading", ctx.loading);
      \u0275\u0275advance(3);
      \u0275\u0275property("formGroup", ctx.filtroForm);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngForOf", ctx.haciendas);
      \u0275\u0275advance(4);
      \u0275\u0275propertyInterpolate("max", ctx.anioDefault);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngForOf", ctx.codigos);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.datosPivotados.length > 0);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, NgStyle, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, MaxValidator, FormGroupDirective, FormControlName, LoaderComponent], styles: ["\n\n.table-responsive[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  background-color: #f8f9fa;\n  z-index: 1000;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);\n}\n.fila-total[_ngcontent-%COMP%] {\n  background-color: #f1f1f1;\n  font-weight: bold;\n  border-top: 2px solid #000;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], \n.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 8px;\n  text-align: center;\n}\n.celda-saldo[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  background-color: #fff3cd !important;\n  font-weight: bold;\n  color: #856404 !important;\n  padding: 2px 6px;\n  border-radius: 4px;\n  display: inline-block;\n}\n@media (max-width: 768px) {\n  .table[_ngcontent-%COMP%] {\n    table-layout: auto;\n  }\n}\n/*# sourceMappingURL=hojadesaldo.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HojadesaldoComponent, { className: "HojadesaldoComponent", filePath: "src\\app\\modulos\\HojaSaldo\\hojadesaldo\\hojadesaldo.component.ts", lineNumber: 19 });
})();

// src/app/modulos/matascaidas/matascaidas.component.ts
var import_sweetalert2 = __toESM(require_sweetalert2_all());
function MatascaidasComponent_div_3_option_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const h_r4 = ctx.$implicit;
    \u0275\u0275property("value", h_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(h_r4.nombre);
  }
}
function MatascaidasComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "label", 21);
    \u0275\u0275text(2, "Hacienda:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 22);
    \u0275\u0275twoWayListener("ngModelChange", function MatascaidasComponent_div_3_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.idhaciendaSeleccionada, $event) || (ctx_r2.idhaciendaSeleccionada = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function MatascaidasComponent_div_3_Template_select_change_3_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onHaciendaSeleccionada());
    });
    \u0275\u0275template(4, MatascaidasComponent_div_3_option_4_Template, 2, 2, "option", 23);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.idhaciendaSeleccionada);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.haciendas);
  }
}
function MatascaidasComponent_ng_template_4_div_0_option_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const h_r6 = ctx.$implicit;
    \u0275\u0275property("value", h_r6.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(h_r6.nombre);
  }
}
function MatascaidasComponent_ng_template_4_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "label", 25);
    \u0275\u0275text(2, "Hacienda:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 26);
    \u0275\u0275twoWayListener("ngModelChange", function MatascaidasComponent_ng_template_4_div_0_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.idhaciendaSeleccionada, $event) || (ctx_r2.idhaciendaSeleccionada = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function MatascaidasComponent_ng_template_4_div_0_Template_select_change_3_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onHaciendaSeleccionada());
    });
    \u0275\u0275template(4, MatascaidasComponent_ng_template_4_div_0_option_4_Template, 2, 2, "option", 23);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.idhaciendaSeleccionada);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.haciendas);
  }
}
function MatascaidasComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, MatascaidasComponent_ng_template_4_div_0_Template, 5, 2, "div", 11);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngIf", ctx_r2.permisoService.tieneGrupo("administradores") || ctx_r2.permisoService.tieneGrupo("sistemas"));
  }
}
function MatascaidasComponent_div_16_option_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const h_r8 = ctx.$implicit;
    \u0275\u0275property("value", h_r8.codempleado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(h_r8.NOMBRE_CORTO);
  }
}
function MatascaidasComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "label", 27);
    \u0275\u0275text(2, "Mayordomo:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 28);
    \u0275\u0275twoWayListener("ngModelChange", function MatascaidasComponent_div_16_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.idmayordomoSeleccionado, $event) || (ctx_r2.idmayordomoSeleccionado = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function MatascaidasComponent_div_16_Template_select_change_3_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onMayordomoSeleccionado());
    });
    \u0275\u0275template(4, MatascaidasComponent_div_16_option_4_Template, 2, 2, "option", 23);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.idmayordomoSeleccionado);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.Mayordomo);
  }
}
function MatascaidasComponent_th_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r9 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("background-color", ctx_r2.getBackgroundColor(column_r9.color))("color", column_r9.color === "BLANCO" || column_r9.color === "AMARILLO" ? "black" : "white");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", column_r9.color, " ");
  }
}
function MatascaidasComponent_th_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r10 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", column_r10.codigo, " ");
  }
}
function MatascaidasComponent_tr_31_td_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td")(1, "input", 33);
    \u0275\u0275listener("change", function MatascaidasComponent_tr_31_td_3_Template_input_change_1_listener() {
      const column_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const row_r13 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onInputChange(row_r13, column_r12.codigo));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r12 = ctx.$implicit;
    const row_r13 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("formControlName", row_r13 + column_r12.codigo);
  }
}
function MatascaidasComponent_tr_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 31);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, MatascaidasComponent_tr_31_td_3_Template, 2, 1, "td", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r13 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r13);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.columns);
  }
}
var MatascaidasComponent = class _MatascaidasComponent {
  fb;
  servicio;
  userService;
  router;
  permisoService;
  today = /* @__PURE__ */ new Date();
  codEmpleado = "";
  user = "";
  anio = 0;
  array = [];
  semana = "";
  Mayordomo = [];
  gridForm;
  idhaciendaSeleccionada = null;
  // Guarda el valor seleccionado del select
  idmayordomoSeleccionado = null;
  // Guarda el valor seleccionado del select
  haciendas = [];
  // Lista de haciendas para el select
  nombreHaciendaSeleccionado = "";
  // Columnas fijas
  columns = [];
  // Las filas (mayordomos) se llenan desde el servicio
  rows = [];
  constructor(fb, servicio, userService, router, permisoService) {
    this.fb = fb;
    this.servicio = servicio;
    this.userService = userService;
    this.router = router;
    this.permisoService = permisoService;
  }
  ngOnInit() {
    this.semanaMatascaidas();
    this.user = this.userService.getUsername();
    this.anio = this.today.getFullYear();
    this.today;
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();
    this.gridForm = this.fb.group({});
    this.haciendas = [
      { id: 1, nombre: "PRIMOBANANO" },
      { id: 8, nombre: "SOFCABANANO" }
    ];
    this.onHaciendaSeleccionada();
  }
  semanaMatascaidas() {
    this.servicio.obtenerSemanaMatasCaidas().subscribe((data) => {
      this.semana = data[0]?.semana;
      this.cintasMatascaidas(this.semana);
    });
  }
  cintasMatascaidas(semana) {
    this.servicio.obtenerCintasMataCaidas(semana).subscribe((data) => {
      this.columns = data.map((item) => ({
        codigo: item.idcalendar,
        color: item.color
      }));
      this.columns = this.columns.reverse();
      if (this.rows.length > 0) {
        this.buildGridForm();
      }
    });
  }
  onHaciendaSeleccionada() {
    if (!this.idhaciendaSeleccionada)
      return;
    this.obtenerNombreHacienda();
    this.codEmpleado = this.userService.getCodEmpleado() || "";
    this.userService.getAdministrativos().subscribe((respuesta) => {
      const mayordomos = 3;
      const respuestaFiltrada = respuesta.filter((item) => item.group_id === mayordomos);
      this.Mayordomo = respuestaFiltrada.filter((m) => m.empresa_id.toString() === this.idhaciendaSeleccionada);
      this.servicio.obtenerLotesMayordomo(this.idhaciendaSeleccionada).subscribe((respuesta2) => {
        let respuestaFiltradaLotes = respuesta2;
        if (!this.permisoService.tieneGrupo("administradores") || !this.permisoService.tieneGrupo("sistemas")) {
          respuestaFiltradaLotes = respuesta2.filter((item) => item.codempleado === this.codEmpleado.toString());
        }
        const LotesUnicos = [...new Set(respuestaFiltradaLotes.map((item) => item.lote.trim()))];
        this.rows = LotesUnicos;
        if (this.columns.length > 0) {
          this.buildGridForm();
        }
      });
    });
  }
  trackByRow(index, row) {
    return row;
  }
  onMayordomoSeleccionado() {
    if (!this.idmayordomoSeleccionado || !this.idhaciendaSeleccionada)
      return;
    this.servicio.obtenerLotesMayordomo(this.idhaciendaSeleccionada).subscribe((respuesta) => {
      const respuestaFiltrada = respuesta.filter((item) => item.codempleado === this.idmayordomoSeleccionado.toString());
      const LotesUnicos = [...new Set(respuestaFiltrada.map((item) => item.lote.trim()))];
      this.rows = LotesUnicos;
      if (this.columns.length > 0) {
        this.buildGridForm();
      }
    });
  }
  onSubmit() {
    if (this.gridForm.valid) {
      const gridData = this.getGridData();
      const payload = {
        semana: this.semana,
        anio: this.anio,
        user: this.user,
        codEmpleado: this.codEmpleado,
        idHacienda: this.idhaciendaSeleccionada,
        nombreHacienda: this.nombreHaciendaSeleccionado,
        datos: gridData
      };
      import_sweetalert2.default.fire({
        title: "\xBFEst\xE1s seguro?",
        text: "\xBFDeseas guardar los cambios?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "S\xED, guardar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          const idGuardado = 1;
          this.servicio.guardar(payload).subscribe({
            next: (resp) => {
              import_sweetalert2.default.fire({
                icon: "success",
                title: "Guardado correctamente",
                text: "Los datos se han guardado con \xE9xito"
              }).then(() => {
                this.router.navigate(["/imprimir", resp.id]);
                this.gridForm.reset();
              });
            },
            error: () => {
              import_sweetalert2.default.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo guardar la informaci\xF3n"
              });
            }
          });
        }
      });
    }
  }
  getGridData() {
    const gridData = [];
    this.rows.forEach((row) => {
      this.columns.forEach((column) => {
        const controlName = `${row}${column.codigo}`;
        const value = this.gridForm.get(controlName)?.value;
        if (value && value.trim() !== "") {
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
  onInputChange(row, column) {
  }
  getBackgroundColor(nombreColor) {
    const colores = {
      CAFE: "brown",
      NEGRO: "black",
      AZUL: "blue",
      ROJO: "red",
      VERDE: "green",
      AMARILLO: "yellow",
      BLANCO: "white",
      NARANJA: "orange",
      LILA: "purple"
    };
    return colores[nombreColor] || { background: nombreColor, text: "black" };
  }
  buildGridForm() {
    this.gridForm = this.fb.group({});
    this.rows.forEach((row) => {
      this.columns.forEach((column) => {
        const controlName = `${row}${column.codigo}`;
        this.gridForm.addControl(controlName, this.fb.control(""));
      });
    });
  }
  obtenerNombreHacienda() {
    const hacienda = this.haciendas.find((h) => h.id === Number(this.idhaciendaSeleccionada));
    this.nombreHaciendaSeleccionado = hacienda ? hacienda.nombre : "";
  }
  static \u0275fac = function MatascaidasComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatascaidasComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(HojasaldosService), \u0275\u0275directiveInject(UserService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthserviceService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MatascaidasComponent, selectors: [["app-matascaidas"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 34, vars: 13, consts: [["administradores", ""], [1, "container-fluid"], [1, ""], [1, "form-inline", "mb-3"], ["class", "form-group", 4, "ngIf", "ngIfElse"], [1, "form-group-auto"], ["for", "semana", 1, "fw-bold"], ["id", "semana", 1, "form-control", "form-control-sm", 3, "ngModelChange", "change", "ngModel"], ["for", "fecha", 1, "fw-bold"], ["type", "text", "id", "fecha", "disabled", "", 1, "form-control", "form-control-sm", 3, "value"], [1, "form-group"], ["class", "form-group", 4, "ngIf"], [1, "grid-container"], [1, "matas-table-wrapper", "table-scroll"], [3, "ngSubmit", "formGroup"], [1, "lote-header", "sticky-col", "header-cell"], ["class", "header-cell", 3, "backgroundColor", "color", 4, "ngFor", "ngForOf"], [1, "text-black"], ["class", "header-cell text-center text-black", 4, "ngFor", "ngForOf"], [4, "ngFor", "ngForOf", "ngForTrackBy"], ["type", "submit", 1, "btn", "btn-primary", "mt-3"], ["for", "idhacienda", 1, "me-2"], ["id", "idhacienda", "disabled", "", 1, "form-control", "me-3", 3, "ngModelChange", "change", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], ["for", "idhacienda", 1, "me-3"], ["id", "idhacienda", 1, "form-control", "me-3", 3, "ngModelChange", "change", "ngModel"], ["for", "idmayordomo", 1, "me-2"], ["id", "idmayordomo", 1, "form-control", "me-3", 3, "ngModelChange", "change", "ngModel"], [1, "header-cell"], [1, "header-cell", "text-center", "text-black"], [1, "sticky-col"], [4, "ngFor", "ngForOf"], ["type", "text", 1, "cell-input", 3, "change", "formControlName"]], template: function MatascaidasComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3);
      \u0275\u0275template(3, MatascaidasComponent_div_3_Template, 5, 2, "div", 4)(4, MatascaidasComponent_ng_template_4_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementStart(6, "div", 5)(7, "label", 6);
      \u0275\u0275text(8, "Semana:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "input", 7);
      \u0275\u0275twoWayListener("ngModelChange", function MatascaidasComponent_Template_input_ngModelChange_9_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.semana, $event) || (ctx.semana = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("change", function MatascaidasComponent_Template_input_change_9_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cintasMatascaidas(ctx.semana));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 5)(11, "label", 8);
      \u0275\u0275text(12, "Fecha:");
      \u0275\u0275elementEnd();
      \u0275\u0275element(13, "input", 9);
      \u0275\u0275pipe(14, "date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 10);
      \u0275\u0275template(16, MatascaidasComponent_div_16_Template, 5, 2, "div", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 12)(18, "div", 13)(19, "form", 14);
      \u0275\u0275listener("ngSubmit", function MatascaidasComponent_Template_form_ngSubmit_19_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onSubmit());
      });
      \u0275\u0275elementStart(20, "table")(21, "thead")(22, "tr");
      \u0275\u0275element(23, "th", 15);
      \u0275\u0275template(24, MatascaidasComponent_th_24_Template, 2, 5, "th", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "th", 15)(26, "label", 17);
      \u0275\u0275text(27, "Lote");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(28, MatascaidasComponent_th_28_Template, 2, 1, "th", 18);
      \u0275\u0275element(29, "tr");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "tbody");
      \u0275\u0275template(31, MatascaidasComponent_tr_31_Template, 4, 2, "tr", 19);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "button", 20);
      \u0275\u0275text(33, " Guardar ");
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      const administradores_r14 = \u0275\u0275reference(5);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.permisoService.tieneGrupo("mayordomo"))("ngIfElse", administradores_r14);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.semana);
      \u0275\u0275advance(4);
      \u0275\u0275property("value", \u0275\u0275pipeBind2(14, 10, ctx.today, "dd/MM/yyyy"));
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.permisoService.tieneGrupo("administradores") || ctx.permisoService.tieneGrupo("sistemas"));
      \u0275\u0275advance(3);
      \u0275\u0275property("formGroup", ctx.gridForm);
      \u0275\u0275advance(5);
      \u0275\u0275property("ngForOf", ctx.columns);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngForOf", ctx.columns);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.rows)("ngForTrackBy", ctx.trackByRow);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, DatePipe, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, FormsModule, NgModel], styles: ["\n\n[_ngcontent-%COMP%]:root {\n  --thead-row-height: 64px;\n}\n.form-inline[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  gap: 16px;\n  padding: 10px 12px;\n  background-color: #f8f9fa;\n  border-radius: 6px;\n  flex-wrap: wrap;\n}\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-width: 180px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  margin-bottom: 4px;\n  color: #212529;\n}\n.form-group-auto[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-width: 120px;\n}\n.form-group-auto[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  margin-bottom: 4px;\n}\n.form-group[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%], \n.form-group-auto[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%] {\n  height: 34px;\n  padding: 4px 8px;\n  font-size: 14px;\n}\n.form-control-sm[_ngcontent-%COMP%] {\n  height: 34px;\n}\n@media (max-width: 768px) {\n  .form-group[_ngcontent-%COMP%], \n   .form-group-auto[_ngcontent-%COMP%] {\n    min-width: calc(50% - 10px);\n  }\n}\n@media (max-width: 480px) {\n  .form-group[_ngcontent-%COMP%], \n   .form-group-auto[_ngcontent-%COMP%] {\n    min-width: 100%;\n  }\n}\n.matas-table-wrapper[_ngcontent-%COMP%] {\n  max-height: 70vh;\n  overflow-y: auto;\n  overflow-x: auto;\n  width: 100%;\n  border: 1px solid #dee2e6;\n}\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  table-layout: fixed;\n}\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  border: 1px solid #ccc;\n  padding: 6px;\n  text-align: center;\n}\n.matas-table-wrapper[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  position: sticky;\n  background-color: #6c757d;\n  color: white;\n}\n.matas-table-wrapper[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:first-child   th[_ngcontent-%COMP%] {\n  top: 0;\n  z-index: 6;\n}\n.matas-table-wrapper[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(2)   th[_ngcontent-%COMP%] {\n  top: var(--thead-row-height);\n  z-index: 5;\n}\n.sticky-col[_ngcontent-%COMP%] {\n  position: sticky;\n  left: 0;\n  z-index: 6;\n  background-color: #f8f9fa;\n}\nthead[_ngcontent-%COMP%]   .sticky-col[_ngcontent-%COMP%] {\n  z-index: 7;\n}\n.header-cell[_ngcontent-%COMP%] {\n  font-weight: 600;\n  white-space: normal;\n  word-break: break-word;\n  line-height: 1.1;\n}\n.cell-input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 60px;\n  max-width: 100px;\n  padding: 3px;\n  box-sizing: border-box;\n}\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(even) {\n  background-color: #fdfdfd;\n}\n@media (max-width: 768px) {\n  .matas-table-wrapper[_ngcontent-%COMP%] {\n    max-height: calc(100vh - 220px);\n  }\n  .header-cell[_ngcontent-%COMP%] {\n    font-size: 11px;\n    padding: 2px 4px;\n  }\n  .cell-input[_ngcontent-%COMP%] {\n    font-size: 12px;\n  }\n}\n/*# sourceMappingURL=matascaidas.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MatascaidasComponent, { className: "MatascaidasComponent", filePath: "src\\app\\modulos\\matascaidas\\matascaidas.component.ts", lineNumber: 17 });
})();

// src/app/modulos/matascaidas/historico/historico.component.ts
function HistoricoComponent_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 3);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 3);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td")(13, "div", 15)(14, "button", 16);
    \u0275\u0275listener("click", function HistoricoComponent_tr_18_Template_button_click_14_listener() {
      const r_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.reimprimir(r_r2.id));
    });
    \u0275\u0275element(15, "i", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 18);
    \u0275\u0275listener("click", function HistoricoComponent_tr_18_Template_button_click_16_listener() {
      const r_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.verdetalle(r_r2.id));
    });
    \u0275\u0275element(17, "i", 19);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const r_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", r_r2.semana, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", r_r2.anio, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", r_r2.NOMBRE_CORTO, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", r_r2.nombrehacienda, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(11, 5, r_r2.created_at, "dd/MM/yyyy"), "");
  }
}
function HistoricoComponent_tr_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 20);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 3);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r4.lote);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r4.codigo);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx_r2.getBackgroundColor(d_r4.color))("color", d_r4.color === "BLANCO" || d_r4.color === "AMARILLO" ? "black" : "white");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r4.color);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r4.cantidad);
  }
}
var HistoricoComponent = class _HistoricoComponent {
  service;
  userService;
  router;
  registros = [];
  idhaciendaSeleccionada = null;
  dataTable;
  datos = {
    cabecera: {},
    detalle: []
  };
  constructor(service, userService, router) {
    this.service = service;
    this.userService = userService;
    this.router = router;
  }
  ngOnInit() {
    this.cargarHistorico();
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();
  }
  cargarHistorico() {
    this.service.listarHistorico().subscribe((resp) => {
      const haciendas = [1, 8];
      let idhacienda = this.idhaciendaSeleccionada;
      if (haciendas.includes(idhacienda)) {
        if (idhacienda === 8) {
          this.idhaciendaSeleccionada = 3;
        }
        const respuestaFiltrada = resp.filter((item) => item.hacienda_id === this.idhaciendaSeleccionada);
        this.registros = respuestaFiltrada;
      } else {
        this.registros = resp;
      }
      setTimeout(() => this.inicializarDatatable(), 0);
    });
  }
  verdetalle(id) {
    this.service.verPorId(id).subscribe({
      next: (resp) => {
        this.datos = resp;
        console.log(resp);
        setTimeout(() => {
          const modal = new window.bootstrap.Modal(document.getElementById("previewModal"));
          modal.show();
        });
      },
      error: () => {
        alert("No se pudo cargar el detalle");
      }
    });
  }
  inicializarDatatable() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    this.dataTable = $("#tablaHistorico").DataTable({
      pageLength: 10,
      order: [[1, "desc"]],
      language: {
        emptyTable: "No hay datos para la fecha seleccionada"
      }
    });
  }
  reimprimir(id) {
    this.router.navigate(["/imprimir", id]);
  }
  ngOnDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
  getBackgroundColor(nombreColor) {
    const colores = {
      CAFE: "brown",
      NEGRO: "black",
      AZUL: "blue",
      ROJO: "red",
      VERDE: "green",
      AMARILLO: "yellow",
      BLANCO: "white",
      NARANJA: "orange",
      LILA: "purple"
    };
    return colores[nombreColor] || { background: nombreColor, text: "black" };
  }
  static \u0275fac = function HistoricoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HistoricoComponent)(\u0275\u0275directiveInject(HojasaldosService), \u0275\u0275directiveInject(UserService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HistoricoComponent, selectors: [["app-historico"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 43, vars: 3, consts: [[1, "container-fluid", "mt-0"], [1, "container-fluid"], ["id", "tablaHistorico", 1, "table", "table-bordered", "table-striped"], [1, "text-center"], [4, "ngFor", "ngForOf"], ["id", "previewModal", "tabindex", "-1", 1, "modal", "fade"], [1, "modal-dialog", "modal-xl", "modal-dialog-scrollable"], [1, "modal-content"], [1, "modal-header"], [1, "modal-title"], ["data-bs-dismiss", "modal", 1, "btn-close"], [1, "modal-body"], ["id", "vertablaHistorico", 1, "table", "table-bordered", "table-striped"], [1, "modal-footer"], ["data-bs-dismiss", "modal", 1, "btn", "btn-secondary"], [1, "d-flex", "gap-2", "justify-content-center"], [1, "btn", "btn-sm", "btn-success", 3, "click"], [1, "bi", "bi-printer-fill"], [1, "btn", "btn-sm", "btn-primary", 3, "click"], [1, "bi", "bi-eye"], [1, "text-center", "fw-bold"]], template: function HistoricoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "table", 2)(3, "thead")(4, "tr")(5, "th");
      \u0275\u0275text(6, "Semana ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "th");
      \u0275\u0275text(8, "A\xF1o ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "th");
      \u0275\u0275text(10, "Empleado ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "th");
      \u0275\u0275text(12, "Hacienda ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "th");
      \u0275\u0275text(14, "Fecha ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "th", 3);
      \u0275\u0275text(16, "Acciones ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(17, "tbody");
      \u0275\u0275template(18, HistoricoComponent_tr_18_Template, 18, 8, "tr", 4);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(19, "div", 5)(20, "div", 6)(21, "div", 7)(22, "div", 8)(23, "h4", 9);
      \u0275\u0275text(24);
      \u0275\u0275elementEnd();
      \u0275\u0275element(25, "button", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "div", 11)(27, "table", 12)(28, "thead")(29, "tr")(30, "th");
      \u0275\u0275text(31, "Lote ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "th");
      \u0275\u0275text(33, "Codigo ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "th", 3);
      \u0275\u0275text(35, "Color ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "th", 3);
      \u0275\u0275text(37, " Cantidad ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(38, "tbody");
      \u0275\u0275template(39, HistoricoComponent_tr_39_Template, 9, 8, "tr", 4);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(40, "div", 13)(41, "button", 14);
      \u0275\u0275text(42, "Cerrar");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(18);
      \u0275\u0275property("ngForOf", ctx.registros);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.datos.cabecera.nombrehacienda);
      \u0275\u0275advance(15);
      \u0275\u0275property("ngForOf", ctx.datos.detalle);
    }
  }, dependencies: [
    NgForOf,
    DatePipe
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HistoricoComponent, { className: "HistoricoComponent", filePath: "src\\app\\modulos\\matascaidas\\historico\\historico.component.ts", lineNumber: 18 });
})();

// src/app/modulos/HojaSaldo/hojasaldo.routes.ts
var HOJASALDOS_ROUTES = [
  {
    path: "",
    component: HojadesaldoComponent,
    data: { breadcrumb: "Hoja de Saldos" }
  },
  {
    path: "matascaidas",
    component: MatascaidasComponent,
    data: { breadcrumb: "Matas Ca\xEDdas" }
    // Título para la ruta secundaria
  },
  {
    path: "historicomatascaidas",
    component: HistoricoComponent,
    data: { breadcrumb: "Historico Matas Ca\xEDdas" }
    // Título para la ruta secundaria
  }
];
export {
  HOJASALDOS_ROUTES
};
//# sourceMappingURL=chunk-PKRYOLWU.js.map
