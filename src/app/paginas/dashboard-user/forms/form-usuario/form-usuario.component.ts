import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services-components/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss']
})
export class FormUsuarioComponent implements OnInit {

  data:any = {};
  btnDisabled:boolean = false;
  id:any;
  titulo:any =  "Agregar";

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private activate: ActivatedRoute,
    private Router: Router
  ) { }

  ngOnInit() {
    this.id = (this.activate.snapshot.paramMap.get('id'));
    if( this.id ) { this.titulo = "Editar"; this.getDrive();}
  }

  getDrive(){
    this._user.get({
      where:{ id: this.id }
    }).subscribe((res:any)=>{
      res = res.data[0];
      if(!res) return this.Router.navigate(['/dashboard/usuarios']);
      this.data = res;
    })
  }

  submit(){ 
    if( this.id ) this.update();
    else this.guardar();
  }

  guardar(){
    this._user.registro(this.data).subscribe((res:any)=>{
      console.log(res);
      this.data = res.data;
      this._tools.presentToast("Usuario creado correctamente");
    },(error)=> this._tools.presentToast("Error al crear el usuario"));
  }

  update(){
    if( this.data.password ) return this.cambioPassword();
    this.data = _.omit( this.data, ['rol', 'password', 'confirpassword']);
    this._user.editar(this.data).subscribe((res:any)=>{
      console.log(res);
      this.data = res;
      this._tools.presentToast("Usuario Actualizado correctamente");
    },(error)=> this._tools.presentToast("Error al Actualizar el usuario"));
  }

  cambioPassword(){
    let data:any = {
      id: this.data.id,
      password: this.data.password,
      confirpassword: this.data.confirpassword
    };
    if( data.password !== data.confirpassword ) return this._tools.presentToast("Error las contraseñas no son iguales");
    this._user.cambioPassword(data).subscribe((res:any)=>{
      console.log(res);
      this._tools.presentToast("Contraseña actualizada");
    },(error)=> this._tools.presentToast( error.data ||  "Error de servidor"));
  }

}
