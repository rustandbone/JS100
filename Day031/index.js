const chatLog = document.getElementById('chat-log'),
  userInput = document.getElementById('user-input'),
  sendButton = document.getElementById('send-button'),
  buttonIcon = document.getElementById('button-icon'),
  info = document.querySelector('.info');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const message = userInput.value.trim();
  if (message === '') {
    return;
  } else if (message === 'developer') {
    userInput.value = '';
    appendMessage('user', message);
    setTimeout(() => {
      appendMessage('bot', 'This Source Coded By AsmrProg');
      buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
      buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
    }, 2000);
    return;
  }

  appendMessage('user', message);
  userInput.value = '';

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': `${key}`,
      'X-RapidAPI-Host': 'openai-api-gpt-3-5-turbo.p.rapidapi.com',
    },
    body: `{"model": "gemma-7b", "messages":[{"role": "user", "content": "${message}"}]}`,
    temperature: 0.5,
    top_p: 0.95,
    max_tokens: -1,
    use_cache: false,
    stream: false,
  };
  fetch(
    'https://openai-api-gpt-3-5-turbo.p.rapidapi.com/api/v1/chat/completions',
    options
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      appendMessage('bot', response.choices[0].message.content);
      buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
      buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'TypeError') {
        appendMessage('bot', 'Error: Check Your Api Key!');
        buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
        buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
      }
    });
}

function appendMessage(sender, message) {
  info.style.display = 'none';
  buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
  buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

  const messageElement = document.createElement('div');
  const iconElement = document.createElement('div');
  const chatElement = document.createElement('div');
  const icon = document.createElement('i');

  chatElement.classList.add('chat-box');
  iconElement.classList.add('icon');
  messageElement.classList.add(sender);
  messageElement.innerText = message;

  if (sender === 'user') {
    icon.classList.add('fa-regular', 'fa-user');
    iconElement.setAttribute('id', 'user-icon');
  } else {
    icon.classList.add('fa-solid', 'fa-robot');
    iconElement.setAttribute('id', 'bot-icon');
  }

  iconElement.appendChild(icon);
  chatElement.appendChild(iconElement);
  chatElement.appendChild(messageElement);
  chatLog.appendChild(chatElement);
  chatLog.scrollTop = chatLog.scrollHeight;
}
