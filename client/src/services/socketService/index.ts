import * as socketIo from "socket.io-client";
import SOCKET_EVENTS from './socketEvents';
import {IGameState} from './interfaces';

const SERVER_URL = "http://localhost:8080";

export class SocketService {

    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = socketIo(SERVER_URL);
    }

    public getGameState(cb: (gameState: IGameState) => void) {
        this.socket.emit(SOCKET_EVENTS.GET_GAME_STATE, (gameState: IGameState) => {
            cb(gameState);
        });
    }

    public onUpdate(onUpdateCallback: (gameState: IGameState) => void) {
        this.socket.on(SOCKET_EVENTS.UPDATE, (gameState: IGameState) => {
            onUpdateCallback(gameState)
        });
    }
}

const socketService = new SocketService();
export default socketService;
