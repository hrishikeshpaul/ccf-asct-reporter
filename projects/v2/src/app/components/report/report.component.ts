import { Component, OnInit } from '@angular/core';
import { ReportService } from './report.service';
import { Report } from '../../models/report.model';
import { Sheet } from '../../models/sheet.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportData: Report;
  sheet: Sheet;
  constructor(public reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.reportData$.subscribe(data => {
      this.reportData = data.data;
      this.sheet = data.sheet;
    })
  }

}
