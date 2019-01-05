import * as messageConstants from "../constants/messageConstants";

export const openMessage = (messageType, message) => ({
  type: messageConstants.OPEN_MESSAGE,
  payload: {
    messageType,
    message
  }
});

export const closeMessage = () => ({
  type: messageConstants.CLOSE_MESSAGE
});
