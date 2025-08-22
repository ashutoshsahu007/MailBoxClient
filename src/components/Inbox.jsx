import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../store/auth-context";

const FIREBASE_BASE_URL =
  "https://mailboxclient-91321-default-rtdb.firebaseio.com/";

const Inbox = () => {
  const [mails, setMails] = useState([]);

  // Replace with logged-in user’s email
  const authCtx = useContext(AuthContext);
  const currentUserEmail = authCtx.email;
  const sanitizeEmail = (email) => email.replace(/[@.]/g, "_");

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const userKey = sanitizeEmail(currentUserEmail);
        const res = await fetch(
          `${FIREBASE_BASE_URL}/users/${userKey}/inbox.json`
        );
        const data = await res.json();

        if (data) {
          const loaded = Object.entries(data).map(([id, mail]) => ({
            id,
            ...mail,
          }));
          setMails(loaded.reverse()); // newest first
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInbox();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📥 Inbox</h1>
      {mails.length === 0 ? (
        <p className="text-gray-500">No mails yet.</p>
      ) : (
        <ul className="space-y-3">
          {mails.map((mail) => (
            <li key={mail.id} className="p-4 bg-white rounded shadow">
              <p className="text-sm text-gray-500">From: {mail.from}</p>
              <p className="font-semibold">{mail.subject}</p>
              <div
                className="text-gray-700 mt-1"
                dangerouslySetInnerHTML={{ __html: mail.body }}
              />
              <p className="text-xs text-gray-400 mt-2">
                {new Date(mail.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
