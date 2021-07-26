// no more jquery
var FADE_TIME = 150;
	var TYPING_TIMER_LENGTH = 400;
	var COLORS = ["#e21400", "#91580f", "#f8a700", "#f78b00", "#58dc00", "#287b00", "#a8f07a", "#4ae8c4", "#3b88eb", "#3824aa", "#a700ff", "#d300e7"];

function $(name) {
  return document.querySelector(name);
}

	var $window = $(window);
	var $usernameInput = $(".usernameInput");
	var $messages = $(".messages");
	var $inputMessage = $(".inputMessage");

	var $loginPage = $(".login.page");
	var $chatPage = $(".chat.page");

	var username;
	var connected = false;
	var typing = false;
	var lastTypingTime;
	var $currentInput = $usernameInput.focus();

	var socket = io();

	var onCooldown = false;

	function rename(data) {
		username = cleanInput(data);
		socket.emit("rename", username);
	}

function fadeOutEffect(fadeTarget) {
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 200);
}

	const addParticipantsMessage = data => {
		var message = "";
		if (data.numUsers === 1) {
			message += "[ Online | 1 ]";
		} else {
			message += "[ Online | " + data.numUsers + " ]";
		}
		log(message);
	};

	const setUsername = () => {
		username = cleanInput($usernameInput);

		if (username) {
			fadeOutEffect($loginPage)
      $chatPage.style.display = "none" })
			//$loginPage.off("click");
			$currentInput = $inputMessage.focus();

			socket.emit("add user", username);
		}
	};

	const sendMessage = () => {
		if (onCooldown) return;
		else {
			// do stuff;
			var message = $inputMessage.value;

			message = cleanInput(message);

			if (message && connected) {
				$inputMessage.value = ""
				addChatMessage({
					username: username,
					message: message,
				});

				socket.emit("new message", message);
			}

			onCooldown = true;
			setTimeout(function () {
				onCooldown = false;
			}, 1000);
		}
	};

	const log = (message, options) => {
		var $el = document.createElement("li")
    $el.classList.add("log")
    $el.innerHTML = message
		addMessageElement($el, options);
	};

// work here
	const addChatMessage = (data, options) => {
		if (data.username !== "" && data.message.length <= 250 && data.username.length <= 50) {
			var $typingMessages = getTypingMessages(data);
			options = options || {};
			if ($typingMessages.length !== 0) {
				options.fade = false;
				$typingMessages.remove();
			}

			var $usernameDiv = $('<span class="username"/>').text(data.username).css("color", getUsernameColor(data.username));
			var $messageBodyDiv = $('<span class="messageBody">').text(data.message);
			var $messageBodyDiv_del = $('<del><span class="messageBody">').text(data.message.replaceAll("~~", ""));
			var $messageBodyDiv_ita = $('<i><span class="messageBody">').text(data.message.replaceAll("*", ""));
			var $messageBodyDiv_bol = $('<B><span class="messageBody">').text(data.message.replaceAll("**", ""));
			var $messageBodyDiv_und = $('<U><span class="messageBody">').text(data.message.replaceAll("__", ""));

			var typingClass = data.typing ? "typing" : "";
			// BetterNY #0: YT Embed
			let $messageDiv;
			if (data.message.startsWith("https://www.youtube.com")) {
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

	const addChatTyping = data => {
		data.typing = true;
		data.message = "Is Typing...";
		addChatMessage(data);
	};

	const removeChatTyping = data => {
		getTypingMessages(data).fadeOut(function () {
			$(this).remove();
		});
	};

	const addMessageElement = (el, options) => {
		var $el = $(el);

		if (!options) {
			options = {};
		}
		if (typeof options.fade === "undefined") {
			options.fade = true;
		}
		if (typeof options.prepend === "undefined") {
			options.prepend = false;
		}

		if (options.fade) {
			$el.hide().fadeIn(FADE_TIME);
		}
		if (options.prepend) {
			$messages.prepend($el);
		} else {
			$messages.append($el);
		}
		$messages[0].scrollTop = $messages[0].scrollHeight;
	};

	const cleanInput = input => {
    let i = document.createElement("div")
    i.innerHTML = input
    return i
		//return $("<div/>").text(input).html();
	};

	const updateTyping = () => {
		if (connected) {
			if (!typing) {
				typing = true;
				socket.emit("typing");
			}
			lastTypingTime = new Date().getTime();

			setTimeout(() => {
				var typingTimer = new Date().getTime();
				var timeDiff = typingTimer - lastTypingTime;
				if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
					socket.emit("stop typing");
					typing = false;
				}
			}, TYPING_TIMER_LENGTH);
		}
	};

	const getTypingMessages = data => {
		return $(".typing.message").filter(function (i) {
			return $(this).data("username") === data.username;
		});
	};

	const getUsernameColor = username => {
		var hash = 7;
		if (username) {
			for (var i = 0; i < username.length; i++) {
				hash = username.charCodeAt(i) + (hash << 5) - hash;
			}
		}

		var index = Math.abs(hash % COLORS.length);
		return COLORS[index];
	};

	$window.keydown(event => {
		if (!(event.ctrlKey || event.metaKey || event.altKey)) {
			$currentInput.focus();
		}

		if (event.which === 13) {
			if (username) {
				sendMessage();
				socket.emit("stop typing");
				typing = false;
			} else {
				setUsername();
			}
		}
	});

	$inputMessage.on("input", () => {
		updateTyping();
	});

	$loginPage.click(() => {
		$currentInput.focus();
	});

	$inputMessage.click(() => {
		$inputMessage.focus();
	});

	socket.on("login", data => {
		connected = true;

		var message = "Welcome To NY Chat";
		log(message, {
			prepend: true,
		});
		addParticipantsMessage(data);
	});

	socket.on("new message", data => {
		// 		addChatMessage(data);
		let before = "";

		// BetterNY #1: username limit
		if (data.username !== "" && data.message.length <= 100 && data.username.length <= 50 && data.message.startsWith(before)) {
			before = data.message;
			addChatMessage(data);
		} else {
			//log("[ 도배 차단됨 ]");
		}
	});

	socket.on("user joined", data => {
		console.log("[ " + data.username + " Is Joined The Chat Room ]");
		log("[ " + data.username + " Is Joined The Chat Room ]");
		addParticipantsMessage(data);
	});

	socket.on("user left", data => {
		console.log("[ " + data.username + " Is Left The Chat Room ]");
		log("[ " + data.username + " Is Left The Chat Room ]");
		addParticipantsMessage(data);
		removeChatTyping(data);
	});

	socket.on("typing", data => {
		//		addChatTyping(data);
	});

	socket.on("stop typing", data => {
		//		removeChatTyping(data);
	});

	socket.on("disconnect", () => {
		log("[ You have been disconnected ]");
	});

	socket.on("reconnect", () => {
		log("[ You have been reconnected ]");
		if (username) {
			socket.emit("add user", username);
		}
	});

	socket.on("reconnect_error", () => {
		log("[ Attempt to reconnect has failed ]");
	});
