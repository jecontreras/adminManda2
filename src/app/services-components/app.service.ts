import { Injectable } from '@angular/core';
import { APP } from '../interfaces/interfasapp';
import { FactoryModelsService } from '../services/factory-models.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private _model: FactoryModelsService
  ) {
  }
  get(query: any){
    return this._model.querys<APP>('app/querys', query, 'post');
  }
  saved (query: any){
    return this._model.querys<APP>('app', query, 'post');
  }
  editar (query: any){
    return this._model.querys<APP>('app/'+query.id, query, 'put');
  }
  delete (query: any){
    return this._model.querys<APP>('app/'+query.id, query, 'delete');
  }
}