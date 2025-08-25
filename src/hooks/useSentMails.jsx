// hooks/useSentMails.js
import { useEffect, useReducer, useCallback } from "react";
import { inboxReducer, initialState } from "../store/inbox-reducer";

const FIREBASE_BASE_URL = import.meta.env.VITE_FIREBASE_URL;

const sanitizeEmail = (email) => email.replace(/[@.]/g, "_");

export function useSentMails(email) {
  const [state, dispatch] = useReducer(inboxReducer, initialState);

  const fetchSentMails = useCallback(async () => {
    try {
      const userKey = sanitizeEmail(email);
      const res = await fetch(
        `${FIREBASE_BASE_URL}/users/${userKey}/sent.json`
      );
      const data = await res.json();

      if (data) {
        const mails = Object.entries(data).map(([id, mail]) => ({
          id,
          ...mail,
        }));
        dispatch({ type: "SET_MAILS", payload: mails });
      }
    } catch (err) {
      console.error("Error fetching mails:", err);
    }
  }, [email]);

  useEffect(() => {
    fetchSentMails();
    const intervalId = setInterval(fetchSentMails, 2000);
    return () => clearInterval(intervalId);
  }, [fetchSentMails]);

  const markAsRead = async (mail) => {
    const userKey = sanitizeEmail(email);
    await fetch(`${FIREBASE_BASE_URL}/users/${userKey}/sent/${mail.id}.json`, {
      method: "PATCH",
      body: JSON.stringify({ read: true }),
      headers: { "Content-Type": "application/json" },
    });
    dispatch({ type: "MARK_AS_READ", payload: mail.id });
  };

  const deleteMail = async (mailId) => {
    const userKey = sanitizeEmail(email);
    await fetch(`${FIREBASE_BASE_URL}/users/${userKey}/sent/${mailId}.json`, {
      method: "DELETE",
    });
    dispatch({ type: "DELETE_MAIL", payload: mailId });
  };

  return { state, markAsRead, deleteMail };
}
