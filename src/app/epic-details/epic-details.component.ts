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

@Component({
  selector: 'app-epic-details',
  templateUrl: './epic-details.component.html',
  styleUrls: ['./epic-details.component.css']
})
export class EpicDetailsComponent implements OnInit {
  state$: Observable<ProjectsState>;
  index$: Observable<Params>;
  epicIndex$: Observable<Params>;
  addFeaturePanelOpenState: boolean = false;
  addedFeature = new Feature('');

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.state$ = this.store.pipe(select('projects'));
    this.index$ = this.activatedRoute.parent.params.switchMap(params => params['index']);
    this.epicIndex$ = this.activatedRoute.params.switchMap(params => params['epicIndex']);
  }

  ngOnInit() {
  }

  onEditEpic(project: ProjectRef) {
    this.store.dispatch(new ProjectsActions.EditProject(project));
  }

  onSaveEpic(form: NgForm, project: ProjectRef) {
    const value = form.value;
    let projectRef = new ProjectRef(project.id, value.title);
    projectRef.description = value.description;
    projectRef.settings.priorityScheme = value.priorityScheme;
    projectRef.settings.pointScheme = value.pointScheme;
    this.store.dispatch(new ProjectsActions.SaveProject(projectRef));
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