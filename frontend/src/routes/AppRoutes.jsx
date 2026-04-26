import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../config";
import Home from "../pages/Home";
import ChatPage from "../pages/ChatPage";
import Register from "../pages/Register";
import Login from "../pages/Login";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/auth/checkAuth`, { withCredentials: true });
        if (!mounted) return;
        setAuthenticated(Boolean(res.data && res.data.authenticated));
      } catch (err) {
        console.error("Auth check error:", err);
        setAuthenticated(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null; // or a spinner
  return authenticated ? (children ? children : <Outlet />) : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/chatpage" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;








// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import axios from "axios";
// import { BaseUrl } from "../config";
// import Home from "../pages/Home";
// import ChatPage from "../pages/ChatPage";
// import Register from "../pages/Register";
// import Login from "../pages/Login";

// const AuthRoute = ({ children, isPrivate }) => {
//   const [loading, setLoading] = useState(true);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     let mounted = true;

//     const checkAuth = async () => {
//       try {
//         const res = await axios.get(`${BaseUrl}/api/auth/checkAuth`, {
//           withCredentials: true,
//         });

//         if (mounted) {
//           setAuthenticated(res.data?.authenticated === true);
//         }
//       } catch (error) {
//         if (mounted) {
//           console.error("Auth check error:", error);
//           setAuthenticated(false);
//         }
//       } finally {
//         if (mounted) {
//           setLoading(false);
//         }
//       }
//     };

//     checkAuth();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   if (isPrivate && !authenticated) {
//     return <Navigate to="/login"  />;
//   }

//   if (!isPrivate && authenticated) {
//     return <Navigate to="/chatpage"  />;
//   }

//   return children;
// };

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />

//         <Route
//           path="/chatpage"
//           element={
//             <AuthRoute isPrivate={true}>
//               <ChatPage />
//             </AuthRoute>
//           }
//         />

//         <Route
//           path="/login"
//           element={
//             <AuthRoute isPrivate={false}>
//               <Login />
//             </AuthRoute>
//           }
//         />

//         <Route
//           path="/register"
//           element={
//             <AuthRoute isPrivate={false}>
//               <Register />
//             </AuthRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;