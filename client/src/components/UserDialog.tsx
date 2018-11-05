import * as React from "react";
import { withStyles, WithStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Modal from "material-ui/Modal";
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

interface UserDialogState {
  username: string | null;
}

interface UserDialogProps {
  title?: string;
  initialUsername?: string | null;
  onUsernameSet: (username: string) => void;
}

class UserDialog extends React.Component<UserDialogProps, UserDialogState> {
  private usernameInput: HTMLInputElement | null = null;

  constructor(props: UserDialogProps) {
    super(props);

    this.state = {
      username: props.initialUsername || null
    };
  }

  onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ username: e.currentTarget.value });

  onEnter = () => {
    if (this.state.username) {
      this.props.onUsernameSet(this.state.username);
    }
  };

  render() {
    const { onUsernameSet, title = "Welcome" } = this.props;
    const { username } = this.state;

    const errorMessage = username || username === null ? null : "Please enter a username";
    const inputValue = username || "";

    return (
      <div>
        <Modal open={true}>
          <div style={getModalStyle()}>
            <Typography type="title">{title}</Typography>
            <TextField
              fullWidth
              autoFocus
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
          </div>
        </Modal>
      </div>
    );
  }
}
export default UserDialog;
