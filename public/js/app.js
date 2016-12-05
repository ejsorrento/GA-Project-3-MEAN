angular.module("diddy", [
  "ui.router",
  "ngResource"
])
.config(["$stateProvider",
  RouterFunction
])
.controller("welcomeController", [
  "Song",
  "$state",
  welcomeControllerFunction
])
.controller("songsIndexController", [
  "Song",
  "$state",
  songsIndexControllerFunction
])
.controller("songsShowController", [
  "$state",
  "$stateParams",
  "Song",
  songsShowControllerFunction
])
.factory("Song", [
  "$resource",
  SongFactory
]);

function SongFactory($resource) {
  return $resource("/api/songs/:name", {}, {
    update: {method: "PUT"}
  });
}

function welcomeControllerFunction(Song, $state) {
  this.newSong = new Song();
  this.create = function() {
    this.newSong.$save().then(function(song) {
      $state.go("index", { name: song.name});
    });
  };
}

function songsIndexControllerFunction(Song, $state) {
  this.songs = Song.query();
}
function songsShowControllerFunction($state, $stateParams, Song) {
  this.song = Song.get({name:
    $stateParams.name});
  this.update = function() {
    this.song.$update({name: $stateParams.name});
  };
  this.destroy = function() {
    this.song.$delete({name:
      $stateParams.name}).then(function() {
        $state.go("index");
      });
  };
}

function RouterFunction ($stateProvider) {
  $stateProvider
.state("welcome", {
  url: "/",
  templateUrl: "/assets/js/ng-views/welcome.html"
})
  .state("index", {
    url: "/songs",
    templateUrl: "/assets/js/ng-views/index.html",
    controller: "songsIndexController",
    controllerAs: "vm"
  })
  .state("show", {
    url: "/songs/:name",
    templateUrl: "/assets/js/ng-views/show.html",
    controller: "songsShowController",
    controllerAs: "vm"
  });
}
