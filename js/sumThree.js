function sumThreeNumbers() {
    var num1 = document.getElementById("num1").value;
    var num2 = document.getElementById("num2").value;
    var num3 = document.getElementById("num3").value;

    if (num1 === '' || num2 === '' || num3 === '') {
        document.getElementById("sumResult").innerHTML = "<span class='error-message'>Please enter numeric values in all fields.</span>";
        return;
    }
    
    var sum = Number(num1) + Number(num2) + Number(num3);
    
    document.getElementById("sumResult").innerHTML = "The sum is: " + sum; 
}