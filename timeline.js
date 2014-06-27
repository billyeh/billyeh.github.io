(function () {

    /*********************************************
    Configuration options
    *********************************************/
    var logFile = "https://dl.dropboxusercontent.com/u/30426053/hellopip.log";
    var myLog = "https://dl.dropboxusercontent.com/u/30426053/mypip.log";
    var startTime = 2990;
    var yIndex = 0;

    /*********************************************
    Functionality
    *********************************************/
    var width = 800
      , barHeight = 30
      , height = barHeight;

    function readTextFile(file, cb) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.status === 200 || rawFile.status === 0) {
                var allText = rawFile.responseText;
                return cb(allText);
            }
        }
        rawFile.send(null);
    }

    function processFile(file) {
        var locations = JSON.parse(file);
        function map(loc) {
            var time = loc.time.toString();
            loc.time = parseInt(time.substring(time.length - 4, time.length));
            return loc;
        }
        function filt(loc) {
            return loc && (loc.time > startTime);
        }
        locations = locations.map(map);
        locations = locations.filter(filt);
        drawTimeline(turnIntoStartsAndLengths(locations));
    }

    function turnIntoStartsAndLengths(locations) {
        var startsAndLengths = []
          , currentIsIndoor = locations[0].isIndoor
          , startTime = locations[0].time;
        for (var i = 0; i < locations.length; i++) {
            if (locations[i].isIndoor !== currentIsIndoor || i === locations.length - 1) {
                startsAndLengths.push({"isIndoor": currentIsIndoor, "startTime": startTime, "length": locations[i].time - startTime});
                currentIsIndoor = !currentIsIndoor;
                startTime = locations[i].time;
            }
        }
        return startsAndLengths;
    }

    function drawTimeline(locations) {
        console.log(locations);
        var chart = d3.select("body")
                .append("svg")
                .attr("class", "chart")
                .attr("width", width)
                .attr("height", height);
        var x
          , y;
        x = d3.scale.linear()
            .domain([0, d3.max(locations, function(loc) { return loc.startTime + loc.length - startTime; })])
            .range([0, width]);
        y = function(i) { return barHeight * i; }

        chart.selectAll("rect")
            .data(locations)
            .enter().append("rect")
            .attr("x", function(d, i) { return x(d.startTime - startTime); })
            .attr("y", yIndex)
            .attr("width", function(d, i) { return x(d.length); })
            .attr("height", barHeight)
            .attr("fill", function(d, i) { return d.isIndoor ? "#003366" : "#8d75b0"; });
        
        yIndex += barHeight;
    }

    readTextFile(logFile, processFile);
    readTextFile(myLog, processFile);
}());
