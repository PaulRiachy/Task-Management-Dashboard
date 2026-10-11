function TaskStatistics({ statistics }) {
  return (
    <section className="statistics">
      <div className="stat-card">
        <span className="stat-label">Total Tasks</span>
        <strong>{statistics.total}</strong>
      </div>

      <div className="stat-card pending-stat">
        <span className="stat-label">Pending</span>
        <strong>{statistics.pending}</strong>
      </div>

      <div className="stat-card progress-stat">
        <span className="stat-label">In Progress</span>
        <strong>{statistics.inProgress}</strong>
      </div>

      <div className="stat-card completed-stat">
        <span className="stat-label">Completed</span>
        <strong>{statistics.completed}</strong>
      </div>
    </section>
  );
}

export default TaskStatistics;