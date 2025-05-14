<?php
// Get notification count (this would come from the database in a real app)
$notificationCount = 3;

// Mock user data
$user = [
    'name' => 'DREYZIE',
    'email' => 'admin@university.edu',
    'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    'role' => 'Administrator'
];
?>

<div class="dashboard-container">
    <div class="dashboard-welcome">
        <h1>Welcome, <?php echo $user['name']; ?>!</h1>
        <p>Academic Scheduler Dashboard</p>
    </div>
    
    <div class="dashboard-cards">
        <div class="card dashboard-card">
            <div class="card-content">
                <div class="dashboard-card-icon">
                    <i class="fas fa-calendar-days"></i>
                </div>
                <div class="dashboard-card-info">
                    <h3>Timetable Grid</h3>
                    <p>View and manage the academic schedule</p>
                </div>
            </div>
            <div class="card-footer">
                <a href="index.php?page=timetable" class="btn btn-primary">Open Timetable</a>
            </div>
        </div>
        
        <div class="card dashboard-card">
            <div class="card-content">
                <div class="dashboard-card-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="dashboard-card-info">
                    <h3>Resource Management</h3>
                    <p>Manage rooms, teachers, subjects, and class sections</p>
                </div>
            </div>
            <div class="card-footer">
                <a href="index.php?page=resources" class="btn btn-primary">Manage Resources</a>
            </div>
        </div>
        
        <div class="card dashboard-card">
            <div class="card-content">
                <div class="dashboard-card-icon">
                    <i class="fas fa-book"></i>
                </div>
                <div class="dashboard-card-info">
                    <h3>Schedule Generator</h3>
                    <p>Generate conflict-free academic schedules</p>
                </div>
            </div>
            <div class="card-footer">
                <a href="index.php?page=generator" class="btn btn-primary">Generate Schedule</a>
            </div>
        </div>
    </div>
    
    <div class="dashboard-stats">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">System Statistics</h3>
            </div>
            <div class="card-content">
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">24</div>
                        <div class="stat-label">Rooms</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">42</div>
                        <div class="stat-label">Teachers</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">86</div>
                        <div class="stat-label">Subjects</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">128</div>
                        <div class="stat-label">Class Sections</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.dashboard-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.dashboard-welcome {
    margin-bottom: 1rem;
}

.dashboard-welcome h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.dashboard-welcome p {
    color: var(--muted-foreground);
}

.dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.dashboard-card {
    display: flex;
    flex-direction: column;
}

.dashboard-card .card-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.dashboard-card-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: var(--primary);
    color: var(--primary-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.dashboard-card-info h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.dashboard-card-info p {
    color: var(--muted-foreground);
    font-size: 0.875rem;
}

.dashboard-stats {
    margin-top: 1rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

.stat-item {
    text-align: center;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
}

.stat-label {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    margin-top: 0.25rem;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
