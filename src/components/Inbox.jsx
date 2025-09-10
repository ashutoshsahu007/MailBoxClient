import { useEffect, useReducer, useContext, useState } from "react";
import { inboxReducer, initialState } from "../store/mail-reducer";
import AuthContext from "../store/auth-context";
import useFetch from "../hooks/useFetch";
import { formatDateTime } from "../utils/date";
import { sanitizeEmail } from "../utils/sanitizeEmail";

const FIREBASE_BASE_URL =
  "https://mailboxclient-91321-default-rtdb.firebaseio.com/";

const Inbox = () => {
  const [selectedMail, setSelectedMail] = useState(null);
  const [state, dispatch] = useReducer(inboxReducer, initialState);
  const authCtx = useContext(AuthContext);
  const userKey = sanitizeEmail(authCtx.email);

  const url = `${FIREBASE_BASE_URL}/users/${userKey}/inbox.json`;

  // Mark as read
  const markAsRead = async (mail) => {
    const userKey = sanitizeEmail(authCtx.email);
    await fetch(`${FIREBASE_BASE_URL}/users/${userKey}/inbox/${mail.id}.json`, {
      method: "PATCH",
      body: JSON.stringify({ read: true }),
      headers: { "Content-Type": "application/json" },
    });

    dispatch({ type: "MARK_AS_READ", payload: mail.id });
    setSelectedMail({ ...mail, read: true });
  };

  // Delete mail
  const deleteMail = async (mail) => {
    try {
      const userKey = sanitizeEmail(authCtx.email);
      await fetch(
        `${FIREBASE_BASE_URL}/users/${userKey}/inbox/${mail.id}.json`,
        { method: "DELETE" }
      );

      dispatch({ type: "DELETE_MAIL", payload: mail.id });
      setSelectedMail(null);
    } catch (err) {
      console.error("Error deleting mail:", err);
    }
  };

  useFetch(url, state, dispatch);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {!selectedMail ? (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Inbox ({state.unreadCount} unread)
          </h2>

          <ul className="space-y-2">
            {state.mails.map((mail) => (
              <li
                key={mail.id}
                className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => markAsRead(mail)}
              >
                <div className="flex items-center space-x-2">
                  {!mail.read && (
                    <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
                  )}
                  <span className="font-medium">{mail.subject}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{mail.from}</p>
                  <p className="text-xs text-gray-400">
                    {formatDateTime(mail.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="border p-4 rounded shadow">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSelectedMail(null)}
              className="text-blue-500 underline cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => deleteMail(selectedMail)}
              className="text-red-500 underline cursor-pointer"
            >
              🗑 Delete
            </button>
          </div>
          <h3 className="text-lg font-bold mb-2">{selectedMail.subject}</h3>
          <p className="text-sm text-gray-500 mb-1">
            From: {selectedMail.from}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {formatDateTime(selectedMail.timestamp)}
          </p>
          <p>{selectedMail.body}</p>
        </div>
      )}
    </div>
  );
};

export default Inbox;
