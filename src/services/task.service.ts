import { Storage } from '@ionic/storage';
import { Preferences } from '@capacitor/preferences';
import { Task, Category } from '../models/task.interface';
import { v4 as uuidv4 } from 'uuid';

// Detectar si estamos en navegador o dispositivo nativo
const isNativePlatform = () => {
  return typeof (window as any).Capacitor !== 'undefined';
};

class TaskService {
  private storage: Storage | null = null;
  private readonly STORAGE_KEY = 'tasks';
  private initialized = false;
  private useFallback = false;
  private fallbackStorage = new Map<string, any>();
  private useCapacitor = isNativePlatform();

  constructor() {
    this.initStorage();
  }

  private async initStorage() {
    try {
      console.log('🔧 Inicializando sistema de almacenamiento...');
      
      if (this.useCapacitor) {
        // ✅ EN DISPOSITIVO MÓVIL - Usar Capacitor Preferences (SQLite)
        console.log('📱 Usando Capacitor Preferences (SQLite) para móvil');
        this.initialized = true;
        this.useFallback = false;
      } else {
        // ✅ EN NAVEGADOR - Usar Ionic Storage
        console.log('🌐 Usando Ionic Storage para navegador');
        this.storage = new Storage({
          name: '__taskmasterdb',
          driverOrder: ['localstorage', 'indexeddb', 'websql']
        });
        
        await this.storage.create();
        this.initialized = true;
        this.useFallback = false;
      }
      
      console.log('✅ Sistema de almacenamiento inicializado correctamente');
    } catch (error) {
      console.warn('⚠️ Storage falló, usando almacenamiento en memoria:', error);
      this.useFallback = true;
      this.initialized = true;
    }
  }

  private async ensureStorageReady(): Promise<void> {
    if (!this.initialized) {
      await this.initStorage();
    }
  }

  // CREATE - Crear nueva tarea
  async createTask(title: string, category: Category): Promise<Task> {
    await this.ensureStorageReady();
    
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      category: category,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('🆕 Creando tarea:', newTask);

    const serializedTask = {
      ...newTask,
      createdAt: newTask.createdAt.toISOString(),
      updatedAt: newTask.updatedAt.toISOString()
    };

    if (this.useFallback) {
      // 🟡 ALMACENAMIENTO EN MEMORIA (solo desarrollo)
      const tasks = this.fallbackStorage.get(this.STORAGE_KEY) || [];
      tasks.push(serializedTask);
      this.fallbackStorage.set(this.STORAGE_KEY, tasks);
      console.log('💾 Tarea guardada en memoria (temporal)');
    } else if (this.useCapacitor) {
      // ✅ CAPACITOR PREFERENCES (Móvil - Persistente)
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      const tasks = value ? JSON.parse(value) : [];
      tasks.push(serializedTask);
      await Preferences.set({ key: this.STORAGE_KEY, value: JSON.stringify(tasks) });
      console.log('💾 Tarea guardada con Capacitor (SQLite)');
    } else {
      // ✅ IONIC STORAGE (Navegador)
      const tasks = (await this.storage!.get(this.STORAGE_KEY)) || [];
      tasks.push(serializedTask);
      await this.storage!.set(this.STORAGE_KEY, tasks);
      console.log('💾 Tarea guardada con Ionic Storage');
    }

    return newTask;
  }

  // READ - Obtener todas las tareas
  async getTasks(): Promise<Task[]> {
    await this.ensureStorageReady();

    let tasks: any[] = [];

    if (this.useFallback) {
      // 🟡 MEMORIA
      tasks = this.fallbackStorage.get(this.STORAGE_KEY) || [];
      console.log('📥 Obteniendo tareas desde memoria:', tasks.length);
    } else if (this.useCapacitor) {
      // ✅ CAPACITOR
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      tasks = value ? JSON.parse(value) : [];
      console.log('📥 Obteniendo tareas desde Capacitor:', tasks.length);
    } else {
      // ✅ IONIC STORAGE
      tasks = (await this.storage!.get(this.STORAGE_KEY)) || [];
      console.log('📥 Obteniendo tareas desde Ionic Storage:', tasks.length);
    }

    // Convertir strings de fecha a objetos Date
    return tasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      category: task.category,
      createdAt: new Date(task.createdAt),
      updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(task.createdAt)
    }));
  }

  // UPDATE - Marcar como completada/pendiente
  async toggleTaskCompletion(id: string): Promise<boolean> {
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      tasks[taskIndex].updatedAt = new Date();
      
      const tasksForStorage = tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      }));

      if (this.useFallback) {
        this.fallbackStorage.set(this.STORAGE_KEY, tasksForStorage);
      } else if (this.useCapacitor) {
        await Preferences.set({ 
          key: this.STORAGE_KEY, 
          value: JSON.stringify(tasksForStorage) 
        });
      } else {
        await this.storage!.set(this.STORAGE_KEY, tasksForStorage);
      }
      
      console.log('🔄 Tarea actualizada');
      return true;
    }
    
    return false;
  }

  // DELETE - Eliminar tarea
  async deleteTask(id: string): Promise<boolean> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length !== tasks.length) {
      const tasksForStorage = filteredTasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: (task.updatedAt || task.createdAt).toISOString()
      }));

      if (this.useFallback) {
        this.fallbackStorage.set(this.STORAGE_KEY, tasksForStorage);
      } else if (this.useCapacitor) {
        await Preferences.set({ 
          key: this.STORAGE_KEY, 
          value: JSON.stringify(tasksForStorage) 
        });
      } else {
        await this.storage!.set(this.STORAGE_KEY, tasksForStorage);
      }
      return true;
    }
    
    return false;
  }

  // Obtener estadísticas
  async getTaskStats() {
    const tasks = await this.getTasks();
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    return { total, completed, pending };
  }

  // Limpiar todas las tareas
  async clearAllTasks(): Promise<void> {
    await this.ensureStorageReady();

    if (this.useFallback) {
      this.fallbackStorage.delete(this.STORAGE_KEY);
      console.log('🧹 Tareas eliminadas de memoria');
    } else if (this.useCapacitor) {
      await Preferences.remove({ key: this.STORAGE_KEY });
      console.log('🧹 Tareas eliminadas de Capacitor Storage');
    } else {
      await this.storage!.remove(this.STORAGE_KEY);
      console.log('🧹 Tareas eliminadas de Ionic Storage');
    }
  }

  // DEBUG: Ver información del storage
  async debugStorage() {
    await this.ensureStorageReady();

    let info: any = {};

    if (this.useFallback) {
      const tasks = this.fallbackStorage.get(this.STORAGE_KEY) || [];
      info = {
        storageType: 'Memory Fallback',
        keys: Array.from(this.fallbackStorage.keys()),
        tasks: tasks,
        tasksCount: tasks.length
      };
    } else if (this.useCapacitor) {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      const tasks = value ? JSON.parse(value) : [];
      info = {
        storageType: 'Capacitor Preferences (SQLite)',
        keys: [this.STORAGE_KEY],
        tasks: tasks,
        tasksCount: tasks.length
      };
    } else {
      const keys = await this.storage!.keys();
      const tasks = await this.storage!.get(this.STORAGE_KEY);
      info = {
        storageType: 'Ionic Storage',
        keys: keys,
        tasks: tasks,
        tasksCount: tasks ? tasks.length : 0
      };
    }

    console.log('🔍 DEBUG Storage:', info);
    return info;
  }

  // Agregar este método en la clase TaskService (antes del getStorageInfo)

// Verificar si el storage funciona
async testStorage(): Promise<boolean> {
  await this.ensureStorageReady();

  if (this.useFallback) {
    console.log('🧪 Test - Usando almacenamiento en memoria');
    return true;
  } else if (this.useCapacitor) {
    // Test para Capacitor
    try {
      const testKey = 'storage_test';
      const testValue = { 
        message: 'Capacitor Storage funciona!', 
        timestamp: new Date().toISOString() 
      };
      
      await Preferences.set({ key: testKey, value: JSON.stringify(testValue) });
      const { value } = await Preferences.get({ key: testKey });
      await Preferences.remove({ key: testKey });
      
      const retrieved = value ? JSON.parse(value) : null;
      console.log('🧪 Test de Capacitor Storage exitoso');
      return retrieved !== null && retrieved.message === testValue.message;
    } catch (error) {
      console.error('❌ Test de Capacitor Storage falló:', error);
      return false;
    }
  } else {
    // Test para Ionic Storage
    try {
      const testKey = 'storage_test';
      const testValue = { 
        message: 'Ionic Storage funciona!', 
        timestamp: new Date().toISOString() 
      };
      
      await this.storage!.set(testKey, testValue);
      const retrieved = await this.storage!.get(testKey);
      await this.storage!.remove(testKey);
      
      console.log('🧪 Test de Ionic Storage exitoso');
      return retrieved !== null && retrieved.message === testValue.message;
    } catch (error) {
      console.error('❌ Test de Ionic Storage falló:', error);
      return false;
    }
  }
}

  // Obtener información del storage
  getStorageInfo() {
    let storageType = '';
    
    if (this.useFallback) {
      storageType = 'Memory (Temporal)';
    } else if (this.useCapacitor) {
      storageType = 'Capacitor (SQLite - Persistente)';
    } else {
      storageType = 'Ionic Storage (Persistente)';
    }

    return {
      usingFallback: this.useFallback,
      storageType: storageType,
      isNative: this.useCapacitor
    };
  }
}

export const taskService = new TaskService();