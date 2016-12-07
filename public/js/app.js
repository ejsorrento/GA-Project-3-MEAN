angular
    .module("diddy", [
        "ui.router",
        "ngResource"
    ])
    .config(["$stateProvider",
        RouterFunction
    ])
    .controller("songsWelcomeController", [
        "Song",
        "$state",
        songsWelcomeControllerFunction
    ])
    .controller("songsShowController", [
        "$state",
        "$stateParams",
        "Song",
        songsShowControllerFunction
    ])
    .directive("piano", function(){
      return {
        templateUrl: 'assets/js/ng-views/piano/_piano.html',
        replace: true
      }
    })
    .directive("playSong", () => {
      return {
        restrict: 'E',
        replace: true,
        template: '<div ng-click="play(song)"></div>',
        scope: {
          name: "="
        },
        link: function(scope) {
          scope.play = function(song){
            console.log(song.sequence)
          }
        }
        }
    })
    .factory("Song", [
        "$resource",
        SongFactory
    ]);


function SongFactory($resource) {
    return $resource("/api/songs/:name", {}, {
        update: {
            method: "PUT"
        }
    });
}

function songsWelcomeControllerFunction(Song, $state) {

    this.songs = Song.query();
    notesHistory = [];
    storedSequence = [];
    keyboardPlay = true;
    this.newSong = new Song();
    this.visibility = {visible: false}
    this.visibilityForSongs = {visible: false}
    self = this;
    this.toggleListSongs = function(){
      this.visibilityForSongs.visible = !(this.visibilityForSongs.visible)
    }
    this.toggleNew = function() {
      this.visibility.visible = !(this.visibility.visible)
      keyboardPlay = !(keyboardPlay);
    };
    this.create = function() {
        this.newSong.sequence = storedSequence;
        this.newSong.$save().then(function(song) {
            self.songs = Song.query();
            $state.go("index");
        });
    };
}

function songsShowControllerFunction($state, $stateParams, Song) {
    var self = this;
    this.song = Song.get({
        name: $stateParams.name
    });
    this.update = function() {
        this.song.$update({
            name: $stateParams.name
        });
    };
    this.destroy = function() {
        this.song.$delete({
            name: $stateParams.name
        }).then(function() {
            $state.go("index");
        });
    };
    this.playback = function(){
      console.log(storedSequence)
      storedSequence = self.song.sequence
      console.log(storedSequence)
      replay()
    }
}

function RouterFunction($stateProvider) {
    $stateProvider
        .state("index", {
            url: "/",
            templateUrl: "/assets/js/ng-views/index.html",
            controller: "songsWelcomeController",
            controllerAs: "vm"
        })
        .state("show", {
            url: "/songs/:name",
            templateUrl: "/assets/js/ng-views/songs/show.html",
            controller: "songsShowController",
            controllerAs: "vm"
        });
}
