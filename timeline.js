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
            if (!loc && !loc["time"]) { return; }
            var time = loc["time"].toString();
            loc["time"] = parseInt(time.substring(time.length - 4, time.length));
        }
        function filter(loc) {
            return loc && loc["time"] && (loc["time"] > startTime);
        }
        locations = locations.map(map);
        locations = locations.filter(filter);
        console.log(locations);
    }

    function drawTimeline(timeline) {

    }

    readTextFile(logFile, processFile);

}());
