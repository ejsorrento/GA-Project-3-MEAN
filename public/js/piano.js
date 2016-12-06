/*global $: true, setTimeout: true, setInterval: true, clearInterval: true */
var keyboardPlay = true;
var notesHistory = [];
var storedSequence = [];
(function () {
    "use strict";

    //Define private variables and functions
    var sounds = {},  //sounds cache
        keys = {}, //keys cache
        // notesHistory = [], //played notes history
        $noHistoryMsg = $('#noHistoryMessage'),
        // Mapping of keypresses to keynotes
        mapping = {
          "q": "C",
          "w": "D",
          "e": "E",
          "r": "F",
          "t": "G",
          "y": "A",
          "u": "B",
          "2": "Cs",
          "3": "Ds",
          "5": "Fs",
          "6": "Gs",
          "7": "As"
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
                sounds[key] = $('#sound' + key);
            }

            //always play sound from the beginning
            sounds[key][0].currentTime = 0;
            sounds[key][0].play();
        },

        pressKey = function () {
            return function (event) {
              if (keyboardPlay === true){
                if (event.type == "keypress"){
                  var key = mapping[event.key];
                } else {
                var key = $(event.currentTarget).data('note');
              }
                $noHistoryMsg.hide();

                playSound(key);
                highlightKey(key);

                notesHistory.push(key);
                console.log(notesHistory);
            }
          };
        },

        //replay all notes that had been previously played
        replay = function () {
            var index = 0,
                interval = null;

            if (notesHistory.length > 0) {
                $noHistoryMsg.hide();
                //loops through the sequence with duration

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
          source.src='';
        },

        startRecord = () => {
          notesHistory = [];
        },

        stopRecord = () => {
          storedSequence = notesHistory;
          console.log(storedSequence);

        },

        //empty notesHistory array
        clearNotesHistory = function () {
            $noHistoryMsg.show();
            notesHistory = [];
        };

    //Bind eventsg
    $(document).keypress(pressKey());
    $(document).on('click', '.whitekey', pressKey());
    $(document).on('click', '.blackkey', pressKey());
    $(document).on('click', '#replayBtn',replay);
    $(document).on('click', '#resetBtn', clearNotesHistory);
    $(document).on('click', '#startRecord', startRecord);
    $(document).on('click', '#stopRecord', stopRecord);
    // $(document).on('click', '#submit', function(){
    //   console.log(notesHistory)
    //   $.ajax({
    //     type: "POST",
    //     url: "/api/songs",
    //     dataType: 'json',
    //     data: {
    //       name: "hello",
    //       sequence: notesHistory,
    //       credit: $('#credit').val()
    //     }
    //   }).done((response) => {
    //     console.log(response)
    //   })
    // })
})();
