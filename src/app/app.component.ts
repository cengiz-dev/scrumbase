import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs/Rx';

import { AppState, ProjectsState } from './store/app.state';
import { getProjectsState } from './store/app.selectors';
import { AppDialogComponent } from './app.dialog';
import { forEach } from '@angular/router/src/utils/collection';
import { DialogClosed } from './store/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  appDialogRef: MatDialogRef<AppDialogComponent>;
  subscriptions = new Array<Subscription>();

  constructor(private store: Store<AppState>, private dialog: MatDialog) { }

  ngOnInit() {
    this.subscriptions.push(this.store.select(getProjectsState).subscribe(this.handleStateChange.bind(this)));
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  handleStateChange(state: ProjectsState) {
    if (state.backendError && !this.appDialogRef) {
      this.appDialogRef = this.dialog.open(AppDialogComponent, {
        hasBackdrop: false,
        data: {
          title: 'Backend Error',
          content: state.backendError.message,
        }
      });
      this.appDialogRef.afterClosed().subscribe(() => {
        this.store.dispatch(new DialogClosed());
        this.appDialogRef = null;
      });
    }
  }
}
