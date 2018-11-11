import {createServer, Server} from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import socketService from './services/SocketService';
import {Socket} from 'socket.io';

export class TanksServer {
    public static readonly PORT: number = 8080;
    private app: express.Application | null = null
    private server: Server | null = null
    private io: SocketIO.Server | null = null
    private port: string | number | null = null

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || TanksServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: Socket) => {
            socketService.listen(socket, this.io)
            console.log('Connected client on port %s.', this.port);
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
