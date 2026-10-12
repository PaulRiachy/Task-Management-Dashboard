import { useCallback, useMemo, useState, useRef, useEffect } from "react";
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

  function createTaskId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  const isValidTasks = (value) => {
    return (
      Array.isArray(value) &&
      value.every(
        (task) =>
          task &&
          typeof task === "object" &&
          typeof task.id === "string" &&
          typeof task.title === "string" &&
          typeof task.description === "string" &&
          ["Low", "Medium", "High"].includes(task.priority) &&
          ["Pending", "In Progress", "Completed"].includes(task.status) &&
          typeof task.createdAt === "string"
      )
    );
  };

  const [tasks, setTasks] = useLocalStorage(
    "tasks",
    [],
    isValidTasks
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editSession, setEditSession] = useState(0);
  const modalRef = useRef(null);

  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    if (!taskToDelete) {
      return;
    }

    const modal = modalRef.current;

    if (!modal) {
      return;
    }

    const previousActiveElement = document.activeElement;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    firstFocusableElement?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setTaskToDelete(null);
        return;
      }

      if (event.key === "Tab" && focusableElements.length > 0) {
        if (
          event.shiftKey &&
          document.activeElement === firstFocusableElement
        ) {
          event.preventDefault();
          lastFocusableElement.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === lastFocusableElement
        ) {
          event.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [taskToDelete]);

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
      id: createTaskId(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      createdAt: new Date().toISOString(),
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
  };

  const handleEdit = useCallback((task) => {
    setEditingTask({ ...task });
    setEditSession((current) => current + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

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
          key={`${editingTask?.id ?? "new"}-${editSession}`}
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
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              cancelDelete();
            }
          }}
        >
          <div
            ref={modalRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            tabIndex="-1"
          >

            <h2 id="delete-modal-title">Delete Task?</h2>

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