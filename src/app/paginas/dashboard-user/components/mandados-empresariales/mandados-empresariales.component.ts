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

  listMandados:any = [];
  counts:any = [];
  querys:any = {
    where:{
      estado: 0,
      tipoOrden: 1
    },
    sort: "createdAt DESC",
    page: 0
  };

  constructor(
    private _mandados: MandadosService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.getMandados();
  }

  getMandados(){
    this._mandados.get( this.querys ).subscribe(( res:any ) => this.formato( res.data, res.count ) );
  }

  formato( res:any, count:number ){
    this.counts = res.data;
    let formato:any = [];
    for( let row of res ){
      let filtro:any = Object();
      if( Object.keys(formato).length > 0 ) { filtro = formato.find((item:any) => item.usuario.id == row.usuario.id ); if(!formato) formato = {}; }
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
    this.listMandados = formato;
  }

  async openDialog( item:any ){
    let dialog:any = await this._tools.openDialog(FormDetallemandadosComponent, item);
    dialog.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result}`);
    });
  }

  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

}
