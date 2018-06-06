import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ProjectsState, AppState } from '../store/app.state';
import * as ProjectsActions from '../store/app.actions';
import { getProjectsState, getRouteParams, getSelectedProject } from '../store/app.selectors';
import { ProjectRef } from '../model/project.model';
import { Task, TaskSummary } from '../model/task.model';
import { TaskNavigationService } from '../shared/task-navigation.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {
  viewState$: Observable<ProjectsState>;
  routeParams$: Observable<Params>;
  currentProject$: Observable<ProjectRef>;
  addTaskPanelOpenState: boolean = false;
  addedTask = new Task('');
  showDeletedTasks = false;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute, private taskNavigationService: TaskNavigationService) {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.viewState$ = this.store.select(getProjectsState);
    this.routeParams$ = this.store.select(getRouteParams);
    this.currentProject$ = this.store.select(getSelectedProject);
  }

  ngOnInit() {
  }

  onAddTask(form: NgForm, project: ProjectRef) {
    this.store.dispatch(new ProjectsActions.AddTask({ project, task: { ...this.addedTask } }));
    form.resetForm();
    this.addedTask = new Task('');
    this.addTaskPanelOpenState = false;
  }

  onTaskSelected(projectIndex: number, taskSummary: TaskSummary, taskIndex: number) {
    this.taskNavigationService.navigate(projectIndex, taskSummary, taskIndex);
  }

  onTaskDeleted(event: any, project: ProjectRef, taskKey: string) {
    event.stopPropagation();
    this.store.dispatch(new ProjectsActions.DeleteTask({ project, taskKey }));
  }
}
