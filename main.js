/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

const svg = d3.select("#chart-area").append("svg")
.attr("width", 300)
.attr("height", 300)
.attr("style", "outline: thin solid black;");

svg.append("circle")
.attr("cx",200)
.attr("cy",150)
.attr("r",40)
.attr("fill","blue");

var year = 2011
var ballot = 1

async function init() {
    const data = await d3.csv("Peru Elections "+ year +".csv");
    console.log(data);
    
    var x = d3.scaleBand().domain([0,1,2,3,4,5,6,7,8,9]).range([0,200]);
    var y = d3.scaleLinear().domain([0,70]).range([200,0]);

    var axisx = d3.axisBottom(x);
    var axisy = d3.axisLeft(y).tickValues([10,20,30,40,50,60]);

    svg.append("g").attr("transform","translate(50,50)")
    .selectAll("dot")
    .data(data).enter().append("rect")
    .attr("x", function (d,i) {return x(i);}) 
    .attr("y", function (d,i) {return y(d.Votes1);})
    .attr("width", function(d,i) {return x.bandwidth();})
    .attr("height",function (d) {return 200 - y(d.Votes1)})
    .attr("fill","blue");

    svg.append("g").attr("transform","translate(50,50)").call(axisy);
    svg.append("g").attr("transform","translate(50,250)").call(axisx);
}
