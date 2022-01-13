// Global variables
var legendSvg;
var innovativeMapSvg;
var sevScoreData;
var latLongData;
var reservTooltip;
var projection;
var yearValue;

var listOfCood = []
// Run when page is loaded
document.addEventListener("DOMContentLoaded", function () {
  innovativeMapSvg = d3.select("#innovativeGeoMapSvg");
  legendSvg = d3.select("#legend");
  reservTooltip = d3
    .select("body")
    .append("div")
    .classed("myTooltip", true)
    .style("visibility", "hidden");

  yearValue = globalSlider.getValue()
  globalSlider.on('change', updateSeverityCircle);
  document.getElementById("yearAnimationButton").addEventListener('click', updateYearSlider)
  
  // Load all data files before processing.
  Promise.all([
    d3.csv("data/geoMap-data/severity_score.csv"),
    d3.csv("data/geoMap-data/lat_long.csv"),
    d3.csv("data/geoMap-data/positions.csv")
  ]).then(function (val) {
    sevScoreData = val[0];
    latLongData = val[1];
    positions = val[2];
    drawCityMap();
  });
});

var xScale, yScale, radiusScale, colorScale

function drawCityMap() {
  projection = d3
    .geoMercator()
    .scale(100000)
    .center([-117.137858, 32.812699])
    .translate([
      +innovativeMapSvg.style("width").replace("px", "") / 2,
      +innovativeMapSvg.style("height").replace("px", "") / 2,
    ]);

  positions.forEach((location) => {
    console.log("****************")
    console.log("location:", location)
    convertPositions(location);

  });
  drawSeverityCircle(listOfCood)

  let linear = d3.scaleLinear().domain([0, 500]).range([0, 1])
  let compute = d3.interpolate("lightyellow", "darkred")

  legendSvg.selectAll("rect").data(d3.range(500)).enter()
          .append("rect")
          .attr("x", function(d,i) { return i * 0.8;} )
          .attr("y", 0)
          .attr("width", 0.8)
          .attr("height", 15)
          .style("fill", (d,i) => compute(linear(d)))
  legendSvg.append("text")
          .attr("x", 100)
          .attr("y", 35)
          .attr("font-size", "15px")
          .text("severity : low --------> high");
}
function convertPositions(restoLocation) {
  coordinates = [restoLocation.x, restoLocation.y]
  listOfCood.push([restoLocation.location, ...coordinates, restoLocation.longitude, restoLocation.latitude])
}

function drawSeverityCircle(listOfCood){

  d3.select('.city-plot-g').remove()

  colorScale = d3.scaleLinear().domain([0, 9]).range(["lightyellow", "darkred"])
  radiusScale = d3.scaleLinear().domain([0, 9]).range([14, 30])

  let glyphs = innovativeMapSvg.append('g').attr("class","city-plot-g")
                                .selectAll('g')
                                .data(listOfCood).enter().append('g')

  let filteredData = sevScoreData.filter((d) => {
    return d.Year == yearValue
  })
  console.log("listOfCood: ",listOfCood)  

  glyphs.append("circle")
    .transition().duration(500)
    .attr("cx", d => d[1])
    .attr("cy", d => d[2])
    .attr("fill", function(d){
      let currLocData = filteredData.filter(_ => _.location == d[0])
      return currLocData.length? colorScale(currLocData[0].mark) : "white"
    })
    .attr("stroke", function(d){
      let currLocData = filteredData.filter(_ => _.location == d[0])
      return currLocData.length? "black" : "white"
    })
    .attr("stroke-width", "2px")
    .attr("r", function(d){
      let currLocData = filteredData.filter(_ => _.location == d[0])
      return currLocData.length? radiusScale(currLocData[0].mark) : 10
    })
    
  glyphs
    .append("text")
    .transition().duration(700)
    .text(d => d[0])
    .attr('font-size',14)
    .attr('text-anchor', "middle")
    .attr("x", d => d[1]-50)
    .attr("y", d => d[2])
}

function updateSeverityCircle(){
  yearValue = globalSlider.getValue()
  let filteredData = sevScoreData.filter((d) => {
    return d.Year == yearValue
  })

  let circle = innovativeMapSvg.select('.city-plot-g').selectAll("circle")

  circle.exit().remove()
  circle.enter().append("circle")

  circle.transition().duration(700)
    .attr("fill", function(d){
      let currLocData = filteredData.filter(_ => _.location == d[0])
      return currLocData.length? colorScale(currLocData[0].mark) : "white"
    })
    .attr("stroke", function(d){
      let currLocData = filteredData.filter(_ => _.location == d[0])
      return currLocData.length? "black" : "white"
    })
    .attr("r", function(d){
      let currLocData = filteredData.filter(_ => _.location == d[0])
      console.log("currLocData[0]:",currLocData[0])
      return currLocData.length? radiusScale(currLocData[0].mark) : 10
    })
}

function updateYearSlider() {
    let val1 = 1998
    let intervalId = setInterval(() => {
        globalSlider.setValue(""+val1, true, true)
        val1 += 1
        if(val1 == 2017) clearInterval(intervalId)
    }, 500)
}
