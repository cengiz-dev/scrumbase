import { Component, OnInit } from '@angular/core';
import { PROJECT_LIST } from '../model/project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects = PROJECT_LIST;

  constructor() { }

  ngOnInit() {
  }

}
