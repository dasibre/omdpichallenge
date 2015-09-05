(function(){
    //get form element
    var searchForm = document.getElementById("search-form");
    var url = "https://www.omdbapi.com/";
    searchForm.addEventListener("submit",function(e){
        e.preventDefault();
        document.getElementById("results").innerHTML = "";
        var movieTitle = document.getElementById("query-string").value;
        var searchParam = '?s=' + movieTitle;
        $.ajax(url + searchParam, {
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

        setAttributes(result,{"id": movie.Title, "class": "movie"});
        result.addEventListener("click", function(e){
            e.preventDefault();
            loader.show();
            loading.style.display = "block";
            getMovieDetails(this.id);
        });

        fields.forEach(function(field){
            item = document.createElement('li');
            item.appendChild(document.createTextNode(field));
            list.appendChild(item);
        });
        result.appendChild(list);
        return document.getElementById("results").appendChild(result);
    }

    function toggleMovieInfoDisplay(cb) {
        el = document.getElementById("overlay");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
        cb(el);
    }

    function setAttributes(element, attrs) {
        for(var key in attrs) {
            element.setAttribute(key, attrs[key]);
        }
    }

    function reqListener () {
        var movieDetails = JSON.parse(this.responseText);
        var movieInfo = document.getElementById("movie-overview-info");
        var poster = movieInfo.getElementsByTagName("img")[0];
        var title = movieInfo.getElementsByTagName("span")[0];
        var year = movieInfo.getElementsByTagName("span")[1];

        title.innerText = movieDetails.Title;
        year.innerText = movieDetails.Year;
        poster.src = movieDetails.Poster;
        loader.hide();
        toggleMovieInfoDisplay(function(element){
            el = document.getElementById("close-modal");
            el.addEventListener("click", function(e){
                element.style.visibility = "hidden";
            })
        });
    }

    function getMovieDetails(movietitle) {
        var oReq = new XMLHttpRequest();
        oReq.ontimeout = function() {
            alert("The request for " + url + " timed out");
            loader.hide();
        };
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", url + "?t=" + movietitle + "&r=json", true);
        oReq.timeout = 3000;
        oReq.send();
    }

    var loader = {
        el: document.getElementById("loading"),
        show: function() {
            this.el.style.display = "block";
        },
        hide: function() {
            this.el.style.display = "none";
        }
    };
}());