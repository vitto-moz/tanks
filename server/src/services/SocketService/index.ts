import {IGameState, TeamId} from './../GameService/interfaces';
import {Socket} from 'socket.io';
import gameService from '../GameService';
import {ITank} from '../GameService/interfaces';
import SOCKET_EVENTS from './socketEvents';

class SocketService {
    // private socket: Socket | null = null
    private io: Socket | null = null

    constructor() {
        gameService.startUpdatingSycle(this.emitUpdate.bind(this))
    }

    public listen(socket: Socket, io: Socket) {
        this.registerSocket(socket, io)
        this.bindSocketEvents(socket)
    }

    private emitUpdate(gameState: IGameState) {
        if (this.io) {
            this.io.emit(SOCKET_EVENTS.UPDATE, gameState);
        }
    }

    private bindSocketEvents(socket: Socket) {
        if (socket) {
            socket.on(SOCKET_EVENTS.REGISTER_USER, (
                name: string,
                teamId: TeamId,
                skinUrl: string,
                fn
            ) => {
                socket
                if (socket) {
                    gameService.addTank(name, socket.id, teamId, skinUrl)
                    fn(socket.id)
                }
            });

            socket.on(SOCKET_EVENTS.MOVE, ({id, direction}) => {
                gameService.registerMovement(id, direction)
            });

            socket.on(SOCKET_EVENTS.FIRE, ({id}) => {
                gameService.registerBullet(id)
            });

            socket.on(SOCKET_EVENTS.UPDATE_TANK, (tank: ITank) => {
                gameService.updateTank(tank)
            });

            socket.on(SOCKET_EVENTS.DISCONNECT, () => {
                socket && gameService.removeTank(socket.id)
            });
        }

    }

    private registerSocket(socket: Socket, io: Socket) {
        this.io = io
    }

}

const socketService = new SocketService()
export default socketService