import {Socket} from 'socket.io';
class SocketService {
    private socket: Socket | null = null

    public listen(socket: Socket) {
        this.registerSocket()
        socket.on('message', (m: Message) => {
            console.log('[server](message): %s', JSON.stringify(m));
            this.io.emit('message', m);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    }

    private registerSocket() {
        this.socket = socket
    }

}

const socketService = new SocketService()
export default socketService