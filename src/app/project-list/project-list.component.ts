import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Project } from '../model/project';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects$: Observable<Project[]>;
  createProjectPanelOpenState: boolean = false;

  @ViewChild('expansionPanel') expansionPanelState: boolean;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.projects$ = this.dataService.getProjects();
  }

  onCreateProject(form: NgForm) {
    const value = form.value;
    this.dataService.addProject(new Project(value.title, value.summary));
    form.resetForm();
    this.createProjectPanelOpenState = false;
  }
}
