import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services-components/app.service';
import { ToolsService } from 'src/app/services/tools.service';
import { WebsocketService } from 'src/app/services/websocket.services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {
  data:any = {
    disponible: true
  };
  constructor(
    private _app: AppService,
    private _tools: ToolsService,
    private wsServices: WebsocketService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getCargandoApp();
  }

  getCargandoApp(){
    this.spinner.show();
    this._app.get( { where: { vercion:"1.0" } }).subscribe(( res:any )=> {
      // console.log( res );
      this.spinner.hide();
      this.data = res.data[0] || {};
    });
  }

  procesoEstado( opt:boolean ){
    this.data.disponible = opt;
    this.actualizar();
  }

  actualizar(){
    let data:any = {
      id: this.data.id,
      mensaje1: this.data.mensaje1,
      mensaje2: this.data.mensaje2,
      desde: this.data.desde,
      hasta: this.data.hasta,
      disponible: this.data.disponible
    };
    this._app.editar( data ).subscribe(( res:any )=>{
      console.log( "res", res );
      this.wsServices.emit("administracion", res);
      this._tools.presentToast("Actualizado administracion");
    },(error)=> this._tools.presentToast("Error de servidor"));
  }

}
