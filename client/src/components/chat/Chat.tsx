import * as React from "react";

import { withStyles, Theme, WithStyles } from "material-ui/styles";
import List from "material-ui/List";

import { User, Message, Action, NewMessage } from "../../model";
import SocketService from "../../services/SocketService";

import ChatList from "./ChatList";
import ChatInput from "./ChatInput";

const styles = (theme: Theme) => ({
  chatContainer: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

interface ChatProps {
  user: User;
}

interface ChatState {
  messages: Message[];
}

type ChatPropsWithStyles = ChatProps & WithStyles<"chatContainer">;

class Chat extends React.Component<ChatPropsWithStyles, any> {
  private listElement: HTMLDivElement | null = null;
  private socketService: SocketService | null = null;

  state: ChatState = {
    messages: []
  };

  componentDidMount() {
    this.socketService = new SocketService();
    this.socketService.onMessage((receivedMessage: Message) => {
      const { messages: oldMessages } = this.state;

      const messages = [...oldMessages, receivedMessage];

      this.setState({ messages }, this.scrollToBottom);
    });

    this.sendNotification(null, Action.JOINED);
  }

  componentWillReceiveProps(nextProps: ChatPropsWithStyles) {
    if (nextProps.user !== this.props.user) {
      this.sendNotification(
        {
          username: nextProps.user.name,
          previousUsername: this.props.user.name
        },
        Action.RENAME
      );
    }
  }

  private sendNotification(params: any, action: Action): void {
    if (!this.socketService) {
      return;
    }
    const { user } = this.props;

    let message: NewMessage | null = null;

    if (action === Action.JOINED) {
      message = {
        from: user,
        action
      };
    } else if (action === Action.RENAME) {
      message = {
        from: user,
        action,
        content: params
      };
    }

    if (message) {
      this.socketService.send(message);
    }
  }

  scrollToBottom = () => {
    if (!this.listElement) {
      return;
    }

    // evil hack, but there seems to be way to get
    // the native root element of the List component
    const parent = this.listElement.parentElement;

    if (!parent) {
      return;
    }

    parent.scrollTop = parent.scrollHeight;
  };

  componentWillUnmount() {
    // todo: disconnect
  }

  onChatMessageEnter = (message: string) => {
    if (!this.socketService) {
      return;
    }

    const { user } = this.props;

    this.socketService.send({
      from: user,
      content: message
    });
  };

  render() {
    const { classes, user } = this.props;
    const { messages } = this.state;
    return (
      <div className={classes.chatContainer}>
        <ChatList messages={messages} user={user} listRef={e => (this.listElement = e)} />
        <ChatInput onChatMessageEnter={this.onChatMessageEnter} />
      </div>
    );
  }
}

export default withStyles(styles)<ChatProps>(Chat);
