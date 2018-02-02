import { Component, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { DataService } from '../data/data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects$: Observable<Project[]>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.projects$ = this.dataService.getProjects();
  }

}
