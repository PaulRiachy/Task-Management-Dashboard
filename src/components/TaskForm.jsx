import { useEffect, useRef, useState } from "react";
import * as yup from "yup";

const taskSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Task title is required")
    .min(2, "Task title must be at least 2 characters"),

  description: yup
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters"),

  priority: yup
    .string()
    .oneOf(["Low", "Medium", "High"])
    .required(),

  status: yup
    .string()
    .oneOf(["Pending", "In Progress", "Completed"])
    .required(),
});

const emptyForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
};

function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [form, setForm] = useState(() =>
    editingTask
      ? {
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          status: editingTask.status,
        }
      : { ...emptyForm },
  );

  const [errors, setErrors] = useState({});

  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const validatedData = await taskSchema.validate(form, {
        abortEarly: false,
      });

      setErrors({});
      onSubmit(validatedData);

      if (!editingTask) {
        setForm(emptyForm);
        titleInputRef.current?.focus();
      }
    } catch (validationError) {
      const validationErrors = {};

      validationError.inner?.forEach((error) => {
        if (!validationErrors[error.path]) {
          validationErrors[error.path] = error.message;
        }
      });

      setErrors(validationErrors);
    }
  };

  const handleCancel = () => {
    onCancelEdit();
  };

  return (
    <section className="form-section">
      <div className="section-heading">
        <div>
          <h2>{editingTask ? "Edit Task" : "Add a New Task"}</h2>
          <p>
            {editingTask
              ? "Update the task details below."
              : "Create a task and keep your work organized."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="title">Task Title</label>
            <input
              ref={titleInputRef}
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Learn React Hooks"
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the task..."
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          {editingTask && (
            <button
              type="button"
              className="secondary-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

          <button type="submit" className="primary-button">
            {editingTask ? "Update Task" : "Save Task"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;