import * as React from "react";
import {Message, Action} from "../../model";
import styles from './polygonStyles'
import Tank from '../Tank';
import {ITanks, ITank} from '../../services/socketService/interfaces';

interface Props {
  gameState: ITanks
}

interface State {
  messages: Message[];
}

class Polygon extends React.Component<Props, any> {
  private listElement: HTMLDivElement | null = null;

  state: State = {
    messages: []
  };

  componentDidMount() {
    // this.sendNotification(null, Action.JOINED);
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
    // if (!this.socketService) {
    //   return;
    // }
    // const {user} = this.props;

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

  // onChatMessageEnter = (message: string) => {
  //   if (!this.socketService) {
  //     return;
  //   }

  //   const {user} = this.props;
  //   if (user) {
  //     this.socketService.send({
  //       from: user,
  //       content: message
  //     });
  //   }
  // };

  render() {
    return (
      <div style={styles.polygon}>
        {
          Object.values(this.props.gameState).map((tank: ITank) => {
            return <Tank tank={tank} />
          })
        }
      </div>
    );
  }
}

export default Polygon
