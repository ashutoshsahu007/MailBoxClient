import { useContext, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import AuthContext from "../store/auth-context";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useToast } from "../store/ToastContext";

const FIREBASE_BASE_URL =
  "https://mailboxclient-91321-default-rtdb.firebaseio.com/";

const ComposeMail = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const { addToast } = useToast();

  // Example: logged-in user's email (replace with auth context if available)
  const senderEmail = authCtx.email;

  // Utility: sanitize email to use as Firebase key
  const sanitizeEmail = (email) => email.replace(/[@.]/g, "_");

  const handleSend = async () => {
    try {
      if (!to || !subject) {
        addToast("Recipient and subject are required!");
        return;
      }

      setLoading(true);

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

      addToast("Mail Sent Successfully", "success");
      setTo("");
      setSubject("");
      setEditorState(EditorState.createEmpty());
    } catch (error) {
      console.error(error);
      addToast("Failed to send mail", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-3">
          <h2 className="font-semibold text-gray-700">New Message</h2>
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
            className={`bg-blue-600 cursor-pointer flex text-white px-5 py-2 rounded-md hover:bg-blue-700 gap-2`}
          >
            {loading && (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </>
            )}
            {loading ? "Sending..." : "Send"}
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
