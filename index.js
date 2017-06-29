console.log('iPlayer Chatbot');

$(document).ready(function(){
  const inputBox = $(".textbox_div__input");
  const messagesDiv = $("#messages_div");
  const sendButton = $(".textbox_div__button");

  var nextResponseObject = responses;

  displayBotMessage('Hello, I am the BBC iPlayer chatbot. Ask me a question.');
  inputBox.val('What shall I watch today?');

  sendButton.click(function() {
    processInput (inputBox.val());
  });

  inputBox.keypress(function( event ) {
    if ( event.which == 13 ) {
      processInput (inputBox.val());
    }
  });

  function processInput (message) {
    displayUserMessage(message);

    const reply = chooseReply(message);

    reply.then(function (result) {
        displayBotMessage(result);
    });
  }

  function displayUserMessage(message) {
    const messageToSend = `<div class='message_wrapper'><span class="messages_div__message user">${message}</span></div>`;
    messagesDiv.append(messageToSend);
    inputBox.val('');
    messagesDiv.scrollTop(500);
  }

  function displayBotMessage(message) {
    const messageToSend = ` <div class='message_wrapper'><img class="bot_img" src="img/bot.png"><span class="messages_div__message bot">${message}</span><div>`;
    setTimeout(function(){
      messagesDiv.append(messageToSend);
      messagesDiv.scrollTop(500);
    },800);
  }

  function chooseReply(rawMessage){
    return new Promise((resolve, reject) => {
      const message = rawMessage.toLowerCase();

      nextResponseObject.forEach(function(response) {


        response.triggers.forEach(function(trigger) {
          if (message.includes(trigger)){
            if ( response.hasOwnProperty('children') ) {
              nextResponseObject = response.children;
            }
            else {
              nextResponseObject = responses;
            }
            resolve(response.message);
          }
        });
      });
      resolve("I'm sorry, I don't understand.");
    });
  }

});
 //when is eastenders next on
 //whats on bbc 1 right now - link to live
 //how old are you? ?

function getHappyShow() {
  const programmeName = "Peter Kay's Comedy Shuffle ";
  const programmeLink = "http://www.bbc.co.uk/iplayer/episode/b08w8gfq/peter-kays-comedy-shuffle-series-2-episode-1";
  const programmeImage = "img/p03qq9lt.jpg";
  return `<br><a href='${programmeLink}'>${programmeName} <img class='programme-image' src='${programmeImage}'></a>`;
}

function getCalmingShow() {
  const programmeName = "Planet Earth II";
  const programmeLink = "http://www.bbc.co.uk/iplayer/episode/b087y9wf/planet-earth-ii-a-world-of-wonder";
  const programmeImage = "img/planetearth.jpg";
  return `<br><a href='${programmeLink}'>${programmeName} <img class='programme-image' src='${programmeImage}'></a>`;
}

function getSadShow() {
  const programmeName = "Broken";
  const programmeLink = "http://www.bbc.co.uk/iplayer/episode/b08wzctf/broken-series-1-episode-5";
  const programmeImage = "img/broken.jpg";
  return `<br><a href='${programmeLink}'>${programmeName} <img class='programme-image' src='${programmeImage}'></a>`;
}

const responses =
[
  {
    triggers: ["watch", "watching"],
    message: "What mood are you in today?",
    children:
    [
      {
        triggers: ["happy","cheerful"],
        message: "Here's a happy show you might enjoy!" + getHappyShow()
      },
      {
        triggers:[ "sad", "upset"],
        message: "Would you like to be cheered up?",
        children: [
          {
            triggers:[ "yes", "yeah", "yep"],
            message: "Cool! Here's a funny programme for you!" + getHappyShow()
          },
          {
            triggers:[ "no", "nope", "nah"],
            message: "Here's a sad programme for you to watch. Feel better soon!" + getSadShow()
          }
        ]
      },
      {
        triggers:[ "angry", "stressed"],
        message: "Here's a programme to calm you down." + getCalmingShow()
      },
    ]
  },
  {
    triggers:[ "hello", "hi", "hiya", "yo"],
    message: "hello there"
  },
  {
    triggers:[ "goodbye", "bye", "see ya"],
    message: "goodbye :,("
  },
  {
    triggers:[ "thanks", "thank you", "thankyou"],
    message: "No, thank you :)"
  },
];
