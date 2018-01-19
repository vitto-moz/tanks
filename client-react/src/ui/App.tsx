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

import LoginDialog from "./Login";
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
}
const getRandomId = (): number => Math.floor(Math.random() * 1000000) + 1;

class App extends React.Component<any, AppState> {
  state: AppState = {
    user: null
  };

  private onLogin = (username: string) => {
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
    const { user } = this.state;

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
            <Button fab color="accent" className={classes.personButton}>
              <Person />
            </Button>
          </Toolbar>
        </AppBar>

        {!user && <LoginDialog onLogin={this.onLogin} />}
        {user && <Chat user={user} />}
      </div>
    );
  }
}

export default withStyles(styles)(App);
