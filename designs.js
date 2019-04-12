function lollipop(gameData) {
    //Set margins
    var margin = {top: 10, right: 30, bottom: 90, left: 40};
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //Create SVG
    var svg = d3.select("#chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    //X Axis
    var xAxis = d3.scaleLinear()
        .domain([0,10])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0,"+ height +")")
        .call(d3.axisBottom(xAxis));
    svg.append("text")
        .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 25) + ")")
        .style("text-anchor", "middle")
        .text("User Score");

    //Y Axis
    var yAxis = d3.scaleLinear()
        .domain([0,100])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(yAxis));
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left -5)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Critic SCore");

    //Create drop lines
    var rect = svg.selectAll("dropline")
        .data(gameData)
        .enter()
        .append("rect")
        .attr("x", d => xAxis(d.User_Score))
        .attr("y", d => yAxis(d.Critic_Score))
        .attr("width", .5)
        .attr("height", d => height - yAxis(d.Critic_Score))
        .attr("fill", "lightgrey")
        .attr("stroke", "black")
        .attr("class", "dropline");

    //Create pacman
    var pacman = svg.selectAll("pacman")
        .data(gameData)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xAxis(d.User_Score); })
        .attr("cy", function(d) { return yAxis(d.Critic_Score); })
        .attr("r", "1.5%")
        .style("fill", "none")
        .attr("stroke", "gold")
        .attr("stroke-dasharray", "63, 17")
        .attr("stroke-dashoffset", -5)
        .attr("stroke-width", "2.5%")
        .attr("class", "pacman");

    //Create circle points
    var circles = svg.selectAll("point")
        .data(gameData)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xAxis(d.User_Score); })
        .attr("cy", function(d) { return yAxis(d.Critic_Score); })
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .attr("class", "point");
        
    //Legend
    svg.append("g")
        .call(legend);
    
    var legend = d3.legendColor()
        .shapeWidth(30)
        .orient("horizontal")
        .scale(x);
    x = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, 10]);
    
}

function createVis(data) {
    //Get top 25 rows
    let gameData = data.slice(0,25);
    /*gameData.forEach(element => {
        console.log(element);
    });*/
    /*
    var platforms = d3.nest()
        .key(function (d) { return d.Platform;})
        .entries(gameData);
    platforms.forEach(d => {
        console.log(JSON.stringify(d));
    });*/

    //Call function
    lollipop(gameData);
}

d3.csv("video_game.csv")
    .then(createVis);