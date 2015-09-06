(function(){

    var url = "https://www.omdbapi.com/"; //using https to make heroku happy
    var movieSelectors = {
      overview: document.getElementById("movie-overview-info"),
      infoBar: document.getElementsByClassName("movie-info-bar"),
      searchForm: document.getElementById("search-form"),
      title: document.getElementById("query-string"),
      results: document.getElementById("results"),
      loader: document.getElementById("loading"),
      favorite: document.getElementById("favorite")
    };

    //Add submit event listener, to get movies on submission
    movieSelectors.searchForm.addEventListener("submit",function(e){
        e.preventDefault();
        movieSelectors.results.innerHTML = "";
        var movieTitle = movieSelectors.title.value;
        var searchParam = '?s=' + movieTitle;
        $.ajax(url + searchParam, {
            complete: function(data, status){
                if(!status === "success") {
                    alert("Something Went wrong");
                } else {
                    var results = $.parseJSON(data.responseText);
                    results['Search'].forEach(createList);
                }
            }
        });
    });



    //TODO Add function
    //function searchByTitle(title) {
    //    var searchParam = '?s=' + movieTitle;
    //}

    function favoriteAmovie(movie) {
        var client = new XMLHttpRequest();
        client.open("POST", "/favorites", true);
        client.setRequestHeader("Content-Type", "application/json");
        client.send(JSON.stringify(movie));
        console.log(movie);
    }


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
        return movieSelectors.results.appendChild(result);
    }

    function toggleMovieInfoDisplay(cb) {
        el = document.getElementById("overlay");
        el.style.visibility = (el.style.visibility === "visible") ? "hidden" : "visible";
        cb(el);
    }

    function setAttributes(element, attrs) {
        for(var key in attrs) {
            element.setAttribute(key, attrs[key]);
        }
    }

    function setMovieFields(movieObj) {
        var movieInfoBar = movieSelectors.infoBar[0];
        var poster = movieSelectors.overview.getElementsByTagName("img")[0];
        var title = movieSelectors.overview.getElementsByTagName("span")[0];
        var year = movieSelectors.overview.getElementsByTagName("span")[1];
        var movieDescription = movieSelectors.overview.getElementsByClassName("movie-description")[0];

        movieinfoHtml = movieObj.Rated + "&nbsp;" + "<span class='divider'>|</span>" + movieObj.Genre + "&nbsp;" + "<span class='divider'>|</span>" + movieObj.Released;

        poster.src = (movieObj.Poster === "N/A") ? "place_holder.png" : movieObj.Poster;
        title.innerText = movieObj.Title;
        year.innerText = movieObj.Year;
        movieInfoBar.innerHTML = movieinfoHtml;
        movieDescription.innerText = movieObj.Plot;
        movieSelectors.favorite.addEventListener("click", function(e) {
            favoriteAmovie(movieObj);
            this.removeEventListener('click', arguments.callee, false);
        },false);
    }

    function reqListener () {
        movie = JSON.parse(this.responseText);
        setMovieFields(movie);
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
        show: function() {
            movieSelectors.loader.style.display = "block";
        },
        hide: function() {
            movieSelectors.loader.style.display = "none";
        }
    };
}());