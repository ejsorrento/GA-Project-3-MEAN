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
    .directive("recorder", function(){
      return {
        templateUrl: 'assets/js/ng-views/recorder/_index.html',
        replace: true
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
    // this.songs = Song.query();
    this.newSong = new Song();
    this.newSong = {visible: false}
    this.toggleNew = function() {
      this.newSong.visible = !(this.newSong.visible)
      console.log(keyboardPlay)
      keyboardPlay = !(keyboardPlay);
      console.log(keyboardPlay)
    };
    this.create = function() {
      console.log("hit")
        // this.newSong.$save().then(function(song) {
        //     $state.go("show", {
        //         name: song.name
        //     });
        // });
    };
}

function songsShowControllerFunction($state, $stateParams, Song) {
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
            templateUrl: "/assets/js/ng-views/show.html",
            controller: "songsShowController",
            controllerAs: "vm"
        });
}
