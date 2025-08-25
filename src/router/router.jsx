
import { Routes, Route } from "react-router-dom";
import PageLayout from "@/components/PageLayout.jsx";
import Home from "@/pages/HomePage.jsx";
const AppRoutes = () => {
  return (
    <>
      <Routes>
            <Route element={<PageLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<Home />} />
            </Route>

        </Routes>
    </>
  );
};

export default AppRoutes;