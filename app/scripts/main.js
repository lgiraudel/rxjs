(function() {
	var search = $('#search');
	var results = $('#results');

	var keyupStream = Rx.Observable.fromEvent(search, 'keyup')
	  .map(function(e) {
	    return e.target.value;
	  })
	  .filter(function(text) {
	    return text.length > 2;
	  })
	  .throttle(750)
	  .distinctUntilChanged();

	var searchStream = keyupStream.flatMapLatest(function(text) {
	  return Rx.Observable.fromPromise($.ajax({
	    url: 'http://en.wikipedia.org/w/api.php',
	    dataType: 'jsonp',
	    data: {
	       action: 'opensearch',
	       format: 'json',
	       search: encodeURIComponent(text)
	    }
	  }));
	}).subscribe(function(data) {
	  results.empty();
	
	  var resultArr = data[1];
	  var descArr = data[2];
	  var urlArr = data[3];

	  for (var i = 0; i < resultArr.length; i++) {
	    results.append('<li><a href="' + urlArr[i] + '">' + resultArr[i] + '</a>: ' + descArr[i] + '</li>');
	  }
	});
}());
