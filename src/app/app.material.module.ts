import {
  MatSliderModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTabsModule,
  MatDialogModule,
  MatButtonModule
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    MatSliderModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    MatSliderModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule
  ],
})
export class MyOwnCustomMaterialModule { }
