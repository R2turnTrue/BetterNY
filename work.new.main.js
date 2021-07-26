const addChatMessageClient = (data, options) => {
		if (data.username !== "" && data.message.length <= 250 && data.username.length <= 50) {
			var $typingMessages = getTypingMessages(data);
			options = options || {};
			if ($typingMessages.length !== 0) {
				options.fade = false;
				$typingMessages.remove();
			}

			var $usernameDiv = $('<span class="username"/>').text(data.username).css("color", getUsernameColor(data.username));
			var $messageBodyDiv = $('<span class="messageBody">').text(data.message).css("background-color", "rgba(166, 248, 255, 30)");
			var $messageBodyDiv_del = $('<del><span class="messageBody">').text(data.message.replaceAll("~~", ""));
			var $messageBodyDiv_ita = $('<i><span class="messageBody">').text(data.message.replaceAll("*", ""));
			var $messageBodyDiv_bol = $('<B><span class="messageBody">').text(data.message.replaceAll("**", ""));
			var $messageBodyDiv_und = $('<U><span class="messageBody">').text(data.message.replaceAll("__", ""));

			var typingClass = data.typing ? "typing" : "";
			// BetterNY #0: YT Embed
			let $messageDiv;
			if (data.message.startsWith("https://www.youtube.com/watch?v=")) {
				$messageDiv = $('<li class="message"/>')
					.data("username", data.username)
					.addClass(typingClass)
					.append(
						$usernameDiv,
						$messageBodyDiv,
						$("<br/>"),
						$(
							`<iframe width="560" height="315" src="https://www.youtube.com/embed/${data.message.replace(
								"https://www.youtube.com/watch?v=",
								""
							)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""/>`
						)
					);
			} else if (data.message.startsWith("https://youtu.be")) {
				$messageDiv = $('<li class="message"/>')
					.data("username", data.username)
					.addClass(typingClass)
					.append(
						$usernameDiv,
						$messageBodyDiv,
						$("<br/>"),
						$(
							`<iframe width="560" height="315" src="https://www.youtube.com/embed/${data.message.replace(
								"https://youtu.be/",
								""
							)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""/>`
						)
					);
			}
			// 취소선
			else if (data.message.startsWith("~~") && data.message.endsWith("~~")) {
				$messageDiv = $('<li class="message"/>').data("username", data.username).addClass(typingClass).append($usernameDiv, $messageBodyDiv_del);
			}
			// 굵게
			else if (data.message.startsWith("**") && data.message.endsWith("**")) {
				$messageDiv = $('<li class="message"/>').data("username", data.username).addClass(typingClass).append($usernameDiv, $messageBodyDiv_bol);
			}
			// 기울림꼴
			else if (data.message.startsWith("*") && data.message.endsWith("*")) {
				$messageDiv = $('<li class="message"/>').data("username", data.username).addClass(typingClass).append($usernameDiv, $messageBodyDiv_ita);
			}
			// 밑줄
			else if (data.message.startsWith("__") && data.message.endsWith("__")) {
				$messageDiv = $('<li class="message"/>').data("username", data.username).addClass(typingClass).append($usernameDiv, $messageBodyDiv_und);
			} else {
				$messageDiv = $('<li class="message"/>').data("username", data.username).addClass(typingClass).append($usernameDiv, $messageBodyDiv);
			}

			addMessageElement($messageDiv, options);
		} else {
			//log("[ 도배 차단됨 ]");
		}
	};

function processCommand(username, msg) {
  console.log('Processing command: ' + msg)
  
  if(msg.startsWith('/help')) {
    addChatMessageClient({username: 'BetterNY Helper', message: '사용 가능 명령어: /테마 <Basic/Default/Dark/Dracula/Light/Ocean>'})
    return
  }
}

function initBetterNy() {
  
  const socket = io()
  
  /**
  @inject HEAD Command Feature
  */
  const oldSendMessage = sendMessage;
  sendMessage = function() {
    var message = $inputMessage.val();
    if(message.startsWith('/')) {
      processCommand(username, message);
      return
    }
    oldSendMessage.apply(oldSendMessage, arguments);
  }
  
}
