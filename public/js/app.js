angular
    .module("diddy", [
        "ui.router",
        "ngResource"
    ])
    .config(["$stateProvider",
        RouterFunction
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

// function Piano() {
//   template: '<h1>Hi There!</h1>'
// }

function SongFactory($resource) {
    return $resource("/api/songs/:name", {}, {
        update: {
            method: "PUT"
        }
    });
}

function songsIndexControllerFunction(Song, $state) {
    this.songs = Song.query();
    this.newSong = new Song();
    this.create = function() {
        this.newSong.$save().then(function(song) {
            $state.go("show", {
                name: song.name
            });
        });
    };
    console.log("Hello")
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
