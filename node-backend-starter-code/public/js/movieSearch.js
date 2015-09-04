var searchForm = $('form');
var container = $('#container');
container.hide();
searchForm.on('submit', function(event){
    event.preventDefault();
    var movieTitle = searchForm.find('input').val();
    var url = 'http://www.omdbapi.com/?s=' + movieTitle;
    $.ajax(url, {
        complete: function(data, status){
            console.log(status);
            var results = $.parseJSON(data.responseText);
            console.log(results['Search']);
            results['Search'].forEach(function(movie){
                container.find('table tbody').append("<tr><td>{{movie.title}}</td><td>{{movie.year}}</td></tr>");
                console.log(movie.director);
//                    $Container.find('.title').text(movie.Title);
//                    $Container.find('.plot').text(movie.Plot);
//                    $Container.find('.poster').html('<img src="' + movie.Poster + '"/>');
//                    $Container.find('.year').text(movie.Year);
            });
            container.show();
        }
    });
});

//$('#dynamictable').append('<table></table>');
//var table = $('#dynamictable').children();
//table.append("<tr><td>a</td><td>b</td></tr>");
//table.append("<tr><td>c</td><td>d</td></tr>");