function rideHeight() {
    var userHeight = document.getElementById("userHeight").value; // Stores the input of user height to be used for the calculation

    // If the users height is left blank, the user will receive an error message asking for a correct input value.
    if (userHeight === '') {
        document.getElementById("rideResult").innerHTML = "<span class='error-message'>Please enter your height in inches in the field above.</span>";
        return;
    }

    // If the users height is less than 48 inches, the user will be notified that they are not tall enough to ride. Otherwise, the user will be shown they are tall enough.
    if (userHeight < 48) {
        document.getElementById("rideResult").innerHTML = "Sorry, you are not tall enough to ride!"
    } else {
        document.getElementById("rideResult").innerHTML = "You are tall enough to ride!"}
    }