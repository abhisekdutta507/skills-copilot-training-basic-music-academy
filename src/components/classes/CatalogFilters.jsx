export default function CatalogFilters({
    categories,
    category,
    level,
    search,
    onCategoryChange,
    onLevelChange,
    onSearchChange,
}) {
    return (
        <div className="filter-panel mb-4">
            <div className="row g-3 align-items-end">
                <div className="col-md-5">
                    <label className="form-label" htmlFor="instrumentFilter">
                        Filter by instrument type
                    </label>
                    <select
                        className="form-select"
                        id="instrumentFilter"
                        value={category}
                        onChange={e => onCategoryChange(e.target.value)}
                    >
                        <option value="all">All instruments</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label" htmlFor="levelFilter">
                        Filter by level
                    </label>
                    <select
                        className="form-select"
                        id="levelFilter"
                        value={level}
                        onChange={e => onLevelChange(e.target.value)}
                    >
                        <option value="all">All levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label" htmlFor="searchInput">Search</label>
                    <input
                        className="form-control"
                        id="searchInput"
                        type="search"
                        placeholder="Search classes"
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
