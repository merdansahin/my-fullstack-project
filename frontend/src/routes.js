import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoote";

const Home = lazy(() => import("./pages/Home"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Booking = lazy(() => import("./pages/Booking"));
const Contact = lazy(() => import("./pages/Contact"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const BookingHistory = lazy(() => import("./pages/BookingHistory"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminBookingManagement = lazy(
  () => import("./pages/AdminBookingManagement"),
);

function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <BookingHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <PrivateRoute>
              <AdminBookingManagement />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
