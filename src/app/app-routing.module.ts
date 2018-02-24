import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { EpicDetailsComponent } from './epic-details/epic-details.component';

const routes: Routes = [
  { path: 'projects', component: ProjectListComponent },
  { path: 'project/:index', component: ProjectDetailsComponent },
  { path: 'project/:index/epic/:epicIndex', component: EpicDetailsComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
