import Chat from './Chat';

const server = 'wss://ahj-8-chat-back.herokuapp.com/';
const login = new Chat(server);

login.init();
