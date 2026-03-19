import { Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import MainLayout from "./layout/MainLayout";
import Meetings from "./pages/Meetings";
import Sentiments from "./pages/Sentiments";
import Chat from "./pages/Chat";
import PageNotFound from "./pages/PageNotFound";

import CustomCursor from "./components/CustomCursor";
import MouseFluidBackground from "./components/MouseFluidBackground";

function App() {
  return (
    <>
      <CustomCursor />
      <MouseFluidBackground />
      <div className="relative z-10 w-full h-full">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/sentiments" element={<Sentiments />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;