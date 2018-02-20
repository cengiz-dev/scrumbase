import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, ProjectsState } from '../store/app.state';
import * as ProjectsActions from '../store/app.actions';
import { getProjects } from '../store/app.selectors';
import { Project } from '../model/project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  allProjects$: Observable<Project[]>;
  createProjectPanelOpenState: boolean = false;

  constructor(private store: Store<AppState>, private router: Router) { }

  ngOnInit() {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.allProjects$ = this.store.select(getProjects);
  }

  onCreateProject(form: NgForm) {
    const value = form.value;
    let createdProject = new Project(value.title);
    createdProject.description = value.description;
    this.store.dispatch(new ProjectsActions.CreateProject(createdProject));
    form.resetForm();
    this.createProjectPanelOpenState = false;
  }

  onProjectSelected(index: number) {
    this.router.navigate(['project', index]);
  }
}
