//Button for adding Trains
var key=[];
var minsTo=[];
var nextTm=[];
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
      dateChanged: firebase.database.ServerValue.TIMESTAMP
    })
  }

});

database.ref().on("child_added", function (snap) {
  setTable(snap)
})

function setTable(snap) {
  var busName = snap.val().name;
  var busDest = snap.val().dest;
  var busFreq = snap.val().freq;
  var busFirst = snap.val().first;
  var timeDiff = moment(moment(), "HH:mm").diff(moment(busFirst, "HH:mm"), 'minutes');
  if (timeDiff < 0) { // if time is past 00:00 (midnight)
    timeDiff = 24 * 60 + timeDiff - 1;
  }
  var minutes = timeDiff % busFreq; // this shows the minutes after previous bus
  minutes = busFreq - minutes; // subtract from frequency to obtain minutes to next bus
  var timeOfNext = moment(moment(), "HH:mm").add(minutes, 'minutes').format("HH:mm")
  //Check if it is past 01:00 am (bus service stops at 01:00)
  if (moment(timeOfNext, "HH:mm").isBetween(moment("01:00", "HH:mm"), moment(busFirst, "HH:mm"))) {
    $("#bus-table > tbody").append("<tr><td>" + busName + "</td><td>" + 
    busDest + "</td><td>" +
      busFreq + "</td><td class='minsTo'>" +
       "No Bus after 1 am" + "</td><td class='nextTm'>" + 
       "First Bus at " + busFirst + "</td><td>" + 
       "<button data=" + snap.key + " class='btn btn-success material-icons btnUpdate'>update</button>" + "</td><td>" + 
       "<button data=" + snap.key + " class='btn btn-danger material-icons btnClear'>clear</button>" + "</td></tr>");
  } else {
    // Add each bus's data into the table
    $("#bus-table > tbody").append("<tr><td>" + busName + "</td><td>" + 
    busDest + "</td><td>" +
      busFreq + "</td><td class='minsTo'>" +
       minutes + "</td><td class='nextTm'>" + 
       timeOfNext + "</td><td>" + 
       "<button data=" + snap.key + " class='btn btn-success material-icons btnUpdate'>update</button>" + "</td><td>" +
       "<button data=" + snap.key + " class='btn btn-danger material-icons btnClear'>clear</button>" + "</td></tr>");
  }
  $("td").each(function () { $(this).addClass("text-center") });
  $("th").each(function () { $(this).addClass("text-center") });
}

// Function of Remove button in table (removes the bus from database and html)
$("#bus-table > tbody").on("click",".btnClear", function(){
  key=$(this).attr("data");
  database.ref(key).remove();  
  $(this).closest("tr").remove();
})

// Function of Update button in table (updates the bus time in html)
$("#bus-table > tbody").on("click",".btnUpdate", function(){
  key=$(this).attr("data");
  database.ref(key).child('dateChanged').set( firebase.database.ServerValue.TIMESTAMP)  
  $(this).closest("tr").children(".minsTo").text(minsTo);
  $(this).closest("tr").children(".nextTm").text(nextTm);
})


// When dateChanged modified bt Update button this is tirggered to update the specific table entries by settingthe global variables minsTo and nextTm using the global variable key (set upon clicking the update button)
database.ref().on("value", function (snap) {
  var busName = snap.val()[key].name;
  var busDest = snap.val()[key].dest;
  var busFreq = snap.val()[key].freq;
  var busFirst = snap.val()[key].first;
  var timeDiff = moment(moment(), "HH:mm").diff(moment(busFirst, "HH:mm"), 'minutes');
  if (timeDiff < 0) { // if time is past 00:00 (midnight)
    timeDiff = 24 * 60 + timeDiff - 1;
  }
  var minutes = timeDiff % busFreq; // this shows the minutes after previous bus
  minutes = busFreq - minutes; // subtract from frequency to obtain minutes to next bus
  var timeOfNext = moment(moment(), "HH:mm").add(minutes, 'minutes').format("HH:mm")
  //Check if it is past 01:00 am (bus service stops at 01:00)
  if (moment(timeOfNext, "HH:mm").isBetween(moment("01:00", "HH:mm"), moment(busFirst, "HH:mm"))) {
      minsTo="No Bus after 1 am";
      nextTm="First Bus at " + busFirst;
  } else {
      minsTo=minutes;
      nextTm=timeOfNext;
  }

})