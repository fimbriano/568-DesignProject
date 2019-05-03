function stackedBars(genreData) {
    //Set margins
    var margin = {top: 25, right: 30, bottom: 55, left: 55};
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
            .attr("class", "barSVG")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("class", "graph")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
    //Title
    var title = svg.append("text")
        .attr("x", (width)/3 - margin.top)
        .attr("y", -5)
        .text("Top 25 Games - # Global Players per Genre");

    var labels = ["PS", "XBOX", "PC", "Nintendo", "Other"];
    var genres = ["Action", "Fighting", "Misc", "Platform", "Puzzle", "Racing", "Shooter", "Sports"]

    //Color Scale
    var labels = ["PS", "XBOX", "PC", "Nintendo", "Other"];
    var colorScale = d3.scaleOrdinal()
        .domain(labels)
        .range(d3.schemeCategory10);

    //X Axis
    var xAxis = d3.scaleBand()
        .domain(genres)
        .range([0, width])
        .paddingInner(0.05);
    var x = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0,"+ height +")")
        .call(d3.axisBottom(xAxis));
    svg.append("text")
        .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 25) + ")")
        .style("text-anchor", "middle")
        .text("Genre");

    //Y Axis
    var yAxis = d3.scaleLinear()
        .domain([0,160])
        .range([height, margin.top]);
    var y = svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yAxis));
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left -5)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("# Global Players");

    //Get stacks
    var stacks = d3.stack()
        .keys(genreData.columns.slice(1,6))(genreData);
    console.log(stacks);

    //Create groups and rectangles
    svg.append("g")
        .selectAll("g")
        .data(stacks)
        .join("g")
            .attr("fill", d => colorScale(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
            .attr("x", (d,i) => xAxis(d.data.Genre))
            .attr("y", d => yAxis(d[1]))
            .attr("height", d => yAxis(d[0])-yAxis(d[1]))
            .attr("width", xAxis.bandwidth())
            .append("title").text(d => d[1]-d[0]);            
    }

function scatterPlot(gameData) {
    

    //Set margins
    var margin = {top: 25, right: 30, bottom: 55, left: 55};
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
            .attr("class", "scatterSVG")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("class", "graph")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
    //Title
    var title = svg.append("text")
        .attr("x", width/3)
        .attr("y", -5)
        .text("Top 25 Games - Global Players vs. NA Players");

    //Color Scale
    var labels = ["PS", "XBOX", "PC", "Nintendo", "Other"];
    var colorScale = d3.scaleOrdinal()
        .domain(labels)
        .range(d3.schemeCategory10);

    //X Axis
    var xAxis = d3.scaleLinear()
        .domain([0,45])
        .range([0, width]);
    var x = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0,"+ height +")")
        .call(d3.axisBottom(xAxis));
    svg.append("text")
        .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 25) + ")")
        .style("text-anchor", "middle")
        .text("# NA Players");
    
    //Y Axis
    var yAxis = d3.scaleLinear()
        .domain([0,100])
        .range([height, margin.top]);
    var y = svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yAxis));
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left -5)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("# Global Players");
    
    //Plot points
    var points = svg.append("g")
        .attr("class", "points");
    var point = points.selectAll("point")
        .data(gameData)
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 4)
        .attr("cx", d => xAxis(d.NA_players))
        .attr("cy", d => yAxis(d.Global_players))
        .style("fill", d => colorScale(d.Platform_Group))
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html("<strong>Game</strong>: " + d.Name +
                            "<br/><strong>Global Players</strong>: " + d.Global_players +
                            "<br/><strong>NA Players</strong>: " + d.NA_players)  
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

function lollipop(gameData) {
    //Set margins
    var margin = {top: 10, right: 20, bottom: 90, left: 50};
        width = 700 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    var dropdownItems = ["All","PS", "XBOX", "PC", "Nintendo", "Other"];

    //Create Tooltip
    var tooltip = d3.select("#chart")
        .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    
    var lollipopViz = d3.select("#chart")
        .append("div")
        .attr("id", "lollipopViz");

    //Create SVG
    var svg = d3.select("#lollipopViz")
        .append("svg")
            .attr("class", "lollipopSVG")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("class", "graph")
            .attr("transform",
                "translate(" + margin.left + "," + margin.right + ")");
            
    //Color Scale
    var labels = ["PS", "XBOX", "PC", "Nintendo", "Other"];
    var colorScale = d3.scaleOrdinal()
        .domain(labels)
        .range(d3.schemeCategory10);
    
    //Title
    var title = svg.append("text")
        .attr("x", width/3)
        .attr("y", -6)
        .text("Top 25 Games - Avg. Players per Platform")

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

    //Draw graph
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
    var pacmen = svg.append("g")
        .attr("class", "pacmen");

    function drawArc(group){
        var pacmanData = [
            {group: 1, start: 1.6, size: 6},
            {group: 2, start: 1.85, size:5.56},
            {group: 3, start: 2.1, size: 5},
            {group: 4, start: 2.35, size: 4.5},
            {group: 5, start: 2.6, size: 4}
        ];
        var d = group-1;
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(15)
                .startAngle(pacmanData[d].start)
                .endAngle((pacmanData[d].start + pacmanData[d].size));
         return arc();
    }
    var pacmanMark = pacmen.selectAll("g")
        .data(gameData)
        .enter()
        .append("g")
            .attr("class", "pacman")
            .attr("transform", d => "translate("+ xAxis(d.User_Score) + " , "+ yAxis(d.Critic_Score) +")");
    pacmanMark.append("path")        
        .style("fill", function(d) {
            return colorScale(d.Platform_Group);
        })
        .style("stroke", "black")
        .attr("d", function(d) {
            return drawArc(d.Player_Group);
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html("<strong>Game</strong>: " + d.Name +
                            "<br/><strong>Global Players</strong>: " + d.Global_players +
                            "<br/><strong>Critic Score</strong>: " + d.Critic_Score +
                            "<br/><strong>User Score</strong>: " + d.User_Score)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    //Dropdown
    var dropdownChange = function() {
        //Get selected platform
        var newPlatform = d3.select(this).property("value");

        if(newPlatform === "All"){
            //Show droplines
            d3.selectAll(".lollipopSVG .droplines .dropline")
                .attr("class", "dropline show");
            //Show pacmen
            d3.selectAll(".lollipopSVG .pacmen .pacman")
                .attr("class", "pacman show");
            //Show points
            d3.selectAll(".scatterSVG .points .point")
                .attr("class", "point show");
        } else {    
            //Hide droplines
            d3.selectAll(".lollipopSVG .droplines .dropline")
                .attr("class", function(d){
                    if(d.Platform_Group === newPlatform){
                        return "dropline show";
                    } else
                        return "dropline hidden";
                });
            //Hide pacmen
            d3.selectAll(".lollipopSVG .pacmen .pacman")
                .attr("class", function(d){
                    if(d.Platform_Group === newPlatform){
                        return "pacman show";
                    } else
                        return "pacman hidden";
                });

            //Hide points
            d3.selectAll(".scatterSVG .points .point")
                .attr("class", function(d){
                    if(d.Platform_Group === newPlatform){
                        return "point show";
                    } else
                        return "point hidden";
                });
        }
    }
    var dropdown = d3.select("#chart")
        .insert("select", "#lollipopViz")
        .attr("id", "dropdown")
        .on("change", dropdownChange)
    dropdown.selectAll("option")
        .data(dropdownItems)
        .enter().append("option")
            .attr("value", d => d)
            .text(d => d);

    //Legend
    var legendDiv = d3.select("#lollipopViz")
        .append("div")
            .attr("id", "legend")
            .html("<strong>Legend<strong/><br/>");
    var legendSVG = legendDiv.append("svg")
            .attr("width", 250)
            .attr("height", 400)
            .attr("id", "legendSVG");
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(25)
            .startAngle(2.1)
            .endAngle((2.1+5));
    var legendPacman = legendSVG.append("g")
        .attr("class", "legendPacman")
        .attr("transform", "translate(50, 50)");
    legendPacman.append("path")
        .style("fill", "gold")
        .style("stroke", "black")
        .attr("d", arc);
    var gLine = legendSVG.append("line")
        .attr("x1", 60)
        .attr("y1", 45)
        .attr("x2", 100)
        .attr("y2", 45)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    var text = legendSVG.append("text")
        .attr("x", 105)
        .attr("y", 40)
        .text("Size of Mouth =");
    legendSVG.append("text")
        .attr("x", 105)
        .attr("y", 60)
        .text("# Global Players");
    var line = legendSVG.append("line")
        .attr("x1", 50)
        .attr("y1", 65)
        .attr("x2", 65)
        .attr("y2", 120)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    var circleX = 25;
    circleY = 25;
    var scaleSVG = legendSVG.append("g")
            .attr("class", "legend-scale");
    var scale = scaleSVG.append("rect")
            .attr("x", margin.left-5)
            .attr("y", 110)
            .attr("width", 145)
            .attr("height", 250)
            .attr("stroke", "black")
            .attr("fill", "white");
    var legendGroups = scaleSVG.append("g")
        .attr("transform", "translate(25, 110)");
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
            .attr("r", 15)
            .attr("fill", d => {
                return colorScale(d);
            });
    var legendLabels = legendContents.append("text")
            .attr("x", circleX + 30)
            .attr("y", circleY + 5)
            .text(d => d);
}

function createVis(data) {
    var videogameData = data[0];
    var genreData = data[1];

    //Get top 25 rows
    var gameData = videogameData.slice(0,25);

    //Change to number format
    gameData.forEach(function(d) {
        d.Global_players = +d.Global_players;
        d.NA_players = +d.NA_players;
    });

    //Call function
    lollipop(gameData);
    scatterPlot(gameData);
    stackedBars(genreData);
}

Promise.all([d3.csv("video_game.csv"), d3.csv("genreTotals.csv")])
    .then(createVis);