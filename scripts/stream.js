var smargin = {top: 20, right: 20, bottom: 80, left: 20};
var swidth, sheight;
var streamgraphSvg;
var SxAxis;
// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  streamSvg= d3.select("#stream")
  swidth = +streamSvg.style('width').replace('px','');
  sheight = +streamSvg.style('height').replace('px','');
  drawStreamGraph();
  $("#slider").on("change", function(){ console.log("stream changing"); drawStreamMap();})
  //document.getElementById("chemical-input").addEventListener("change", function() { console.log("stream changing"); drawStreamGraph();});
});

function drawStreamGraph() {
  streamSvg.selectAll("*").remove();
  var chemical = document.getElementById("chemical-input").value;
  d3.csv(chemicalUrl[chemical]).then(function(data) {
    
    console.log(data);

    const keys = ["Achara", "Boonsri", "Busarakhan", "Chai", "Decha", "Kannika", "Kohsoom", "Sakda", "Somchair", "Tansanee"]
    var data_filtered=[];
	  for(var i = 0;i<data.length;i++)
	  {
      var ye = data[i].Year;
      var year_int = parseInt(ye);
      if(a<=year_int && year_int<=b)
      {
        data_filtered.push(data[i])
      }	  
	  }
    console.log(data_filtered)
    // Add X axis
    const x = d3.scaleBand()
                .domain(data_filtered.map(function(d) { return d.Year; }))
                // .domain([1998, 2016])
                .range([smargin.left, swidth - smargin.right]);

    console.log(x(2010))
    SxAxis = d3.axisBottom(x).tickSize(-height*0.8)
    streamSvg.append("g")
            .attr("transform", `translate(0, ${sheight*0.9})`)
            .call(SxAxis)
            .select(".domain").remove()

    // Customization
    streamSvg.selectAll(".tick line").attr("stroke", "#b8b8b8")
    
    // Add X axis label:
    streamSvg.append("text")
            .attr("text-anchor", "end")
            .attr("x", swidth/2)
            .attr("y", sheight-smargin.bottom/8 )
            .text("Time (year)");
    
    var color = d3.scaleOrdinal()
                  .domain(["Achara", "Boonsri", "Busarakhan", "Chai","Decha","Kannika","Kohsoom", "Sakda", "Somchair", "Tansanee"])
                  .range(["#F69035", "#B9DDF1", "#6798C1", "#4776A4","#AD8BC9","#2A5783","#8BBADC","#9E3D22","#D45B21","#D18954"]);
      //stack the data?
    const stackedData = d3.stack()
                          .offset(d3.stackOffsetSilhouette)
                          .keys(keys)
                          (data_filtered)

    var y_min = 100000, y_max = -100000;
    for(var i = 0; i < 10;i++)
    {
      for(var j = 0; j < stackedData[i].length; j++)
      {
        y_min = Math.min(stackedData[i][j][0], y_min)
        y_min = Math.min(stackedData[i][j][1], y_min)
        y_max = Math.max(stackedData[i][j][0], y_max)
        y_max = Math.max(stackedData[i][j][1], y_max)
      }
    }
            
    // Add Y axis
    const y = d3.scaleLinear()
                .domain([y_min*0.9, y_max*1.1])
                .range([sheight-smargin.bottom, smargin.top]);
  
    console.log(stackedData)
    // create a tooltip
    const Tooltip = streamSvg.append("text")
                            .attr("x", 50)
                            .attr("y", 30)
                            .style("opacity", 0)
                            .style("font-size", 17)
    
      // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event,d) {
      Tooltip.style("opacity", 1)
      d3.selectAll(".myArea").style("opacity", .2)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    const mousemove = function(event,d,i) {
      Tooltip.text(keys[d])
    }
    const mouseleave = function(event,d) {
      Tooltip.style("opacity", 0)
      d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
    }
    
    // Area generator
    const generate_area = d3.area()
                            .curve(d3.curveMonotoneX)
                            .x(function(d) { return x(d.data.Year)+x.bandwidth()/2; })
                            .y0(function(d) { return y(d[0]); })
                            .y1(function(d) { return y(d[1]); })
                          
      // Show the areas
    streamSvg.selectAll("mylayers")
            .data(stackedData)
            .join("path")
            .attr("class", "myArea")
            .style("fill", function(d) { return color(d.key); })
            .attr("d", generate_area)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click",function(event,d,i){
              if(window.c===keys[d]){
                window.c='all';
              }
              else{
                window.c=keys[d];
              }
              console.log(window.c);  
              updateChart2();
            })
            .attr("opacity", 1)
  })
}
  
 