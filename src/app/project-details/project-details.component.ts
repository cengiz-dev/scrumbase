import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, ProjectsState } from '../store/app.state';
import { getProjectsState, getRouteParams, getSelectedProject } from '../store/app.selectors';
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
  viewState$: Observable<ProjectsState>;
  routeParams$: Observable<Params>;
  currentProject$: Observable<ProjectRef>;
  prioritySchemeKeys = Object.keys(TaskPriorityScheme);
  prioritySchemeValues = TaskPriorityScheme;
  pointSchemeKeys = Object.keys(TaskPointScheme);
  pointSchemeValues = TaskPointScheme;
  addEpicPanelOpenState: boolean = false;
  addedEpic = new Epic('');

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.viewState$ = this.store.select(getProjectsState);
    this.routeParams$ = this.store.select(getRouteParams);
    this.currentProject$ = this.store.select(getSelectedProject);
  }

  ngOnInit() {
  }

  onEditProject(project: ProjectRef) {
    this.store.dispatch(new ProjectsActions.SwitchEditMode(true));
  }

  onSaveProject(form: NgForm, project: ProjectRef) {
    const value = form.value;
    let updatedProject = { ...project };
    project.title = value.title;
    updatedProject.description = value.description;
    updatedProject.settings.priorityScheme = value.priorityScheme;
    updatedProject.settings.pointScheme = value.pointScheme;
    this.store.dispatch(new ProjectsActions.UpdateProject(updatedProject));
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