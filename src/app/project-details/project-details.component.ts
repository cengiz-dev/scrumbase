import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, ProjectsState } from '../store/app.reducers';
import * as ProjectsActions from '../store/app.actions';
import { Project } from '../model/project';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  state$: Observable<ProjectsState>;
  params$: Observable<Params>;

  constructor(private store: Store<AppState>, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.state$ = this.store.pipe(select('projects'));
    this.params$ = this.activatedRoute.params;
  }
}
