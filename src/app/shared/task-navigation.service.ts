import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Task, TaskSummary } from '../model/task.model';
import { ProjectRef } from '../model/project.model';

@Injectable({
  providedIn: 'root'
})
export class TaskNavigationService {

  constructor(private router: Router) { }

  navigateWithoutTaskIndex(project: ProjectRef, projectIndex: number, task: Task | TaskSummary) {
    let taskIndex: number;
    let target: Array<string> = ['project', projectIndex.toString()];
    let taskParent = task.parent;
    if (taskParent.epicIndex == 0 || taskParent.epicIndex) {
      target.push('epic', taskParent.epicIndex.toString());
      if (taskParent.featureIndex == 0 || taskParent.featureIndex) {
        target.push('feature', taskParent.featureIndex.toString());
        taskIndex = this.getTaskIndex(project.epics[taskParent.epicIndex].features[taskParent.featureIndex].tasks, task.key);
      } else {
        taskIndex = this.getTaskIndex(project.epics[taskParent.epicIndex].tasks, task.key);
      }
    } else {
      taskIndex = this.getTaskIndex(project.tasks, task.key);
    }
    target.push('task', taskIndex.toString());
    this.router.navigate(target);
  }

  navigate(projectIndex: number, task: Task | TaskSummary, taskIndex: number) {
    let target: Array<string> = ['project', projectIndex.toString()];
    let taskParent = task.parent;
    if (taskParent.epicIndex == 0 || taskParent.epicIndex) {
      target.push('epic', taskParent.epicIndex.toString());
      if (taskParent.featureIndex == 0 || taskParent.featureIndex) {
        target.push('feature', taskParent.featureIndex.toString());
      }
    }
    target.push('task', taskIndex.toString());
    this.router.navigate(target);
  }

  private getTaskIndex(tasks: TaskSummary[], taskKey: string): number {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].key == taskKey) {
        return i;
      }
    }

    return -1;
  }
}
