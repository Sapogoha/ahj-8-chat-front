import Popover from './Popover';

export default class Login {
  constructor(server) {
    this.server = server;
    this.usernameEl = document.querySelector('.username__name');
    this.continueButton = document.querySelector('.username__continue-button');
    this.usernameForm = document.querySelector('.username');
    this.membersList = document.querySelector('.chat__members-list');
    this.messagesList = document.querySelector('.chat__messages');
    this.listOfUsers = [];
  }

  init() {
    this.continueButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.username = this.usernameEl.value.trim();
      if (this.username === '') {
        new Popover('empty', this.usernameEl).init();
      } else {
        this.ws = new WebSocket(this.server);
        this.ws.addEventListener('open', () => {
          this.ws.send(
            JSON.stringify({ event: 'newUser', message: this.username }),
          );
        });

        this.ws.addEventListener('message', (evt) => {
          const message = JSON.parse(evt.data);

          if (message.event === 'connect') {
            for (let i = 0; i < message.users.length; i += 1) {
              const a = { username: message.users[i], id: message.ids[i] };
              this.listOfUsers.push(a);
            }

            this.listOfUsers.forEach((user) => this.createUser(user.username, user.id));
            this.usernameForm.classList.add('hidden');
          } else if (message.event === 'error') {
            new Popover(message.error, this.usernameEl).init();
          } else if (
            message.event === 'notification - entered'
            && message.newUser !== this.username
          ) {
            this.messageFromBot(message.notification);
            this.createUser(message.newUser, message.id);
          } else if (
            message.event === 'notification - left'
            && message.leftUser !== this.username
          ) {
            this.messageFromBot(message.notification);
            this.removeUser(message.id);
          }
        });
      }
    });
  }

  createUser(username, id) {
    const chatMember = document.createElement('li');
    const picture = document.createElement('div');
    const name = document.createElement('div');

    chatMember.classList.add('chat__member');
    username === this.username
      ? chatMember.classList.add('user')
      : chatMember.classList.add('another-user');
    chatMember.dataset.id = `${id}`;
    picture.classList.add('member__picture');
    name.classList.add('member__name');
    name.textContent = username;

    chatMember.append(picture, name);
    this.membersList.appendChild(chatMember);
  }

  removeUser(id) {
    const toRemove = document.querySelector(`[data-id='${id}']`);
    toRemove.remove();
  }

  messageFromBot(text) {
    const message = document.createElement('li');
    const body = document.createElement('div');

    message.classList.add('chat__message');
    message.classList.add('bot');
    body.classList.add('message__body');
    body.textContent = text;

    message.appendChild(body);
    this.messagesList.appendChild(message);
  }
}
