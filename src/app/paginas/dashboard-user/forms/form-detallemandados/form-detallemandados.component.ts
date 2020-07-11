import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import { UsuariosService } from 'src/app/services-components/usuarios.service';
import { MandadosService } from 'src/app/services-components/mandados.service';
import { ToolsService } from 'src/app/services/tools.service';
import { OfertandoService } from 'src/app/services-components/ofertando.service';
import { error } from 'protractor';
import { WebsocketService } from 'src/app/services/websocket.services';
import { MensajesService } from 'src/app/services-components/mensajes.service';
import { resolve } from 'url';

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
  query:any = { where: { estadoDisponible: true, /*conectado:true,*/ estado: 0, rol: "conductor" }, limit: -1 }
  
  constructor(
    public dialogRef: MatDialogRef<FormDetallemandadosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _user: UsuariosService,
    private _mandado: MandadosService,
    private _tools: ToolsService,
    private _ofertando: OfertandoService,
    private wsServices: WebsocketService,
    private _mensajes: MensajesService
  ) { }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      console.log( this.data );
      // if( this.data.view == 'asignar') this.getDrivers();
      if( this.data.view == 'ver') this.procesoVer();
      this.getDrivers();
    }
    this.escucharSockets();
  }

  escucharSockets(){
    // orden-nueva
    this.wsServices.listen('marcador-nuevo')
    .subscribe((marcador: any)=> {
      if( !marcador ) return false;
      //console.log( marcador );
      if( marcador.rol != "conductor") return false;
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
      if( this.data.coductor ) this.listDrivers = this.listDrivers.filter( ( row:any )=> row.id !== this.data.coductor.id );
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
      if( this.data.coductor ) this.listDrivers = this.listDrivers.filter( ( row:any )=> row.id !== this.data.coductor.id );
    });
  }

  async AsignarConductor(){
    if( Object.keys( this.listSeleccionados ).length == 0 ) return false;
    let validador = await this.procesoValidandoMandado();
    if( !validador ) return this._tools.presentToast( "No se puede asignar este mandado empresarial" );
    this.disabledSubmit = true;
    let ofertando:any = await this.crearOfertando();
    if( !ofertando ) { this.disabledSubmit = false; return this._tools.presentToast("Error en el Proceso por favor vuelva a intentar");}
    let data:any = {
      id: this.data.id,
      coductor: this.listSeleccionados.id,
      idOfertando: ofertando.id,
      origenConductorlat: this.listSeleccionados.latitud,
      origenConductorlon: this.listSeleccionados.longitud,
      ofreceConductor: this.data.ofreceCliente || 0,
      estado: 3
    };
    data = _.omitBy(data, _.isNull);
    data = _.omitBy(data, _.isUndefined);
    if( !this.data.coductor ) await this.procesoEditarContrato( data );
    else await this.procesoCambiarConductor( data );
    this.disabledSubmit = false;
  }

  procesoValidandoMandado(){
    return new Promise( resolve =>{
      this._mandado.get( { where: { id: this.data.id, estado: [ 0, 3 ] }, limit: 1 })
      .subscribe(( res:any )=> {
        res = res.data[0];
        if( !res ) return resolve( false );
        resolve( true );
      },( error:any ) => resolve( false ) );
    });
  }

  procesoEditarContrato( data:any ){
    return new Promise( resolve=>{
      this._mandado.editar(data).subscribe((res:any)=> {
        this.disabledSubmit = false;
        this._tools.presentToast("Asignado el usuario");
        this.wsServices.emit("orden-confirmada", res);
        this.dialogRef.close('asignado');
        resolve( res );
      },(error)=> { this.disabledSubmit = false; this._tools.presentToast("Error en el proceso"); resolve(false) });
    });
  }

  procesoCambiarConductor( data:any ){
    return new Promise( resolve=>{
      this._mandado.editar(data).subscribe( async ( res:any )=> {
        let idChat:any;
        try {
          idChat = await this.procesoEliminarChat({ emisor: this.data.coductor.id, reseptor: this.data.usuario.id, ofertando: this.data.idOfertando.id, ordenes: this.data.id });
        } catch (error) {}
        res.idChat = idChat || false;
        this.wsServices.emit("orden-cancelada", res);
        setTimeout(()=>{
          this.disabledSubmit = false;
          this._tools.presentToast("Asignado el usuario");
          this.wsServices.emit("orden-confirmada", res);
          this.dialogRef.close('cambiado');
        }, 3000);
        resolve( res );
      },(error)=> { this.disabledSubmit = false; this._tools.presentToast("Error en el proceso"); resolve(false) });
    })
  }

  procesoEliminarChat( data:any ){
    return new Promise( resolve=>{
      let filtro = {
        emisor: data.emisor,
        reseptor: data.reseptor,
        text: "eliminado",
        ofertando: data.ofertando,
        ordenes: data.ordenes
      };
      this._mensajes.destruirChat( filtro ).subscribe((res:any)=>{
        resolve( res.data );
      },(error:any)=> resolve( false ));
    });
  }

  crearOfertando(){
    return new Promise(resolve=>{
      let data:any = {
        usuario: this.listSeleccionados.id,
        orden: this.data.id,
        ofrece: this.data.ofreceCliente || 0
      };
      data = _.omitBy(data, _.isNull);
      data = _.omitBy(data, _.isUndefined);
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
