import {Socket} from 'socket.io';
import gameService from '../GameService';
import {direction, ITanks} from '../GameService/interfaces';
import SOCKET_EVENTS from './socketEvents';

class SocketService {
    private socket: Socket | null = null

    public listen(socket: Socket, io) {
        this.registerSocket(socket, io)
        gameService.startUpdatingSycle(this.emitUpdate.bind(this))

        socket.on('register_user', (name: string) => {
            gameService.addTank(name)
            console.log('gameService.tanks ', gameService.tanks)
        });

        socket.on('move', (id: string, direction: direction) => {
            gameService.moveTank(id, direction)
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    }

    private emitUpdate(tanks: ITanks) {
        console.log('emitUpdate ')
        this.io.emit(SOCKET_EVENTS.UPDATE, tanks);
    }

    private registerSocket(socket: Socket, io) {
        this.socket = socket
        this.io = io
    }

}

const socketService = new SocketService()
export default socketService