$(document).ready(function characterCount() {
  // $('textarea').on('keyup', function(){
  //})
  const input = document.getElementById("tweet-text");
  input.addEventListener("input", function () {
    let counterUpdate = document.getElementById("counter");
    let diff = 140 - document.getElementById("tweet-text").value.length;
    document.getElementById("counter").innerHTML = diff;
    if (diff <= 0) {
      counterUpdate.style.color = "red";
    } else {
      counterUpdate.style.color = "black";
    }
  });
});
