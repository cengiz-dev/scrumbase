import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, ProjectsState } from '../store/app.state';
import * as ProjectsActions from '../store/app.actions';
import { ProjectRef } from '../model/project.model';
import { Epic } from '../model/epic.model';
import { Feature } from '../model/feature.model';
import { Task } from '../model/task.model';

@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.css']
})
export class FeatureDetailsComponent implements OnInit {
  state$: Observable<ProjectsState>;
  index$: Observable<Params>;
  epicIndex$: Observable<Params>;
  featureIndex$: Observable<Params>;
  addTaskPanelOpenState: boolean = false;
  addedTask = new Task('');

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.state$ = this.store.pipe(select('projects'));
    this.index$ = this.activatedRoute.parent.params.switchMap(params => params['index']);
    this.epicIndex$ = this.activatedRoute.params.switchMap(params => params['epicIndex']);
    this.featureIndex$ = this.activatedRoute.params.switchMap(params => params['featureIndex']);
  }

  ngOnInit() {
  }

  onEditFeature(project: ProjectRef) {
    this.store.dispatch(new ProjectsActions.EditProject(project));
  }

  onSaveFeature(form: NgForm, project: ProjectRef, epicIndex: number, featureIndex: number) {
    const value = form.value;
    let editedFeature = { ...project.epics[epicIndex].features[featureIndex] };
    editedFeature.title = value.title;
    editedFeature.description = value.description;
    let projectRef = { ...project };
    projectRef.epics[epicIndex].features[featureIndex] = editedFeature;
    this.store.dispatch(new ProjectsActions.SaveProject(projectRef));
  }

  onCancelEditFeature() {
    this.store.dispatch(new ProjectsActions.CancelEdit());
  }

  onAddTask(form: NgForm, project: ProjectRef, epicIndex: number, featureIndex: number) {
    // this.store.dispatch(new ProjectsActions.AddTask(
    //   { project: project, epicIndex: epicIndex, featureIndex: featureIndex, task: { ...this.addedTask }}));
    form.resetForm();
    this.addedTask = new Task('');
    this.addTaskPanelOpenState = false;
  }

  onTaskSelected(projectIndex: number, epicIndex: number, featureIndex: number, taskIndex: number) {
    this.router.navigate(['project', projectIndex, 'epic', epicIndex, 'feature', featureIndex, 'task', taskIndex]);
  }
}