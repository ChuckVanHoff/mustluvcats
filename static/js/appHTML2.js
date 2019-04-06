

///////////////////fourth chart//////////////////////
var settingsEnergy = {
  max_width: 1000,
  range_band: 15,
  y: {
      label: '',
      type: 'ordinal',
      column: 'name',
      behavior: "flex",
      sort: 'total-descending'
  },
  x: {
      label: 'kcal',
      type: 'linear',
      column: 'value',
      behavior: "flex",
      sort: 'total-descending'
  },
  marks: [
      {
        "type":"bar",
        "per":["name"],
        "summarizeX":"mean",
        "tooltip":"[nutrient]: $x"
      }
  ],
  "color_by":"nutrient",
  colors:['#e34a33','#fc8d59','rgb(102,194,165)',"#fecc5c",'rgb(43,131,186)'],
  margin: {left: 230},
  "legend": 
  {
        "label":"",
        "location": "right"
    	}
};

var controlsEnergy = webCharts.createControls('#EnergyChartHeader', 
	{	
		location: 'top', 
		inputs:[
      {type: "subsetter", value_col: "category", label: "Filter by Category"},
		]
	}
);

// create the chart using the configuration above
// the chart will be rendered in the <body> element
var EnergyChart = webCharts.createChart('#EnergyChart', settingsEnergy, controlsEnergy);

// pass some data to the chart's init() method
// d3.csv is used to load data from a csv
d3.csv('/static/data/API_energy.csv', function(error,csv) {

  csv.forEach(function(dataRow){
    dataRow.name = dataRow.name.split(",").slice(0,2).join(",").split("(")[0];

  });

  EnergyChart.init(csv);
});

////configuring data table
var dataTable = webCharts.createTable('#dataTable');

d3.csv('/static/data/API_table.csv', function(e,d){

  //making data 'wide' vs 'long' meaning making one record per food item
  var wide = d3.nest()
  .key(function(d) { return d["name"] }) // sort by key
  .rollup(function(d) { // do this to each grouping
    // reduce takes a list and returns one value
    // in this case, the list is all the grouped elements
    // and the final value is an object with keys
    return d.reduce(function(prev, curr) {
      prev["name"] = curr["name"];
      prev["category"] = curr["category"];
      prev[curr["nutrient"]] = curr["value"]; // + curr["unit"];
      return prev;
    }, {});
  })
  .entries(d) // tell it what data to process
  .map(function(d) { // pull out only the values
    return d.values;
  });

  dataTable.init(wide);
});

// creating scatter plot Protein vs Carbs
// var settingsScatterPC = {
//   "max_width":"500",
//   "x":{
//       "label":"Protein (g)",
//       "type":"linear",
//       "column":"Protein",
//       "domain": [-1, 40]
//   },
//   "y":{
//       "label":"Carbs (g)",
//       "type":"linear",
//       "column":"Carbohydrate, by difference",
//       "domain": [-1, 85]
//   },
//   "marks":[
//       {
//           "type":"circle",
//           "per":["name"],
//           "tooltip":"[name] \n" + "Carbs: $yg\n" + "Protein: $xg"
//       }
//   ],
//   // "aspect":"5",
//   "gridlines":"xy",
//   "colors": ["#CD5C5C"]
// };

// var controlsProteinCarbs = webCharts.createControls('#ScatterControlsPC', 
// 	{	
// 		location: 'top', 
// 		inputs:[
//       {type: "subsetter", value_col: "category", label: "Filter by Category"},
// 		]
// 	}
// );

// var scatterProteinCarbs =  webCharts.createChart('#ScatterChartPC', settingsScatterPC, controlsProteinCarbs);


// d3.csv('/static/data/API_table.csv',function(error,d){

//   var wide = d3.nest()
//   .key(function(d) { return d["name"] }) // sort by key
//   .rollup(function(d) { // do this to each grouping
//     // reduce takes a list and returns one value
//     // in this case, the list is all the grouped elements
//     // and the final value is an object with keys
//     return d.reduce(function(prev, curr) {
//       prev["name"] = curr["name"];
//       prev["category"] = curr["category"];
//       prev[curr["nutrient"]] = curr["value"]; // + curr["unit"];
//       return prev;
//     }, {});
//   })
//   .entries(d) // tell it what data to process
//   .map(function(d) { // pull out only the values
//     return d.values;
//   });

//   scatterProteinCarbs.init(wide);

// })

// creating scatter plot Carbs vs Fats
var settingsScatterCF = {
  "max_width":"1000",
  "x":{
      "label":"Protein (g)",
      "type":"linear",
      "column":"Protein (g)",
      "domain": [-1, 40]
  },
  "y":{
      "label":"Carbs (g)",
      "type":"linear",
      "column":"Carbohydrate, by difference",
      "domain": [-1, 85]
  },
  "marks":[
      {
          "type":"circle",
          "per":["name"],
          "tooltip":"[name] \n" + "Carbs: $yg\n" + "x-axis value: $xg"
      }
  ],
  // "aspect":"5",
  "gridlines":"xy",
  "colors": ["#4682B4"]
};

var controlsCarbsFats = webCharts.createControls('#ScatterControlsCF', 
    {    
        location: 'top', 
        inputs:[
      {type: "subsetter", value_col: "category", label: "Filter by Category"},
      {type: "dropdown",
      options: ['x.column', 'x.label'],
      label: "X Variable:",
      values:
        ["Protein (g)","Fats (g)"],
      require: true},
        ]
    }
);

var scatterCarbsFats =  webCharts.createChart('#ScatterChartCF', settingsScatterCF, controlsCarbsFats);


d3.csv('/static/data/API_table.csv',function(error,d){

  var wide = d3.nest()
  .key(function(d) { return d["name"] }) // sort by key
  .rollup(function(d) { // do this to each grouping
    // reduce takes a list and returns one value
    // in this case, the list is all the grouped elements
    // and the final value is an object with keys
    return d.reduce(function(prev, curr) {
      prev["name"] = curr["name"];
      prev["category"] = curr["category"];
      prev[curr["nutrient"]] = curr["value"]; // + curr["unit"];
      return prev;
    }, {});
  })
  .entries(d) // tell it what data to process
  .map(function(d) { // pull out only the values
    return d.values;
  });
  
  wide.forEach(function(d){
    d[`Protein (g)`] = d.Protein;
    d[`Fats (g)`] = d[`Total lipid (fat)`];
  })

  scatterCarbsFats.init(wide);

})
