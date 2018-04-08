//Button for adding Employees
var config = {
    apiKey: "AIzaSyBPKUJIpm5-WDZGD9-EJs3SmmlshvXIPew",
    authDomain: "berk-proj-1.firebaseapp.com",
    databaseURL: "https://berk-proj-1.firebaseio.com",
    projectId: "berk-proj-1",
    storageBucket: "berk-proj-1.appspot.com",
    messagingSenderId: "598442430608"
  };
  firebase.initializeApp(config);
  
  
  // Create a variable to reference the database.
  var database = firebase.database();
  
$("#add-employee-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#dest-input").val().trim();
    var trainFreq = $("#freq-input").val().trim();
    var trainFirst = $("#first-time").val().trim();
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#dest-input").val("");
    $("#freq-input").val("");
    $("#first-time").val("");

    database.ref().push({
        name:trainName,
        dest:trainDest,
        freq:trainFreq,
        first:trainFirst,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    })

  });

  database.ref().on("child_added", function(snap) {
    var trainName =snap.val().name;
    var trainDest = snap.val().dest;
    var trainFreq = snap.val().freq;
    var trainFirst = snap.val().first;
    var minutes = moment(moment(),"hh:mm").diff(moment(trainFirst,"hh:mm"),'minutes') % trainFreq;
    minutes=trainFreq-minutes;
    var timeOfNext = moment(moment(),"hh:mm").add(minutes, 'minutes').format("hh:mm")
     // Add each train's data into the table
     $("#employee-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
     trainFreq + "</td><td>" + minutes + "</td><td>" + timeOfNext + "</td></tr>");
  })