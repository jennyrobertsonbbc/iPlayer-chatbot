console.log('iPlayer Chatbot');

$(document).ready(function(){
  const inputBox = $(".textbox_div__input");
  const messagesDiv = $("#messages_div");
  const sendButton = $(".textbox_div__button");

  var nextResponseObject = responses;

  displayBotMessage('Hello, I am the BBC iPlayer chatbot. Ask me a question.');

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

    chooseReply(message).then(function(chosenResponse){
      if( chosenResponse.hasOwnProperty('function')){

        eval(chosenResponse.function).then(function(functionResult) {
        displayBotMessage(chosenResponse.message + functionResult);
        });
      }
      else{
        displayBotMessage(chosenResponse.message);
      }
    });
  }


  function displayUserMessage(message) {
    const messageToSend = `<div class='message_wrapper'><span class="messages_div__message user">${message}</span></div>`;
    messagesDiv.append(messageToSend);
    inputBox.val('');
    messagesDiv.scrollTop(500);
  }

  function displayBotMessage(message) {
    const messageToSend = ` <div class='message_wrapper'><img class="bot_img" src="img/iPlayer-robot.png"><span class="messages_div__message bot">${message}</span><div>`;
    setTimeout(function(){
      messagesDiv.append(messageToSend);
      messagesDiv.scrollTop(500);
    },800);
  }


  function chooseReply(rawMessage){
    return new Promise((resolve, reject) => {
      const message = rawMessage.toLowerCase();
      nextResponseObject.forEach(function(response) {

        if (message.match(response.triggers)){
          if (response.hasOwnProperty('children') ) {
            nextResponseObject = response.children;
          }
          else {
            nextResponseObject = responses;
          }
          resolve(response);
        }
      });
      resolve("I'm sorry, I don't understand.");
    });
  }

});

function displayShow(pId) {

   return new Promise((resolve, reject) => {
    $.get(`https://ibl.api.bbci.co.uk/ibl/v1/programmes/${pId}`, function(data, status){
      console.log(data);
      const programmeName = data.programmes[0].title;
      const programmeLink = `http://www.bbc.co.uk/iplayer/episodes/${pId}`;
      const programmeImage = data.programmes[0].images.standard.replace('{recipe}','203x114');
      resolve( `<br><a href='${programmeLink}'>${programmeName} <img class='programme-image' src='${programmeImage}'></a>`);
    });
  });
}

function getCurrentShow(channel){
  return new Promise((resolve, reject) => {
    const programme = "EastEnders"
    const programmeLink = "http://www.bbc.co.uk/bbcone";
    const programmeImage = "img/eastenders.jpg";
    resolve( `${channel} is currently showing ${programme}.<br><a href='${programmeLink}'>Watch it Live on iPlayer!  <img class='programme-image' src='${programmeImage}'</a>`);
  });
}

const responses =
[
  {
    triggers: "watch|watching|recommend",
    message: "What mood are you in today?",
    children:
    [
      {
        triggers: "happy|cheerful",
        message: "Here's a happy show you might enjoy!",
        function: "displayShow('b08w8kt4')"
      },
      {
        triggers:"sad|upset",
        message: "Would you like to be cheered up?",
        children: [
          {
            triggers: "yes|yeah|sure",
            message: "Cool! Here's a funny programme for you!",
            function: "displayShow('b08w8kt4')"
          },
          {
            triggers:"no|nope|nah",
            message: "Here's a sad programme for you to watch. Feel better soon!",
            function: "displayShow('b08s7nyz')"
          }
        ]
      },
      {
        triggers:"angry|stressed",
        message: "Here's a programme to calm you down.",
        function: "displayShow('p02544td')"
      },
    ]
  },
  {
    triggers:"hello|hi|hiya|wowcha",
    message: "hello there"
  },
  {
    triggers:"goodbye|bye|see ya",
    message: "goodbye :,("
  },
  {
    triggers:"thanks|thank you|thankyou",
    message: "No, thank you :)"
  },
  {
    triggers:"(BBC|bbc) *(one|1)",
    message: '',
    function: "getCurrentShow('bbc1')"
  },
  {
    triggers:"(when|what time) is eastenders",
    message: "EastEnders is next showing on BBC One tonight at 7pm."
  },
  {
    triggers:"favourite|fave",
    message: 'My favourite programme is <a href="http://www.bbc.co.uk/iplayer/episode/p04sxvgw/can-a-robot-replace-ed-sheeran">\'Can A Robot Replace Ed Sheeran?\'</a>'
  },
  {
    triggers:"who created you",
    message:"Jenny did."
  },
  {
    triggers:"(directed|director).*poldark",
    message: "Poldark was directed by Joss Agnew. Here's the <a href='http://www.bbc.co.uk/programmes/b08vh083/credits'>full credits</a>."
  },
  {
    triggers: "^(ok|okay|kk|k|okay then)$",
    message: ":)"
  },
  {
    triggers:"what can I ask you|help|what can you do|what do you know",
    message: `You can ask me:<br><br>
    What shall I watch tonight?<br>
    What's on BBC One right now?<br>
    When is EastEnders on?<br>
    What's your favourite show?<br>
    Who directed Peep Show?
    `
  }
];
