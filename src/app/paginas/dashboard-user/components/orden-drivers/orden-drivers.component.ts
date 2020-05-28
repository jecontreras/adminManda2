import { Component, OnInit } from '@angular/core';
import { MandadosService } from 'src/app/services-components/mandados.service';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { FormDetallemandadosComponent } from '../../forms/form-detallemandados/form-detallemandados.component';

@Component({
  selector: 'app-orden-drivers',
  templateUrl: './orden-drivers.component.html',
  styleUrls: ['./orden-drivers.component.scss']
})
export class OrdenDriversComponent implements OnInit {

  listMandados2: any = [];
  counts2: any = [];
  querys2: any = {
    where: {
      estado: [2, 3],
      tipoOrden: 1,
      coductor:{ '!': null }
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
    this.getMandadosPactados();
  }

  /* mandados empresariales pactado */
  getMandadosPactados(){
    this._mandados.get( this.querys2 ).subscribe(( res:any ) => this.formato2( res.data, res.count ) );
  }

  formato2( res:any, count:number ){
    this.counts2 = res.data;
    let formato:any = [];
    for( let row of res ){
      let filtro:any = Object();
      if( Object.keys(formato).length > 0 ) { filtro = formato.find((item:any) => item.coductor.id == row.coductor.id ); if(!formato) formato = {}; }
      if(Object.keys(filtro).length == 0 ) {
        formato.push({
          id: this.codigo(),
          coductor: row.coductor,
          mandados: [ { ...row } ]
        });
      }else{
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
    });
  }

  codigo() {
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

}

