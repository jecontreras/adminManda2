import { Component, OnInit } from '@angular/core';
import { MandadosService } from 'src/app/services-components/mandados.service';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { FormDetallemandadosComponent } from '../../forms/form-detallemandados/form-detallemandados.component';
import { WebsocketService } from 'src/app/services/websocket.services';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-mandados-empresariales',
  templateUrl: './mandados-empresariales.component.html',
  styleUrls: ['./mandados-empresariales.component.scss']
})
export class MandadosEmpresarialesComponent implements OnInit {

  listMandados: any = [];
  counts: any = [];
  querys: any = {
    where: {
      estado: 0,
      tipoOrden: 1
    },
    sort: "fechaEntrega DESC",
    limit: -1,
    page: 0
  };
  listMandados2: any = [];
  counts2: any = [];
  querys2: any = {
    where: {
      estado: 3,
      tipoOrden: 1
    },
    sort: "fechaEntrega DESC",
    limit: -1,
    page: 0
  };
  listMandados3: any = [];
  querys3: any = {
    where: {
      estado: 2,
      tipoOrden: 1
    },
    sort: "fechaEntrega DESC",
    limit: -1,
    page: 0
  };

  markersMapbox: any = {};

  constructor(
    private wsServices: WebsocketService,
    private _mandados: MandadosService,
    private _tools: ToolsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getMandados();
    this.escucharSockets();
  }

  OpenSelect(ev: any) {
    if (ev == 1) this.getMandadosPactados();
    if (ev == 2) this.getMandadosFinix();
  }

  escucharSockets() {
    this.wsServices.listen('orden-nuevo')
      .subscribe((marcador: any) => {
        //console.log(marcador);
        let formato: any = this.listMandados;
        this.creacionDelFormato(formato, marcador);
        this.listMandados = formato;
      });
  }

  /* mandados empresariales activos */
  getMandados() {
    this.spinner.show();
    this._mandados.get(this.querys).subscribe((res: any) => this.formato(res.data, res.count));
  }

  formato(res: any, count: number) {
    this.counts = res.data;
    let formato: any = [];
    for (let row of res) {
      this.creacionDelFormato(formato, row);
    }
    this.listMandados = formato;
    this.spinner.hide();
  }

  creacionDelFormato(formato: any, row: any) {
    let filtro: any = Object();
    if (Object.keys(formato).length > 0) {
      filtro = formato.find((item: any) => item.usuario.id == row.usuario.id);
      if (!filtro) filtro = {};
    }
    //console.log(filtro);
    if (filtro == undefined) filtro = {};
    if (Object.keys(filtro).length == 0) {
      formato.push({
        id: this.codigo(),
        usuario: row.usuario,
        mandados: [{ ...row }]
      });
    } else {
      let idx: any = _.findIndex(formato, ['id', filtro.id]);
      if (idx >= 0) formato[idx].mandados.push({ ...row });
    }
  }

  /* mandados empresariales finis */

  /* mandados empresariales pactado */
  getMandadosPactados() {
    this.spinner.show();
    this._mandados.get(this.querys2).subscribe((res: any) => this.formato2(res.data, res.count));
  }

  formato2(res: any, count: number) {
    this.counts2 = res.data;
    let formato: any = [];
    for (let row of res) {
      let filtro: any = Object();
      if (Object.keys(formato).length > 0) {
        filtro = formato.find((item: any) => item.usuario.id == row.usuario.id);
        if (!filtro) filtro = {};
        if (filtro == undefined) filtro = {};
      }
      if (Object.keys(filtro).length == 0) {
        formato.push({
          id: this.codigo(),
          usuario: row.usuario,
          mandados: [{ ...row }]
        });
      } else {
        //console.log("entre", formato, filtro.id)
        let idx: any = _.findIndex(formato, ['id', filtro.id]);
        if (idx >= 0) formato[idx].mandados.push({ ...row });
      }
    }
    this.listMandados2 = formato;
    this.spinner.hide();
  }
  /* mandados empresariales finis */

  /* mandados empresariales pactado */
  getMandadosFinix() {
    this.spinner.show();
    this._mandados.get(this.querys3).subscribe((res: any) => this.formato3(res.data, res.count));
  }

  formato3(res: any, count: number) {
    this.counts2 = res.data;
    let formato: any = [];
    for (let row of res) {
      let filtro: any = Object();
      if (Object.keys(formato).length > 0) {
        filtro = formato.find((item: any) => item.usuario.id == row.usuario.id);
        if (!filtro) filtro = {};
        if (filtro == undefined) filtro = {};
      }
      if (Object.keys(filtro).length == 0) {
        formato.push({
          id: this.codigo(),
          usuario: row.usuario,
          mandados: [{ ...row }]
        });
      } else {
        //console.log("entre", formato, filtro.id)
        let idx: any = _.findIndex(formato, ['id', filtro.id]);
        if (idx >= 0) formato[idx].mandados.push({ ...row });
      }
    }
    this.listMandados3 = formato;
    this.spinner.hide();
  }
  /* mandados empresariales finis */

  async openDialog(item: any, opt: string) {
    item.view = opt;
    let dialog: any = await this._tools.openDialog(FormDetallemandadosComponent, item, { height: "694px", width: "750px" });
    dialog.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
      if (result == 'asignado') this.getMandados();
      if (result == 'cambiado') this.getMandadosPactados();
    });
  }

  codigo() {
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

}
