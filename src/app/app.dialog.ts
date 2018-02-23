import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-dialog',
    template: `
        <h1 mat-dialog-title>{{data.title}}</h1>
        <mat-dialog-content>
            {{data.content}}
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-button mat-dialog-close>Ok</button>
        </mat-dialog-actions>
    `,
})
export class AppDialogComponent {

    constructor(public dialogRef: MatDialogRef<AppDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}