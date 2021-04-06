## Visualization Functions
---

To make the visualization more interactive, there are certain functions like sorting, sizing and filtering that can be done on various nodes. These functionalities only apply to the Cell Types nodes and the Biomarker nodes. The figure below shows the visualization functions that can be accessed via the Control Pane on the left.

<img src="assets/docs/vis-functions/vf.png" alt="Vis Functions Full" class="md-img p-2 w-50" >

<br>
<br>
<br>


##### Terminologies

- **Indegree**: Number of incoming links into a node
- **Outdegree**: Number of outgoing links from the node
- **Degree**: Sum of the indegree and outdegree

<br>

##### Sorting

CT and B nodes can be sorted *Alphabetically* or by their *Degree*. By default, these nodes are sorted Alphabecially. Selecting any of the options will cause the visualization to re-render.

<br>

##### Sizing

CT and B nodes can be sized based on their *Indegree*, *Outdegree* and *Degree*. By default, all the nodes are sized based on the default value of `300`. Since the outdegree is the same and the indegree for the B nodes, you can just sort B nodes by their *Degree*. Selecting any of the options will cause the visualization to re-render.

<br>

##### Filtering

The Reporter currently supports 2 types of Biomarkers,

- Protein (denoted by BP in the ASCT+B Tables)
- Gene (denoted by BG in the ASCT+B Tables)

By using the third select menu in the Biomarker Functions, B nodes can be filtered based on their type. Selecting any of the options will cause the visualization to re-render.
