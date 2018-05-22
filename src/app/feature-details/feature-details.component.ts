import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, ProjectsState } from '../store/app.state';
import { getProjectsState, getRouteParams, getSelectedProject, getSelectedFeature } from '../store/app.selectors';
import * as ProjectsActions from '../store/app.actions';
import { ProjectRef } from '../model/project.model';
import { Feature, FeatureUpdate } from '../model/feature.model';
import { Task } from '../model/task.model';

@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.css']
})
export class FeatureDetailsComponent implements OnInit {
  viewState$: Observable<ProjectsState>;
  routeParams$: Observable<Params>;
  currentProject$: Observable<ProjectRef>;
  currentFeature$: Observable<Feature>;
  addTaskPanelOpenState: boolean = false;
  addedTask = new Task('');
  showDeletedTasks = false;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.viewState$ = this.store.select(getProjectsState);
    this.routeParams$ = this.store.select(getRouteParams);
    this.currentProject$ = this.store.select(getSelectedProject);
    this.currentFeature$ = this.store.select(getSelectedFeature);
    this.store.dispatch(new ProjectsActions.GetProjects());
  }

  ngOnInit() {
  }

  onEditFeature(project: ProjectRef) {
    this.store.dispatch(new ProjectsActions.SwitchEditMode(true));
  }

  onSaveFeature(form: NgForm, projectRef: ProjectRef, epicIndex: number, featureIndex: number) {
    const value = form.value;
    let feature = projectRef.epics[epicIndex].features[featureIndex];
    let updatedFeature: FeatureUpdate = {};
    if (feature.title != value.title) {
      updatedFeature.title = value.title;
    }
    if (feature.description != value.description) {
      updatedFeature.description = value.description;
    }
    this.store.dispatch(new ProjectsActions.UpdateFeature({ project: projectRef, updatedFeature, epicIndex, featureIndex }));
  }

  onCancelEditFeature() {
    this.store.dispatch(new ProjectsActions.CancelEdit());
  }

  onAddTask(form: NgForm, project: ProjectRef, epicIndex: number, featureIndex: number) {
    this.store.dispatch(new ProjectsActions.AddTask({ project, task: { ...this.addedTask }, epicIndex, featureIndex }));
    form.resetForm();
    this.addedTask = new Task('');
    this.addTaskPanelOpenState = false;
  }

  onTaskSelected(projectIndex: number, epicIndex: number, featureIndex: number, taskIndex: number) {
    this.router.navigate(['project', projectIndex, 'epic', epicIndex, 'feature', featureIndex, 'task', taskIndex]);
  }

  onTaskDeleted(event: any, project: ProjectRef, taskKey: string) {
    event.stopPropagation();
    this.store.dispatch(new ProjectsActions.DeleteTask({ project, taskKey }));
  }
}