(function () {

    /*********************************************
    Configuration options
    *********************************************/
    var logFile = "https://dl.dropboxusercontent.com/u/30426053/hellopip.log";
    var startTime = 3000;

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
            var time = loc["time"];
            loc["time"] = parseInt(time.toString().substring(time.length() - 4, time.length()));
        }
        function filter(loc) {
            return loc["time"] > startTime;
        }
        locations = locations.map(map);
        locations = locations.filter(filter);
        console.log(file);
    }

    function drawTimeline(timeline) {

    }

}());
