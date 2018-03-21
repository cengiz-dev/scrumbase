import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, ProjectsState } from '../store/app.state';
import * as ProjectsActions from '../store/app.actions';
import { ProjectRef } from '../model/project.model';
import { TaskPriorityScheme, TaskPointScheme } from '../model/project-settings.model';
import { Epic } from '../model/epic.model';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  state$: Observable<ProjectsState>;
  index$: Observable<Params>;
  prioritySchemeKeys = Object.keys(TaskPriorityScheme);
  prioritySchemeValues = TaskPriorityScheme;
  pointSchemeKeys = Object.keys(TaskPointScheme);
  pointSchemeValues = TaskPointScheme;
  addEpicPanelOpenState: boolean = false;
  addedEpic = new Epic('');

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.state$ = this.store.pipe(select('projects'));
    this.index$ = this.activatedRoute.params.switchMap(params => params['index']);
  }

  ngOnInit() {
  }

  onEditProject(project: ProjectRef) {
    this.store.dispatch(new ProjectsActions.EditProject(project));
  }

  onSaveProject(form: NgForm, project: ProjectRef) {
    const value = form.value;
    let projectRef = new ProjectRef(project.id, value.title);
    projectRef.description = value.description;
    projectRef.settings.priorityScheme = value.priorityScheme;
    projectRef.settings.pointScheme = value.pointScheme;
    this.store.dispatch(new ProjectsActions.UpdateProject(projectRef));
  }

  onCancelEditProject() {
    this.store.dispatch(new ProjectsActions.CancelEdit());
  }

  onAddEpic(form: NgForm, project: ProjectRef) {
    this.store.dispatch(new ProjectsActions.AddEpic({ project: project, epic: { ...this.addedEpic }}));
    form.resetForm();
    this.addedEpic = new Epic('');
    this.addEpicPanelOpenState = false;
  }

  onEpicSelected(projectIndex: number, epicIndex: number) {
    this.router.navigate(['project', projectIndex, 'epic', epicIndex]);
  }
}