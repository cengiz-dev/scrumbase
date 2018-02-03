import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.projects$ = this.dataService.getProjects();
  }

  onCreateProject(form: NgForm) {
    const value = form.value;
    this.dataService.addProject(new Project(value.title, value.summary));
    form.resetForm();
    this.createProjectPanelOpenState = false;
  }

  onProjectSelected(project: Project) {
    this.router.navigate(['project', project.title]);
  }
}
