import * as React from "react";

import List, { ListItem, ListItemText } from "material-ui/List";
import Avatar from "material-ui/Avatar";

import { Message, Action, User } from "../../model";
import { Typography, withStyles, WithStyles } from "material-ui";
import { StyleRules } from "material-ui/styles";

const chatListStyles: StyleRules = {
  chatList: {
    overflow: "auto",
    position: "fixed",
    top: "90px",
    left: "25px",
    right: "25px",
    bottom: "120px"
  }
};

const checkMessageStyles: StyleRules = {
  chatListItem: {
    marginTop: "2px",
    marginBottom: "2px",
    borderRadius: "5px",
    backgroundColor: "#E8EAF6"
  }
};

interface ChatMessageProps {
  user: User;
  message: Message;
}

const ChatMessage = withStyles(checkMessageStyles)<ChatMessageProps>((props: ChatMessageProps & WithStyles<"chatListItem">) => {
  const { message: { from, content, action }, user, classes } = props;
  if (!from) {
    return null;
  }

  if (action === Action.JOINED || action === Action.RENAME) {
    return (
      <ListItem style={{ display: "inline" }}>
        <Typography type="body2" gutterBottom align="center">
          {action === Action.JOINED ? (
            <React.Fragment>
              <b>{from.name}</b> joined to the conversation.
            </React.Fragment>
          ) : (
            <React.Fragment>
              <b>{content.previousUsername}</b> is now <b>{content.username}</b>
            </React.Fragment>
          )}
        </Typography>
      </ListItem>
    );
  }

  const isCurrentFromCurrentUser = from.id === user.id;

  return (
    <ListItem className={isCurrentFromCurrentUser ? classes.chatListItem : ""}>
      <Avatar src={from.avatar} />
      <ListItemText primary={from.name} secondary={content} />
    </ListItem>
  );
});

interface ChatListProps {
  listRef?: React.Ref<any>;
  user: User;
  messages: Message[];
}

function ChatList(props: ChatListProps & WithStyles<"chatList">) {
  const { classes, messages, listRef, user } = props;

  return (
    <List className={classes.chatList}>
      <div ref={listRef}>{messages.map(message => <ChatMessage key={message.id} message={message} user={user} />)}</div>
    </List>
  );
}

export default withStyles(chatListStyles)<ChatListProps>(ChatList);
