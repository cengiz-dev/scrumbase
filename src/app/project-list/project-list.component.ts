import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, ProjectsState } from '../store/app.state';
import * as ProjectsActions from '../store/app.actions';
import { Project } from '../model/project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  state$: Observable<ProjectsState>;
  createProjectPanelOpenState: boolean = false;

  constructor(private store: Store<AppState>, private router: Router) { }

  ngOnInit() {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.state$ = this.store.pipe(select('projects'));
  }

  onCreateProject(form: NgForm) {
    const value = form.value;
    this.store.dispatch(new ProjectsActions.CreateProject(new Project(value.title, value.summary)));
    form.resetForm();
    this.createProjectPanelOpenState = false;
  }

  onProjectSelected(index: number) {
    this.router.navigate(['project', index]);
  }
}
