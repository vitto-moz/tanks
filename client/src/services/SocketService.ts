import * as socketIo from "socket.io-client";
import { NewMessage, Message } from "../model";
const SERVER_URL = "http://localhost:8080";

let idCounter = 0;

type OnMessageCallback = (message: Message) => void;

export class SocketService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = socketIo(SERVER_URL);
  }

  public send(message: NewMessage): void {
    this.socket.emit("message", message);
  }

  public onMessage(onMessageCallback: OnMessageCallback) {
    this.socket.on("message", (data: NewMessage) => {
      const message: Message = {
        id: ++idCounter,
        ...data
      };
      onMessageCallback(message);
    });
  }

  public registerUser(name: string){
    console.log('register_user ')
    this.socket.emit("register_user", name);
  }
}

const socketService = new SocketService()
export default socketService
