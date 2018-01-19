export interface User {
  id: number;
  name: string;
  avatar: string;
}

export enum Action {
  JOINED,
  LEFT,
  RENAME
}

export enum Event {
  CONNECT = "connect",
  DISCONNECT = "disconnect"
}

export interface NewMessage {
  from?: User;
  content?: any;
  action?: Action;
}

export interface Message extends NewMessage {
  id: number;
}
