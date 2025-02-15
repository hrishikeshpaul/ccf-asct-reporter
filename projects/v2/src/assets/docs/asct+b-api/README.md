## API

---

This section goes over the API services that ASCT+B Reporter fetches the data. which runs a simple Node script to fetch the data from Google Sheets.

These services supports CORS and requires no authentication to use. All responses are sent over HTTPS as well.

<br>

##### Base URL

Production - https://asctb-api.herokuapp.com
<br>
Staging - https://asctb-api--staging.herokuapp.com

<br>

##### Version

The current version of the ASCT+B API is v2

<br>

#### Services

<br>

### GET /{sheetid}/{gid}

Get the sheet data from the google sheet by sheetid and gid.

<br>

###### Path Parameter

<br>

| Parameter &nbsp; | Data Type &nbsp; | Description &nbsp;           | Required &nbsp; |
| ---------------- | ---------------- | ---------------------------- | --------------- |
| sheetid          | string           | Sheet Id of the Google sheet | Yes             |
| gid              | String           | GId of the Google sheet      | Yes             |

<br>

###### Responses

| Code &nbsp; | Example response &nbsp; |
| ----------- | ----------------------- |
|             | ` {`                    |
|             | &nbsp;` data: array,`   |
| 200         | &nbsp;` csv: string,`   |
|             | &nbsp;` parsed: array`  |
|             | `}`                     |
|             | ` {`                    |
| 500         | &nbsp;` msg: string,`   |
|             | &nbsp;` code: number,`  |
|             | `}`                     |

<br>

###### Example

1. /v2/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/345174398

<br>

### GET /graph

Get the sample graph generated by graph data.

<br>

###### Example

1. /graph

<br>

<img src="assets/docs/asct+b-api/graph.png" class="md-img p-2 w-50">

<br>
<br>

### GET /{sheetid}/{gid}/graph

Get the graph data from the google sheet by sheetid and gid.

<br>

###### Path Parameter

| Parameter | Data Type | Description                  | Required |
| --------- | --------- | ---------------------------- | -------- |
| sheetid   | String    | Sheet Id of the Google sheet | Yes      |
| gid       | String    | GId of the Google sheet      | Yes      |

<br>

###### Responses

| Code &nbsp; | Example response &nbsp; |
| ----------- | ----------------------- |
|             | ` {`                    |
|             | &nbsp;` data: array,`   |
| 200         | &nbsp;` csv: string,`   |
|             | &nbsp;` parsed: array`  |
|             | `}`                     |
|             | ` {`                    |
| 500         | &nbsp;` msg: string,`   |
|             | &nbsp;` code: number,`  |
|             | `}`                     |

<br>

###### Example

1. /v2/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/345174398/graph

<br>

### GET /csv

Get the sheet or graph data from the google sheet by sheetid and gid based on the output format.

<br>

###### Path Parameter

| Parameter | Type  | Data Type | Description               | Required |
| --------- | ----- | --------- | ------------------------- | -------- |
| csvUrl    | query | string    | CSV url of the sheet data | Yes      |
| output    | query | string    | output format of the data | Yes      |

<br>

###### Responses

| Code &nbsp; | Example response &nbsp; |
| ----------- | ----------------------- |
|             | ` {`                    |
|             | &nbsp;` data: array,`   |
| 200         | &nbsp;` csv: string,`   |
|             | &nbsp;` parsed: array`  |
|             | `}`                     |
|             | ` {`                    |
| 500         | &nbsp;` msg: string,`   |
|             | &nbsp;` code: number,`  |
|             | `}`                     |

<br>

###### Example

1. /v2/csv?csvUrl=https://darshalshetty.github.io/asctb-azimuth-data-comparison/lung.csv&output=graph

2. /v2/csv?csvUrl=https://darshalshetty.github.io/asctb-azimuth-data-comparison/lung.csv&output=json

<br>

### GET /playground

Get the sheet data from the playground initial csv file to render the visualization.

<br>

###### Responses

| Code &nbsp; | Example response &nbsp; |
| ----------- | ----------------------- |
|             | ` {`                    |
|             | &nbsp;` data: array,`   |
| 200         | &nbsp;` csv: string,`   |
|             | &nbsp;` parsed: array`  |
|             | `}`                     |
|             | ` {`                    |
| 500         | &nbsp;` msg: string,`   |
|             | &nbsp;` code: number,`  |
|             | `}`                     |

<br>

###### Example

1. /v2/playground

<br>

### GET /lookup/{ontology}/{id}

Get data about the ontology term, including label and description by ontology term and id.

<br>

###### Path Parameter

| Parameter | Data Type | Description                                    | Required |
| --------- | --------- | ---------------------------------------------- | -------- |
| ontology  | String    | Given an ontology code (UBERON, FMA, CL, HGNC) | Yes      |
| id        | String    | ID of a term                                   | Yes      |

<br>

###### Responses

| Code &nbsp; | Example response &nbsp;      |
| ----------- | ---------------------------- |
|             | ` {`                         |
|             | &nbsp;` label: string,`      |
| 200         | &nbsp;` link: string,`       |
|             | &nbsp;` description: string` |
|             | `}`                          |
|             | ` {`                         |
| 500         | &nbsp;` msg: string,`        |
|             | &nbsp;` code: number,`       |
|             | `}`                          |

<br>

###### Example

1. /v2/lookup/CL/0000057

### POST /playground

POST the sheet data from the playground table feature and get the data to render the visualization.

<br>

###### Body

Parsed array of the CSV data

` {`<br>
&nbsp;` data: array`<br>
`}`

###### Responses

| Code &nbsp; | Example response &nbsp; |
| ----------- | ----------------------- |
|             | ` {`                    |
|             | &nbsp;` data: array,`   |
| 200         | &nbsp;` csv: string,`   |
|             | &nbsp;` parsed: array`  |
|             | `}`                     |
|             | ` {`                    |
| 500         | &nbsp;` msg: string,`   |
|             | &nbsp;` code: number,`  |
|             | `}`                     |

<br>

###### Example

1. /v2/playground

<br>
