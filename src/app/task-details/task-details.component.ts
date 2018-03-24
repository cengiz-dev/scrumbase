import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { AppState, ProjectsState } from '../store/app.state';
import * as ProjectsActions from '../store/app.actions';
import { ProjectRef } from '../model/project.model';
import { Epic } from '../model/epic.model';
import { Feature } from '../model/feature.model';
import { Task, TaskSummary } from '../model/task.model';
import { getSelectedTaskSummary, getCurrentTask } from '../store/app.selectors';

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
  selectedTaskSummary$: Observable<TaskSummary>;
  currentTask$: Observable<Task>;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.state$ = this.store.pipe(select('projects'));
    this.index$ = this.activatedRoute.parent.params.switchMap(params => params['index']);
    this.epicIndex$ = this.activatedRoute.params.switchMap(params => params['epicIndex']);
    this.featureIndex$ = this.activatedRoute.params.switchMap(params => params['featureIndex']);
    this.taskIndex$ = this.activatedRoute.params.switchMap(params => params['taskIndex']);
    this.selectedTaskSummary$ = this.store.select(getSelectedTaskSummary).do(taskSummary => this.store.dispatch(new ProjectsActions.GetTask(taskSummary.key)));
    this.currentTask$ = this.store.select(getCurrentTask);
  }

  ngOnInit() {
  }

  onEditTask(task: Task) {
    this.store.dispatch(new ProjectsActions.SwitchEditMode(true));
  }

  onSaveTask(form: NgForm, task: Task, project: ProjectRef, epicIndex: number, featureIndex: number, taskIndex: number) {
    const value = form.value;
    let updatedTask = { ...task };
    updatedTask.title = value.title;
    updatedTask.description = value.description;
    this.store.dispatch(new ProjectsActions.UpdateTask({ project, updatedTask, epicIndex, featureIndex, taskIndex }));
  }

  onCancelEditTask() {
    this.store.dispatch(new ProjectsActions.CancelEdit());
  }
}