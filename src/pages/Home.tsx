import React, { useState } from "react";
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
} from "@ionic/react";
import { add, trash, create } from "ionicons/icons";
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
    debugStorage,
  } = useTasks();

  // Hook de filtros
  const {
    activeFilter,
    setActiveFilter,
    searchQuery, // ← NUEVO
    setSearchQuery, // ← NUEVO
    filteredTasks,
    filterStats,
    getActiveFilterName,
    clearSearch, // ← NUEVO
  } = useTaskFilters(tasks);

  const [showClearAlert, setShowClearAlert] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

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
    return CategoryColors[category] || "medium";
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>MasterTasks</IonTitle>
          <IonButton
            slot="start"
            fill="clear"
            color="light"
            routerLink="/about"
            style={{ marginLeft: "8px" }}
          >
            Acerca de
          </IonButton>
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

        {/* Modal para agregar tareas */}
        <AddTaskModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTask}
        />

        <div style={{ padding: "16px" }}>
          {/* Estado del Storage */}
          <IonCard color={storageInfo.usingFallback ? "warning" : "success"}>
            <IonCardContent style={{ padding: "12px" }}>
              <small>
                <strong>Almacenamiento:</strong> {storageInfo.storageType}
              </small>
            </IonCardContent>
          </IonCard>

          {/* Estadísticas */}
          <IonCard>
            <IonCardContent style={{ textAlign: "center", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                  <IonBadge color="primary">{filterStats.total}</IonBadge>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    Total
                  </div>
                </div>
                <div>
                  <IonBadge color="success">{filterStats.completed}</IonBadge>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    Completadas
                  </div>
                </div>
                <div>
                  <IonBadge color="warning">{filterStats.pending}</IonBadge>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    Pendientes
                  </div>
                </div>
              </div>
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClearSearch={clearSearch}
                resultsCount={filteredTasks.length}
              />
            </IonCardContent>
          </IonCard>

          {/* Lista de tareas */}
          <h3 style={{ margin: "16px 0 8px 0" }}>
            {getActiveFilterName()} ({filteredTasks.length})
          </h3>

          {/* Componente de Filtros */}
          <TaskFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            filterStats={filterStats}
            searchQuery={searchQuery} // ← NUEVA PROP
          />

          {filteredTasks.length === 0 && !loading && (
            <IonCard>
              <IonCardContent
                style={{ textAlign: "center", padding: "40px 20px" }}
              >
                <IonIcon
                  icon={create}
                  style={{ fontSize: "48px", color: "#ccc" }}
                />
                <h3 style={{ color: "#666", margin: "16px 0 8px 0" }}>
                  {activeFilter === "completed"
                    ? "No hay tareas completadas"
                    : activeFilter === "pending"
                    ? "No hay tareas pendientes"
                    : "No hay tareas"}
                </h3>
                <p style={{ color: "#888", fontSize: "14px" }}>
                  {activeFilter === "all"
                    ? "Presiona el botón + para agregar tu primera tarea"
                    : "Cambia el filtro o crea nuevas tareas"}
                </p>
              </IonCardContent>
            </IonCard>
          )}

          <IonList>
            {filteredTasks.map((task) => (
              <IonItem
                key={task.id}
                className={task.completed ? "task-completed" : ""}
              >
                <IonCheckbox
                  slot="start"
                  checked={task.completed}
                  onIonChange={() => handleToggleTask(task.id)}
                />
                <IonLabel>
                  <h3 style={{ margin: "0 0 4px 0" }}>{task.title}</h3>
                  <p
                    style={{
                      margin: "0",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <IonChip color={getCategoryColor(task.category)}>
                      {CategoryDisplay[task.category]}
                    </IonChip>
                    <span style={{ fontSize: "12px", color: "#666" }}>
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
