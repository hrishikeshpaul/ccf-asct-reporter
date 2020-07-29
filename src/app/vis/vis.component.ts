import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from '../loading/loading.component';
import { SconfigService } from '../services/sconfig.service';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';
import { CompareComponent } from "../compare/compare.component";

@Component({
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.css']
})
export class VisComponent implements OnInit {

  @ViewChild('drawer') drawer;
  @ViewChild('reportComponent') reportComponent;
  @ViewChild('tree') treeComponent;

  displayGraph = 'Tree';
  refreshTree = false;
  refreshIndent = false;
  refreshReport = false;
  refreshLogs = false;
  sheetName = 'All Organs';
  shouldRefreshData = false;
  showCompInDrawer = '';
  compareData = [];

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public sc: SconfigService,
    public sheet: SheetService,
    public report: ReportService) {
  }

  ngOnInit() {
  }

  toggleReportDrawer(val) {
    // this.refreshReport = val;
    this.drawer.opened = val;
    this.showCompInDrawer = 'Report';
  }

  toggleLogsDrawer(val) {
    this.refreshLogs = val;
    this.drawer.opened = val;
    this.showCompInDrawer = 'Logs';
  }

  showGraph(val) {
    this.openLoading();
    this.displayGraph = val;
    this.shouldRefreshData = true;
  }

  uploadDDSheet() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    dialogConfig.maxWidth = "700px";
    let dialogRef = this.dialog.open(CompareComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(r => {
      this.compareData = r.data;
    })
  }

  refreshData(val) {
    this.refreshReport = true;
    if (val === 'Tree') {
      this.openLoading();
      this.refreshTree = true;
      this.shouldRefreshData = true;
    } else if (val === 'Indented List') {
      this.openLoading();
      this.refreshIndent = true;
    }
  }

  returnRefresh(val) {
    if (val.comp === 'Tree') {
      this.dialog.closeAll();
      if (val.val) {
        val.status === 200 ?
          this.openSnackBar('Tree data successfully fetched.', 'Close', 'green') :
          this.openSnackBar('Tree data successfully fetched from system cache.', 'Close', 'warn');

      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshTree = false;
      this.shouldRefreshData = false;


    } else if (val.comp === 'Indented List') {
      this.dialog.closeAll();
      if (val.val) {
        val.status === 200 ?
          this.openSnackBar('Indented List data successfully fetched.', 'Close', 'green') :
          this.openSnackBar('Indented List successfully fetched from system cache.', 'Close', 'warn');
      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshIndent = false;
      this.shouldRefreshData = false;

    }
  }

  closeComponent() {
    this.refreshReport = false;
    this.showCompInDrawer = '';
  }

  openLoading() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(LoadingComponent, dialogConfig);
  }

  openSnackBar(message, action, style) {
    this.snackBar.open(message, action, {
      duration: style === 'green' || style === 'warn' ? 3000 : undefined,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [`${style}-snackbar`]
    });
  }

  downloadVis(img) {
    this.treeComponent.downloadVis(img);
  }

  getSelectedSheet(event) {
    this.sheetName = event;
    this.report.reportLog(`${this.sheetName}`, 'success', 'file');
    new Promise((res, rej) => {
      this.sheet.sheet = this.sc.SHEET_CONFIG[this.sc.SHEET_CONFIG.findIndex(i => i.display === this.sheetName)];
      res(true);
    })
      .then(data => {
        if (data) {
          this.openLoading();
          this.shouldRefreshData = true;

        }
      });

  }
}

