import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../store/app.state';
import * as ProjectsActions from '../store/app.actions';
import { getSelectedProject, getRouteParams } from '../store/app.selectors';
import { Sprint } from '../model/sprint.model';
import { ProjectRef } from '../model/project.model';

@Component({
  selector: 'app-sprints',
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.css']
})
export class SprintsComponent implements OnInit {
  routeParams$: Observable<Params>;
  currentProject$: Observable<ProjectRef>;
  createSprintPanelOpenState: boolean = false;
  createdSprint = new Sprint();

  constructor(private store: Store<AppState>, private router: Router) {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.routeParams$ = this.store.select(getRouteParams);
    this.currentProject$ = this.store.select(getSelectedProject);
  }

  ngOnInit() {
  }

  onCreateSprint(form: NgForm, project: ProjectRef) {
    this.store.dispatch(new ProjectsActions.CreateSprint({ project: project, sprint: { ...this.createdSprint as Sprint } }));
    form.resetForm();
    this.createdSprint = new Sprint();
    this.createSprintPanelOpenState = false;
  }

  onSprintSelected(index: number, sprintIndex: number) {
    this.router.navigate(['project', index, 'sprint', sprintIndex]);
  }
}
