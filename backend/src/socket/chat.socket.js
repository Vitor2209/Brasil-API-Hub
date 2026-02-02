export default function initChatSocket(io) {
  io.on('connection', socket => {
    console.log('🟢 Usuário conectado:', socket.id);

    socket.on('join_room', ({ username, room }) => {
      socket.join(room);
      socket.username = username;
      socket.room = room;

      io.to(room).emit('system_message', {
        message: `${username} entrou na sala ${room}`
      });
    });

    socket.on('send_message', ({ message }) => {
      if (!socket.room) return;

      io.to(socket.room).emit('receive_message', {
        username: socket.username,
        message,
        time: new Date().toLocaleTimeString()
      });
    });

    socket.on('disconnect', () => {
      console.log('🔴 Usuário desconectado:', socket.id);

      if (socket.room) {
        io.to(socket.room).emit('system_message', {
          message: `${socket.username} saiu da sala`
        });
      }
    });
  });
}
