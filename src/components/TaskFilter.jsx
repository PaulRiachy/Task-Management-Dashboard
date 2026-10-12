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
      <div className="search-box">
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>

        <input
          id="task-search"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

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

        <div className="sort-control">
          <label htmlFor="task-sort">Sort by:</label>

          <select
            id="task-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default TaskFilter;