import React from 'react';
import { BrowserRouter, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import FormPage from "./pages/FormPage";
import NotFound from "./pages/NotFound";
import AadhaarESign from "./pages/Aadharesign";
import './index.css';
import ChatbotFAB from './components/ChatbotFAB';
import ProtectedRoute from "./components/ProtectedRoute";

import TrackCasePage from './pages/TrackCasePage';
import CaseDetailsPage from './pages/CaseDetailsPage';
import NewCasePage from './pages/NewCasePage';

import PublicRoute from "./components/PublicRoute";


const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const hideChatbot = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
          
        
        <Route path="/track-cases" element={<TrackCasePage />} />
        <Route path="/cases/:id" element={<CaseDetailsPage />} />
        <Route path="/new-case" element={<NewCasePage />} />
      

        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        <Route
          path="/forms"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/form/:formId" element={<FormPage />} />
        <Route path="/aadhaar-esign" element={<AadhaarESign />} />

        <Route path="/ask-vaani-nyay" element={<ChatbotFAB key="chatbot-page" forceOpen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChatbot && <ChatbotFAB />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

// import React from 'react';
// import { BrowserRouter, useLocation, Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "./components/ui/toaster";
// import { Toaster as Sonner } from "./components/ui/sonner";
// import { TooltipProvider } from "./components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { LanguageProvider } from "./contexts/LanguageContext";
// import Index from "./pages/Index";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import About from "./pages/About";
// import FormPage from "./pages/FormPage";
// import NotFound from "./pages/NotFound";
// import AadhaarESign from "./pages/Aadharesign";
// import './index.css';
// import ChatbotFAB from './components/ChatbotFAB';
// import ProtectedRoute from "./components/ProtectedRoute";
// import TrackCasePage from './pages/TrackCasePage';
// import CaseDetailsPage from './pages/CaseDetailsPage';
// import NewCasePage from './pages/NewCasePage';

// const queryClient = new QueryClient();

// function AppRoutes() {
//   const location = useLocation();
//   const hideChatbot = ["/login", "/register"].includes(location.pathname);

//   return (
//     <>
//       <Toaster />
//       <Sonner />
//       <Routes>
//         <Route path="/" element={<Navigate to="/home" replace />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/about" element={<About />} />
        
//         {/* Protected Routes */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/forms" element={<Index />} />
//           <Route path="/form/:formId" element={<FormPage />} />
//           <Route path="/aadhaar-esign" element={<AadhaarESign />} />
          
//           {/* Case Tracking Routes */}
//           <Route path="/track-case" element={<TrackCasePage />} />
//           <Route path="/cases/:id" element={<CaseDetailsPage />} />
//           <Route path="/new-case" element={<NewCasePage />} />
//         </Route>

//         {/* 404 Route */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       {!hideChatbot && <ChatbotFAB />}
//     </>
//   );
// }

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <LanguageProvider>
//       <TooltipProvider>
//         <BrowserRouter>
//           <AppRoutes />
//         </BrowserRouter>
//       </TooltipProvider>
//     </LanguageProvider>
//   </QueryClientProvider>
// );

// export default App;