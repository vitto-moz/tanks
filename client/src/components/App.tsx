import * as React from "react";
import {User} from "../model";

import Polygon from './Polygon';
import socketService from '../services/SocketService';

const AVATAR_URL = "https://api.adorable.io/avatars/285";

interface AppState {
  user: User | null;
  usernameChangeDialogOpen: boolean;
}
const getRandomId = (): number => Math.floor(Math.random() * 1000000) + 1;

class App extends React.Component<{}, AppState> {
  state: AppState = {
    user: null,
    usernameChangeDialogOpen: false
  };

  constructor(props: {}) {
    super(props)
    this.registerUser = this.registerUser.bind(this)
  }

  private openUsernameChangeDialog = () => {
    this.setState({
      usernameChangeDialogOpen: true
    });
  };

  private onUsernameChange = (username: string) => {
    const {user: currentUser} = this.state;

    if (currentUser) {
      const newUser: User = {
        ...currentUser,
        name: username
      };

      this.setState({
        user: newUser,
        usernameChangeDialogOpen: false
      });
    }
  };

  private onUsernameSet = (username: string) => {
    const randomId = getRandomId();

    const user: User = {
      name: username,
      id: randomId,
      avatar: `${AVATAR_URL}/${randomId}.png`
    };

    this.setState({user});
  };

  private registerUser() {
    console.log('registerUser ')
    socketService.registerUser('tankist')
  }

  render() {
    const {user, usernameChangeDialogOpen} = this.state;

    return (
      [
        <Polygon user={user} key="Polygon" />,
        <button
          key="registerUserButton"
          onClick={this.registerUser}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
          }} > start </button>
      ]
    )
  }
}

export default App
