// inbox-reducer.js
export const initialState = {
  mails: [],
  unreadCount: 0,
};

export const inboxReducer = (state, action) => {
  switch (action.type) {
    case "SET_MAILS":
      return {
        mails: action.payload,
        unreadCount: action.payload.filter((mail) => !mail.read).length,
      };

    case "MARK_AS_READ":
      const updatedMails = state.mails.map((mail) =>
        mail.id === action.payload ? { ...mail, read: true } : mail
      );
      return {
        mails: updatedMails,
        unreadCount: updatedMails.filter((mail) => !mail.read).length,
      };

    default:
      return state;
  }
};
