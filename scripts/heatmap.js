window.c = 'all';
window.a = 1998;
window.b = 2016;
var data,all_hdata,Achara_hdata,Boonsri_hdata,Busarakhan_hdata,Chai_hdata,Decha_hdata,Kannika_hdata,Kohsoom_hdata,Sakda_hdata,Somchair_hdata,Tansanee_hdata;
var tickVals = ["Jan-98", "Jan-99", "Jan-00", "Jan-01", "Jan-02", "Jan-03", "Jan-04", "Jan-05", "Jan-06", "Jan-07", "Jan-08", "Jan-09", "Jan-10", "Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16"];
// This runs when the page is loaded

var margin = { top: 30, right: 30, bottom: 60, left: 200};
var width = 900, height = 1200;
var svg = d3.select("#heatmap_main")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var inner_width = width-margin.left-margin.right;
var inner_height = height-margin.top-margin.bottom;
  	  
var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
                .extent( [ [0,0], [inner_width,inner_height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                .on("end", updateChart);
	  
var scatter = svg.append("g")
                .attr("clip-path", "url(#clip)")

var x, y,new_tickvals;
var xAxis;
var myGroups = [];
document.addEventListener('DOMContentLoaded', function() {
		
	
  // append the svg object to the body of the page 
  var clip = svg.append("defs")
                .append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", inner_width )
                .attr("height", inner_height )
                .attr("x", 0)
                .attr("y", 0);

  
  Promise.all([d3.csv("data/heatmap-data/all.csv"),d3.csv("data/heatmap-data/Achara.csv"),d3.csv("data/heatmap-data/Boonsri.csv")
,d3.csv("data/heatmap-data/Busarakhan.csv"),d3.csv("data/heatmap-data/Chai.csv"),d3.csv("data/heatmap-data/Decha.csv")
,d3.csv("data/heatmap-data/Kannika.csv"),d3.csv("data/heatmap-data/Kohsoom.csv"),d3.csv("data/heatmap-data/Sakda.csv")
,d3.csv("data/heatmap-data/Somchair.csv"),d3.csv("data/heatmap-data/Tansanee.csv")]).then(function(values){
    data = values[0];
    all_hdata=values[0];
    Achara_hdata=values[1];
    Boonsri_hdata=values[2];
    Busarakhan_hdata=values[3];
    Chai_hdata=values[4];
    Decha_hdata=values[5];
    Kannika_hdata=values[6];
    Kohsoom_hdata=values[7];
    Sakda_hdata=values[8];
    Somchair_hdata=values[9];
    Tansanee_hdata=values[10];

    console.log(data);
    var keys1 = [];
    var values1 = [];
    console.log(data.length);
    for(var k = 0;k<data.length;k++)
    {
      x = data[k];
      keys1.push(x.Index);
      values1.push(x.Chemical);
    }
    console.log(keys1);
    myGroups = keys1
    var myVars = values1
    scatter = svg.append("g").attr("clip-path", "url(#clip)")
    x = d3.scaleBand()
        .range([0, inner_width])
        .domain(myGroups)
        .padding(0.05);
    xAxis = svg.append("g")
              .style("font-size", 8)
              .attr("transform", "translate(0," + inner_height + ")")
              .call(d3.axisBottom(x).tickValues(tickVals))
    console.log(xAxis);
    y = d3.scaleBand()
      .range([inner_height, 0])
      .domain(myVars)
      .padding(0.05);
    var yAxis = svg.append("g")
        .style("font-size", 8)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()
	
    var myColor = d3.scaleLinear()
                    .domain([0, 37])
                    .range(["#CCD1D9", "#FF0000"])

    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tool")
      .style("background-color", "#FFFFE0")
      .style("opacity",0.8)
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");
	
  // Three function that change the tooltip when user hover / move / leave a cell
  
    scatter.selectAll()
      .data(data, function(d) {return d.Index+':'+d.Chemical;})
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.Index) })
      .attr("y", function(d) { return y(d.Chemical) })
      .attr("width", 5 )
      .attr("height", 5 )
      .style("fill", function(d) { return myColor(d.Count)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .on("mouseover", function(d){
        return tooltip.style("visibility", "visible")
		    .html("<div style=&quot;background-color:#FFFFE0&quot;><b>"+"Time: "+d.Index+"</b>"+"<p>Chemical:"+d.Chemical+"</p>"+"<p>Number of recordings:"+d.Count+"</p></div>");
		  })
	    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	    .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
		
		scatter.append("g")
          .attr("class", "brush")
          .call(brush)
          .on("dblclick", dblclicked);
    // svg.selectAll('text').remove();
    svg.append("text")
        .attr("x", 300)
        .attr("y", 1150)
        .attr("text-anchor", "left")
        .style("font-size", "10px")
        .style("fill","gray")
        .text("Year");	
		
    svg.append("text")
      .attr("y", -150)
      .attr("x", -500)
      .style("font-size", "10px")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .style("fill","gray")
      .text("Measure");

  });
  
});

function dblclicked() {
  console.log('dblclick');
  x.domain(myGroups);
  xAxis.transition().duration(1000).call(d3.axisBottom(x).tickValues(tickVals))
  scatter.selectAll("rect")
        .transition().duration(1000)
        .attr("x", function (d) { return x(d.Index); } )
        .attr("y", function (d) { return y(d.Chemical); } )
  window.a = 1998;
  window.b = 2016;
  drawStreamGraph();
  drawMap();
  loadChart();
  // window.a=1998;
  // window.b=2016;
  // updateChart2();
}

function updateChart() {
  console.log(xAxis);
  console.log('updateChart');
  var index1, index2;
  var idleTimeout;

  function idled() {idleTimeout = null; }
  extent = d3.event.selection;
  // If no selection, back to initial coordinate. Otherwise, update X axis domain
  if(!extent){
    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
    x.domain(myGroups);
  }
  else{
    x.invert = function(x1) {
      var domain = this.domain();
      var range = this.range()
      var scale = d3.scaleQuantize().domain(range).range(domain)
      return scale(x1)
    };
    window.a = x.invert(extent[0]);
    window.b = x.invert(extent[1]);
    index1 = myGroups.indexOf(x.invert(extent[0]));
    index2 = myGroups.indexOf(x.invert(extent[1]));
    var new_domain = myGroups.slice(index1, index2);
    x.domain(new_domain);
    scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
  }
 
  window.a = window.a.split("-")[1];
  window.b = window.b.split("-")[1];
  var left = "Jan-"+window.a,
      right = "Jan-"+window.b,
      i1 = tickVals.indexOf(left), 
      i2 = tickVals.indexOf(right);

      new_tickvals = tickVals.slice(i1, i2);
      console.log(xAxis);
  xAxis.transition().duration(1000).call(d3.axisBottom(x).tickValues(new_tickvals));
  var hjk=xAxis;
  scatter.selectAll("rect")
        .transition()
        .duration(1000)
        .attr("x", function (d) { return x(d.Index); } )
        .attr("y", function (d) { return y(d.Chemical); } )
  let yearMap = new Map();
  for(var i = 1998; i<=2016; i++)
  {
    var yy = i.toString();
    var y1 = yy.substr(2,4);
    yearMap[y1] = yy; 
  }
  window.a = parseInt(yearMap[window.a]);
  window.b = parseInt(yearMap[window.b]); 
  drawStreamGraph();
  drawMap();
  loadChart();
}

function updateChart2()
  {
    console.log(xAxis);
    
    if(window.c=='all') {
      data=all_hdata;
    }
    else if (window.c=='Achara'){
      data=Achara_hdata;
    }
    else if (window.c=='Boonsri'){
      data=Boonsri_hdata;
    }
    else if (window.c=='Busarakhan'){
      data=Busarakhan_hdata;
    }
    else if (window.c=='Chai'){
      data=Chai_hdata;
    }
    else if (window.c=='Decha'){
      data=Decha_hdata;
    }
    else if (window.c=='Kannika'){
      data=Kannika_hdata;
    }
    else if (window.c=='Kohsoom'){
      data=Kohsoom_hdata;
    }
    else if (window.c=='Somchair'){
      data=Somchair_hdata;
    }
    else if (window.c=='Tansanee'){
      data=Tansanee_hdata;
    }
    else if (window.c=='Sakda'){
      data=Sakda_hdata;
    }
    console.log('updateChart2');

    svg.selectAll("*").remove();
    scatter = svg.append("g")
                  .attr("clip-path", "url(#clip)")
    // console.log(data);
    var keys1 = [];
    var values1 = [];
    console.log(data.length);
    for(var k = 0;k<data.length;k++)
    {
      x = data[k];
      keys1.push(x.Index);
      values1.push(x.Chemical);
    }
    // console.log(keys1);
    myGroups = keys1
    var myVars = values1
    
    x = d3.scaleBand()
        .range([0, inner_width])
        .domain(myGroups)
        .padding(0.05);
        
    xAxis = svg.append("g")
                .style("font-size", 8)
                .attr("transform", "translate(0," + inner_height + ")")
                .call(d3.axisBottom(x).tickValues(tickVals))
    console.log('xAxis');
    console.log(xAxis);
    y = d3.scaleBand()
          .range([inner_height, 0])
          .domain(myVars)
          .padding(0.05);
    var yAxis = svg.append("g")
                  .style("font-size", 8)
                  .call(d3.axisLeft(y).tickSize(0))
                  .select(".domain").remove()

    var myColor = d3.scaleLinear()
          .domain([0, 37])
          .range(["#CCD1D9", "#FF0000"])

    var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tool")
                    .style("background-color", "#FFFFE0")
                    .style("opacity",0.8)
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden");

    // Three function that change the tooltip when user hover / move / leave a cell
    scatter.selectAll('*').remove();
    scatter.selectAll()
          .data(data, function(d) {return d.Index+':'+d.Chemical;})
          .enter()
          .append("rect")
          .attr("x", function(d) { 
            // console.log(x(d.Index)); 
            return x(d.Index) })
          .attr("y", function(d) { 
            // console.log(y(d.Chemical)  );
            return y(d.Chemical) })
          .attr("width", 5 )
          .attr("height", 5 )
          .style("fill", function(d) { return myColor(d.Count)} )
          .style("stroke-width", 4)
          .style("stroke", "none")
          .style("opacity", 0.8)
          .on("mouseover", function(d){
          return tooltip.style("visibility", "visible")
          .html("<div style=&quot;background-color:#FFFFE0&quot;><b>"+"Time: "+d.Index+"</b>"+"<p>Chemical:"+d.Chemical+"</p>"+"<p>Number of recordings:"+d.Count+"</p></div>");
          })
          .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
          .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
    
    scatter.append("g")
          .attr("class", "brush")
          .call(brush)
          .on("dblclick", dblclicked);

    svg.append("text")
      .attr("x", 300)
      .attr("y", 1150)
      .attr("text-anchor", "left")
      .style("font-size", "10px")
      .style("fill","gray")
      .text("Year");	

    svg.append("text")
      .attr("y", -150)
      .attr("x", -300)
      .style("font-size", "10px")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .style("fill","gray")
      .text("Measure");
  }