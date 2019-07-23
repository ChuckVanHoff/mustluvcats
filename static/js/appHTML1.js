
//////////////Carb, Protein, Fat chart///////////////////////////
var settingsCPF = {
  max_width: 700,
  max_height: 600,
  x: {
      label: '',
      type: 'ordinal',
      column: 'nutrient'
  },
  y: {
      label: 'grams (mean)',
      type: 'linear',
      column: 'value',
      behavior: "firstfilter"
  },
  marks: [
      {
        "arrange":"stacked",
        "split":"category",
        "type":"bar",
        "per":["nutrient"],
        "summarizeY":"mean",
        "tooltip":"[category]: $y"
      }
  ],
  "color_by":"category",
  colors:['rgb(102,194,165)','#fc8d59','#fecc5c',"rgb(43,131,186)",'#e34a33'],
  "legend":{
    		"label":"Carbs, Protiens, Fats",
    		"order": ["fruits", "vegetables", "grains", "meats", "dairy"]
    	}
};

var controlsCPF = webCharts.createControls('#CPFChartHeader', 
	{	
		location: 'top', 
		inputs:[
      {type: "subsetter", value_col: "category", label: "Choose group"},
      {type: "subsetter", value_col: "name", label: "Filter by Name", multiple: true}
		]
	}
);

// create the chart using the configuration above
// the chart will be rendered in the <body> element
var chartCPF = webCharts.createChart('#CPFChart', settingsCPF, controlsCPF);

// pass some data to the chart's init() method
// d3.csv is used to load data from a csv
d3.csv('/static/data/API_F_C_P.csv', function(error,csv) {

  chartCPF.init(csv);
});


///////////////////fourth chart//////////////////////
var settingsNutrients = {
  max_width: 1000,
  //max_height: 700,
  range_band: 15,
  y: {
      label: '',
      type: 'ordinal',
      column: 'name',
      behavior: "flex",
      sort: 'total-descending'
  },
  x: {
      label: 'grams',
      type: 'linear',
      column: 'value'
  },
  marks: [
      {
        "arrange":"stacked",
        "split":"nutrient",
        "type":"bar",
        "per":["name"],
        "summarizeX":"mean",
        "tooltip":"[nutrient]: $x"
      }
  ],
  "color_by":"nutrient",
  "colors":["rgb(43,131,186)", '#e65c00','#16A085', '#ffcc66', '#595959',  'rgb(163, 57, 79)', '#EC7063'],
  "margin": {left: 230},
  "color_dom": ["Water", "Protein", "Total lipid (fat)", "Carbohydrate, by difference", "Fiber, total dietary", "Sugars, total", "Calcium, Ca"],
  "legend":{
    		"label":"",
    		"order": ["Water", "Protein", "Total lipid (fat)", "Carbohydrate, by difference", "Fiber, total dietary", "Sugars, total", "Calcium, Ca"]
    	}
};

var controlsNutrients = webCharts.createControls('#nutrientsChartHeader', 
	{	
		location: 'top', 
		inputs:[
      {type: "subsetter", value_col: "category", label: "Filter by Category"},
      {type: "subsetter", value_col: "nutrient", label: "Filter by Nutrient"}
		]
	}
);

// create the chart using the configuration above
// the chart will be rendered in the <body> element
var fourthChart = webCharts.createChart('#nutrientsChart', settingsNutrients, controlsNutrients);

// pass some data to the chart's init() method
// d3.csv is used to load data from a csv
d3.csv('/static/data/API.csv', function(error,csv) {

  csv.forEach(function(dataRow){
    dataRow.name = dataRow.name.split(",").slice(0,2).join(",").split("(")[0];
   });

  fourthChart.init(csv);
});

