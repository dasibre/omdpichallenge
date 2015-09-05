var searchForm = document.getElementById("search");
searchForm.addEventListener("submit",function(e){
    e.preventDefault();
    document.getElementById("results").innerHTML = "";
    var movieTitle = document.getElementById("query-string").value;
    var url = 'http://www.omdbapi.com/?s=' + movieTitle;
    $.ajax(url, {
        complete: function(data, status){
            console.log(status);
            var results = $.parseJSON(data.responseText);
            results['Search'].forEach(createList);
        }
    });
});

function createList(movie){
    var fields = [movie.Title, movie.Year];
    var result = document.createElement("div");
    var list = document.createElement('ul');

    result.setAttribute("id", movie.Title);
    result.addEventListener("click", function(e){
        e.preventDefault();
        getMovieDetails(this.id);
    });

    fields.forEach(function(field){
        var item = document.createElement('li');
        item.appendChild(document.createTextNode(field));
        list.appendChild(item);
    });
    result.appendChild(list);
    return document.getElementById("results").appendChild(result);
}

function reqListener () {
    var movieDetails = JSON.parse(this.responseText);
    console.log(movieDetails);
    document.getElementById("movie-details").innerHTML = movieDetails.Title;
}

function getMovieDetails(movietitle) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "http://www.omdbapi.com/?t=" + movietitle + "&r=json", true);
    oReq.send();
}