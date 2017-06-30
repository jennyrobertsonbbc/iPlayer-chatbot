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
      if( !chosenResponse )
      {
        displayBotMessage("I'm sorry, I don't understand. Try typing 'help'.");
        return;
      }
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
      resolve();
    });

  }

  $(document).on('click', '.chatbot-help-link', function(){
    message = $(this).text();
    processInput(message);
  });

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

function getCurrentShow(channelId){
  return new Promise((resolve, reject) => {
    $.get(`https://ibl.api.bbci.co.uk/ibl/v1/channels/${channelId}/broadcasts`, function(data, status){
      const channelName = data.broadcasts.channel.title;
      const programmeData = data.broadcasts.elements[0];
      const programmeName = programmeData.episode.title;
      const programmeLink = `http://www.bbc.co.uk/${getChannelLiveLink(channelId)}`;
      const programmeImage = programmeData.episode.images.standard.replace('{recipe}','203x114');
      resolve( `${channelName} is currently showing <strong>${programmeName}</strong>.<br><a href='${programmeLink}'>Watch it Live on iPlayer!  <img class='programme-image' src='${programmeImage}'</a>`);
    });
  });
}

function getChannelLiveLink(channelId){
  switch (channelId){
    case 'bbc_one_london':
      return 'bbcone';
    case 'bbc_two_england':
      return 'bbctwo';
    case 'bbc_four':
      return 'bbcfour';
    case 'cbbc':
      return 'tv/cbbc';
    case 'cbeebies':
      return 'tv/cbeebies';
    case 'bbc_news24':
      return 'tv/bbcnews';
    case 'bbc_parliament':
      return 'tv/bbcparliament';
    case 'bbc_alba':
      return 'tv/bbcalba';
    case 's4cpbs':
      return 'tv/s4c';
  }
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
    function: "getCurrentShow('bbc_one_london')"
  },
    {
    triggers:"(BBC|bbc) *(two|2)",
    message: '',
    function: "getCurrentShow('bbc_two_england')"
  },
    {
    triggers:"(BBC|bbc) *(four|4)",
    message: '',
    function: "getCurrentShow('bbc_four')"
  },
    {
    triggers:"cbbc",
    message: '',
    function: "getCurrentShow('cbbc')"
  },
  {
    triggers:"cbeebies",
    message: '',
    function: "getCurrentShow('cbeebies')"
  },
  {
    triggers:"news",
    message: '',
    function: "getCurrentShow('bbc_news24')"
  },
   {
    triggers:"parliament",
    message: '',
    function: "getCurrentShow('bbc_parliament')"
  },
   {
    triggers:"alba",
    message: '',
    function: "getCurrentShow('bbc_alba')"
  },
   {
    triggers:"s4c",
    message: '',
    function: "getCurrentShow('s4cpbs')"
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
    triggers: "what channel is doctor'*s",
    message: "Doctors is on BBC One. Here's the programmes page:",
    function: "displayShow('b006mh9v')"
  },
  {
    triggers: "why .*sign *in",
    message: `Because without signing in, you'll be unable to play programmes or choose to benefit from the personalised features that BBC iPlayer offers.<br><br>
    You won't have to sign in every time you visit BBC iPlayer as you should stay signed in for two years on each web browser or app.<br><br>
    <a href="https://www.bbc.co.uk/iplayer/help/latest-news/account-signin">Find out more</a>
     `
  },
  {
    triggers:"what can I ask you|help|what can you do|what do you know",
    message: `You can ask me:<br><br>
    <a href="#" class="chatbot-help-link">What shall I watch tonight?<a/><br>
    <a href="#" class="chatbot-help-link">What's on BBC One right now?<a/><br>
    <a href="#" class="chatbot-help-link">When is EastEnders on?<a/><br>
    <a href="#" class="chatbot-help-link">What's your favourite show?<a/><br>
    <a href="#" class="chatbot-help-link">Who directed Poldark?<a/><br>
    <a href="#" class="chatbot-help-link">What channel is Doctors on?<a/><br>
    <a href="#" class="chatbot-help-link">Why do I have to sign in to iPlayer?<a/>
    `
  }
];


