import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { SheetState, SheetStateModel } from '../../store/sheet.state';
import { Observable } from 'rxjs';
import { Sheet, SheetDetails, VersionDetail } from '../../models/sheet.model';
import { Router } from '@angular/router';
import { UpdateGetFromCache } from '../../actions/sheet.actions';
import { ToggleControlPane, ToggleIndentList, ToggleReport, ToggleDebugLogs, OpenCompare } from '../../actions/ui.actions';
import { UIState, UIStateModel } from '../../store/ui.state';
import { ClearSheetLogs } from '../../actions/logs.actions';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GaAction, GaCategory } from '../../models/ga.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrganTableSelectorComponent } from '../../components/organ-table-selector/organ-table-selector.component';
import { ConfigService } from '../../app-config.service';
import { SheetService } from '../../services/sheet.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  /**
   * Available Data versions (depricated)
   */
  versions;
  /**
   * Menu options
   */
  moreOptions;
  /**
   * Export options
   */
  imgOptions;
  /**
   * Sheet configs
   */
  sheetOptions;
  /**
   * Document window object
   */
  window: Window = window;
  /**
   * Organ sheet selected
   */
  selectedSheetOption: string;
  /**
   * Selected data version
   */
  selectedVersion: string;
  /**
   * Currently selected sheet
   */
  currentSheet: Sheet;
  /**
   * Currently selecte mode
   */
  mode: string;
  /**
   * Currently selected organs
   */
  selectedOrgans: Array<string>;
  /**
   * Currently selected organs joined by comma
   */
  selectedOrgansValues: string;

  sheetConfig:SheetDetails[];

  // state observables
  @Select(SheetState) sheet$: Observable<SheetStateModel>;
  @Select(UIState) ui$: Observable<UIStateModel>;
  @Select(SheetState.getMode) mode$: Observable<string>;
  @Select(SheetState.getSelectedOrgans) selectedOrgans$: Observable<Array<string>>;

  @Input() cache: boolean;
  @Output() export: EventEmitter<any> = new EventEmitter<any>();
  playgroundSheetOptions: any;
  masterSheetLink;

  constructor(public sheetservice: SheetService, public configService: ConfigService,public store: Store, public router: Router, public ga: GoogleAnalyticsService, public dialog: MatDialog,
  ) {

    this.configService.sheetConfiguration$.subscribe(data=>{
      this.sheetConfig = data;
    });

    this.configService.config$.subscribe(config => {
      this.sheetOptions = config.sheetOptions;
      this.versions = config.version;
      this.moreOptions = config.moreOptions;
      this.imgOptions = config.imgOptions;
      this.playgroundSheetOptions = config.playgroundSheetOptions;
      this.masterSheetLink = config.masterSheetLink;
    });


  }

  ngOnInit(): void {
    this.sheet$.subscribe((sheet) => {
      if (sheet.sheet) {
        this.currentSheet = sheet.sheet;
        this.selectedSheetOption = sheet.sheet.display;
        this.selectedVersion = this.versions.find(
          (s) => s.folder === sheet.version
        ).display;
      }
    });

    this.mode$.subscribe((mode) => {
      this.mode = mode;
      if (mode === 'playground') {
        this.sheetOptions = this.playgroundSheetOptions;
      }
    });

    this.selectedOrgans$.subscribe((organs) => {
      this.selectedOrgans = organs;
      const selectedOrgansNames = [];
      for (const organ of organs) {
        this.sheetConfig.forEach((config: SheetDetails) => {
          config.version?.forEach((version: VersionDetail) => {
            if (version.value === organ) {
              selectedOrgansNames.push(config.display);
            }
          });
        });
      }
      this.selectedOrgansValues =
      selectedOrgansNames?.join(', ').length > 64 ? `${organs.length} organs selected`: selectedOrgansNames?.join(', ');
    });
  }

  getSheetSelection(sheet, event) {
    const selectedSheet = this.sheetOptions.find((s) => s.title === sheet);
    this.store.dispatch(new ClearSheetLogs());
    this.router.navigate(['/vis'], {
      queryParams: { sheet: selectedSheet.sheet },
      queryParamsHandling: 'merge',
    });
    this.ga.event(GaAction.CLICK, GaCategory.NAVBAR, `Select Organ Set Dropdown: ${selectedSheet.sheet}`);
  }

  getVersionSelection(version, event) {
    const selectedVersion = this.versions.find((s) => s.display === version);
    this.router.navigate(['/vis'], {
      queryParams: { version: selectedVersion.folder },
      queryParamsHandling: 'merge',
    });
  }

  openMasterDataTables() {
    this.ga.event(GaAction.NAV, GaCategory.NAVBAR, 'Go to Master Data Tables', null);
    window.open(this.masterSheetLink, '_blank');
  }

  refreshData() {
    this.router.navigate(['/vis'], {
      queryParams: {  selectedOrgans: this.selectedOrgans?.join(','), playground: false},
    });
    
    this.ga.event(GaAction.CLICK, GaCategory.NAVBAR, 'Refresh Visualization Button', null);
  }

  togglePane() {
    this.store.dispatch(new ToggleControlPane());
  }

  toggleIndentedList() {
    this.store.dispatch(new ToggleIndentList());
  }

  toggleReport() {
    this.store.dispatch(new ToggleReport());
  }

  toggleDebugLogs() {
    this.store.dispatch(new ToggleDebugLogs());
  }

  toggleCompare() {
    this.store.dispatch(new OpenCompare());
  }

  exportImage(imageType: string) {
    this.export.emit(imageType);
    this.ga.event(GaAction.CLICK, GaCategory.NAVBAR, `Export Image: ${imageType}`, 0);
  }

  onOptionClick(type: string, url: string) {
    switch (type) {
    case 'route':
      this.router.navigate([url]); break;
    case 'tab':
      this.window.open(url, '_blank'); break;
    default:
      this.window.open(url, '_blank'); break;
    }
  }

  openSelectOrgansDialog(){

    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.id = 'OrganTableSelector';
    config.width = '40vw';
    config.data = {
      organs: this.selectedOrgans, 
      isIntilalSelect: false,
      getFromCache: this.cache,
    };

    const dialogRef = this.dialog.open(OrganTableSelectorComponent, config);
    dialogRef.afterClosed().subscribe(({organs,cache}) => {
      this.store.dispatch(new UpdateGetFromCache(cache));
      if(organs !== false){
        this.router.navigate(['/vis'], {
          queryParams: {
            selectedOrgans: organs?.join(','),
            playground: false,
          },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  toggleMode() {
    if (this.mode === 'vis') {
      this.router.navigate(['/vis'], {
        queryParams: {  playground: true, selectedOrgans: 'example'},
        queryParamsHandling: 'merge',
      });
      this.ga.event(GaAction.NAV, GaCategory.NAVBAR, 'Enter Playground Mode', null);
    } else if (this.mode === 'playground') {
      this.router.navigate(['/vis'], {
        queryParams: {
          selectedOrgans: sessionStorage.getItem('selectedOrgans'),
          playground: false,
        },
        queryParamsHandling: 'merge',
      });
      this.ga.event(GaAction.NAV, GaCategory.NAVBAR, 'Exit Playground Mode', null);
    }
  }
}
