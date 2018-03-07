import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { Observable } from 'rxjs';

import { AppState, RouterStateUrl, AppUrlSegment } from '../store/app.state';
import { getSelectedProject, getSelectedProjectIndex, getBreadcrumbs, getRouterState } from '../store/app.selectors';
import { Project } from '../model/project.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  selectedProject$: Observable<Project>;
  selectedProjectIndex$: Observable<number>;
  breadcrumbs$: Observable<AppUrlSegment[]>;
  routerState$: Observable<RouterReducerState<RouterStateUrl>>;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.selectedProject$ = this.store.select(getSelectedProject);
    this.selectedProjectIndex$ = this.store.select(getSelectedProjectIndex);
    this.breadcrumbs$ = this.store.select(getBreadcrumbs);
    this.routerState$ = this.store.select(getRouterState);
  }

  ngOnInit() {
  }

  onBreadcrumbClick(breadcrumbs: AppUrlSegment[], index: number) {
    let urlSegments = new Array<string>();
    for (let i = 0; i <= index && i < breadcrumbs.length; i++) {
      urlSegments.push(breadcrumbs[i].name);
      urlSegments.push(breadcrumbs[i].index);
    }
    this.router.navigate(urlSegments);
  }
}
