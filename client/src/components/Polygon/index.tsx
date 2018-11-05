import * as React from "react";
import {User, Message, Action, NewMessage} from "../../model";
import SocketService from "../../services/SocketService";
import styles from './polygonStyles'

interface Props {
  user: User | null;
}

interface State {
  messages: Message[];
}

class Polygon extends React.Component<Props, any> {
  private listElement: HTMLDivElement | null = null;
  private socketService: SocketService | null = null;

  state: State = {
    messages: []
  };

  componentDidMount() {
    this.socketService = new SocketService();
    this.socketService.onMessage((receivedMessage: Message) => {
      const {messages: oldMessages} = this.state;

      const messages = [...oldMessages, receivedMessage];

      this.setState({messages}, this.scrollToBottom);
    });

    this.sendNotification(null, Action.JOINED);
  }

  componentWillReceiveProps(nextProps: Props) {
    // if (nextProps.user !== this.props.user) {
    //   this.sendNotification(
    //     {
    //       username: nextProps.user.name,
    //       previousUsername: this.props.user.name
    //     },
    //     Action.RENAME
    //   );
    // }
  }

  private sendNotification(params: any, action: Action): void {
    if (!this.socketService) {
      return;
    }
    const {user} = this.props;

    // let message: NewMessage | null = null;

    // if (action === Action.JOINED) {
    //   message = {
    //     from: user,
    //     action
    //   };
    // } else if (action === Action.RENAME) {
    //   message = {
    //     from: user,
    //     action,
    //     content: params
    //   };
    // }

    // if (message) {
    //   this.socketService.send(message);
    // }
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

    const {user} = this.props;
    if (user) {
      this.socketService.send({
        from: user,
        content: message
      });
    }
  };

  render() {
    return (
      <div style={styles.polygon}>
      </div>
    );
  }
}

export default Polygon
