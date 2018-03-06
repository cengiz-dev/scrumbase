import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { Observable } from 'rxjs';

import { AppState, RouterStateUrl } from '../store/app.state';
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
  breadcrumbs$: Observable<string[]>;
  routerState$: Observable<RouterReducerState<RouterStateUrl>>;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) {
    this.selectedProject$ = this.store.select(getSelectedProject);
    this.selectedProjectIndex$ = this.store.select(getSelectedProjectIndex);
    this.breadcrumbs$ = this.store.select(getBreadcrumbs);
    this.routerState$ = this.store.select(getRouterState);
  }

  ngOnInit() {
  }

  onBreadcrumbClick(index: number, routerState: RouterReducerState<RouterStateUrl>) {
    const segments = routerState.state.segments;
    if (index + 1 < segments.length) {
      let url = '';
      let nodesProcessed = 0;
      let node = this.activatedRoute;
      while (node && nodesProcessed <= index) {
        if (url.length > 0) {
          url = url.concat('/');
        }
        let urlSegments = node.snapshot.url;
        for (let i = 0; i < urlSegments.length; i++) {
          url = url.concat(urlSegments[i].path);
          if (i+1 < urlSegments.length) {
            url = url.concat('/');
          }
        }
        node = node.firstChild;
        nodesProcessed++;
      }
      this.router.navigate([url]);
    }
  }
}
