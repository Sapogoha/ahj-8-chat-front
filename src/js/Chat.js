import Login from './Login';

export default class Chat {
  constructor(server) {
    this.server = server;
    this.messagesList = document.querySelector('.chat__messages');
    this.chatForm = document.querySelector('.chat__form');
    this.chatInput = document.querySelector('.chat__input');
    this.login = new Login(server);

    this.sendMessage = this.sendMessage.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
  }

  init() {
    this.login.init();
    this.chatForm.addEventListener('submit', this.sendMessage);
  }

  sendMessage(event) {
    event.preventDefault();
    this.message = this.chatInput.value;
    this.chatInput.value = '';
    const timestamp = Date.now();

    this.login.ws.send(
      JSON.stringify({
        event: 'newMessage',
        message: this.message,
        username: this.login.username,
        timestamp,
      }),
    );

    this.login.ws.addEventListener('message', this.receiveMessage);
  }

  receiveMessage(evt) {
    const data = JSON.parse(evt.data);
    const {
      event, message, username, id, timestamp,
    } = data;
    if (event === 'newMessage') {
      this.newMessage(username, message, id, timestamp);
    }
  }

  newMessage(user, text, id, timestamp) {
    const message = document.createElement('li');
    const header = document.createElement('div');
    const body = document.createElement('div');

    message.classList.add('chat__message');
    this.renderDate(timestamp);
    if (this.login.username === user) {
      message.classList.add('user');
      header.textContent = `You, ${this.created}`;
    } else {
      message.classList.add(`${id}`);
      header.textContent = `${user}, ${this.created}`;
    }

    header.classList.add('message__header');
    body.classList.add('message__body');
    body.textContent = text;

    message.append(header, body);
    this.messagesList.appendChild(message);
  }

  renderDate(timestamp) {
    const date = new Date(timestamp);

    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    this.created = `${hours}:${mins} ${day}.${month}.${year}`;
  }
}
