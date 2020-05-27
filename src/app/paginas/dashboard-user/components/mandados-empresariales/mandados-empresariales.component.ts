import { Component, OnInit } from '@angular/core';
import { MandadosService } from 'src/app/services-components/mandados.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-mandados-empresariales',
  templateUrl: './mandados-empresariales.component.html',
  styleUrls: ['./mandados-empresariales.component.scss']
})
export class MandadosEmpresarialesComponent implements OnInit {

  listMandados:any = [
    {
      usuario:{
        nombre: "jose"
      },
      mandados: [
        {
          origentexto: "tibu"
        }
      ]
    }
  ];
  counts:any = [{},{},{},{},{},{}];
  querys:any = {
    where:{
      estado: 0,
      tipoOrden: 1
    },
    sort: "createdAt DESC",
    page: 0
  };

  constructor(
    private _mandados: MandadosService
  ) { }

  ngOnInit() {
    this.getMandados();
  }

  getMandados(){
    this._mandados.get( this.querys ).subscribe(( res:any ) => this.formato( res.data, res.count ) );
  }

  formato( res:any, count:number ){
    // this.counts = count;
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
        let idx:any = _.indexOf( formato, [ 'id', filtro.id ]);
        console.log("entre", formato, filtro.id, idx)
        if(idx >= 0) formato[idx].mandados.push( { ...row });
      }
    }
    console.log(formato);
    this.listMandados = formato;
  }

  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

}
