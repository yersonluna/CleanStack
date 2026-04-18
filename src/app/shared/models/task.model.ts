// 🛠️ Task model interface - Defines the structure of a task entity
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  categoryId: string;
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

// 🔄 Enum for task status values
export type TaskStatus = 'pending' | 'completed';

// 📋 Type for creating a new task (without id and timestamps)
export interface CreateTaskDTO {
  title: string;
  description?: string;
  categoryId: string;
}

// ✏️ Type for updating an existing task
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  categoryId?: string;
}
