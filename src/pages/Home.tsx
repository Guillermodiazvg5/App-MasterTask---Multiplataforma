import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonBadge,
  IonLoading,
  IonAlert,
  IonCard,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonChip
} from '@ionic/react';
import { add, trash, create } from 'ionicons/icons';
import { useTasks } from '../hooks/useTasks';
import { Category, CategoryDisplay, CategoryColors } from '../models/task.interface';
import AddTaskModal from '../components/AddTaskModal';
import './Home.css';

const Home: React.FC = () => {
  const { 
    tasks, 
    loading, 
    storageInfo,
    createTask, 
    toggleTask, 
    deleteTask,
    clearAllTasks, 
    debugStorage
  } = useTasks();
  
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [showClearAlert, setShowClearAlert] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  // Actualizar estadísticas cuando cambien las tareas
  React.useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    setStats({ total, completed, pending });
  }, [tasks]);

  const handleAddTask = async (title: string, category: Category) => {
    await createTask(title, category);
  };

  const handleToggleTask = async (taskId: string) => {
    await toggleTask(taskId);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setDeleteTaskId(null);
  };

  const handleClearTasksConfirm = async () => {
    await clearAllTasks();
    setShowClearAlert(false);
  };

  const getCategoryColor = (category: Category) => {
    return CategoryColors[category] || 'medium';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>TaskMaster</IonTitle>
          <IonButton 
            slot="end" 
            color="light" 
            onClick={() => setShowClearAlert(true)}
            disabled={tasks.length === 0}
          >
            <IonIcon icon={trash} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={loading} message="Cargando tareas..." />
        
        {/* Alertas */}
        <IonAlert
          isOpen={showClearAlert}
          onDidDismiss={() => setShowClearAlert(false)}
          header={'Limpiar Todo'}
          message={'¿Estás seguro de que quieres eliminar TODAS las tareas?'}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Limpiar', handler: handleClearTasksConfirm }
          ]}
        />

        <IonAlert
          isOpen={deleteTaskId !== null}
          onDidDismiss={() => setDeleteTaskId(null)}
          header={'Eliminar Tarea'}
          message={'¿Estás seguro de que quieres eliminar esta tarea?'}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Eliminar', handler: () => deleteTaskId && handleDeleteTask(deleteTaskId) }
          ]}
        />

        {/* Modal para agregar tareas */}
        <AddTaskModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTask}
        />

        <div style={{ padding: '16px' }}>
          {/* Estado del Storage */}
          <IonCard color={storageInfo.usingFallback ? 'warning' : 'success'}>
            <IonCardContent style={{ padding: '12px' }}>
              <small>
                <strong>Almacenamiento:</strong> {storageInfo.storageType}
              </small>
            </IonCardContent>
          </IonCard>

          {/* Estadísticas */}
          <IonCard>
            <IonCardContent style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <IonBadge color="primary">{stats.total}</IonBadge>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Total</div>
                </div>
                <div>
                  <IonBadge color="success">{stats.completed}</IonBadge>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Completadas</div>
                </div>
                <div>
                  <IonBadge color="warning">{stats.pending}</IonBadge>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Pendientes</div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Lista de tareas */}
          <h3 style={{ margin: '16px 0 8px 0' }}>
            Mis Tareas {tasks.length > 0 && `(${tasks.length})`}
          </h3>
          
          {tasks.length === 0 && !loading && (
            <IonCard>
              <IonCardContent style={{ textAlign: 'center', padding: '40px 20px' }}>
                <IonIcon icon={create} style={{ fontSize: '48px', color: '#ccc' }} />
                <h3 style={{ color: '#666', margin: '16px 0 8px 0' }}>No hay tareas</h3>
                <p style={{ color: '#888', fontSize: '14px' }}>
                  Presiona el botón + para agregar tu primera tarea
                </p>
              </IonCardContent>
            </IonCard>
          )}

          <IonList>
            {tasks.map(task => (
              <IonItem key={task.id} className={task.completed ? 'task-completed' : ''}>
                <IonCheckbox 
                  slot="start" 
                  checked={task.completed}
                  onIonChange={() => handleToggleTask(task.id)}
                />
                <IonLabel>
                  <h3 style={{ margin: '0 0 4px 0' }}>{task.title}</h3>
                  <p style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IonChip color={getCategoryColor(task.category)}>
                      {CategoryDisplay[task.category]}
                    </IonChip>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {task.createdAt.toLocaleDateString()}
                    </span>
                  </p>
                </IonLabel>
                <IonButton 
                  slot="end" 
                  fill="clear" 
                  color="danger"
                  onClick={() => setDeleteTaskId(task.id)}
                >
                  <IonIcon icon={trash} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </div>

        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowAddModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;