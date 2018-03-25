import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import 'rxjs/add/operator/do';

import { AppState, ProjectsState } from '../store/app.state';
import { getProjectsState, getRouteParams, getSelectedProject, getSelectedTaskSummary, getCurrentTask } from '../store/app.selectors';
import * as ProjectsActions from '../store/app.actions';
import { ProjectRef } from '../model/project.model';
import { Epic } from '../model/epic.model';
import { Feature } from '../model/feature.model';
import { Task, TaskSummary } from '../model/task.model';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  viewState$: Observable<ProjectsState>;
  routeParams$: Observable<Params>;
  currentProject$: Observable<ProjectRef>;
  currentTask$: Observable<Task>;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.viewState$ = this.store.select(getProjectsState);
    this.routeParams$ = this.store.select(getRouteParams);
    this.currentProject$ = this.store.select(getSelectedProject);
    this.currentTask$ = this.store.select(getSelectedTaskSummary).pipe(
      mergeMap(taskSummary => {
        if (taskSummary) {
          this.store.dispatch(new ProjectsActions.GetTask(taskSummary.key))
        }
        return this.store.select(getCurrentTask);
      }));
    this.store.dispatch(new ProjectsActions.GetProjects());
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