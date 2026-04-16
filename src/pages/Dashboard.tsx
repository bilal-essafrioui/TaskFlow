import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../features/auth/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';
import HeaderMUI from '../components/HeaderMUI';

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

export default function Dashboard() {
  const { state: authState, dispatch } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const dangerousName = '<img src=x onerror=alert("HACK")>';
 
  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);

        setProjects(projRes.data);
        setColumns(colRes.data);

      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  
  async function addProject(name: string, color: string) {
    setSaving(true);
    setError(null);

    try {
      const { data } = await api.post('/projects', { name, color });

      setProjects(prev => [...prev, data]);

      return true;

    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
          `Erreur ${err.response?.status}`
        );
      } else {
        setError('Erreur inconnue');
      }

      return false; // 
    } finally {
      setSaving(false);
    }
  }

  async function renameProject(project: Project) {
    const newName = prompt('Nouveau nom :', project.name);

    if (!newName || newName.trim() === '' || newName === project.name) {
      return;
    }

    setError(null);

    try {
      const { data } = await api.put('/projects/' + project.id, {
        ...project,
        name: newName
      });

      setProjects(prev =>
        prev.map(p => (p.id === project.id ? data : p))
      );

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
      } else {
        setError('Erreur inconnue');
      }
    }
  }

  async function deleteProject(id: string) {
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer ce projet ?');
    if (!confirmed) return;

    setError(null);

    try {
      await api.delete('/projects/' + id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
      } else {
        setError('Erreur inconnue');
      }
    }
  }

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  return (
    <div className={styles.layout}>
      <p>{dangerousName}</p>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      
      {/* <HeaderMUI/>*/}

      <div className={styles.body}>
        <Sidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRename={renameProject}
          onDelete={deleteProject}
        />

        <div className={styles.content}>
          <div className={styles.toolbar}>

            {/* ✅ ERROR DISPLAY */}
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            {!showForm ? (
              <button
                className={styles.addBtn}
                onClick={() => {
                  setError(null); // reset error
                  setShowForm(true);
                }}
              >
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel={saving ? "Création..." : "Créer"}
                onSubmit={async (name, color) => {
                  const success = await addProject(name, color);

                  if (success) {
                    setShowForm(false);
                  }
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>

          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}