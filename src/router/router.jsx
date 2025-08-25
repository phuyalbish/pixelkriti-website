import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "@/router/ScrollToTop";
import Spinner from "@/components/skeleton/Spinner.jsx"
import PageLayout from "@/components/PageLayout.jsx";

const NotFound = lazy(() =>  import("@/pages/NotFoundPage.jsx"));


import Home from "@/pages/HomePage.jsx";

const AppRoutes = () => {


  return (
    <>
      <ScrollToTop />
      
      <Suspense fallback={<div className="p-10 w-full h-[100vh] bg-white flex items-center justify-center fixed inset-0 z-50 text-center"><Spinner/></div>}>
        <Routes>
            <Route element={<PageLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Route>

        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;