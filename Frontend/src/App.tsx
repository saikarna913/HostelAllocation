import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/api/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/layouts/AppLayout";

import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import FloorView from "@/pages/FloorView";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />

            <Route
              element={
                /* The ProtectedRoute component has been commented out to allow
                   unauthenticated access to the nested routes below. 
                */
                // {/*<ProtectedRoute>*/} 
                  <AppLayout />
                // {/*</ProtectedRoute>*/} 
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/hostels/:hostelId" element={<FloorView />} />
               <Route
                path="/hostels/:hostelId/floor/:floor"
                element={<FloorView />}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}