function boxplot(data) {
    //Set margins
    var margin = {top: 10, right: 30, bottom: 90, left: 40};
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //Create Tooltip
    var tooltip = d3.select("#chart")
        .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    //Create SVG
    var svg = d3.select("#chart")
        .append("svg")
            .attr("class", "boxplotSVG")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("class", "graph")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
    //Title
    var title = svg.append("text")
        .attr("x", 200)
        .attr("y", 3)
        .text("Top 25 Games - Avg. Players per Platform");

    var labels = ["PS", "XBOX", "PC", "Nintento", "Other"];

    //X Axis
    var xAxis = d3.scaleOrdinal()
        .range([0, width]);
    var x = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0,"+ height +")")
        .call(d3.axisBottom(xAxis));
    svg.append("text")
        .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 25) + ")")
        .style("text-anchor", "middle")
        .text("Platform");
    
    //Y Axis
    var yAxis = d3.scaleLinear()
        .domain([0,100])
        .range([height, 0]);
    var y = svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yAxis));
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left -5)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Critic Score");
}

function lollipop(data) {
    //Set margins
    var margin = {top: 10, right: 30, bottom: 90, left: 40};
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var dropdownItems = ["All","PS", "XBOX", "PC", "Nintento", "Other"];

    //Create Tooltip
    var tooltip = d3.select("#chart")
        .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    
    //Create SVG
    var svg = d3.select("#chart")
        .append("svg")
            .attr("class", "lollipopSVG")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("class", "graph")
            .attr("transform",
                "translate(" + margin.left + "," + margin.right + ")");
    
    //Dropdown
    var dropdownChange = function() {
        var newPlatform = d3.select(this).property("value"), newData;
        if(newPlatform === "All"){
            newData = data;
        } else
            newData = platformMap[newPlatform];

        //drawViz(newData);
    }
    var dropdown = d3.select("#chart")
        .insert("select", "svg")
        .attr("id", "dropdown")
        .on("change", dropdownChange)
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("<strong>Currently not working</strong>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
    dropdown.selectAll("option")
        .data(dropdownItems)
        .enter().append("option")
            .attr("value", d => d)
            .text(d => d);
    //Color Scale
    var labels = ["PS", "XBOX", "PC", "Nintento", "Other"];
    var colorScale = d3.scaleOrdinal()
        .domain(labels)
        .range(d3.schemeAccent);
    
    //Title
    var title = svg.append("text")
        .attr("x", 300)
        .attr("y", 2)
        .text("Top 25 Games - Avg. Players per Platform")

    var labels = ["PS", "XBOX", "PC", "Nintento", "Other"];

    //X Axis
    var xAxis = d3.scaleLinear()
        .domain([0,10])
        .range([0, width]);
    var x = svg.append("g")
        .attr("class", "x-axis")
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
    var y = svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yAxis));
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left -5)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Critic Score");

    //Draw initial graph
    var drawViz = function(gameData) {
        //Create drop lines
        var droplines = svg.append("g")
            .attr("class", "droplines");
        var rect = droplines.selectAll("dropline")
            .data(gameData)
            .enter()
            .append("rect")
                .attr("x", d => xAxis(d.User_Score))
                .attr("y", d => yAxis(d.Critic_Score))
                .attr("width", .5)
                .attr("height", d => height - yAxis(d.Critic_Score))
                .attr("fill", function(d) {
                    return colorScale(d.Platform_Group);
                })
                .attr("stroke", "black")
                .attr("class", "dropline");

        //Create pacman
        var pacmanMark = svg.append("g")
            .attr("class", "pacman");
        var pacman = pacmanMark.selectAll("pacman")
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

        //Create point markers
        var points = svg.append("g")
            .attr("class", "points");
        var circles = points.selectAll("point")
            .data(gameData)
            .enter()
            .append("circle")
                .attr("cx", function(d) { return xAxis(d.User_Score); })
                .attr("cy", function(d) { return yAxis(d.Critic_Score); })
                .attr("r", "4")
                .attr("fill", function(d) {
                    return colorScale(d.Platform_Group);
                })
                .attr("stroke", "black")
                .attr("class", "point")
                .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html("<strong>Global Players:</strong> " + d.Global_players + 
                        "<br/><strong>Critic Score:</strong> " + d.Critic_Score +
                        "<br/><strong>User Score:</strong> " + d.User_Score +
                        "<br/><strong>Platform</strong> " + d.Platform_Group)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

        //Draw playerMarks
        //TODO: only draws one circle..
        gameData.forEach(d => {
            var x = xAxis(d.User_Score);
            var y = yAxis(d.Critic_Score);
            var nodes = d3.range(d.Num_Nodes);
            console.log(nodes)
            var node = svg.append("g")
                .attr("class", "nodes");
            var nodeMarker = node.selectAll("node")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("cx", x+10)
                .attr("cy", y)
                .attr("r", 4)
                .attr("fill", "black");
        })
    }

    //Draw data
    //TODO: add ability to update graph
    drawViz(data);

    //Legend
    var legendDiv = d3.select("#chart")
        .append("div")
            .attr("id", "legend")
            .html("<h3>Legend</h3><br/>");
    var svg2 = legendDiv.append("svg")
            .attr("width", 250)
            .attr("height", 500);
    var legendSVG = svg2.append("svg")
            .attr("viewbox", "0 0 100 100")
            .attr("class", "legend");
    var legendPacman = legendSVG.append("circle")
        .attr("cx", "20%")
        .attr("cy", "10%")
        .attr("r", "5%")
        .attr("fill", "none")
        .attr("stroke", "gold")
        .attr("stroke-dasharray", "105, 50")
        .attr("stroke-dashoffset", -10)
        .attr("stroke-width", "10%");
    var mainCircle = svg2.append("circle")
        .attr("cx", 50)
        .attr("cy", 50)
        .attr("r", 10)
        .attr("fill", "white")
        .attr("stroke", "black")
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("<strong>Global Players:</strong> " + 
                "<br/><strong>Critic Score:</strong> " +
                "<br/><strong>User Score:</strong> " +
                "<br/><strong>Platform</strong>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    var playerCircle = svg2.append("circle")
        .attr("cx", 75)
        .attr("cy", 50)
        .attr("r", 6)
        .attr("fill", "black")
    var line2 = legendSVG.append("line")
        .attr("x1", 75)
        .attr("y1", 50)
        .attr("x2", 90)
        .attr("y2", 10)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    var text = legendSVG.append("text")
        .attr("x", 95)
        .attr("y", 12)
        .text("# Global Players");
    var line = legendSVG.append("line")
        .attr("x1", 50)
        .attr("y1", 50)
        .attr("x2", 70)
        .attr("y2", 150)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    var circleX = 25;
    circleY = 25;
    var scaleSVG = svg2.append("g")
            .attr("class", "legend-scale");
    var scale = scaleSVG.append("rect")
            .attr("x", margin.left-5)
            .attr("y", 150)
            .attr("width", 150)
            .attr("height", 255)
            .attr("stroke", "black")
            .attr("fill", "white");
    var legendGroups = scaleSVG.append("g")
        .attr("transform", "translate(25, 155)");
    var legendContents = legendGroups.selectAll("g")
        .data(labels)
        .enter()
        .append("g")
            .attr("transform", function (d,i) {
                return "translate("+ circleX +","+ circleY*i*2+")";
            })
    var legendMarks = legendContents.append("circle")
            .attr("cx", circleX)
            .attr("cy", circleY)
            .attr("r", 20)
            .attr("fill", d => {
                return colorScale(d);
            });
    var legendLabels = legendContents.append("text")
            .attr("x", circleX + 30)
            .attr("y", circleY + 5)
            .text(d => d);
}

function createVis(data) {
    //Get top 25 rows
    let gameData = data.slice(0,25);

    //Boxplot data        
    var platformData = d3.nest()
        .key(d => { return d.Platform_Group;})
        .entries(gameData);

    //Call function
    lollipop(gameData);
    boxplot(platformData);
}

d3.csv("video_game.csv")
    .then(createVis);