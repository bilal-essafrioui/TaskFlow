import styles from './Sidebar.module.css';
interface Project { id: string; name: string; color: string; }
interface SidebarProps { 
  projects: Project[]; 
  isOpen: boolean;
  onRename?: (project: Project) => void;
  onDelete?: (id: string) => void;
}
export default function Sidebar({ projects, isOpen, onRename, onDelete }: SidebarProps) {
 return (
 <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
 <h2 className={styles.title}>Mes Projets</h2>
 <ul className={styles.list}>
 {projects.map(p => (
 <li key={p.id} className={styles.item}>
   <div className={styles.itemContent}>
     <span className={styles.dot} style={{ background: p.color }} />
     <span className={styles.name}>{p.name}</span>
   </div>
   <div className={styles.actions}>
     {onRename && <button className={styles.actionBtn} onClick={() => onRename(p)}>✏️</button>}
     {onDelete && <button className={styles.actionBtn} onClick={() => onDelete(p.id)}>❌</button>}
   </div>
 </li>
 ))}
 </ul>
 </aside>
 );
}