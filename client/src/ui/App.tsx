import * as React from "react";
import { withStyles, StyleRules } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";

import Button from "material-ui/Button";
import Person from "material-ui-icons/Person";

import { User, Message } from "../model";

import UserDialog from "./UserDialog";
import Chat from "./Chat";

const AVATAR_URL = "https://api.adorable.io/avatars/285";

const styles: StyleRules = {
  root: {
    width: "100%"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  personButton: {
    position: "absolute",
    right: "2%",
    top: "35px",
    zIndex: 1
  }
};

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
    const { user: currentUser } = this.state;

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

    this.setState({ user });
  };

  render() {
    const { classes } = this.props;
    const { user, usernameChangeDialogOpen } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography type="title" color="inherit">
              TypeScript React Chat
            </Typography>
            <Button fab color="accent" className={classes.personButton} onClick={this.openUsernameChangeDialog}>
              <Person />
            </Button>
          </Toolbar>
        </AppBar>

        {!user && <UserDialog onUsernameSet={this.onUsernameSet} />}
        {user && <Chat user={user} />}
        {usernameChangeDialogOpen && (
          <UserDialog onUsernameSet={this.onUsernameChange} title="Edit details" initialUsername={user && user.name} />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(App);
