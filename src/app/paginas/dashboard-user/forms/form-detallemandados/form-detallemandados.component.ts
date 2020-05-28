import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import { UsuariosService } from 'src/app/services-components/usuarios.service';

@Component({
  selector: 'app-form-detallemandados',
  templateUrl: './form-detallemandados.component.html',
  styleUrls: ['./form-detallemandados.component.scss']
})
export class FormDetallemandadosComponent implements OnInit {
  
  data:any = {};
  listDrivers:any = [];
  
  constructor(
    public dialogRef: MatDialogRef<FormDetallemandadosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _user: UsuariosService
  ) { }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      console.log( this.data );
    }
    this.getDrivers();
  }

  getDrivers(){
    this._user.get({ where: {estadoDisponible: true, estado: 0, conectado: true, rol: "conductor" }, limit: -1 }).subscribe((res:any)=>{
      this.listDrivers = res.data;
    });
  }

}
