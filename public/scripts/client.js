/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  const escape = function (str) {
    //Escape security for XSS <script> input tags
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //input: tweet object, output: tweet <article> with HTML structure
  const createTweetElement = function (tweetData) {
    const safeHTML = `<p>${escape(tweetData.content.text)}</p>`; //safeHTML Input tag to insert & protect against cross site scripting
    let $tweet = $(`<article class="tweet-article">
    <header>
    <div class="userdata">
        <div class="avatar-name">
            <img src='${tweetData.user.avatars}'/>
            <div id='nameOfUser'>${tweetData.user.name}</div>
        </div>
        <div id='handleOfUser'>${tweetData.user.handle}</div>
    </div> 
        <p class="tweet-text">${safeHTML}</p> 
    </header>
    <footer>
      <span class="need_to_be_rendered">${timeago.format(
        tweetData.created_at
      )}</span>
      <div>
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
      </div>
    </footer>
 </article>`);
    console.log(new Date(tweetData.created_at).toISOString());
    return $tweet; //return tweet article created
  };

  //input: array of tweet objects (<article>); output: appending objects to #tweets-container
  const renderTweets = function (tweets) {
    let result = "";
    // $('tweet-record').empty();
    for (let $tweet of tweets) {
      // loops through tweets
      let $returnedValue = createTweetElement($tweet); // calls createTweetElement for each tweet
      result = $(`#tweet-record`).prepend($returnedValue); // takes return value and appends it to the tweets container
      $('textarea').on('submit', function(event){

      })
    }
  };
//targeting tweet form to on submit event to perform the form validation
  $(".tweet-form").on(`submit`, function (event) {
    event.preventDefault();
    let diff = 140 - document.getElementById("tweet-text").value.length;
    let tweetData = document.getElementById("tweet-text").value;
    console.log("tweetData is", typeof tweetData, tweetData.length);
    $(".error-message").hide().removeClass("error-class");
    if (diff < 0) {
      //form validation for tweet chars exceeding 140
      $(".error-message").html(
        `<i class="fas fa-exclamation-triangle"></i> Too long, please respect limit of 140 chars. #kthxbye <i class="fas fa-exclamation-triangle"></i>`
      ); //html error message styling to display
      $(".error-message").slideDown().addClass("error-class");
      return;
    }
    if (tweetData.length === 0 || tweetData === null) {
      //form validation for empty tweet
      $(".error-message").html(
        `<i class="fas fa-exclamation-triangle"></i> The tweet, is empty, please write something. #kthxbye <i class="fas fa-exclamation-triangle"></i>`
      ); //html error message styling to display
      $(".error-message").slideDown().addClass("error-class");
      return;
    }
    console.log($(".error-message").hasClass("error-class"));

    if ($(".error-message").hasClass("error-class")) {
      //form to revert state if error-class class is still showing.
      $(".error-message").slideUp().removeClass("error-class"); //slideup/hide and removeclass error-class
      return;
    }

    const data = $(`.tweet-form textarea`).serialize(); //serialize data
//POST request  post data to /tweets and then get data, render and display it
    $.ajax("/tweets", { method: "POST", data: data })
        .then(function (tweetResult) {
        let tweetTextArea = $('#tweet-text');
        tweetTextArea.val("");
        let counter = $('#counter');
        counter.text(140);
      //AJAX post request on tweet data
      console.log("Success: ", tweetResult);
      $.ajax("/tweets", { method: "GET" })
        .then(function (tweetDisplay) {
        //AJAX get request to get back tweet data and use renderTweets to display it on website
        renderTweets(tweetDisplay);
        console.log("Display:", tweetDisplay);
      });
    });
  });

  //fetches tweets from /tweets using get request
  const loadtweets = function () {
    $.ajax("/tweets", { method: "GET" })
      .then(function (tweetDisplay) { 
      renderTweets(tweetDisplay);
      console.log("Display:", tweetDisplay);
    });
  };

  loadtweets();
});
