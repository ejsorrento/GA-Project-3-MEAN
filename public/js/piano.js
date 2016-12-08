/*global $: true, setTimeout: true, setInterval: true, clearInterval: true */
var keyboardPlay = true;
var notesHistory = [];
var storedSequence = [];
var recording = false;
// (function () {
//     "use strict";

//Define private variables and functions
var sounds = {}, //sounds cache
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
    duration = [], //pressed keys along with duration for playBack

    unhightlightKeys = function() {
        setTimeout(function() {
            $('#keyboard .highlighted').removeClass('highlighted');
        }, 500);
    },

    highlightKey = function(key) {
        unhightlightKeys();

        //try fetch key element from cache, if not in cache, cache new key element
        if (!keys[key]) {
            keys[key] = $('#keyboard .' + key);
        }
        keys[key].addClass('highlighted');
    },

    playSound = function(key) {

        //try fetch sound element from cache, if not in cache, cache new sound element
        if (!sounds[key]) {
            sounds[key] = $('#sound' + key);
        }

        //always play sound from the beginning
        sounds[key][0].currentTime = 0;
        sounds[key][0].play();
    },

    pressKey = function() {
        return function(event) {
            if (keyboardPlay == true) {
                if (event.type == "keypress") {
                    var key = mapping[event.key]
                } else {
                    var key = $(event.currentTarget).data('note');
                }
                $noHistoryMsg.hide(); //doesnt work
                playSound(key);
                highlightKey(key);
                if (recording == true) {
                    duration[duration.length - 1] = event.timeStamp - duration[duration.length - 1]
                    duration.push(event.timeStamp)
                    notesHistory.push([key]);
                } //if I want to record key clicks try putting this in playsound
            };
        }
    },

    //replay all notes that had been previously played
    replay = function(recording = storedSequence) {

        var index = 0,
            interval = null,
            intervalTime = recording[index][1],
            intervalPlay = () => {
                console.log(intervalTime)
                interval = setInterval(function() {
                    if (index < recording.length) {
                        playSound(recording[index][0]);
                        highlightKey(recording[index][0]);
                        index += 1;
                        interval1();
                    } else {
                        //clear interval when all recorded notes are played
                        clearInterval(interval);
                        unhightlightKeys();
                    }
                }, intervalTime);
            },
            interval1 = () => {
                console.log(recording[index])
                clearInterval(interval);
                if (index < recording.length) {
                    intervalTime = recording[index][1];
                    intervalPlay();
                }
            };

        if (recording.length > 0) {
            console.log(recording)
            $noHistoryMsg.hide();
            //loops through the sequence with duration

            //replay all notes in the first item of each subarray in the storedSequence array, for a duration in miliseconds that is stored in the second item of each said subarray
            intervalPlay();
        }
    },

    updateSource = function() {
        var source = document.getElementById('mp3Source');
        source.src = ''
    },

    startRecord = (event) => {
        $('#stopRecord').css("display", "inline-block")
        $(event.currentTarget).css("display", "none");
        notesHistory = [];
        recording = true;
        duration = [event.timeStamp];
    },

    stopRecord = (event) => {
        $(event.currentTarget).hide();
        $("#replayBtn").show();
        $("#resetBtn").show();
        $("#saveBtn").show();
        duration.pop()
        console.log(duration)
        console.log(notesHistory)
        for (var i = 0; i < duration.length; i++) {
            notesHistory[i].push(Math.floor(duration[i]))
        }
        storedSequence = notesHistory
        console.log(storedSequence)
        recording = false;
    },

    clearSave = function(){
      $('#replayBtn').hide()
      $('#resetBtn').hide()
    },

    showRecord = function(){
      $('#RecordBtn').show()
    }

    //empty notesHistory array
    clearNotesHistory = function(event) {
        $(event.currentTarget).hide()
        $("#startRecord").show()
        $("#replayBtn").hide()
        $("#saveBtn").hide()
        storedSequence = [];
    };

//Bind events
$(document).keypress(pressKey())
$(document).on('click', '.whitekey', pressKey())
$(document).on('click', '#replayBtn', function(){
  replay(storedSequence)
});
$(document).on('click', '#resetBtn', clearNotesHistory);
$(document).on('click', '#startRecord', startRecord)
$(document).on('click', '#stopRecord', stopRecord)
$(document).on('click', "#cancelBtn", showRecord)
$(document).on('click', "#submitBtn", showRecord)
