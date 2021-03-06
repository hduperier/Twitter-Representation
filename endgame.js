//import axios from '../node_modules/axios/dist/axios.js';

/*async function getTweets(){
        let result = await axios({
            method: 'get',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
            withCredentials: true,
        });
        let d = document.createElement("div");
    
        $('.tweet-append').append(d);
    
        for(let i=0;i<50;i++){
            let tweet = result.data[i];
            $('.tweet-append').append(tweetFormat(tweet));
    
        }
    
}
    
export function tweetFormat(tweet){
        let tweetF =  document.createElement("div");
        tweetF.id = tweet.id;
        tweetF.className = "box has-background-link has-text-white";
        tweetF.innerHTML = tweet.body;
    
        let author = document.createElement("p");
        author.innerHTML = "By: " + tweet.author;
}*/

/*async function f21() {
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });
    result.data.forEach(element => {
        $('.tweet-append').append(element.body);
    });
}
f21();*/


/*
Starting new Javascript attempt at Axios
*/



let tweets = [];
$(function () {
    main();
});

async function main() {
    tweets = await getTweets();
    for(let i=0; i<50; i++) {
        let tweetbody = tweets.data[i].body;
        let author = tweets.data[i].author;
        let likes = tweets.data[i].likeCount;
        let retweets = tweets.data[i].retweetCount;
        let replies = tweets.data[i].replyCount;
        let heart = tweets.data[i].isLiked ? `<div class="card-footer-item"><button class="heartButton" id="heart${i}" data="${i}"><i class="fa fa-heart" aria-hidden="true"></i>   ${likes} </button>  </div>`: `<div class="card-footer-item"><button class="heartButton" id="heart${i}" data="${i}"><i class="fa fa-heart-o" aria-hidden="true"></i>   ${likes}</button>  </div>`;
        let date = new Date(tweets.data[i].createdAt);
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let editTweet = tweets.data[i].isMine;
        let minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        let dateStr = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' ' + date.getHours() + ':' + minutes;
        $('#loadtweets').append(`      <br>              <div class="card" id="tweet${i}">
            <header class="card-header">
            <br>
            <p class="card-header-title">
            ${author}
            </p>
            <br>
            <p class="subtitle is-6"><br>${dateStr} &nbsp;&nbsp;&nbsp;&nbsp;</p>
            </header>
            <div class="card-content">
            <div class="content">
            ${tweetbody}
             <br>
            </div>
            </div>
            <footer class="card-footer">
            ${heart}
            <div class="card-footer-item"><button class="retweetButton" data="${i}"><i class="fa fa-retweet" aria-hidden="true"></i>  ${retweets}
            </button>  
            </button></div>
  
            <div class="card-footer-item"><button class="replyButton" data="${i}" data-target="#myModal"><i class="fa fa-reply" aria-hidden="true"></i>   ${replies}
            </button></div>
  
            </footer>
            <br>
            </div>
        `);
        if (editTweet) {
            $(`#tweet${i}` + " .card-footer").append(`<div class="card-footer-item"><button class="editButton" data="${i}"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp;Edit</button></div>`);
            $(`#tweet${i}` + " .card-header").append(`<div class="card-footer-item"><button class="deleteButton" data="${i}"><i class="fa trash-o" aria-hidden="true"></i>&nbsp;Delete</button></div>`);
        }
    }
    $('#homepage').on("click",".heartButton", handleHeartButtonPress);
    $('#homepage').on("click",".replyButton", sendReply);
    $('#homepage').on("click",".deleteButton", deleteTweet);
    $('#homepage').on("click",".editButton", renderEditTweet);
    $('#homepage').on("click",".retweetButton", renderRetweet);
    $('#homepage').on("click","#tweetbutton", sendTweet);
}

async function getTweets() {
    let result = await axios({
      method: 'get',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
      withCredentials: true,
    });

  return result;
}

async function tweetCreate(tweet) {
    const result = await axios({
      method: 'post',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
      withCredentials: true,
      data: {
        body: tweet,
      },
    });
    return result;
}

export async function tweetUpdate(id, newTweet) {
    const result = await axios({
      method: 'put',
      url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${id}`,
      withCredentials: true,
      data: {
        body: newTweet
      },
    });
    window.location.reload();
    return result;
}

export async function tweetDelete(id) {
    const result = await axios({
      method: 'delete',
      url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${id}`,
      withCredentials: true,
      });
    window.location.reload();
    return result;    
}

async function likeTweet(id) {
    await axios({
      method: 'put',
      url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${id}/like`,
      withCredentials: true,
    });
}

async function unlikeTweet(id) {
    await axios({
      method: 'put',
      url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${id}/unlike`,
      withCredentials: true,
    });
}

async function tweetReply(parentID, reply) {
    let result = await axios({
      method: 'post',
      url: "https://comp426-1fa20.cs.unc.edu/a09/tweets",
      withCredentials: true,
      data: {
        "type": "reply",
        "parent": parentID,
        "body": reply
      },
      });
    return result;
}

async function retweetTweet(parentID, body) {
    const result = await axios({
      method: 'post',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
      withCredentials: true,
      data: {
        "type": "retweet",
        "parent": parentID,
        "body": body
      },
    });
    return result;
}

const handleHeartButtonPress = async function(event) {
    event.preventDefault(); 
    let tweetIndex = $(event.currentTarget).attr("data");
    let tweetLikes;
    let isliked;
    
    const tweetData = await axios({
      method: 'get',
      url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweets.data[tweetIndex].id}`,
      withCredentials: true,
    }).then((response) =>  {
      tweetLikes = response.data.likeCount;
      isliked = response.data.isLiked;
  
      if (isliked) {
        $("#heart" + tweetIndex).replaceWith(`<button class="heartButton" id="heart${tweetIndex}" data="${tweetIndex}"><i class="fa fa-heart-o" aria-hidden="true"></i>   ${tweetLikes - 1}
        </button>`);
        unlikeTweet(response.data.id);
      } else {
        $("#heart" + tweetIndex).replaceWith(`<button class="heartButton" id="heart${tweetIndex}" data="${tweetIndex}"><i class="fa fa-heart" aria-hidden="true"></i>   ${tweetLikes + 1}
        </button>`);
        likeTweet(response.data.id);
      }
    
    });
    
};

const deleteTweet = async function(event) {
    event.preventDefault(); 
    let tweetIndex = $(event.currentTarget).attr("data");
    tweetDelete(tweets.data[tweetIndex].id);
};

const sendTweet = async function(event) {
    event.preventDefault(); 
    let tweet = $(".writetweet .textarea").val();
    if ((tweet.length != 0) && (tweet.length <= 250)) {
      $('.writetweet .textarea').val('');
      await tweetCreate(tweet);
      window.location.reload();
    }
};

const sendReply = async function(event) {
    event.preventDefault(); 
    let tweetIndex = $(event.currentTarget).attr("data");
    let parentID = tweets.data[tweetIndex].id;
    let replies = tweets.data[tweetIndex].replyCount;
    $("body").append(`    <div class="modal is-active" id="myModal">
    <div class="modal-background"></div>
    <div class="modal-content" id="modal-content">

      <div class="box">  
            <button class="modal-close is-large" aria-label="close"></button>

        <div class="writereply"> 
                              <textarea class="textarea" placeholder="Write your reply here!"></textarea>
      
                          <br>
                          <button class="button" id="finalReplyButton" data="${tweetIndex}">Reply</button><br>
                          <br>
    </div>
    </div>
  </div>   
  </div>
  `);    

  $( "#finalReplyButton" ).click(function() {
  
  let reply = $(".writereply .textarea").val();
    if ((reply.length != 0) && (reply.length <= 250)) {
      tweetReply(parentID, reply);
      $('textarea').val('');
      $(".replyButton").replaceWith(`<button class="replyButton" data="${tweetIndex}" data-target="#myModal"><i class="fa fa-reply" aria-hidden="true"></i>   ${replies + 1} 
      </button>
  `);

    }

  });
  $('.modal-close').click(function() {
  $('.modal').removeClass('is-active');

  });

  $('.modal-background').click(function() {
  $('.modal').removeClass('is-active');
  });

};

const renderRetweet = async function(event) {
    let tweetIndex = $(event.currentTarget).attr("data");
    let parent = tweets.data[tweetIndex].id;
    let retweetMsg = "RT @" + tweets.data[tweetIndex].author + " " + tweets.data[tweetIndex].body;
    let retweets = tweets.data[tweetIndex].retweetCount;
    retweetTweet(parent, retweetMsg);
    $(".retweetButton").replaceWith(`<button class="retweetButton" data="${tweetIndex}"><i class="fa fa-retweet" aria-hidden="true"></i>  ${retweets + 1}
    </button> 
  `);

}

const renderEditTweet = async function(event) {
    let tweetIndex = $(event.currentTarget).attr("data");
    $("#tweet" + tweetIndex + " .card-content").replaceWith(`<div class="writeedit"> 
    <textarea class="textarea" placeholder="${tweets.data[tweetIndex].body}"></textarea>
    </div>

    `);
    $("#tweet" + tweetIndex + " .card-footer").replaceWith(`<footer class="card-footer">
    <div class="card-footer-item"><button class="saveButton" data="${tweetIndex}">Save</button>  
    </footer>
    `);
    $( ".saveButton").click(function() {

        let reply = $(".writeedit .textarea").val();
        if (reply.length != 0) {
            tweetUpdate(tweets.data[tweetIndex].id, reply);
            $('textarea').val('');
        }
    }); 
}