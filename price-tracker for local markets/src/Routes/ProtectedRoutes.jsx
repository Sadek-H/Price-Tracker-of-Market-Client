import { useOutletContext, Navigate } from "react-router";

// Admin only
export const AdminRoute = ({ children }) => {
  const { role } = useOutletContext();
  if (role === "admin") return children;
  return <Navigate to="/" replace />;
};

// Vendor only
export const VendorRoute = ({ children }) => {
  const { role } = useOutletContext();
  if (role === "vendor") return children;
  return <Navigate to="/" replace />;
};

// User only
// export const UserRoute = ({ children }) => {
//   const { role } = useOutletContext();
//   if (role === "user") return children;
//   return <Navigate to="/" replace />;
// };
