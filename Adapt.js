/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 300 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 700 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)



const partyColor = ["blue","LightBlue","grey","pink","red"]

// Labels
const xLabel = g.append("text")
	.attr("y", HEIGHT + 50)
	.attr("x", WIDTH / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Peruvian Political Parties")
const yLabel = g.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", -40)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Votes (Percentage)")
const timeLabel = g.append("text")
	.attr("y", HEIGHT - 10)
	.attr("x", WIDTH - 40)
	.attr("font-size", "40px")
	.attr("opacity", "0.4")
	.attr("text-anchor", "middle")
	.text("2011 elections round 1")

let year = 2011
let ballot = 1
let ballotField = "Percent1"

d3.csv("Peru Elections.csv").then(function(data){
	// clean data
    data.forEach(d => {
        d.Percent1 = Number(d.Percent1)
        d.Percent2 = Number(d.Percent2)
        d.Votes1 = Number(d.Votes1)
        d.Votes2 = Number(d.Votes2)
        d.Seats = Number(d.Seats)
        d.OrientationN = Number(OrientationN)
    })

    let yearData = data.filter(function(d) {return d.Year == String(year)})

	// run the code every 6 seconds
	d3.interval(function(){
		// at the end of our data, loop back
        if (ballot == 2) {
            year = (year < 2021 ? year + 5 : 2011)
            ballot = 1
            ballotField = "Percent1"
        } else {
            ballot = 2
            ballotField = "Percent2"
        }
        yearData = data.filter(function(d) {return d.Year == String(year)})
		update(yearData)
	}, 6000)

	// first run of the visualization
	update(yearData)
})

function update(data) {
    // Scales
    const x = d3.scaleBand()
        .range([0, WIDTH])
        .domain(data.map(d => d.party))
        .paddingInner(0.3)
        .paddingOuter(0.2)
    const y = d3.scaleLinear()
        .range([HEIGHT, 0])
        .domain([0, d3.max(data, d => d[ballotField])])

        
	// standard transition time for the visualization
	const t = d3.transition()
    .duration(500)

    // X Axis
    const xAxisCall = d3.axisBottom(x)

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`)
        .transition(t)
        .call(xAxisCall)
        .selectAll("text")
        .attr("y","10")
        .attr("x","-5")
        .attr("text-anchor","end")
        .attr("transform","rotate(-40)")

    // Y Axis
    const yAxisCall = d3.axisLeft(y)
    g.append("g")
        .attr("class", "y axis")
        .transition(t)
        .call(yAxisCall)


	// JOIN new data with old elements.
	const rectangles = g.selectAll("rect")
		.data(data, d => d.Party)

	// EXIT old elements not present in new data.
	rectangles.exit().remove()

	// ENTER new elements present in new data.
	rectangles.enter().append("rect")
		.attr("fill", d => partyColor(d.OrientationN - 1))
		.merge(rectangles)
		.transition(t)
			.attr("y", d => y(d[ballotField]))
			.attr("x", d => x(d.Party))
			.attr("height", d => HEIGHT - y(d[ballotField]))
            .attr("width", x.bandwidth)

	// update the time label
	timeLabel.text(String(year)+" elections round" + String(ballot))
}