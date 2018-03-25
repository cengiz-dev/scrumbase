import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, ProjectsState } from '../store/app.state';
import { getProjectsState, getRouteParams, getSelectedProject, getSelectedEpic } from '../store/app.selectors';
import * as ProjectsActions from '../store/app.actions';
import { ProjectRef } from '../model/project.model';
import { Epic } from '../model/epic.model';
import { Feature } from '../model/feature.model';

@Component({
  selector: 'app-epic-details',
  templateUrl: './epic-details.component.html',
  styleUrls: ['./epic-details.component.css']
})
export class EpicDetailsComponent implements OnInit {
  viewState$: Observable<ProjectsState>;
  routeParams$: Observable<Params>;
  currentProject$: Observable<ProjectRef>;
  currentEpic$: Observable<Epic>;
  addFeaturePanelOpenState: boolean = false;
  addedFeature = new Feature('');

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
    let updatedEpic = { ...projectRef.epics[epicIndex] };
    updatedEpic.title = value.title;
    updatedEpic.description = value.description;
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
}