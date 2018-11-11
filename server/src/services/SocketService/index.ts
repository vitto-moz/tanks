import {Socket} from 'socket.io';
import gameService from '../GameService';
class SocketService {
    private socket: Socket | null = null

    public listen(socket: Socket, io) {
        this.registerSocket(socket, io)
        socket.on('register_user', (name: string) => {
            gameService.addTank(name)
            console.log('gameService.tanks ', gameService.tanks)
            // this.io.emit('updatePolygon');
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    }

    private registerSocket(socket: Socket, io) {
        this.socket = socket
        this.io = io
    }

}

const socketService = new SocketService()
export default socketService