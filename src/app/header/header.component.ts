import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../store/app.state';
import { Project } from '../model/project.model';
import { getSelectedProject } from '../store/app.selectors';
import { AuthService } from '../auth/auth.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedProject$: Observable<Project>;
  user$: Observable<User>;

  constructor(private store: Store<AppState>, private authService: AuthService) {
    this.selectedProject$ = this.store.select(getSelectedProject);
    this.user$ = this.authService.getUser();
  }

  ngOnInit() {
  }

  onLogin() {
    this.authService.login();
  }

  onLogout() {
    this.authService.logout();
  }
}
