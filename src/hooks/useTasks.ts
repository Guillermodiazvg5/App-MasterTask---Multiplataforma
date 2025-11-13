import { useState, useEffect } from 'react';
import { Task, Category } from '../models/task.interface';
import { taskService } from '../services/task.service';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState({ 
    usingFallback: false, 
    storageType: 'Checking...',
    isNative: false 
  });

  // Verificar storage al iniciar
  useEffect(() => {
    const initialize = async () => {
      console.log('🔧 Inicializando aplicación...');
      
      try {
        // Obtener información del storage
        const info = taskService.getStorageInfo();
        setStorageInfo(info);
        
        // Testear el storage (con manejo de error por si no existe)
        let storageWorking = false;
        try {
          if (typeof taskService.testStorage === 'function') {
            storageWorking = await taskService.testStorage();
          } else {
            console.warn('⚠️ testStorage no disponible, continuando...');
            storageWorking = true;
          }
        } catch (error) {
          console.warn('⚠️ Test de storage falló, continuando...', error);
          storageWorking = true;
        }
        
        // Cargar tareas independientemente del test
        await loadTasks();
        
      } catch (error) {
        console.error('❌ Error en inicialización:', error);
        setLoading(false);
      }
    };
    
    initialize();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const loadedTasks = await taskService.getTasks();
      console.log('📦 Tareas cargadas:', loadedTasks);
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]); // Asegurar que tasks sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (title: string, category: Category) => {
    console.log('➕ Creando tarea:', { title, category });
    const newTask = await taskService.createTask(title, category);
    await loadTasks();
    return newTask;
  };

  const toggleTask = async (id: string) => {
    console.log('🔄 Cambiando estado de tarea:', id);
    await taskService.toggleTaskCompletion(id);
    await loadTasks();
  };

  const deleteTask = async (id: string) => {
    console.log('🗑️ Eliminando tarea:', id);
    await taskService.deleteTask(id);
    await loadTasks();
  };

  const clearAllTasks = async () => {
    console.log('🧹 Limpiando todas las tareas');
    await taskService.clearAllTasks();
    await loadTasks();
  };

  const debugStorage = async () => {
    console.log('🔍 Ejecutando debug completo...');
    return await taskService.debugStorage();
  };

  const testStorage = async () => {
    if (typeof taskService.testStorage === 'function') {
      return await taskService.testStorage();
    }
    return false;
  };

  return {
    tasks,
    loading,
    storageInfo,
    createTask,
    toggleTask,
    deleteTask,
    clearAllTasks,
    debugStorage,
    testStorage,
    refreshTasks: loadTasks
  };
};