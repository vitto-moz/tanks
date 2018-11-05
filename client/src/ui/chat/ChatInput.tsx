import * as React from "react";
import { withStyles, WithStyles, StyleRules } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Modal from "material-ui/Modal";
import Button from "material-ui/Button";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import TextField from "material-ui/TextField";

const styles: StyleRules = {
  chatInputContainer: {
    bottom: "25px",
    left: "25px",
    right: "25px",
    position: "fixed"
  }
};

interface ChatInputState {
  chatMessage: string;
}

interface ChatInputProps {
  onChatMessageEnter: (chatmessage: string) => void;
}

class ChatInput extends React.Component<ChatInputProps & WithStyles<"chatInputContainer">, ChatInputState> {
  state: ChatInputState = {
    chatMessage: ""
  };

  onChatMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ chatMessage: e.currentTarget.value });

  onEnter = () => {
    const { chatMessage } = this.state;
    const { onChatMessageEnter } = this.props;
    if (chatMessage && chatMessage.length <= 140) {
      onChatMessageEnter(chatMessage);
      this.setState({ chatMessage: "" });
    }
  };

  render() {
    const { classes } = this.props;
    const { chatMessage } = this.state;

    const helperText = `${chatMessage.length} / 140`;

    return (
      <div className={classes.chatInputContainer}>
        <TextField
          fullWidth
          label="Type your message"
          value={chatMessage}
          onChange={this.onChatMessageChange}
          helperText={helperText}
          error={chatMessage.length > 140}
          onKeyPress={ev => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              this.onEnter();
            }
          }}
        />
      </div>
    );
  }
}

//
export default withStyles(styles)<ChatInputProps>(ChatInput);
