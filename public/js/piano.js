/*global $: true, setTimeout: true, setInterval: true, clearInterval: true */
var keyboardPlay = true;

(function () {
    "use strict";

    //Define private variables and functions
    var sounds = {},  //sounds cache
        keys = {}, //keys cache
        notesHistory = [], //played notes history
        $noHistoryMsg = $('#noHistoryMessage'),
        // Mapping of keypresses to keynotes
        mapping = {
          "q": "c",
          "w": "d",
          "e": "e",
          "r": "f",
          "t": "g",
          "y": "a",
          "u": "b"
        },

        unhightlightKeys = function () {
            setTimeout(function () {
                $('#keyboard .highlighted').removeClass('highlighted');
            }, 500);
        },

        highlightKey = function (key) {
            unhightlightKeys();

            //try fetch key element from cache, if not in cache, cache new key element
            if (!keys[key]) {
                    keys[key] = $('#keyboard .' + key);
            }
            keys[key].addClass('highlighted');
        },

        playSound = function (key) {

            //try fetch sound element from cache, if not in cache, cache new sound element
            if (!sounds[key]) {
                sounds[key] = $('#sound' + key.toUpperCase());
            }

            //always play sound from the beginning
            sounds[key][0].currentTime = 0;
            sounds[key][0].play();
        },

        pressKey = function () {
            return function (event) {
              if (keyboardPlay == true){
                if (event.type == "keypress"){
                  var key = mapping[event.key]
                } else {
                var key = $(event.currentTarget).data('note');
              }
                $noHistoryMsg.hide();

                playSound(key);
                highlightKey(key);

                notesHistory.push(key);
                console.log(notesHistory)
            };
          }
        },

        //replay all notes that had been previously played
        replay = function () {
            var index = 0,
                interval = null;

            if (notesHistory.length > 0) {
                $noHistoryMsg.hide();

                //replay all notes in notesHistory array for 1.5 second each
                interval = setInterval(function () {

                    if (index < notesHistory.length) {
                        playSound(notesHistory[index]);
                        highlightKey(notesHistory[index]);
                        index += 1;
                    } else {
                        //clear interval when all recorded notes are played
                        clearInterval(interval);
                        unhightlightKeys();
                    }

                }, 1500);
            }
        },

        updateSource = function () {
          var source = document.getElementById('mp3Source');
          source.src=''
        },

        //empty notesHistory array
        clearNotesHistory = function () {
            $noHistoryMsg.show();
            notesHistory = [];
        };

    //Bind eventsg
    $(document).keypress(pressKey())
    $(document).on('click', '.whitekey', pressKey());
    $(document).on('click', '#replayBtn',replay);
    $(document).on('click', '#resetBtn', clearNotesHistory);
    $(document).on('click', '#saveBtn', updateSource);
    //   $.ajax({
    //     type: "POST",
    //     url: "/api/songs",
    //     data: {song: [notesHistory]}
    //   })
    // }
}())
