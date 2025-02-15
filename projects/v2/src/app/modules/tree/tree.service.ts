import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { VegaService } from './vega.service';
import { AS_RED, TNode, NODE_TYPE } from './../../models/tree.model';
import { TreeState, TreeStateModel } from '../../store/tree.state';
import { Observable } from 'rxjs';
import { UIState, UIStateModel } from '../../store/ui.state';
import { ReportLog } from '../../actions/logs.actions';
import { LOG_TYPES, LOG_ICONS } from '../../models/logs.model';
import { UpdateLinksData, UpdateVegaSpec } from '../../actions/tree.actions';
import { Sheet, SheetConfig } from '../../models/sheet.model';
import { HasError } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';
import { SheetState } from '../../store/sheet.state';
import { Row } from '../../models/sheet.model';
import { BimodalService } from './bimodal.service';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  /**
   * Height of the tree
   */
  height: number;
  /**
   * Denotes if the left control pane is open
   */
  controlPaneOpen: boolean;
  /**
   * Sheet configurations that has the different parameters
   */
  sheetConfig: SheetConfig;

  /**
   * Tree State observable
   */
  @Select(TreeState) tree$: Observable<TreeStateModel>;

  /**
   * UI State observable
   */
  @Select(UIState) uiState$: Observable<UIStateModel>;

  /**
   * Sheet state - sheet config observable
   */
  @Select(SheetState.getSheetConfig) sc$: Observable<SheetConfig>;

  constructor(public readonly store: Store, public readonly vs: VegaService, public readonly bm: BimodalService,) {
    this.tree$.subscribe((state) => {
      this.height = state.height;
      const view = state.view;

      // if the vega view is valid, check for search data
      // re-render the view
      if (Object.keys(view).length) {
        const search = state.search;
        view.data('search', search);
        view.runAsync();
      }

      // if the vega view is valid, check for discrepency Labels data
      // re-render the view
      if (Object.keys(view).length) {
        const discrepency = state.discrepencyLabel;
        view.data('discrepencyLabel', discrepency);
        view.runAsync();
      }

      // if the vega view is valid, check for discrepency Ids data
      // re-render the view
      if (Object.keys(view).length) {
        const discrepency = state.discrepencyId;
        view.data('discrepencyId', discrepency);
        view.runAsync();
      }

      // if the vega view is valid, check for duplicate Ids data
      // re-render the view
      if (Object.keys(view).length) {
        const discrepency = state.duplicateId;
        view.data('duplicateId', discrepency);
        view.runAsync();
      }
    });
    this.uiState$.subscribe((state) => {
      this.controlPaneOpen = state.controlPaneOpen;
    });

    this.sc$.subscribe((config) => {
      this.sheetConfig = config;
    });
  }

  /**
   * Function to create the vega tree that visualization the
   * Anatomical structures and its substructures
   *
   * @param currentSheet current selected sheet
   * @param data data from the miner of the sheet
   * @param compareData compare data (depricated)
   */
  public makeTreeData(currentSheet: Sheet, data: Row[], compareData?: any, isReport = false): void {
    try {
      const idNameSet = {};
      let id = 1;
      let parent: TNode;
      const nodes = [];
      const allParentIds = new Set();
      const root = new TNode(
        id,
        data[0].anatomical_structures[0].name,
        0,
        data[0].anatomical_structures[0].id,
        data[0].anatomical_structures[0].notes,
        'Body',
        AS_RED
      );
      root.label = '';
      root.comparator = root.name + root.label + root.ontologyId;
      root.type = NODE_TYPE.R;
      delete root.parent;
      nodes.push(root);
      let flag = 0;
      const AS_AS_organWise = {};

      data.forEach((row) => {
        parent = root;
        
        row.anatomical_structures.forEach((structure) => {
          let s: number;
          if (structure.id && structure.id.toLowerCase() !== 'not found') {
            s = nodes.findIndex(
              (i: any) => {
                if (!isReport) {
                  return i.type !== 'root' &&
                  i.comparatorId === parent.comparatorId + structure.id;
                } else {
                  return i.type !== 'root' &&
                  (i.comparatorId === parent.comparatorId + structure.id) && i.organName === row.organName;
                }
              }
            );
          } else {
            s = nodes.findIndex(
              (i: any) => {
                if (!isReport) {
                  return i.type !== 'root' &&
                  i.comparatorName === parent.comparatorName + structure.name;
                } else {
                  return i.type !== 'root' &&
                  (i.comparatorName === parent.comparatorName + structure.name) && i.organName === row.organName;
                }
              }
            );
          }
          if (s === -1) {
            if (Object.prototype.hasOwnProperty.call(AS_AS_organWise, row?.organName) && flag >= 2) {
              AS_AS_organWise[row?.organName] += 1;
            } else {
              flag += 1;
              AS_AS_organWise[row?.organName] = 1;
            }
            id += 1;
            const newNode = new TNode(
              id,
              structure.id.toLowerCase() !== 'not found' && structure.id && idNameSet[structure.id] ? idNameSet[structure.id]  : structure.name,
              parent.id,
              structure.id,
              structure.notes,
              row.organName,
              AS_RED
            );
            newNode.label = structure.rdfs_label;
            newNode.comparator =
              parent.comparator +
              newNode.name +
              newNode.label +
              newNode.ontologyId;
            newNode.comparatorId = parent.comparatorId + newNode.ontologyId;
            newNode.comparatorName = parent.comparatorName + newNode.name;
            if (idNameSet[newNode.ontologyId] === undefined) {
              idNameSet[newNode.ontologyId] = newNode.name;
            }
            if ('isNew' in structure) {
              newNode.isNew = true;
              newNode.color = structure.color;
              newNode.pathColor = structure.color;
            }

            nodes.push(newNode);
            allParentIds.add(parent.id);
            parent = newNode;
          } else {
            const node = nodes[s];
            if ('isNew' in structure) {
              node.color = structure.color;
              node.pathColor = structure.color;
            }
            parent = node;
          }
        });
      });

      // delete duplicate organ element
      nodes.shift();
      delete nodes[0].parent;

      const spec = this.vs.makeVegaConfig(
        currentSheet,
        nodes,
        this.sheetConfig
      );
      allParentIds.delete(1);
      const allParentIdsArray = [...allParentIds];
      if (!isReport) {
        this.store.dispatch(new UpdateLinksData(0, 0, {}, {}, 0, AS_AS_organWise));
        this.store.dispatch(new UpdateVegaSpec(spec));
        this.vs.renderGraph(spec);
      } else {
        this.store.dispatch(new UpdateLinksData(0, 0, {}, {}, 0, AS_AS_organWise));
        this.bm.makeBimodalData(
          data,
          spec.data[0].values.filter(x => !allParentIdsArray.includes(x.id)),
          this.store.selectSnapshot(TreeState.getBimodalConfig),
          this.store.selectSnapshot(SheetState.getSheetConfig),
          true);
      }
    } catch (error) {
      console.log(error);
      const err: Error = {
        msg: `${error.name} (Status: ${error.status})`,
        status: error.status,
        hasError: true,
      };
      this.store.dispatch(
        new ReportLog(LOG_TYPES.MSG, 'Failed to create Tree', LOG_ICONS.error)
      );
      this.store.dispatch(new HasError(err));
    }
  }
}
