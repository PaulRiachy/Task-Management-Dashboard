import { useCallback, useMemo, useState } from "react";
import TaskFilter from "./components/TaskFilter";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskStatistics from "./components/TaskStatistics";
import useLocalStorage from "./hooks/useLocalStorage";
import { useTheme } from "./context/ThemeContext";

const priorityOrder = {
  High: 1,
  Medium: 2,
  Low: 3,
};

function App() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const { darkMode, toggleTheme } = useTheme();

  const statistics = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "Pending").length,
      inProgress: tasks.filter((task) => task.status === "In Progress").length,
      completed: tasks.filter((task) => task.status === "Completed").length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortBy === "priority") {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return 0;
    });
  }, [tasks, search, statusFilter, sortBy]);

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...taskData,
              }
            : task
        )
      );

      setEditingTask(null);
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      createdAt: new Date().toISOString(),
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
  };

  const handleEdit = (task) => {
    setEditingTask(task);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = useCallback((task) => {
    setTaskToDelete(task);
  }, []);

  const confirmDelete = () => {
    if (!taskToDelete) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskToDelete.id)
    );

    if (editingTask?.id === taskToDelete.id) {
      setEditingTask(null);
    }

    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">TaskFlow</div>

        <div className="header-actions">
          <span>{tasks.length} Tasks</span>

          <button className="theme-button" onClick={toggleTheme}>
            {darkMode ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <h1>Task Dashboard</h1>
            <p>Track and organize your daily work.</p>
          </div>
        </section>

        <TaskStatistics statistics={statistics} />

        <TaskForm
          onSubmit={handleSaveTask}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>Your Tasks</h2>
              <p>
                {filteredTasks.length} of {tasks.length} tasks displayed
              </p>
            </div>
          </div>

          <TaskFilter
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <TaskList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>

      {taskToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Delete Task?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{taskToDelete.title}</strong>?
            </p>

            <div className="modal-actions">
              <button className="secondary-button" onClick={cancelDelete}>
                Cancel
              </button>

              <button className="delete-confirm-button" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;