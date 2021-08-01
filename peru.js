/*
*    peru.js
*    Data Visualization with D3.js
*    Final Project - Peruvian Elections (2011 to 2021)
*/

const MARGIN = { LEFT: 90, RIGHT: 90, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

const a = svg.append("g")
.attr("class", "annotation-group")
.attr('id',"annotation-id");

const partyColors = ["blue", "LightBlue", "grey", "pink", "red"]
const partyTypes = ["Far left", "Left", "Center", "Right", "Far right"]

// Build a new svg for the Legend of types of parties: Far left, left, Center, etc.

const svg2 = d3.select("#chart-area").append("svg")
    .attr("width", 120)
    .attr("height", 100)

const legend = svg2.append("g");

partyTypes.forEach((pType, i) => {
    const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

    legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", partyColors[i]);

    legendRow.append("text")
        .attr("x", 70)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .attr("font-size", "14px")
        .text(pType);
})


// X, Y, Election year and Round (ballot) Labels
const xLabel = g.append("text")
    .attr("y", HEIGHT + 90)
    .attr("x", WIDTH / 3)
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
    .attr("y", HEIGHT - 220)
    .attr("x", WIDTH - 20)
    .attr("font-size", "20px")
    .attr("opacity", "0.6")
    .attr("text-anchor", "middle")
    .text("2011")

const roundLabel = g.append("text")
    .attr("y", HEIGHT - 200)
    .attr("x", WIDTH - 20)
    .attr("font-size", "20px")
    .attr("opacity", "0.6")
    .attr("text-anchor", "middle")
    .text("round 1")

// Scales fixed part - varying part below inside update function
const x = d3.scaleBand()
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.8)

const y = d3.scaleLinear()
    .range([HEIGHT, 0])

let year = 2011
let ballot = 1
let ballotField = "Percent1"

const xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
    .attr("class", "y axis")

// Create a tooltip

var Tooltip = d3.select(".row")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
    Tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
}
var mousemove = function(d) {
Tooltip
    .html("Name of Party: " + d.Party +"<br> Candidate: " + d.Candidate + "<br> Orientation: " + d.Orientation +"<br> Congress seats: "+ d.Seats + "<br> Votes 1st round (%): "+ d.Percent1+ "<br> Votes 2nd round (%): "+ d.Percent2)
    .style("left", (d3.mouse(this)[0]+70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
Tooltip
    .style("opacity", 0)
d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.8)
}


// Build commentary of each election year

const electionComments = ["", "", "", "", "", ""]
electionComments[0] = "Phoenix rebirth: Keiko Fujimori, the daughter of an autocratic past president now in prison, has rebuilt Popular Force party and promised honesty. She is helped by the economic growth that allegedly came from her father's free market reforms. Other contenders are Peru Wins a leftist party that is seen as a threat to the economic rebound, and a former prime minister leading a right coalition Alliance for Great Change that promises to accelerate the free market reforms."
electionComments[1] = "Strategic play: Humala's Peru Wins gets the upper hand by moderating their leftist discourse towards the center and promising social reforms without dismantling the free market policies that proved to be effective. Some good reforms are implemented but corruption scandals stain his mandate. Poverty in urban areas recedes but his voting base in poor provinces and rural areas sees little to no progress and are disappointed."
electionComments[2] = "Dellusion: Peru Wins introduced some social reforms that benefit urban areas but neglected his voting base in rural areas. The right wing parties benefit from the dellusion from a leftist government that promised too much. Popular Force leverages the memory of the economic progress during her father's rule. This time she wins the congress in a landslide and will face former prime minister Kuczynski's Alliance for the Great Change in the 2nd round."
electionComments[3] = "Emotion beats Reason: Alliance of Kuczynski capitalizes on the resentment towards the autocratic and corrupted government of Keiko's father and wins votes from the Left. They defeat Popular Force by mere 0.1% after a tough campaign. Kuczynski has little support in the congress and outside Lima the capital city. Popular Force uses the congress to block all his initiatives. He is forced to resign after a video shows him trying to bribe some Popular Force's congressmen to support his initiatives. From political instability to Chaos."
electionComments[4] = "Save us from Saviours: The country is in political disarray. Some parties get dissolved and new leaders emerge. All claim to know how to better distribute the benefits of the economic boom among all peruvians and stop the corruption. 18 parties compete this year including far right and far left extremist parties. Socialists and Communists of Free Peru, lead by a rural teacher from a poor province, win the first round with only 19% of votes, followed by Popular Force with 13%."
electionComments[5] = "Fascination for the Abyss: In a toxic campaign Popular Force accuses the socialists of Free Peru to be terrorists, and they accuse Popular Force to be corrupt. All newspapers and the media favor Popular Force. However, Free Peru manages to win by 0.1% difference. Popular Force claims fraud without proofs but with much media support, questioning the Electoral institute's neutrality. Next five years will test the limits of Peru's weak democracy."

d3.select("#chart-area").append("hr")

var comment = d3.select("#chart-area")
    .append("p")
    .attr("class", "message")
    .style("font-size", "14px")
    .text(electionComments[0]);

d3.select("#chart-area").append("hr")

// Read data from file 

d3.csv("Peru Elections.csv").then(function (data) {
    // clean data
    data.forEach(d => {
        d.Percent1 = Number(d.Percent1)
        d.Percent2 = Number(d.Percent2)
        d.Votes1 = Number(d.Votes1)
        d.Votes2 = Number(d.Votes2)
        d.Seats = Number(d.Seats)
        d.OrientationN = Number(d.OrientationN)
    })

    globalThis.data = data;

    let yearData = data.filter(function (d) { return d.Year == String(year) })
    update(yearData)
    d3.select("#annotation-id").html("")
    updateAnnotations();
})

// Update function redraws chart and axis

function update(mydata) {

    // Scales varying part - fixed part above
    x.domain(mydata.map(d => d.Party))
    y.domain([0, 1.3 * d3.max(mydata, d => d[ballotField])])

    // standard transition time for the visualization
    const t = d3.transition().duration(500)

    // X Axis
    const xAxisCall = d3.axisBottom(x)

    xAxisGroup.transition(t).call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    // Y Axis
    const yAxisCall = d3.axisLeft(y)
    yAxisGroup.transition(t).call(yAxisCall)

    // JOIN new data with old elements.
    const rectangles = g.selectAll("rect")
        .data(mydata, function (d) { return d.Party })

    // EXIT old elements not present in new data.
    rectangles.exit()
        .attr("fill", "peru")
        .transition(t)
        .attr("height", 0)
        .attr("y", y(0))
        .remove()

    // ENTER new elements present in new data.
    rectangles.enter().append("rect")
        .attr("fill", d => partyColors[d.OrientationN - 1])
        .attr("y", y(0))
        .attr("height", 0)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .merge(rectangles)
        .transition(t)
        .attr("y", d => y(d[ballotField]))
        .attr("x", d => x(d.Party))
        .attr("height", d => HEIGHT - y(d[ballotField]))
        .attr("width", x.bandwidth);

    // update the time label, round (ballot) 
    timeLabel.text(String(year));
    roundLabel.text("round " + String(ballot));
    arrayIndex = (year - 2011) / 5 * 2 + (ballot - 1);

    // update comments
    d3.select("#chart-area").selectAll("p").text(electionComments[arrayIndex]);

}

// Buttons code

var next = function () {
    if (year < 2021) {
        year = year + 5;
        ballot = 1;
        ballotField = "Percent1";
        yearData = data.filter(function (d) { return d.Year == String(year) });
        update(yearData);
        d3.selectAll("#annotation-id").html("")
        updateAnnotations();
    }
}
var previous = function () {
    if (year > 2011) {
        year = year - 5
        ballot = 1
        ballotField = "Percent1";
        yearData = data.filter(function (d) { return d.Year == String(year) })
        update(yearData);
        d3.selectAll("#annotation-id").html("")
        updateAnnotations();
    }
}
var toggleBallot = function () {
    if (ballot == 1) {
        ballot = 2
        ballotField = "Percent2"
        yearData = data.filter(function (d) { return d.Year == String(year) })
        update(yearData)
    } else {
        ballot = 1
        ballotField = "Percent1"
    }
    yearData = data.filter(function (d) { return d.Year == String(year) })
    update(yearData)
    d3.selectAll("#annotation-id").html("")
    updateAnnotations();
}

// Annotations code previous color #E8336D
var updateAnnotations = function() {

    annotationList = getAnnotations(year,ballot)

    const annotations = annotationList.map(function(d){ d.color = "mediumvioletred"; return d});

    const makeAnnotations = d3.annotation()
      .type(d3.annotationLabel)
      .annotations(annotations);
    
    a.call(makeAnnotations);
}

var getAnnotations = function(thisYear,thisBallot) {
    if (thisYear == 2011 && thisBallot == 1) {
        return [
            {
            note: {
                title: "Votes evenly spread across spectrum"
            },
            x: 270,
            y: 80,
            dy: 0,
            dx: 0
            },{
            note: {
                title: "Fujimori's Popular Force resurges"
            },
            x: 380,
            y: 180,
            dy: -30,
            dx: 60
            }
            ]
    }
    if (thisYear == 2011 && thisBallot == 2) {
        return [
            {
            note: {
                title: "Tight margin favors Peru Wins (left)"
            },
            x: 190,
            y: 100,
            dy: -15,
            dx: 20
            }
            ]
    }
    if (thisYear == 2016 && thisBallot == 1) {
        return [
            {
            note: {
                title: "Major shift to the Right"
            },
            x: 310,
            y: 60,
            dy: 0,
            dx: 0
            },{
            note: {
                title: "Center parties lose ground"
            },
            x: 280,
            y: 350,
            dy: -30,
            dx: -10
            }
            ]
    }
    if (thisYear == 2016 && thisBallot == 2) {
        return [
            {
            note: {
                title: "Tighter margin favors Alliance FGC"
            },
            x: 430,
            y: 100,
            dy: -20,
            dx: -100
            }
            ]
    }
    if (thisYear == 2021 && thisBallot == 1) {
        return [
            {
            note: {
                title: "Rural areas and the poor turn radical"
            },
            x: 150,
            y: 100,
            dy: -20,
            dx: 10
            },{
            note: {
                title: "Fragmentation and rise of extremist parties"
            },
            x: 450,
            y: 210,
            dy: -60,
            dx: -110
            }
            ]
    }
    if (thisYear == 2021 && thisBallot == 2) {
        return [
            {
            note: {
                title: "Tiny margin fuels Fraud claims"
            },
            x: 145,
            y: 100,
            dy: -20,
            dx: 20
            }
            ]
    }
}