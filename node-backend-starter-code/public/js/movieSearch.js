MOVIES = [{title: 'Batman'}];


var searchForm = $('form');
var container = $('#container');
container.hide();
searchForm.on('submit', function(event){
    event.preventDefault();
    var movieTitle = searchForm.find('input').val(); //query parameter
    var url = 'http://www.omdbapi.com/?s=' + movieTitle;
    $.ajax(url, {
        complete: function(data, status){
            console.log(status);
            var results = $.parseJSON(data.responseText);
            console.log(results['Search']);
            results['Search'].forEach(function(movie){
                getMovieDetails(movie.Title);
                container.find('table tbody').append("<tr><td>movie.Title</td><td>{{movie.year}}</td></tr>");
//                    $Container.find('.title').text(movie.Title);
//                    $Container.find('.plot').text(movie.Plot);
//                    $Container.find('.poster').html('<img src="' + movie.Poster + '"/>');
//                    $Container.find('.year').text(movie.Year);
            });
            container.show();
        }
    });
});

function reqListener () {
    console.log(this.responseText);
    $("#results").append(this.responseText);
}

function getMovieDetails(movietitle) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    console.log(movietitle);
    oReq.open("GET", "http://www.omdbapi.com/?t=" + movietitle + "&r=json", true);
    oReq.send();
}


//$('#dynamictable').append('<table></table>');
//var table = $('#dynamictable').children();
//table.append("<tr><td>a</td><td>b</td></tr>");
//table.append("<tr><td>c</td><td>d</td></tr>");

//function MakeTablejQuery(rows, cols) {
//    var table = $("<table/>").attr("border", 1);
//    for (r = 0; r < rows; r++) {
//        var row = $("<tr/>");
//        for (var c = 0; c < cols; c++) {
//            if (r == 0) {
//                row.append($("<th/>").text("Column " + c))
//            } else {
//                row.append($("<td/>").text(c.toString() + r.toString()))
//            }
//        }
//        table.append(row);
//    }
//    var container = $("#container")
//    container.html('');
//    container.append(table);
//}
//
//MakeTablejQuery(5, 3);

//functional style
//Number.prototype.times = function(fn) {
//    for(var r = [], i = 0; i < this; i++)
//        r.push(fn(i));
//    return r;
//};
//
//function MakeTablejQuery(numRows, numCols) {
//
//    var header = numCols.times(function(c) {
//        return $("<th/>").text("Column " + c);
//    });
//
//    var row = function(r) {
//        return $("<tr/>").append(numCols.times(function(c) {
//            return $("<td/>").text([c, r].join(""));
//        }));
//    };
//
//    return $("<table/>")
//        .append(header)
//        .append(numRows.times(row))
//        .attr("border", 1);
//}
//
//$("#placeholder").append(MakeTablejQuery(5, 3));
