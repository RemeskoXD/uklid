/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router";
import PublicPage from "./pages/PublicPage";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
