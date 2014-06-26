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
        drawTimeline(locations)
    }

    function drawTimeline(locations) {
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
    }

    readTextFile(logFile, processFile);

}());
