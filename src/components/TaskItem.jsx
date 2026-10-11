import { memo } from "react";

function TaskItem({ task, onEdit, onDelete }) {
  return (
    <article className="task-item">
      <div className="task-main">
        <div className="task-heading">
          <h3>{task.title}</h3>

          <span className={`status status-${task.status.toLowerCase().replaceAll(" ", "-")}`}>
            {task.status}
          </span>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          <span className={`priority priority-${task.priority.toLowerCase()}`}>
            {task.priority} Priority
          </span>

          <span>
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button className="edit-button" onClick={() => onEdit(task)}>
          Edit
        </button>

        <button className="delete-button" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default memo(TaskItem);