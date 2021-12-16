/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  // Test / driver code (temporary). Eventually will get this from the server.
  //   const data = [
  //     {
  //       user: {
  //         name: "Newton",
  //         avatars: "https://i.imgur.com/73hZDYK.png",
  //         handle: "@SirIsaac",
  //       },
  //       content: {
  //         text: "If I have seen further it is by standing on the shoulders of giants",
  //       },
  //       created_at: 1461116232227,
  //     },
  //     {
  //       user: {
  //         name: "Descartes",
  //         avatars: "https://i.imgur.com/nlhLi3I.png",
  //         handle: "@rd",
  //       },
  //       content: {
  //         text: "Je pense , donc je suis",
  //       },
  //       created_at: 1461113959088,
  //     },
  //   ];

  const escape = function (str) { //Escape security for XSS <script> input tags
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //input: tweet object, output: tweet <article> with HTML structure
  const createTweetElement = function (tweetData) {
    const safeHTML = `<p>${escape(tweetData.content.text)}</p>`; //safeHTML Input tag to insert & protect against cross site scripting
    //const HTML = tweetData.content.text; //tweet TEXT
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
    }
  };

  //renderTweets(data);

  $(".tweet-form").on(`submit`, function (event) {
    event.preventDefault();
    let diff = 140 - document.getElementById("tweet-text").value.length;
    let tweetData = document.getElementById("tweet-text").value;
    console.log('tweetData is', typeof tweetData, tweetData.length);
    $('.error-message').hide().removeClass('error-class');
    if (diff < 0) {//form validation for tweet chars exceeding 140
        $('.error-message').html(`<i class="fas fa-exclamation-triangle"></i> Too long, please respect limit of 140 chars. #kthxbye <i class="fas fa-exclamation-triangle"></i>`);
        $('.error-message').slideDown().addClass('error-class');
      return;
    }
    if (tweetData.length === 0 || tweetData === null) { //form validation for empty tweet
        $('.error-message').html(`<i class="fas fa-exclamation-triangle"></i> The tweet, is empty, please write something. #kthxbye <i class="fas fa-exclamation-triangle"></i>`)
        $('.error-message').slideDown().addClass('error-class');
      return;
    }
    console.log($('.error-message').hasClass('error-class'));

    if ($('.error-message').hasClass('error-class')){
        $('.error-message').slideUp().removeClass('error-class');
        return;
    }


    const data = $(`.tweet-form textarea`).serialize(); //serialize data
    
    $.ajax("/tweets", { method: "POST", data: data }).then(function ( //AJAX post request on tweet data
      tweetResult
    ) {
      console.log("Success: ", tweetResult);
      $.ajax("/tweets", { method: "GET" }).then(function (tweetDisplay) { //AJAX get request to get back tweet data and use renderTweets to display it on website
        renderTweets(tweetDisplay);
        console.log("Display:", tweetDisplay);
      });
    });
  });


  //fetches tweets from /tweets
  const loadtweets = function () {
    $.ajax("/tweets", { method: "GET" }).then(function (tweetDisplay) {
      renderTweets(tweetDisplay);
      console.log("Display:", tweetDisplay);
    });
  };

  loadtweets();
});
