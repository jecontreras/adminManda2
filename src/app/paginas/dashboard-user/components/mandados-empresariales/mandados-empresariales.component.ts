import { Component, OnInit } from '@angular/core';
import { MandadosService } from 'src/app/services-components/mandados.service';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { FormDetallemandadosComponent } from '../../forms/form-detallemandados/form-detallemandados.component';
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
    sort: "createdAt DESC",
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
    sort: "createdAt DESC",
    limit: -1,
    page: 0
  };

  constructor(
    private _mandados: MandadosService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.getMandados();
    this.getMandadosPactados();
  }
  /* mandados empresariales activos */
  getMandados() {
    this._mandados.get(this.querys).subscribe((res: any) => this.formato(res.data, res.count));
  }

  formato(res: any, count: number) {
    this.counts = res.data;
    let formato: any = [];
    for (let row of res) {
      let filtro: any = Object();
      if (Object.keys(formato).length > 0) { 
        filtro = formato.find((item: any) => item.usuario.id == row.usuario.id); 
        if (!filtro) filtro = {}; 
      }
      console.log(filtro);
      if(filtro == undefined) filtro = {}; 
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
    this.listMandados = formato;
  }
  /* mandados empresariales finis */

  /* mandados empresariales pactado */
  getMandadosPactados(){
    this._mandados.get( this.querys2 ).subscribe(( res:any ) => this.formato2( res.data, res.count ) );
  }

  formato2( res:any, count:number ){
    this.counts2 = res.data;
    let formato:any = [];
    for( let row of res ){
      let filtro:any = Object();
      if( Object.keys(formato).length > 0 ) { 
        filtro = formato.find((item:any) => item.usuario.id == row.usuario.id ); 
        if(!filtro) filtro = {}; 
        if(filtro == undefined) filtro = {}; 
      }
      if(Object.keys(filtro).length == 0 ) {
        formato.push({
          id: this.codigo(),
          usuario: row.usuario,
          mandados: [ { ...row } ]
        });
      }else{
        console.log("entre", formato, filtro.id)
        let idx:any = _.findIndex( formato, [ 'id', filtro.id ]);
        if(idx >= 0) formato[idx].mandados.push( { ...row });
      }
    }
    this.listMandados2 = formato;
  }
/* mandados empresariales finis */

  async openDialog(item: any, opt:string) {
    item.view = opt;
    let dialog: any = await this._tools.openDialog(FormDetallemandadosComponent, item, { height: "490px", width: "750px" });
    dialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result == 'asignado') this.getMandados();
    });
  }

  codigo() {
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

}
