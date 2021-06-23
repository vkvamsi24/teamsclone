import io from 'socket.io-client';
 const sockets = io('https://serverteams.herokuapp.com/', { autoConnect: true, forceNew: true });
// const sockets = io('/');
export default sockets;
