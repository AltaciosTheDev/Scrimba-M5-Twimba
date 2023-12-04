//step 1: import tweets data from data.js file 
import {tweetsData} from "./data.js"
//step 4/5: import icons from font Awesome and add data attributes to the icons to be identifiable 
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

//step 6: declare the event listeners: listener will only call function when specific elements with type datasets are clicked. When this happens they will pass the tweet id to the function.
document.addEventListener("click", function(e){
//managed to narrow it down to 3 possible events, determined byt 3 possible icon types 
    if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)  
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)   
    }
    
    else if(e.target.id === "tweet-btn"){
        handleTweetBtnClick()
    }
})

//step 2: Declare function that will create the html string to render later on 
function getFeedHtml(){
    let feedHtml = ''
    tweetsData.forEach(function(tweet){
        
//step: 7: add contionally rendered style. First we change the data with the designated functions, and based on that data, we add additional conditions to render styles
    let likeIconClass = tweet.isLiked        ? "liked"     : ""
    let retweetIconClass = tweet.isRetweeted ? "retweeted" : ""
        
//step 8: add feedHtml to render the replies of each tweet
    let repliesHtml = ""
    if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                 repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
            ` 
        })
    }


        feedHtml+= `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-solid fa-comment-dots" data-reply="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail" >
                                <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>
            </div>
        `
    })
    return feedHtml
}

//step 3: Declare render funtion that will call upon the getFeedHtml 
function renderFeed(){
    document.getElementById("feed").innerHTML = getFeedHtml()
}
renderFeed()

//step 5: declare like function to like and dislike and show red color for liking
function handleLikeClick(tweetId){
    let targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
//takes out the element specified of the array 
    })[0]
    if(targetTweetObj.isLiked){
        targetTweetObj.likes --
    }
    else{
        targetTweetObj.likes ++
    }
//will be false(we add), then true(we subtract) and so on...
    targetTweetObj.isLiked = !targetTweetObj.isLiked
//when you change the data in the dataPool, you always have to render back....
    renderFeed()
}


//step 6: declare retweet function to like and dislike and show red color for liking
function handleRetweetClick(tweetId){
    let targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
//takes out the element specified of the array 
    })[0]
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets --
    }
    else{
        targetTweetObj.retweets ++
    }
//will be false(we add), then true(we subtract) and so on...
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
//when you change the data in the dataPool, you always have to render back....
    renderFeed()
}

//step 9: Declare the handleReply funtion to make the comments appear and dissapear
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle("hidden")
}

//step 10: Declare handle click button tweet function
function handleTweetBtnClick(){
    const tweetInput = document.getElementById("tweet-input")
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
            })
    }
    tweetInput.value = ""
    
    renderFeed()
}