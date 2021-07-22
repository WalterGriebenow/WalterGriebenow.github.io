/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/
const svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400)
    .attr("style", "outline: thin solid red;")

svg.append("circle")
    .attr("cx",100)
    .attr("cy",250)
    .attr("r",70)
    .attr("fill","red")

async function init() {
    data = await d3.csv("https://raw.githubusercontent.com/alex6499cat/CS416-NarrativeVisualization/main/cars2017(1).csv");
    var x = d3.scaleLog().base(10).domain([10,150]).range([0,200]);
var y = d3.scaleLog().base(10).domain([10,150]).range([200,0]);

var axisx = d3.axisBottom(x).tickValues([10,20,50,100]).tickFormat(d3.format("~s"));
var axisy = d3.axisLeft(y).tickValues([10,20,50,100]).tickFormat(d3.format("~s"));

d3.select("svg").append("g").attr("transform","translate(50,50)")
  .selectAll("dot")
  .data(data).enter().append("circle")
     .attr("cx", function (d,i) {return x(d.AverageCityMPG);}) 
     .attr("cy", function (d,i) {return y(d.AverageHighwayMPG);})
     .attr("r", function(d,i) {return d.EngineCylinders*1 +2;});

d3.select("svg").append("g").attr("transform","translate(50,50)").call(axisy);
d3.select("svg").append("g").attr("transform","translate(50,250)").call(axisx);
}
