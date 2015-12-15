var app = angular.module("myApp", ['cgBusy']);
var api_key = "7b5e30851a9285340e78c201c4e4ab99";
var url_image = "http://covers.openlibrary.org/b/olid/";
var small_image = "-M.jpg";
var small_no_image = "noimage.png";
var big_image = "-L.jpg";
var big_no_image = "noimage.png";

app.controller("myController", function($scope, $http, $window) {

	$scope.currentView = "indexView";

	$scope.urlImage = url_image;
	$scope.smallImage = small_image;
	$scope.smallNoImage = small_no_image;
	$scope.bigImage = big_image;
	$scope.bigNoImage = big_no_image;

	$scope.indexBooks = [];

	$scope.loading = $http.get("https://openlibrary.org/subjects/world_war_1939-1945.json").success(function(data) {
		$scope.indexBooks = data;
		console.log($scope.searchBooks);
	});

	$scope.searchBooks = [];

	$scope.showSearchResults = function(value, page = 1) {
		$scope.search = value;
		$scope.page = page;
		$scope.loading = $http.get("https://openlibrary.org/search.json?q=" + value + "&page=" + page).success(function(data) {
			$scope.searchBooks = data;
			$scope.pages = $window.Math.ceil(data.numFound/100);
			console.log($scope.searchBooks);
			$scope.currentView = "searchBooksView";
		});
	};

	$scope.nextPage = function() {
		if ($scope.page < $scope.pages) {
			$scope.page++;
			$scope.showSearchResults($scope.search, $scope.page);
			$window.scrollTo(0, 0);
		}
	};

	$scope.previousPage = function() {
		if ($scope.page > 1) {
			$scope.page--;
			$scope.showSearchResults($scope.search, $scope.page);
			$window.scrollTo(0, 0);
		}
	};

	$scope.currentBook = {};
	
	$scope.goToBook = function(book, back = true) {
		$scope.id = book.cover_edition_key ? book.cover_edition_key : book.edition_key[0];
		$scope.cover_edition_key = book.cover_edition_key;
		$scope.authors = book.author_name ? book.author_name : book.authors;
		$scope.isBack = back;
		$scope.loading = $http.get("https://openlibrary.org/books/" + $scope.id + ".json").success(function(data) {
			$scope.currentBook = data;
			console.log($scope.currentBook);
			$scope.currentView = "bookView";
		});
	};

	$scope.back = function() {
		$scope.showSearchResults($scope.search, $scope.page);
	};

	$scope.changeView = function(viewName) {
		$scope.currentView = viewName;
	};
});

