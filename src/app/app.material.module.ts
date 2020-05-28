import {
  MatSliderModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTabsModule,
  MatDialogModule,
  MatButtonModule,
  MatListModule,
  MatPaginatorModule
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    MatSliderModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatPaginatorModule
  ],
  exports: [
    MatSliderModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatPaginatorModule
  ],
})
export class MyOwnCustomMaterialModule { }
