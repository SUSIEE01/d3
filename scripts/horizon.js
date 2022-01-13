var AllData;
var Ammonium_data, Chemical_Oxygen_Demand_Cr_data, Iron_data, Lead_data, Orthophosphate_phosphorus_data, Oxygen_saturation_data, Total_nitrogen_data, Total_phosphorus_data;

var margin = {top: 10, right: 0, bottom: 30, left: 0};

document.addEventListener('DOMContentLoaded', function() {
  Promise.all([
    d3.csv("data/barchart-data/ammonium_data.csv"),
    d3.csv("data/barchart-data/Chemical Oxygen Demand (Cr)_data.csv"),
    d3.csv("data/barchart-data/Iron_data.csv"),
    d3.csv("data/barchart-data/lead_data.csv"),
    d3.csv("data/barchart-data/Orthophosphate-phosphorus_data.csv"),
    d3.csv("data/barchart-data/Oxygen saturation_data.csv"),
    d3.csv("data/barchart-data/Total nitrogen_data.csv"),
    d3.csv("data/barchart-data/Total phosphorus_data.csv")
  ]).then(function (AllData) {
    Ammonium_data = AllData[0],
	  Chemical_Oxygen_Demand_Cr_data = AllData[1],
		Iron_data = AllData[2],
		Lead_data = AllData[3],
		Orthophosphate_phosphorus_data = AllData[4],
		Oxygen_saturation_data = AllData[5],
		Total_nitrogen_data = AllData[6],
		Total_phosphorus_data = AllData[7];
	  loadChart();
  });
})
    
function loadChart() {

		var val;
		var val_max;

		var chem = document.getElementById("chemical-input").value;
		console.log("chem:", chem);
		if(chem == "Ammonium") val = Ammonium_data, val_max = 0.2;
    else if(chem == "Chemical Oxygen Demand (Cr)") val = Chemical_Oxygen_Demand_Cr_data, val_max = 15;
    else if(chem == "Iron") val = Iron_data, val_max = 0.3;
    else if(chem == "Lead") val = Lead_data, val_max = 0.01;
    else if(chem == "Orthophosphate-phosphorus") val = Orthophosphate_phosphorus_data, val_max = 0.025;
    else if(chem == "Oxygen saturation") val = Oxygen_saturation_data, val_max = 6;
    else if(chem == "Total nitrogen") val = Total_nitrogen_data, val_max = 0.2;
    else if(chem == "Total phosphorus") val = Total_phosphorus_data, val_max = 0.02;
	  
    console.log(val_max);

	  var val_filtered=[];
	  for(var i = 0;i<val.length;i++)
	  {
      var x = val[i].Year;
      var year_int = parseInt(x);
      if(window.a<=year_int && year_int<=window.b)
      {
        val_filtered.push(val[i])
      }
	  }
    console.log(val_filtered)
    // const width = window.innerWidth;
    // const height = window.innerHeight;
    // streamSvg= d3.select("#box")
    // width = +streamSvg.style('width').replace('px','');
    // height = +streamSvg.style('height').replace('px','');
    const height = 390, width = 540;

    let multiSeriesData = populateTimeSeriesData(val_filtered, val_max);

    console.log(multiSeriesData)
    HorizonTSChart()(document.getElementById("horizon_chart"))
              .data(multiSeriesData)
              .width(width)
              .height(height)
              .series("series")
              .yNormalize(true)
              .tooltipContent(({ series, ts, val}) =>{
                let year = new Date(ts).getFullYear()
                if(val != 0)
                  val += val_max
                return `
                <div>
                  <h3>${series}</h3>
                  <p>Value: <b>${val}</b></p>
                  <span>Year: ${year}</span>
                </div>`
              });
}

function populateTimeSeriesData(values, maxx){
	var yearIndexMap = new Map()
  let ind = 0
  for(let i = window.a; i<=window.b; i++) {
    yearIndexMap.set(i.toString(), ind)
    ind++
  }
  let locations = Object.keys(values[0]).filter(key => key !== "Year" && key !== "measure")
  let currData = Array.from(values)
      currData.unshift(new Object())
      currData = currData.reduce((obj, row) => {
        obj[row.Year] = row
        return obj
      })
  parseDate = d3.utcParse("%Y")
  let ansData = []
  locations.forEach(loc => {
    yearIndexMap.forEach((value, year) => {
    let obj = new Object()
    obj.series = loc
    obj.ts = parseDate(year.toString())
    obj.val = 0
    if(currData.hasOwnProperty(year)){
      if(currData[year][loc] != 0)
        obj.val = (currData[year][loc]-maxx)
      else
        obj.val = (currData[year][loc])
    }
    ansData.push(obj)
    })
  })
  return ansData
}