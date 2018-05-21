import {tap,  mergeMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';


import { AppState, ProjectsState } from '../store/app.state';
import { getProjectsState, getRouteParams, getSelectedProject, getSelectedTaskSummary, getCurrentTask } from '../store/app.selectors';
import * as ProjectsActions from '../store/app.actions';
import { ProjectRef } from '../model/project.model';
import { Epic } from '../model/epic.model';
import { Feature } from '../model/feature.model';
import { Task, TaskSummary, TaskUpdate } from '../model/task.model';
import { TaskType } from '../model/task-type.model';
import { TaskStatus } from '../model/task-status.model';
import { TaskPriorityScheme, TaskPointScheme } from '../model/project-settings.model';
import { TaskPriorityMoscow, TaskPrioritySeverity, TaskPriorityLevel } from '../model/task-priority.model';
import { TaskPointsFibonacci, TaskPointsPowersOf2, TaskPointsLinear } from '../model/task-points.model';

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
  taskTypeKeys = Object.keys(TaskType);
  taskTypeValues = TaskType;
  taskStatusKeys = Object.keys(TaskStatus);
  taskStatusValues = TaskStatus;
  taskPriorityKeys;
  taskPriorityValues;
  taskPointsKeys;
  taskPointsValues;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.viewState$ = this.store.select(getProjectsState);
    this.routeParams$ = this.store.select(getRouteParams);
    this.currentProject$ = this.store.select(getSelectedProject).pipe(tap(currentProject => {
      if (currentProject && currentProject.settings) {
        switch (currentProject.settings.priorityScheme) {
          case TaskPriorityScheme.MOSCOW:
            this.taskPriorityKeys = Object.keys(TaskPriorityMoscow);
            this.taskPriorityValues = TaskPriorityMoscow;
            break;
          case TaskPriorityScheme.SEVERITY:
            this.taskPriorityKeys = Object.keys(TaskPrioritySeverity);
            this.taskPriorityValues = TaskPrioritySeverity;
            break;
          case TaskPriorityScheme.LEVEL:
            this.taskPriorityKeys = Object.keys(TaskPriorityLevel);
            this.taskPriorityValues = TaskPriorityLevel;
            break;
        }
        switch (currentProject.settings.pointScheme) {
          case TaskPointScheme.FIBONACCI:
            this.taskPointsKeys = Object.keys(TaskPointsFibonacci);
            this.taskPointsValues = TaskPointsFibonacci;
            break;
          case TaskPointScheme.POWERS_OF_2:
            this.taskPointsKeys = Object.keys(TaskPointsPowersOf2);
            this.taskPointsValues = TaskPointsPowersOf2;
            break;
          case TaskPointScheme.LINEAR:
            this.taskPointsKeys = Object.keys(TaskPointsLinear);
            this.taskPointsValues = TaskPointsLinear;
            break;
        }
      }
    }));
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
    let updatedTask: TaskUpdate = { };
    if (task.title != value.title) {
      updatedTask.title = value.title;
    }
    if (task.type != value.taskType) {
      updatedTask.type = value.taskType;
    }
    if (task.status != value.taskStatus) {
      updatedTask.status = value.taskStatus;
    }
    if (task.points != value.taskPoints) {
      updatedTask.points = value.taskPoints;
    }
    if (task.priority != value.taskPriority) {
      updatedTask.priority = value.taskPriority;
    }
    if (task.description != value.description) {
      updatedTask.description = value.description;
    }
    this.store.dispatch(new ProjectsActions.UpdateTask({ project, taskKey: task.key, updatedTask, epicIndex, featureIndex, taskIndex }));
  }

  onCancelEditTask() {
    this.store.dispatch(new ProjectsActions.CancelEdit());
  }

  onTaskDeleted(event: any, project: ProjectRef, taskKey: string) {
    this.store.dispatch(new ProjectsActions.DeleteTask({ project, taskKey }));
  }
}