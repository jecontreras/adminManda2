import { Injectable } from '@angular/core';
import { FactoryModelsService } from '../services/factory-models.service';
import { OFERTANDO } from '../interfaces/interfasapp';

@Injectable({
  providedIn: 'root'
})
export class OfertandoService {

  constructor(
    private _model: FactoryModelsService
  ) {
  }
  get(query: any){
    return this._model.querys<OFERTANDO>('ofertando/querys', query, 'post');
  }
  saved (query: any){
    return this._model.querys<OFERTANDO>('ofertando', query, 'post');
  }
  editar (query: any){
    return this._model.querys<OFERTANDO>('ofertando/'+query.id, query, 'put');
  }
  delete (query: any){
    return this._model.querys<OFERTANDO>('ofertando/'+query.id, query, 'delete');
  }
}
