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
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  state$: Observable<ProjectsState>;
  index$: Observable<Params>;
  epicIndex$: Observable<Params>;
  featureIndex$: Observable<Params>;
  taskIndex$: Observable<Params>;
  addTaskPanelOpenState: boolean = false;
  addedTask = new Task('');

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.state$ = this.store.pipe(select('projects'));
    this.index$ = this.activatedRoute.parent.params.switchMap(params => params['index']);
    this.epicIndex$ = this.activatedRoute.params.switchMap(params => params['epicIndex']);
    this.featureIndex$ = this.activatedRoute.params.switchMap(params => params['featureIndex']);
    this.taskIndex$ = this.activatedRoute.params.switchMap(params => params['taskIndex']);
  }

  ngOnInit() {
  }

  onEditTask(project: ProjectRef) {
    this.store.dispatch(new ProjectsActions.EditProject(project));
  }

  onSaveTask(form: NgForm, project: ProjectRef, epicIndex: number, featureIndex: number, taskIndex: number) {
    const value = form.value;
    let editedTask = { ...project.epics[epicIndex].features[featureIndex].tasks[taskIndex] };
    editedTask.title = value.title;
    editedTask.description = value.description;
    let projectRef = { ...project };
    projectRef.epics[epicIndex].features[featureIndex].tasks[taskIndex] = editedTask;
    this.store.dispatch(new ProjectsActions.SaveProject(projectRef));
  }

  onCancelEditTask() {
    this.store.dispatch(new ProjectsActions.CancelEdit());
  }
}