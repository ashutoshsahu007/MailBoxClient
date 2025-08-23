import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import MailBoxClient from "./components/ComposeMail";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useContext } from "react";
import AuthContext from "./store/auth-context";
import Inbox from "./components/Inbox";
import Sentbox from "./components/Sentbox";

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route
          path="/"
          element={!isLoggedIn ? <AuthPage /> : <Navigate to="/compose" />}
        />
        <Route
          path="/inbox"
          element={isLoggedIn ? <Inbox /> : <Navigate to="/" replace />}
        />
        <Route
          path="/compose"
          element={isLoggedIn ? <MailBoxClient /> : <Navigate to="/" replace />}
        />
        <Route
          path="/sentbox"
          element={isLoggedIn ? <Sentbox /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
