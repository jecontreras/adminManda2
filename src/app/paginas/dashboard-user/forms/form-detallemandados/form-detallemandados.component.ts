import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import { UsuariosService } from 'src/app/services-components/usuarios.service';
import { MandadosService } from 'src/app/services-components/mandados.service';
import { ToolsService } from 'src/app/services/tools.service';
import { OfertandoService } from 'src/app/services-components/ofertando.service';
import { error } from 'protractor';
import { WebsocketService } from 'src/app/services/websocket.services';

@Component({
  selector: 'app-form-detallemandados',
  templateUrl: './form-detallemandados.component.html',
  styleUrls: ['./form-detallemandados.component.scss']
})
export class FormDetallemandadosComponent implements OnInit {
  
  data:any = {};
  listDrivers:any = [];
  listSeleccionados:any = {};
  disabledSubmit:boolean = false;
  options:boolean = false;

  markersMapbox: any = {};
  query:any = { where: { estadoDisponible: true, conectado:true, estado: 0, rol: "conductor" }, limit: -1 }
  
  constructor(
    public dialogRef: MatDialogRef<FormDetallemandadosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _user: UsuariosService,
    private _mandado: MandadosService,
    private _tools: ToolsService,
    private _ofertando: OfertandoService,
    private wsServices: WebsocketService,
  ) { }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      console.log( this.data );
      if( this.data.view == 'asignar') this.getDrivers();
      if( this.data.view == 'ver') this.procesoVer();
    }
    this.escucharSockets();
  }

  escucharSockets(){
    // orden-nueva
    this.wsServices.listen('marcador-nuevo')
    .subscribe((marcador: any)=> {
      if( !marcador ) return false;
      if( this.markersMapbox[marcador.id]) this.markersMapbox[marcador.id] = marcador;
      else this.markersMapbox[marcador.id] = marcador; 
      //console.log(marcador, this.markersMapbox);
      let filtro:any = this.listDrivers.find(( row:any )=> row.id == marcador.userID);
      //console.log("encontro", filtro)
      if( !filtro ) this.listDrivers.push({
        id: marcador.userID,
        latitud: marcador.lat,
        longitud: marcador.lng,
        nombre: marcador.nombre,
        apellido: ""
      });
      this.cambiarEstadoDrive();
    });
   
    this.wsServices.listen('marcador-borrar')
    .subscribe((marcador: any)=> {
      //console.log(marcador);
      if( !marcador ) return false;
      if( this.markersMapbox[marcador] ) { this.markersMapbox[marcador].estado = false; this.cambiarEstadoDrive(); }
      this.listDrivers = this.listDrivers.filter( ( row:any )=> row.idSockets !== marcador );
    });

  }
  /* Procedimiento de cambio de estado */

  cambiarEstadoDrive(){
    for( let row of this.listDrivers ){
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

  getDrivers(){
    this._user.get( this.query ).subscribe((res:any)=>{
      this.listDrivers = res.data;
    });
  }

  async AsignarConductor(){
    if( Object.keys( this.listSeleccionados ).length == 0 ) return false;
    this.disabledSubmit = true;
    let ofertando:any = await this.crearOfertando();
    if( !ofertando ) { this.disabledSubmit = false; return this._tools.presentToast("Error en el Proceso por favor vuelva a intentar");}
    let data:any = {
      id: this.data.id,
      coductor: this.listSeleccionados.id,
      idOfertando: ofertando.id,
      origenConductorlat: this.listSeleccionados.latitud,
      origenConductorlon: this.listSeleccionados.longitud,
      ofreceConductor: this.data.ofreceCliente,
      estado: 3
    };
    this._mandado.editar(data).subscribe((res:any)=> {
      this.disabledSubmit = false;
      this._tools.presentToast("Asignado el usuario");
      this.wsServices.emit("orden-confirmada", res);
      this.dialogRef.close('asignado');
    },(error)=> { this.disabledSubmit = false; this._tools.presentToast("Error en el proceso") });
  }

  crearOfertando(){
    return new Promise(resolve=>{
      let data:any = {
        usuario: this.listSeleccionados.id,
        orden: this.data.id,
        ofrece: this.data.ofreceCliente
      };
       this._ofertando.saved(data).subscribe((res:any)=>resolve(res),(error)=>resolve(false));
    });
  }

  seleccionConductor( item:any ){
    for(let row of this.listDrivers) row.check = false;
    item.check = !item.check;
    this.listSeleccionados = item;
  }

  procesoVer(){

  }

}
