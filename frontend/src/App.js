import { Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import HomeScreen from "./pages/HomeScreen";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" exact element={<HomeScreen />} />
        <Route path="/chats" exact element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
