import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PageLayout from "@/components/PageLayout.jsx";
import HomePage from "@/pages/HomePage.jsx";

/*
 * Only the landing page ships in the main bundle; every other route loads on
 * navigation. The fallback is nothing at all: the shell (header/footer) stays
 * mounted, chunks arrive in tens of milliseconds, and a flashed spinner would
 * be more visible than the wait.
 */
const WorkPage = lazy(() => import("@/pages/WorkPage.jsx"));
const WorkDetailPage = lazy(() => import("@/pages/WorkDetailPage.jsx"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage.jsx"));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage.jsx"));
const AboutPage = lazy(() => import("@/pages/AboutPage.jsx"));
const ContactPage = lazy(() => import("@/pages/ContactPage.jsx"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.jsx"));

/*
 * Deliberately outside PageLayout: an internal tool has no business wearing
 * the marketing chrome. No header, no nav, no sticky CTA - and so no link back
 * into it from anywhere a visitor can see, which is the point.
 */
const DashboardPage = lazy(() => import("@/pages/DashboardPage.jsx"));

function AppRoutes() {
  return (
    <Routes>
      {/* /dashboard lists, /dashboard/:id opens one. Same component and the
          same chunk - the id just switches which view it draws. A real URL
          rather than a modal so the back button works and a row can be
          linked to. The Worker's noindex covers /dashboard and everything
          under it. */}
      <Route
        path="/dashboard"
        element={
          <Suspense fallback={null}>
            <DashboardPage />
          </Suspense>
        }
      />
      {/* Before :id, so "new" is never looked up as an enquiry id. */}
      <Route
        path="/dashboard/new"
        element={
          <Suspense fallback={null}>
            <DashboardPage />
          </Suspense>
        }
      />
      <Route
        path="/dashboard/:id"
        element={
          <Suspense fallback={null}>
            <DashboardPage />
          </Suspense>
        }
      />
      <Route element={<PageLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/work"
          element={
            <Suspense fallback={null}>
              <WorkPage />
            </Suspense>
          }
        />
        <Route
          path="/work/:slug"
          element={
            <Suspense fallback={null}>
              <WorkDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/services"
          element={
            <Suspense fallback={null}>
              <ServicesPage />
            </Suspense>
          }
        />
        <Route
          path="/services/:slug"
          element={
            <Suspense fallback={null}>
              <ServiceDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={null}>
              <AboutPage />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={null}>
              <ContactPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={null}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
