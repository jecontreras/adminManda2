import { Component, OnInit } from '@angular/core';
import { MandadosService } from 'src/app/services-components/mandados.service';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { FormDetallemandadosComponent } from '../../forms/form-detallemandados/form-detallemandados.component';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

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
      estado: [2,3],
      tipoOrden: 1,
      coductor:{ '!': null }
    },
    sort: "createdAt DESC",
    limit: -1,
    page: 0
  };

  filtro:any = {};
  disableFiltro:boolean = false;

  constructor(
    private _mandados: MandadosService,
    private spinner: NgxSpinnerService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.borrarFiltro();
  }

  borrarFiltro(){
    this.filtro = {
      fecha2: moment().format("YYYY-MM-DD"),
      fecha1: moment().add(-1, 'days').format("YYYY-MM-DD")
    };
    this.querys2= {
      where: {
        estado: [2,3],
        tipoOrden: 1,
        coductor:{ '!': null }
      },
      sort: "createdAt DESC",
      limit: -1,
      page: 0
    };
    this.querys2.where.createdAt = {
      ">=": moment( this.filtro.fecha1 ),
      "<=": moment( this.filtro.fecha2 )
    };
    console.log(this.querys2)
    this.getMandadosPactados();
  }

  /* mandados empresariales pactado */
  getMandadosPactados(){
    this.spinner.show();
    this._mandados.get( this.querys2 ).subscribe(( res:any ) => this.formato2( res.data, res.count ) );
  }

  formato2( res:any, count:number ){
    this.disableFiltro = false;
    this.counts2 = res.data;
    let formato:any = [];
    for( let row of res ){
      let filtro:any = Object();
      if( Object.keys(formato).length > 0 ) { filtro = formato.find((item:any) => item.coductor.id == row.coductor.id ); if(!filtro) filtro = {}; }
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
    this.spinner.hide();
  }
/* mandados empresariales finis */

  async openDialog(item: any, opt:string) {
    item.view = opt;
    let dialog: any = await this._tools.openDialog(FormDetallemandadosComponent, item, { height: "694px", width: "750px" });
    dialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  codigo() {
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  buscarFiltro(){
    var dateFormat = 'YYYY-MM-DD';
    if( !( moment(moment( this.filtro.fecha1 ).format(dateFormat),dateFormat ).isValid() ) ) return false;
    if( !( moment(moment( this.filtro.fecha2 ).format(dateFormat),dateFormat ).isValid() ) ) return false;
    this.disableFiltro = true;
    this.querys2.where.createdAt = {
      ">=": moment( this.filtro.fecha1 ),
      "<=": moment( this.filtro.fecha2 )
    };
    this.getMandadosPactados();
  }

}

