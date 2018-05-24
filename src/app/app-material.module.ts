import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatExpansionModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDialogModule,
  MatMenuModule,
  MatCheckboxModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MAT_DATE_LOCALE,
} from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FlexLayoutModule,
  ],
  exports: [
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FlexLayoutModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class AppMaterialModule { }
