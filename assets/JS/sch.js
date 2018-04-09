//Button for adding Trains
var config = {
  apiKey: "AIzaSyB8lP7rq2q9ME-ul5NHaao6dvX4XBJHd9E",
  authDomain: "hw-8-bussch.firebaseapp.com",
  databaseURL: "https://hw-8-bussch.firebaseio.com",
  projectId: "hw-8-bussch",
  storageBucket: "",
  messagingSenderId: "208435863409"
};
firebase.initializeApp(config);


// Create a variable to reference the database.
var database = firebase.database();

$("#add-bus-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var busName = $("#bus-name-input").val().trim();
  var busDest = $("#dest-input").val().trim();
  var busFreq = $("#freq-input").val().trim();
  var busFirst = $("#first-time").val().trim();

  // Clears all of the text-boxes
  $("#bus-name-input").val("");
  $("#dest-input").val("");
  $("#freq-input").val("");
  $("#first-time").val("");
  if (busName.length > 0) {
    database.ref().push({
      name: busName,
      dest: busDest,
      freq: busFreq,
      first: busFirst,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    })
  }

});

database.ref().on("child_added", function (snap) {
  var busName = snap.val().name;
  var busDest = snap.val().dest;
  var busFreq = snap.val().freq;
  var busFirst = snap.val().first;
  var timeDiff = moment(moment(), "HH:mm").diff(moment(busFirst, "HH:mm"), 'minutes');
  if (timeDiff < 0) { // if time is past 00:00 (midnight)
    timeDiff = 24 * 60 + timeDiff -1;
  }
  var minutes = timeDiff % busFreq; // this shows the minutes after previous bus
  minutes = busFreq - minutes; // subtract from frequency to obtain minutes to next bus
  var timeOfNext = moment(moment(), "HH:mm").add(minutes, 'minutes').format("HH:mm")
  //Check if it is past 01:00 am (bus service stops at 01:00)
  if (moment(timeOfNext, "HH:mm").isBetween(moment("01:00","HH:mm"),moment(busFirst, "HH:mm"))) {
    $("#bus-table > tbody").append("<tr><td>" + busName + "</td><td>" + busDest + "</td><td>" +
      busFreq + "</td><td>" + "No Bus after 1 am" + "</td><td>" + "First Bus at " + busFirst + "</td></tr>");
  } else {
    // Add each bus's data into the table
    $("#bus-table > tbody").append("<tr><td>" + busName + "</td><td>" + busDest + "</td><td>" +
      busFreq + "</td><td>" + minutes + "</td><td>" + timeOfNext + "</td></tr>");
  }
  $("td").each(function () { $(this).addClass("text-center") })
  $("th").each(function () { $(this).addClass("text-center") })

})