import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';

import { AppState } from '../store/app.reducers';
import { Project } from '../model/project';
import { getSelectedProject } from '../store/app.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedProject$: Observable<Project>;

  constructor(private store: Store<AppState>) {
    this.selectedProject$ = this.store.select(getSelectedProject);
  }

  ngOnInit() {
  }

}
