import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule, MatListModule, MatIconModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { DataModule } from './data/data.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProjectListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    DataModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
