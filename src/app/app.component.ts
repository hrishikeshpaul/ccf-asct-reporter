import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoadingComponent } from './loading/loading.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('logs_drawer') logs_drawer;

  displayGraph = 'Tree';
  refreshTree = false;
  refreshIndent = false;

  constructor(private dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() { 
    this.openDialog();
  }

  toggleDrawer(val) {
    this.logs_drawer.opened = val;
  }

  showGraph(val) {
    this.displayGraph = val;
  }

  refreshData(val) {
    if (val == 'Tree') {
      this.openDialog();
      this.refreshTree = true;
    } else if (val == 'Indent') {
      this.openDialog();
      this.refreshIndent = true;
    }
  }

  returnRefresh(val) {
    if (val == 'Tree') {
      this.dialog.closeAll();
      this.openSnackBar('Tree data successfully fetched.', 'Close')
      this.refreshTree = false;
    } else if (val == 'Indent') {
      this.openSnackBar('Indent data successfully fetched.', 'Close')
      this.dialog.closeAll();
      this.refreshIndent = false;
    }
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(LoadingComponent, dialogConfig);
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: ['green-snackbar']
    })
  }
}
