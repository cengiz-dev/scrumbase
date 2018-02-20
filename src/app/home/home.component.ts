import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../store/app.state';
import * as ProjectsActions from '../store/app.actions';
import { getRecentProjects } from '../store/app.selectors';
import { Project } from '../model/project.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recentProjects$: Observable<Project[]>;

  constructor(private store: Store<AppState>, private router: Router) { }

  ngOnInit() {
    this.store.dispatch(new ProjectsActions.GetProjects());
    this.recentProjects$ = this.store.select(getRecentProjects);
  }

  onProjectSelected(index: number) {
    this.router.navigate(['project', index]);
  }
}
