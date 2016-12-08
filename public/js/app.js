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
    .directive("play", () => {
      return {
        replace: true,
        template: '<div ng-click="play()">Play</div>',
        scope: {
          song: "="
        },
        link: function(scope) {
          scope.play = function(song){
            recording = scope.song.sequence;
            console.log(recording)
            replay(recording)
          }
        }
      }
    })
    .factory("Song", [
        "$resource",
        SongFactory
    ])
    .filter('reverse', function() {
  return function(items) {
  return items.slice().reverse();
  };
});


function SongFactory($resource) {
    return $resource("/api/songs/:name", {}, {
        update: {
            method: "PUT"
        }
    });
}

function songsWelcomeControllerFunction(Song, $state) {
    self = this;
    this.songs = Song.query();
    notesHistory = [];
    storedSequence = [];
    keyboardPlay = true;
    this.newSong = new Song();
    this.visibility = {visible: false}
    this.visibilityForSongs = {visible: false}
    this.toggleListSongs = function(){
      this.visibilityForSongs.visible = !(this.visibilityForSongs.visible)
    }
    this.toggleNew = function() {
      this.visibility.visible = !(this.visibility.visible)
      keyboardPlay = !(keyboardPlay);
      clearSave();
    };
    this.create = function() {
        this.newSong.sequence = storedSequence;
        this.newSong.$save().then(function(song) {
            self.songs = Song.query();
            $state.go("index");
        });
        this.visibility = {visible: false}
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
        }).then(() => {
          $state.go("show", {
            name: this.song.name
          });
        });
    };
    this.destroy = function() {
        this.song.$delete({
            name: $stateParams.name
        }).then(function() {
            $state.go("index");
        });
    };
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
