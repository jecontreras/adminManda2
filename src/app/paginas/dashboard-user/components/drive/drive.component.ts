import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { UsuariosService } from 'src/app/services-components/usuarios.service';
import { WebsocketService } from 'src/app/services/websocket.services';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      rol: "conductor",
      estado: 0
    },
    sort: "createdAt DESC",
    page: 0
  };
  Header:any = [ 'Acciones','Nombre','apellido','E-mail','Telefonos','Cedula', 'Direccion', 'Fecha Registro','Estado' ];
  $:any;
  public datoBusqueda = '';

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  coint:number;

  markersMapbox: any = {};

  constructor(
    private wsServices: WebsocketService,
    private _usuarios: UsuariosService,
    private spinner: NgxSpinnerService,
    private Router: Router,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.cargarTodos();
    this.escucharSockets();
  }

  escucharSockets(){
    // orden-nueva
    this.wsServices.listen('marcador-nuevo')
    .subscribe((marcador: any)=> {
      if( !marcador ) return false;
      if( this.markersMapbox[marcador.id]) this.markersMapbox[marcador.id] = marcador;
      else this.markersMapbox[marcador.id] = marcador; 
      // console.log(marcador, this.markersMapbox);
      this.cambiarEstadoDrive();
    });
   
    this.wsServices.listen('marcador-borrar')
    .subscribe((marcador: any)=> {
      // console.log(marcador);
      if( !marcador ) return false;
      if( this.markersMapbox[marcador] ) { this.markersMapbox[marcador].estado = false; this.cambiarEstadoDrive(); }
      else {
        let filtro = _.findIndex( this.dataTable.dataRows, [ 'idSockets', marcador ]);
        if( !filtro ) return false;
        this.dataTable.dataRows[filtro]['conectado'] = false;
      }
    });

  }
  /* Procedimiento de cambio de estado */

  cambiarEstadoDrive(){
    for( let row of this.dataTable.dataRows ){
      let filtro:any =  this.encontrarDrive( row['id'] ); /*this.markersMapbox.find(( item:any )=> item.userID == row['id'] );*/
      //console.log(filtro);
      if(!filtro) continue;
      row['conectado'] = filtro.estado;
    }
  }

  encontrarDrive( ids:string ){
    let respuesta:any = "";
    for (let [id, marcador] of Object.entries(this.markersMapbox)) {
      //console.log( id, marcador);
      if( marcador['userID'] == ids ) { respuesta = marcador; return marcador;}
    }
    return respuesta;
  }

  crear(obj:any){

  }
  async eliminar(obj:any){
    let confirm = await this._tools.confirm( {title:"Eliminar", detalle:"Deseas Eliminar Dato", confir:"Si Eliminar"} );
    if(!confirm.value) return false;
      let data = {
        id: obj.id,
        estado: 1
      };
    this._usuarios.editar(data).subscribe((res:any)=>{
      this.dataTable.dataRows = this.dataTable.dataRows.filter( (row:any) => row.id !== obj.id );
      this._tools.presentToast("Eliminado")
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
  }

  editar(obj:any){
    this.Router.navigate(['/dashboard/drivesform', obj.id]);
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.cargarTodos();
     }
   }

   pageEvent(ev: any) {
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }

   cargarTodos() {
     this.spinner.show();
     this._usuarios.get(this.query)
     .subscribe(
       (response: any) => {
         this.coint= response.count;
         this.dataTable.headerRow = this.dataTable.headerRow;
         this.dataTable.footerRow = this.dataTable.footerRow;
         this.dataTable.dataRows.push(... response.data);
         this.dataTable.dataRows =_.unionBy(this.dataTable.dataRows || [], response.data, 'id');
         this.loader = false;
           this.spinner.hide();
          
           if (response.data.length === 0 ) {
             this.notEmptyPost =  false;
           }
           this.notscrolly = true;
       },
       error => {
         console.log('Error', error);
       });
   }
  buscar() {
    this.loader = false;
    this.notscrolly = true 
    this.notEmptyPost = true;
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    this.dataTable.dataRows = [];
    if (this.datoBusqueda === '') {
      this.query = {where:{},page: 0};
      this.cargarTodos();
    } else {
      this.query.page = 0;
      this.query.where.or = [
        {
          nombre: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          email: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          apellido: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          celular: {
            contains: this.datoBusqueda|| ''
          }
        },
      ];
      this.cargarTodos();
    }
  }

}
