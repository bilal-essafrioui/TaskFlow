import { useState, useEffect } from "react";
import { useAuth } from "./features/auth/AuthContext.tsx";
import Login from "./features/auth/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Tooltip from "./components/Tooltip.tsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import ProtectedRoute from "./components/ProtectedRoute";

interface Project {
  id: string;
  name: string;
  color: string;
}

interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function App() {
  return (
    <Routes>
      <Route
        path='/login'
        element={<Login />}
      />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/projects/:id'
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path='/'
        element={
          <Navigate
            to='/dashboard'
            replace
          />
        }
      />
      <Route
        path='*'
        element={
          <Navigate
            to='/dashboard'
            replace
          />
        }
      />
    </Routes>
  );
}

// function Dashboard() {
//   const { state: authState, dispatch } = useAuth();

//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [columns, setColumns] = useState<Column[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Chargement des données au montage
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [projRes, colRes] = await Promise.all([
//           fetch("http://localhost:4000/projects"),
//           fetch("http://localhost:4000/columns"),
//         ]);
//         setProjects(await projRes.json());
//         setColumns(await colRes.json());
//       } catch (error) {
//         console.error("Erreur:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   if (loading) return <div style={{ padding: "2rem" }}>Chargement...</div>;

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
//       <Header
//         title='TaskFlow'
//         onMenuClick={() => setSidebarOpen((p) => !p)}
//         userName={authState.user?.name}
//         onLogout={() => dispatch({ type: "LOGOUT" })}
//       />

//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         <Sidebar
//           projects={projects}
//           isOpen={sidebarOpen}
//         />

//         <div style={{ flex: 1, overflow: "auto" }}>
//           <Tooltip />
//           <MainContent columns={columns} />
//         </div>
//       </div>
//     </div>
//   );
// }
