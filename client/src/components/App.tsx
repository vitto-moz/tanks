import * as React from "react";
import {User, Message} from "../model";

import Polygon from './Polygon';

const AVATAR_URL = "https://api.adorable.io/avatars/285";

interface AppState {
  user: User | null;
  usernameChangeDialogOpen: boolean;
}
const getRandomId = (): number => Math.floor(Math.random() * 1000000) + 1;

class App extends React.Component<any, AppState> {
  state: AppState = {
    user: null,
    usernameChangeDialogOpen: false
  };

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

  render() {
    const {classes} = this.props;
    const {user, usernameChangeDialogOpen} = this.state;

    return (
      <Polygon user={user} />
    )
  }
}

export default App
