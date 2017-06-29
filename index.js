console.log('iPlayer Chatbot');

$(document).ready(function(){
  const inputBox = $(".textbox_div__input");
  const messagesDiv = $("#messages_div");
  const sendButton = $(".textbox_div__button");

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
      displayBotMessage(reply);
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

  function chooseReply(rawMessage) {
    const message = rawMessage.toLowerCase();

    if (message.includes('watch')) {
      return 'What mood are you in today?';
    }
    if (message.includes('happy')) {
      const programmeName = "Peter Kay's Comedy Shuffle ";
      const programmeLink = "http://www.bbc.co.uk/iplayer/episode/b08w8gfq/peter-kays-comedy-shuffle-series-2-episode-1";
      return `Okay, you might enjoy \n<a href='${programmeLink}'>${programmeName} <img class='programme-image' src='img/p03qq9lt.jpg'></a>`;
    }
    if (message.includes('thanks') || message.includes('thank you') || message.includes('thankyou')){
      return 'No, thank you :D';
    }

    return "I'm sorry I don't know how to answer that.";
  }
});
 //when is eastenders next on
 //whats on bbc 1 right now - link to live
 //how old are you? ?

 const responses = {

  trigger: "watch",
  response: "What mood are you in today?",
  children: [
    {
      trigger: "happy",
      message: "Here's a happy show you might enjoy"
    },
    {
      trigger: "sad",
      message: "Would you like to be cheered up?",
      children: [
        {
          trigger: "yes",
          message: "Here's a happy show for you to watch."
        },
        {
          trigger: "no",
          message: "Here's a sad for you to watch. Feel better soon!"
        }
      ]
    },
    {
      trigger: "angry",
      message: "Here's a happy show you might enjoy."
    },

  ]

 };
