import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../store/app.state';
import { getSelectedProject, getSelectedProjectIndex, getBreadcrumbs } from '../store/app.selectors';
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

  constructor(private store: Store<AppState>) {
    this.selectedProject$ = this.store.select(getSelectedProject);
    this.selectedProjectIndex$ = this.store.select(getSelectedProjectIndex);
    this.breadcrumbs$ = this.store.select(getBreadcrumbs);
  }

  ngOnInit() {
  }
}
