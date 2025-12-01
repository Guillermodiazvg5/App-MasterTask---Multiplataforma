import React, { useState, useEffect } from "react";
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
  IonChip,
  IonButtons,
  IonPopover,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { 
  add, 
  trash, 
  create, 
  ellipsisVertical,
  informationCircle,
  sunny,
  moon
} from "ionicons/icons";
import { useTasks } from "../hooks/useTasks";
import { useTaskFilters } from "../hooks/useTaskFilters";
import {
  Category,
  CategoryDisplay,
  CategoryColors,
} from "../models/task.interface";
import AddTaskModal from "../components/AddTaskModal";
import TaskFilters from "../components/TaskFilters";
import SearchBar from "../components/SearchBar";
import "./Home.css";

const Home: React.FC = () => {
  const {
    tasks,
    loading,
    storageInfo,
    createTask,
    toggleTask,
    deleteTask,
    clearAllTasks,
  } = useTasks();

  // Hook de filtros
  const {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    filterStats,
    getActiveFilterName,
    clearSearch,
  } = useTaskFilters(tasks);

  const [showClearAlert, setShowClearAlert] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuEvent, setMenuEvent] = useState<any>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Cargar preferencia del localStorage o detectar preferencia del sistema
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    // Si no hay preferencia guardada, usar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showDeleteCompletedAlert, setShowDeleteCompletedAlert] = useState(false);

  // Efecto para aplicar el tema
  useEffect(() => {
    const applyTheme = () => {
      if (darkMode) {
        // Aplicar modo oscuro
        document.body.classList.add('dark');
        document.body.setAttribute('data-theme', 'dark');
        // Para Ionic, también necesitamos actualizar el atributo en el elemento ion-app
        document.querySelector('ion-app')?.classList.add('ion-palette-dark');
        // Guardar en localStorage
        localStorage.setItem('darkMode', 'true');
      } else {
        // Aplicar modo claro
        document.body.classList.remove('dark');
        document.body.removeAttribute('data-theme');
        document.querySelector('ion-app')?.classList.remove('ion-palette-dark');
        localStorage.setItem('darkMode', 'false');
      }
    };

    applyTheme();
  }, [darkMode]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo cambiar si el usuario no ha establecido una preferencia manual
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };

    // Agregar listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Limpieza
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

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

  // Nueva función para eliminar tareas completadas
  const handleDeleteCompleted = async () => {
    const completedTasks = tasks.filter(task => task.completed);
    for (const task of completedTasks) {
      await deleteTask(task.id);
    }
    setShowDeleteCompletedAlert(false);
  };

  const getCategoryColor = (category: Category) => {
    return CategoryColors[category] || "medium";
  };

  // Abrir menú de opciones
  const openMenu = (e: React.MouseEvent) => {
    setMenuEvent(e.nativeEvent);
    setShowMenu(true);
  };

  // Alternar tema
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const completedCount = filterStats.completed;

  return (
    <IonPage>
      {/* ===== HEADER MEJORADO ===== */}
      <IonHeader className="mastertasks-header">
        <IonToolbar>
          {/* Título con icono */}
          <div slot="start" className="header-title-container">
            <IonIcon 
              icon={create} 
              color="primary" 
              className="header-logo"
            />
            <IonTitle className="app-title">
              MasterTasks
              {tasks.length > 0 && (
                <IonBadge color="medium" className="title-badge">
                  {tasks.length}
                </IonBadge>
              )}
            </IonTitle>
          </div>

          {/* Botones de acción */}
          <IonButtons slot="end">
            {/* Botón de tema claro/oscuro FUNCIONAL */}
            <IonButton 
              onClick={toggleTheme}
              fill="clear"
              size="small"
              className="theme-toggle"
              title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              <IonIcon 
                icon={darkMode ? sunny : moon} 
                slot="icon-only"
                color={darkMode ? "warning" : "dark"}
              />
            </IonButton>

            {/* Botón de menú */}
            <IonButton 
              onClick={openMenu}
              fill="clear"
              size="small"
              className="menu-button"
            >
              <IonIcon icon={ellipsisVertical} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* ===== POPOVER DE OPCIONES ===== */}
      <IonPopover
        isOpen={showMenu}
        event={menuEvent}
        onDidDismiss={() => setShowMenu(false)}
        side="bottom"
        alignment="end"
      >
        <IonContent>
          <IonList lines="full">
            <IonItem 
              button 
              detail={false}
              routerLink="/about"
              onClick={() => setShowMenu(false)}
            >
              <IonIcon slot="start" icon={informationCircle} />
              <IonLabel>Acerca de</IonLabel>
            </IonItem>
            
            {completedCount > 0 && (
              <IonItem 
                button 
                detail={false}
                onClick={() => {
                  setShowMenu(false);
                  setShowDeleteCompletedAlert(true);
                }}
                className="delete-completed-item"
              >
                <IonIcon slot="start" icon={trash} color="danger" />
                <IonLabel color="danger">Eliminar completadas</IonLabel>
                <IonBadge slot="end" color="danger">
                  {completedCount}
                </IonBadge>
              </IonItem>
            )}
            
            <IonItem 
              button 
              detail={false}
              onClick={() => {
                setShowMenu(false);
                setShowClearAlert(true);
              }}
              className="clear-all-item"
            >
              <IonIcon slot="start" icon={trash} color="danger" />
              <IonLabel color="danger">Eliminar todas</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>

      <IonContent fullscreen className="ion-padding">
        <IonLoading isOpen={loading} message="Cargando tareas..." />

        {/* ===== ALERTAS ===== */}
        <IonAlert
          isOpen={showClearAlert}
          onDidDismiss={() => setShowClearAlert(false)}
          header={"Limpiar Todo"}
          message={"¿Estás seguro de que quieres eliminar TODAS las tareas?"}
          buttons={[
            { text: "Cancelar", role: "cancel" },
            { text: "Limpiar", handler: handleClearTasksConfirm },
          ]}
        />

        <IonAlert
          isOpen={deleteTaskId !== null}
          onDidDismiss={() => setDeleteTaskId(null)}
          header={"Eliminar Tarea"}
          message={"¿Estás seguro de que quieres eliminar esta tarea?"}
          buttons={[
            { text: "Cancelar", role: "cancel" },
            {
              text: "Eliminar",
              handler: () => deleteTaskId && handleDeleteTask(deleteTaskId),
            },
          ]}
        />

        <IonAlert
          isOpen={showDeleteCompletedAlert}
          onDidDismiss={() => setShowDeleteCompletedAlert(false)}
          header="Eliminar tareas completadas"
          message={`¿Eliminar ${completedCount} tarea(s) completada(s)?`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: handleDeleteCompleted
            }
          ]}
        />

        {/* ===== MODAL PARA AGREGAR TAREAS ===== */}
        <AddTaskModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTask}
        />

        <div className="content-container">
          {/* Estado del Storage */}
          <IonCard color={storageInfo.usingFallback ? "warning" : "success"}>
            <IonCardContent className="storage-info">
              <small>
                <strong>Almacenamiento:</strong> {storageInfo.storageType}
              </small>
            </IonCardContent>
          </IonCard>

          {/* Estadísticas */}
          <IonCard>
            <IonCardContent className="stats-card">
              <div className="stats-container">
                <div className="stat-item">
                  <IonBadge color="primary">{filterStats.total}</IonBadge>
                  <div className="stat-label">Total</div>
                </div>
                <div className="stat-item">
                  <IonBadge color="success">{filterStats.completed}</IonBadge>
                  <div className="stat-label">Completadas</div>
                </div>
                <div className="stat-item">
                  <IonBadge color="warning">{filterStats.pending}</IonBadge>
                  <div className="stat-label">Pendientes</div>
                </div>
              </div>
              
              {/* Barra de búsqueda */}
              {SearchBar && (
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClearSearch={clearSearch}
                  resultsCount={filteredTasks.length}
                />
              )}
            </IonCardContent>
          </IonCard>

          {/* Filtros rápidos */}
          <div className="quick-filters">
            <IonSegment 
              value={activeFilter} 
              onIonChange={(e) => setActiveFilter(e.detail.value as any)}
              scrollable={true}
            >
              <IonSegmentButton value="all">
                <IonLabel>Todas</IonLabel>
                <IonBadge color="medium">{filterStats.total}</IonBadge>
              </IonSegmentButton>
              <IonSegmentButton value="pending">
                <IonLabel>Pendientes</IonLabel>
                <IonBadge color="warning">{filterStats.pending}</IonBadge>
              </IonSegmentButton>
              <IonSegmentButton value="completed">
                <IonLabel>Completadas</IonLabel>
                <IonBadge color="success">{filterStats.completed}</IonBadge>
              </IonSegmentButton>
            </IonSegment>
          </div>

          {/* Componente de Filtros */}
          {TaskFilters && (
            <TaskFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              filterStats={filterStats}
              searchQuery={searchQuery}
            />
          )}

          {/* Título de la lista */}
          <h3 className="list-title">
            {getActiveFilterName()} ({filteredTasks.length})
          </h3>

          {/* Lista vacía */}
          {filteredTasks.length === 0 && !loading && (
            <IonCard className="empty-state">
              <IonCardContent>
                <IonIcon icon={create} className="empty-icon" />
                <h3>
                  {activeFilter === "completed"
                    ? "No hay tareas completadas"
                    : activeFilter === "pending"
                    ? "No hay tareas pendientes"
                    : searchQuery
                    ? "No se encontraron resultados"
                    : "No hay tareas"}
                </h3>
                <p>
                  {searchQuery
                    ? "Intenta con otros términos de búsqueda"
                    : activeFilter === "all"
                    ? "Presiona el botón + para agregar tu primera tarea"
                    : "Cambia el filtro o crea nuevas tareas"}
                </p>
              </IonCardContent>
            </IonCard>
          )}

          {/* Lista de tareas */}
          <IonList className="task-list">
            {filteredTasks.map((task) => (
              <IonItem
                key={task.id}
                className={`task-item ${task.completed ? "task-completed" : ""}`}
                lines="full"
              >
                <IonCheckbox
                  slot="start"
                  checked={task.completed}
                  onIonChange={() => handleToggleTask(task.id)}
                  className="task-checkbox"
                />
                <IonLabel className="task-content">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-meta">
                    <IonChip 
                      color={getCategoryColor(task.category)}
                      className="category-chip"
                    >
                      {CategoryDisplay[task.category]}
                    </IonChip>
                    <span className="task-date">
                      {task.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </IonLabel>
                <IonButton
                  slot="end"
                  fill="clear"
                  color="danger"
                  onClick={() => setDeleteTaskId(task.id)}
                  className="delete-task-button"
                  size="small"
                >
                  <IonIcon icon={trash} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </div>

        {/* ===== BOTÓN FLOTANTE ===== */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowAddModal(true)} className="add-task-fab">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;