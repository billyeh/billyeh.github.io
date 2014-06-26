(function () {

    /*********************************************
    Configuration options
    *********************************************/
    var logFile = "https://dl.dropboxusercontent.com/u/30426053/hellopip.log";
    var startTime = 3000;

    /*********************************************
    Functionality
    *********************************************/

    function readTextFile(file, cb) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.status === 200 || rawFile.status === 0) {
                var allText = rawFile.responseText;
                cb(allText);
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
            if (locations[i].isIndoor !== currentIsIndoor) {
                startsAndLengths.push({"isIndoor": currentIsIndoor, "startTime": startTime, "length": locations[i].time - startTime});
                currentIsIndoor = !currentIsIndoor;
                startTime = locations[i].time;
            }
        }
        return startsAndLengths;
    }

    function drawTimeline(locations) {
        console.log(locations);
        var x
          , y
          , width = 800
          , barHeight = 30
          , height = 2 * barHeight
          , chart = d3.select("body")
                .append("svg")
                .attr("class", "chart")
                .attr("width", width)
                .attr("height", height);
        x = d3.scale.linear()
            .domain([startTime, d3.max(locations, function(loc) { return loc.time; })])
            .range([0, width]);
        y = function(i) { return barHeight * i; }

        chart.selectAll("rect")
            .data(locations)
            .enter().append("rect")
            .attr("x", 0)
            .attr("y", function(d, i) { return y(i); })
            .attr("width", 50)
            .attr("height", barHeight);
    }

    readTextFile(logFile, processFile);

}());
