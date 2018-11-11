import * as socketIo from "socket.io-client";
import SOCKET_EVENTS from './socketEvents';
import {ITanks} from './interfaces';

const SERVER_URL = "http://localhost:8080";
let idCounter = 0;

export class SocketService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = socketIo(SERVER_URL);
  }

  // public send(message: NewMessage): void {
  //   this.socket.emit("message", message);
  // }

  public onUpdate(onUpdateCallback: (gameState: ITanks) => void) {
    this.socket.on(SOCKET_EVENTS.UPDATE, (gameState: ITanks) => {
      console.log('gameState ', gameState)
      onUpdateCallback(gameState)
    });
  }

  // public onMessage(onMessageCallback: OnMessageCallback) {
  //   this.socket.on("message", (data: NewMessage) => {
  //     const message: Message = {
  //       id: ++idCounter,
  //       ...data
  //     };
  //     onMessageCallback(message);
  //   });
  // }

  public registerUser(name: string) {
    console.log('register_user ')
    this.socket.emit("register_user", name);
  }
}

const socketService = new SocketService()
export default socketService
