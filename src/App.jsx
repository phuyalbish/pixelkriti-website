
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "@/router/router.jsx";
import "./App.css";


function App() {
  return (
    <Router>
        <AppRoutes />
    </Router>
  );
}

export default App;
