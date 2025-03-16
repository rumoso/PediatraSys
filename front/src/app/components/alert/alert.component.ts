import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {

  constructor(
    private dialogRef: MatDialogRef<AlertComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

  if(this.data.type == 'S'){
    setTimeout (() => {
      this.close();
    }, 3000000);
  }

  }

  delete(){
    this.dialogRef.close(true);
  }

  close(){
    this.dialogRef.close();
  }
}
