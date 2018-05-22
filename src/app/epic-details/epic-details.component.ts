import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, ProjectsState } from '../store/app.state';
import { getProjectsState, getRouteParams, getSelectedProject, getSelectedEpic } from '../store/app.selectors';
import * as ProjectsActions from '../store/app.actions';
import { ProjectRef } from '../model/project.model';
import { Epic, EpicUpdate } from '../model/epic.model';
import { Feature } from '../model/feature.model';
import { Task } from '../model/task.model';

@Component({
  selector: 'app-epic-details',
  templateUrl: './epic-details.component.html',
  styleUrls: ['./epic-details.component.css'],
})
export class EpicDetailsComponent implements OnInit {
  viewState$: Observable<ProjectsState>;
  routeParams$: Observable<Params>;
  currentProject$: Observable<ProjectRef>;
  currentEpic$: Observable<Epic>;
  addFeaturePanelOpenState: boolean = false;
  addedFeature = new Feature('');
  addTaskPanelOpenState: boolean = false;
  addedTask = new Task('');

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.viewState$ = this.store.select(getProjectsState);
    this.routeParams$ = this.store.select(getRouteParams);
    this.currentProject$ = this.store.select(getSelectedProject);
    this.currentEpic$ = this.store.select(getSelectedEpic);
    this.store.dispatch(new ProjectsActions.GetProjects());
  }

  ngOnInit() {
  }

  onEditEpic(project: ProjectRef) {
    this.store.dispatch(new ProjectsActions.SwitchEditMode(true));
  }

  onSaveEpic(form: NgForm, projectRef: ProjectRef, epicIndex: number) {
    const value = form.value;
    let epic = projectRef.epics[epicIndex];
    let updatedEpic: EpicUpdate = {};
    if (epic.title != value.title) {
      updatedEpic.title = value.title;
    }
    if (epic.description != value.description) {
      updatedEpic.description = value.description;
    }
    this.store.dispatch(new ProjectsActions.UpdateEpic({
      project: projectRef,
      updatedEpic: updatedEpic,
      epicIndex: epicIndex
    }));
  }

  onCancelEditEpic() {
    this.store.dispatch(new ProjectsActions.CancelEdit());
  }

  onAddFeature(form: NgForm, project: ProjectRef, epicIndex: number) {
    this.store.dispatch(new ProjectsActions.AddFeature({ project: project, epicIndex: epicIndex, feature: { ...this.addedFeature }}));
    form.resetForm();
    this.addedFeature = new Feature('');
    this.addFeaturePanelOpenState = false;
  }

  onFeatureSelected(projectIndex: number, epicIndex: number, featureIndex: number) {
    this.router.navigate(['project', projectIndex, 'epic', epicIndex, 'feature', featureIndex]);
  }

  onAddTask(form: NgForm, project: ProjectRef, epicIndex: number) {
    this.store.dispatch(new ProjectsActions.AddTask({ project, task: { ...this.addedTask }, epicIndex }));
    form.resetForm();
    this.addedTask = new Task('');
    this.addTaskPanelOpenState = false;
  }

  onTaskSelected(projectIndex: number, epicIndex: number, taskIndex: number) {
    this.router.navigate(['project', projectIndex, 'epic', epicIndex, 'task', taskIndex]);
  }

  onTaskDeleted(event: any, project: ProjectRef, taskKey: string) {
    event.stopPropagation();
    this.store.dispatch(new ProjectsActions.DeleteTask({ project, taskKey }));
  }
}