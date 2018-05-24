import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../store/app.state';
import * as ProjectsActions from '../store/app.actions';
import { getSelectedProject } from '../store/app.selectors';
import { Sprint } from '../model/sprint.model';
import { ProjectRef } from '../model/project.model';

@Component({
  selector: 'app-sprints',
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.css']
})
export class SprintsComponent implements OnInit {
  currentProject$: Observable<ProjectRef>;
  createSprintPanelOpenState: boolean = false;
  createdSprint = new Sprint();

  constructor(private store: Store<AppState>, private router: Router) {
    this.store.dispatch(new ProjectsActions.GetProjects());
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

  onSprintSelected(index: number) {
    this.router.navigate(['project', index]);
  }
}
