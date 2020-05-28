import {
  MatSliderModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTabsModule,
  MatDialogModule,
  MatButtonModule,
  MatListModule
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
    MatListModule
  ],
  exports: [
    MatSliderModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule
  ],
})
export class MyOwnCustomMaterialModule { }
