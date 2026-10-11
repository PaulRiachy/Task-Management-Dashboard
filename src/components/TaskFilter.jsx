function TaskFilter({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}) {
  return (
    <section className="filter-panel">
      <input
        type="text"
        placeholder="Search tasks by title..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="filter-row">
        <div className="status-filters">
          {["All", "Pending", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              className={statusFilter === status ? "active" : ""}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </section>
  );
}

export default TaskFilter;