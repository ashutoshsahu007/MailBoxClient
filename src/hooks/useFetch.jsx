import { useEffect, useState } from "react";

const useFetch = (url, state, dispatch) => {
  useEffect(() => {
    const fetchMails = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data) {
          const mails = Object.entries(data).map(([id, mail]) => ({
            id,
            ...mail,
          }));

          // ✅ Only dispatch if mails actually changed
          const prevIds = state.mails
            .map((m) => m.id)
            .sort()
            .join(",");
          const newIds = mails
            .map((m) => m.id)
            .sort()
            .join(",");

          if (prevIds !== newIds || state.mails.length !== mails.length) {
            dispatch({ type: "SET_MAILS", payload: mails });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMails();
    const intervalId = setInterval(fetchMails, 2000);

    return () => clearInterval(intervalId);
  }, [url]);
};

export default useFetch;
