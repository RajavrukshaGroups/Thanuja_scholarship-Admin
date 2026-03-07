import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../../pages/auth/AdminLogin";
import ProtectedRoute from "../common/protectedRoute";
import Dashboard from "../../pages/dashboard/dashboard";
import ScholarshipSponsors from "../../pages/scholarshipSponsors/scholarshipSponsors";
import ScholarshipTypes from "../../pages/scholarshipTypes/scholarshipTypes";
import FeatureNewScholarship from "../../pages/featureNewScholarship/featureNewScholarship";
import MembershipPlans from "../../pages/membershipPlans/membershipPlans";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/scholarship-sponsors"
          element={
            <ProtectedRoute>
              <ScholarshipSponsors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/scholarship-types"
          element={
            <ProtectedRoute>
              <ScholarshipTypes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feature-scholarship"
          element={
            <ProtectedRoute>
              <FeatureNewScholarship />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/membership-plans"
          element={
            <ProtectedRoute>
              <MembershipPlans />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
