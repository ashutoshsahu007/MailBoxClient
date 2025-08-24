import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import ComposeMailPage from "./pages/ComposeMailPage";
import AuthPage from "./pages/AuthPage";
import { useContext } from "react";
import AuthContext from "./store/auth-context";
import NotFound from "./pages/NotFound";
import SentboxPage from "./pages/SentboxPage";
import InboxPage from "./pages/InboxPage";

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      <Routes>
        <Route
          path="/"
          element={!isLoggedIn ? <AuthPage /> : <Navigate to="/compose" />}
        />
        <Route
          path="/inbox"
          element={isLoggedIn ? <InboxPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/compose"
          element={
            isLoggedIn ? <ComposeMailPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/sentbox"
          element={isLoggedIn ? <SentboxPage /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
