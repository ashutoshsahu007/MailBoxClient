import { useState, useContext } from "react";
import AuthContext from "../store/auth-context";
import { useSentMails } from "../hooks/useSentMails";

const formatDateTime = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleString() : "";

const Inbox = () => {
  const { email } = useContext(AuthContext);
  const { state, markAsRead, deleteMail } = useSentMails(email);
  const [selectedMail, setSelectedMail] = useState(null);

  if (!state.mails.length) {
    return <p className="text-center text-gray-500">No mails found 📭</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {!selectedMail ? (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Sentbox ({state.unreadCount} unread)
          </h2>

          <ul className="space-y-2">
            {state.mails.map((mail) => (
              <li
                key={mail.id}
                className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  markAsRead(mail);
                  setSelectedMail(mail);
                }}
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
              onClick={() => {
                deleteMail(selectedMail.id);
                setSelectedMail(null);
              }}
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
