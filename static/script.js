let btn = document.querySelector("button");
let input = document.querySelector("input");
let messages = document.querySelector("#messages");

let nick = prompt("Podaj swój nick: ");
let playerColor = Math.round(0xffffff * Math.random()).toString(16);
let playerToIgnore = "";

let scrollbar;

function init() {
  scrollbar = new SimpleBar(document.getElementById("messages"));
  getMessages();
}

function sendMessage() {
  let msg = input.value;
  if (msg.trim() !== "" && msg[0] !== "/") {
    let data = {
      name: nick,
      time: new Date().toLocaleTimeString(),
      playerColor: playerColor,
      message: msg,
    };
    fetch("/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } else if (msg[0] === "/") {
    let command = msg.split(" ");
    switch (command[0]) {
      case "/nick":
        nick = command[1];
        break;
      case "/color":
        playerColor = command[1];
        break;
      case "/ignore":
        playerToIgnore = command[1];
        break;
      default:
        console.log("Command does not exist!");
        break;
    }
  }
  input.value = "";
}

async function getMessages() {
  let res = await fetch("/getMessages");
  if (res.status === 200) {
    console.log(`res: `, res);
    let data = await res.json();

    console.log(data);
    // messages.textContent = "";
    for (let msg of data) {
      if (msg.name !== playerToIgnore) {
        let div = document.createElement("div");
        div.classList.add("msg");

        //time
        {
          let span = document.createElement("span");
          span.textContent = `[${msg.time}] `;
          div.appendChild(span);
        }

        //nick
        {
          let span = document.createElement("span");
          span.textContent = `< @${msg.name} > `;
          span.style.color = `#${msg.playerColor}`;
          div.appendChild(span);
        }

        //message
        {
          let span = document.createElement("span");
          span.textContent = msg.message;
          $(span).emoticonize();

          div.appendChild(span);
        }

        //   div.textContent = `[${msg.time}] < @${msg.name} > ${msg.message}`;
        scrollbar.getContentElement().appendChild(div);
        let scroll = scrollbar.getScrollElement();
        scroll.scrollTop = scroll.scrollHeight;
      }
    }
  }

  getMessages();
}

// document.body.addEventListener("load", getMessages);
window.onload = init;
btn.addEventListener("click", sendMessage);
input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) sendMessage();
});
