/**
 * Created by jnaadjie on 9/6/15.
 */
(function(){

    var omdbapiUrl = "https://www.omdbapi.com/"; //using https to make heroku happy
    var movieSelectors;

    document.onreadystatechange = function() {
      if(document.readyState === "interactive") {
          initApplication();
      }
    };

    function initApplication() {
        movieSelectors = {
            overview: document.getElementById("movie-overview-info"),
            infoBar: document.getElementsByClassName("movie-info-bar"),
            searchForm: document.getElementById("search-form"),
            title: document.getElementById("query-string"),
            results: document.getElementById("results"),
            loader: document.getElementById("loading"),
            favorite: document.getElementById("favorite"),
            favorites: document.getElementById("list-favorites")
        };

        movieSelectors.favorites.addEventListener("click", showFavorites);
        //Add submit event listener, to get movies on submission
        movieSelectors.searchForm.addEventListener("submit",function(e){
            e.preventDefault();
            loader.show();
            resetResultsHtml();
            var movieTitle = movieSelectors.title.value;
            var searchParam = '?s=' + movieTitle;
            ajaxClient.get(omdbapiUrl + searchParam,function(){
                loader.hide();
                var results = JSON.parse(this.responseText);
                results['Search'].forEach(createList);
            });
        });
    }

    function resetResultsHtml() {
        movieSelectors.results.innerHTML = "";
    }
    //Saves movie to favorites
    function favoriteAmovie(movie) {
        movie.favorites = "true";
        ajaxClient.post("/favorites", JSON.stringify(movie));
    }

    //displays all movies added to favorites
    function showFavorites() {
        resetResultsHtml();
        movieSelectors.favorite.innerText = "Saved to Favorites";
        ajaxClient.get("/favorites",function(){
            var results = JSON.parse(this.responseText);
            results.forEach(createList);
        });
    }

    //creates an unordered list of divs using the results of index search
    function createList(movie){
        var fields = [movie.Title, movie.Year];
        var result = document.createElement("div");
        var list = document.createElement('ul');

        setAttributes(result,{"id": movie.Title, "class": "movie"});
        result.addEventListener("click", function(e){
            e.preventDefault();
            loader.show();
            movieSelectors.favorite.innerText = (movie.favorite === "true") ? "Saved to favorites" : "favorite this movie";
            searchByTitle(this.id);
        });

        fields.forEach(function(field){
            item = document.createElement('li');
            item.appendChild(document.createTextNode(field));
            list.appendChild(item);
        });
        result.appendChild(list);
        return movieSelectors.results.appendChild(result);
    }

    //Search Omdbapi by movie title
    function searchByTitle(title) {
        ajaxClient.get(omdbapiUrl + "?t=" + title + "&r=json",displayMovieInfo)
    }

    //Display movie details
    function displayMovieInfo () {
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

    //Helper to toggle modal overlay
    function toggleMovieInfoDisplay(cb) {
        overlay = document.getElementById("overlay");
        overlay.style.visibility = (overlay.style.visibility === "visible") ? "hidden" : "visible";
        cb(overlay);
    }

    //Helper to set multiple element attributes
    function setAttributes(element, attrs) {
        for(var key in attrs) {
            element.setAttribute(key, attrs[key]);
        }
    }

    //Set Movie fields for displaying movie details
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
            this.innerText = "Saved to favorites";
        },false);
    }

    //Ajax client to get and post requests
    var ajaxClient = {
      get: function(url,reqListener) {
          var client = new XMLHttpRequest();
          client.ontimeout = function() {
              alert("The request for " + omdbapiUrl + " timed out");
              loader.hide();
          };
          client.addEventListener("load", reqListener);
          client.open("GET", url, true);
          client.timeout = 6000;
          client.send();
      },

      post: function(url,data) {
          var client = new XMLHttpRequest();
          client.ontimeout = function() {
              alert("The request for " + omdbapiUrl + " timed out");
              loader.hide();
          };
          client.open("POST", url, true);
          client.setRequestHeader("Content-Type", "application/json");
          client.timeout = 6000;
          client.send(data);
      }
    };

    //Turns loader gif on and off
    var loader = {
        show: function() {
            movieSelectors.loader.style.display = "block";
        },
        hide: function() {
            movieSelectors.loader.style.display = "none";
        }
    };
}());