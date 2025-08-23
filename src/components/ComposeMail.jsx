import React, { useContext, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import AuthContext from "../store/auth-context";

const FIREBASE_BASE_URL =
  "https://mailboxclient-91321-default-rtdb.firebaseio.com/";

const ComposeMail = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const authCtx = useContext(AuthContext);

  // Example: logged-in user's email (replace with auth context if available)
  const senderEmail = authCtx.email;

  // Utility: sanitize email to use as Firebase key
  const sanitizeEmail = (email) => email.replace(/[@.]/g, "_");

  const handleSend = async () => {
    try {
      if (!to || !subject) {
        alert("Recipient and subject are required!");
        return;
      }

      const rawContent = convertToRaw(editorState.getCurrentContent());
      const htmlContent = draftToHtml(rawContent);

      const mailData = {
        from: senderEmail,
        to,
        subject,
        body: htmlContent,
        timestamp: new Date().toISOString(),
        read: false,
      };

      const receiverKey = sanitizeEmail(to);
      const senderKey = sanitizeEmail(senderEmail);

      // Store in Receiver's Inbox
      await fetch(`${FIREBASE_BASE_URL}/users/${receiverKey}/inbox.json`, {
        method: "POST",
        body: JSON.stringify(mailData),
        headers: { "Content-Type": "application/json" },
      });

      // Store in Sender's Sentbox
      await fetch(`${FIREBASE_BASE_URL}/users/${senderKey}/sent.json`, {
        method: "POST",
        body: JSON.stringify(mailData),
        headers: { "Content-Type": "application/json" },
      });

      alert("Mail Sent Successfully!");

      // Reset form
      setTo("");
      setSubject("");
      setEditorState(EditorState.createEmpty());
    } catch (error) {
      console.error(error);
      alert("Failed to send mail");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-3">
          <h2 className="font-semibold text-gray-700">New Message</h2>
          <button className="text-gray-500 hover:text-red-500">✖</button>
        </div>

        {/* To */}
        <div className="border-b p-3">
          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Subject */}
        <div className="border-b p-3">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Rich Text Editor */}
        <div className="p-3 min-h-[300px]">
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbarClassName="border-b"
            wrapperClassName="border rounded-md"
            editorClassName="p-2 min-h-[200px]"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-3 border-t">
          <button
            onClick={handleSend}
            className="bg-blue-600 cursor-pointer text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            Send
          </button>

          <div className="flex space-x-3 text-gray-500">
            <button className="hover:text-gray-700">📎</button>
            <button className="hover:text-gray-700">😊</button>
            <button className="hover:text-gray-700">🖼️</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeMail;
