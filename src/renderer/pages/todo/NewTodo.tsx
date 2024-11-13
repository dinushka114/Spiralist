import React, { useState } from 'react';

interface TodoItem {
  id: number;
  task: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<TodoItem[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskText, setEditTaskText] = useState<string>('');
  const [editTaskDueDate, setEditTaskDueDate] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const addTask = () => {
    if (newTask && newDueDate) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          task: newTask,
          isCompleted: false,
          priority: 'low',
          dueDate: newDueDate,
        },
      ]);
      setNewTask('');
      setNewDueDate('');
    }
  };

  const editTask = () => {
    if (editTaskText && editTaskDueDate) {
      setTasks(
        tasks.map((task) =>
          task.id === editTaskId
            ? { ...task, task: editTaskText, dueDate: editTaskDueDate }
            : task
        )
      );
      setIsEditing(false);
      setEditTaskId(null);
      setEditTaskText('');
      setEditTaskDueDate('');
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const changePriority = (id: number, priority: 'low' | 'medium' | 'high') => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, priority } : task
      )
    );
  };

  const handleDueDateReminder = (dueDate: string) => {
    const now = new Date();
    const taskDueDate = new Date(dueDate);
    const timeDiff = taskDueDate.getTime() - now.getTime();
    if (timeDiff <= 86400000 && timeDiff >= 0) {
      setNotification('Reminder: Task is due within 24 hours!');
    } else {
      setNotification(null);
    }
  };

  const renderPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <span className="badge bg-danger">High</span>;
      case 'medium':
        return <span className="badge bg-warning text-dark">Medium</span>;
      case 'low':
        return <span className="badge bg-success">Low</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <h3>Todo List</h3>

      {/* Add New Task */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="New task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          className="form-control mt-2"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={addTask}>
          Add Task
        </button>
      </div>

      {/* Notification */}
      {notification && <div className="alert alert-warning">{notification}</div>}

      {/* Task List */}
      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`list-group-item d-flex align-items-center ${
              task.isCompleted ? 'list-group-item-success' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleCompletion(task.id)}
              className="form-check-input me-2"
            />
            <span>{task.task}</span>
            <div className="ms-auto d-flex align-items-center">
              {renderPriorityIcon(task.priority)}

              {/* Edit / Delete Task */}
              <button
                className="btn btn-link text-decoration-none mx-2"
                onClick={() => {
                  setIsEditing(true);
                  setEditTaskId(task.id);
                  setEditTaskText(task.task);
                  setEditTaskDueDate(task.dueDate);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-link text-decoration-none"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Task Form (Shown only when editing) */}
      {isEditing && (
        <div className="mt-3">
          <input
            type="text"
            className="form-control mb-2"
            value={editTaskText}
            onChange={(e) => setEditTaskText(e.target.value)}
          />
          <input
            type="date"
            className="form-control mb-2"
            value={editTaskDueDate}
            onChange={(e) => setEditTaskDueDate(e.target.value)}
          />
          <button className="btn btn-success" onClick={editTask}>
            Save Changes
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
