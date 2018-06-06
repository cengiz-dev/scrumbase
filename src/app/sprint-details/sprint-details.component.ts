import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ProjectsState, AppState } from '../store/app.state';
import { getProjectsState, getRouteParams, getSelectedProject, getSelectedSprint, getCurrentTasks } from '../store/app.selectors';
import * as ProjectsActions from '../store/app.actions';
import { Sprint, SprintUpdate } from '../model/sprint.model';
import { ProjectRef } from '../model/project.model';
import { TaskSummary } from '../model/task.model';
import { TaskNavigationService } from '../shared/task-navigation.service';

@Component({
  selector: 'app-sprint-details',
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.css']
})
export class SprintDetailsComponent implements OnInit {
  viewState$: Observable<ProjectsState>;
  routeParams$: Observable<Params>;
  currentProject$: Observable<ProjectRef>;
  currentSprint$: Observable<Sprint>;
  currentTasks$: Observable<TaskSummary[]>;
  addTaskPanelOpenState: boolean = false;
  showDeletedTasks = false;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute, private taskNavigationService: TaskNavigationService) {
    this.viewState$ = this.store.select(getProjectsState);
    this.routeParams$ = this.store.select(getRouteParams);
    this.currentProject$ = this.store.select(getSelectedProject);
    this.currentSprint$ = this.store.select(getSelectedSprint).pipe(
      tap(currentSprint => { if (currentSprint) this.store.dispatch(new ProjectsActions.GetTasks(currentSprint.taskKeys)); })
    );
    this.currentTasks$ = this.store.select(getCurrentTasks);
  }

  ngOnInit() {
    this.store.dispatch(new ProjectsActions.GetProjects());
    ;
  }

  onEditSprint(project: ProjectRef, sprint) {
    this.store.dispatch(new ProjectsActions.SwitchEditMode(true));
  }

  onSaveSprint(form: NgForm, project: ProjectRef, sprintIndex: number, sprint: Sprint) {
    const value = form.value;
    let updatedSprint: SprintUpdate = {};
    if (sprint.title != value.title) {
      updatedSprint.title = value.title;
    }
    if (sprint.startTime != value.startTime) {
      updatedSprint.startTime = value.startTime;
    }
    if (sprint.endTime != value.endTime) {
      updatedSprint.endTime = value.endTime;
    }
    this.store.dispatch(new ProjectsActions.UpdateSprint({ project, sprintIndex, updates: updatedSprint }));
  }

  onCancelEditSprint() {
    this.store.dispatch(new ProjectsActions.CancelEdit());
  }

  onAddTask(event: any, project: ProjectRef, taskKey: string, sprintIndex: number) {
    event.stopPropagation();
    this.store.dispatch(new ProjectsActions.AddTaskToSprint({ project, taskKey, sprintIndex }));
  }

  onRemoveTask(event: any, project: ProjectRef, taskKey: string, sprintIndex: number) {
    event.stopPropagation();
    this.store.dispatch(new ProjectsActions.RemoveTaskFromSprint({ project, taskKey, sprintIndex }));
  }

  onSprintTaskSelected(project: ProjectRef, projectIndex: number, taskSummary: TaskSummary) {
    this.taskNavigationService.navigateWithoutTaskIndex(project, projectIndex, taskSummary);
  }

  onTaskSelected(projectIndex: number, taskSummary: TaskSummary, taskIndex: number) {
    this.taskNavigationService.navigate(projectIndex, taskSummary, taskIndex);
  }
}
