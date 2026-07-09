import { Routes, Route } from "react-router-dom";
import PageLayout from "@/components/PageLayout.jsx";
import HomePage from "@/pages/HomePage.jsx";
import WorkPage from "@/pages/WorkPage.jsx";
import WorkDetailPage from "@/pages/WorkDetailPage.jsx";
import ServicesPage from "@/pages/ServicesPage.jsx";
import ServiceDetailPage from "@/pages/ServiceDetailPage.jsx";
import AboutPage from "@/pages/AboutPage.jsx";
import ContactPage from "@/pages/ContactPage.jsx";
import NotFoundPage from "@/pages/NotFoundPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<WorkDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
