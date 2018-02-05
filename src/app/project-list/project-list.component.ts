import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { State } from '../store/app.reducers';
import * as ProjectsActions from '../store/app.actions';
import { Project } from '../model/project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects$: Observable<Project[]>;
  createProjectPanelOpenState: boolean = false;

  constructor(private store: Store<State>, private router: Router) { }

  ngOnInit() {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.projects$ = this.store.pipe(select('projects'));
  }

  onCreateProject(form: NgForm) {
    const value = form.value;
    this.store.dispatch(new ProjectsActions.CreateProject(new Project(value.title, value.summary)));
    form.resetForm();
    this.createProjectPanelOpenState = false;
  }

  onProjectSelected(project: Project) {
    this.router.navigate(['project', project.title]);
  }
}
