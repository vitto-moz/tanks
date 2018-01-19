import * as React from "react";
import { withStyles, WithStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Modal from "material-ui/Modal";
import Button from "material-ui/Button";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import TextField from "material-ui/TextField";

function getModalStyle(): React.CSSProperties {
  const top = 50;
  const left = 50;

  return {
    position: "absolute",
    width: 8 * 50,
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    border: 0,
    backgroundColor: "#fff",
    boxShadow: "0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12)",
    padding: 8 * 4
  };
}

const styles = {
  usernameInput: {
    width: "100%"
  }
};

interface LoginState {
  username: string | null;
}

interface LoginProps {
  onLogin: (username: string) => void;
}

class Login extends React.Component<LoginProps & WithStyles<"usernameInput">, LoginState> {
  state: LoginState = {
    username: null
  };

  onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ username: e.currentTarget.value });

  onLoginClick = () => {
    if (this.state.username) {
      this.props.onLogin(this.state.username);
    }
  };

  onEnter = () => {
    this.onLoginClick();
  };

  render() {
    const { onLogin } = this.props;
    const { username } = this.state;

    const errorMessage = username || username === null ? null : "Please enter a username";
    const inputValue = username || "";

    return (
      <div>
        <Modal open={true}>
          <div style={getModalStyle()}>
            <Typography type="title" id="modal-title">
              Welcome
            </Typography>
            <TextField
              fullWidth
              label={errorMessage || "Username"}
              id="username"
              error={!!errorMessage}
              value={inputValue}
              onChange={this.onUsernameChange}
              onKeyPress={ev => {
                if (ev.key === "Enter") {
                  ev.preventDefault();
                  this.onEnter();
                }
              }}
              helperText="Please type your username"
            />
            <div style={{ width: "100%", marginTop: "10px", display: "flex" }}>
              <Button raised color="accent" style={{ marginLeft: "auto" }} disabled={!inputValue} onClick={this.onLoginClick}>
                Login
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default withStyles(styles)<LoginProps>(Login);
