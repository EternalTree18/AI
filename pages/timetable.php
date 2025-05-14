<?php
// Mock data for the timetable
$days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
$timeSlots = [
    '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

// Sample class sessions with some conflicts
$classSessions = [
    [
        'id' => '1',
        'subject' => 'Mathematics 101',
        'teacher' => 'Dr. Smith',
        'room' => 'Room 201',
        'section' => 'Section A',
        'day' => 'Monday',
        'startTime' => '9:00 AM',
        'endTime' => '10:00 AM',
        'hasConflict' => false
    ],
    [
        'id' => '2',
        'subject' => 'Physics 202',
        'teacher' => 'Prof. Johnson',
        'room' => 'Lab 101',
        'section' => 'Section B',
        'day' => 'Monday',
        'startTime' => '11:00 AM',
        'endTime' => '1:00 PM',
        'hasConflict' => false
    ],
    [
        'id' => '3',
        'subject' => 'Computer Science 303',
        'teacher' => 'Dr. Williams',
        'room' => 'Room 105',
        'section' => 'Section C',
        'day' => 'Tuesday',
        'startTime' => '8:00 AM',
        'endTime' => '10:00 AM',
        'hasConflict' => false
    ],
    [
        'id' => '4',
        'subject' => 'English Literature',
        'teacher' => 'Prof. Davis',
        'room' => 'Room 302',
        'section' => 'Section A',
        'day' => 'Wednesday',
        'startTime' => '1:00 PM',
        'endTime' => '3:00 PM',
        'hasConflict' => false
    ],
    [
        'id' => '5',
        'subject' => 'Chemistry 101',
        'teacher' => 'Dr. Smith',
        'room' => 'Lab 202',
        'section' => 'Section D',
        'day' => 'Wednesday',
        'startTime' => '9:00 AM',
        'endTime' => '11:00 AM',
        'hasConflict' => true,
        'conflictType' => 'teacher'
    ],
    [
        'id' => '6',
        'subject' => 'Biology 201',
        'teacher' => 'Prof. Brown',
        'room' => 'Lab 202',
        'section' => 'Section E',
        'day' => 'Wednesday',
        'startTime' => '10:00 AM',
        'endTime' => '12:00 PM',
        'hasConflict' => true,
        'conflictType' => 'room'
    ],
    [
        'id' => '7',
        'subject' => 'History 101',
        'teacher' => 'Dr. Miller',
        'room' => 'Room 401',
        'section' => 'Section A',
        'day' => 'Thursday',
        'startTime' => '2:00 PM',
        'endTime' => '4:00 PM',
        'hasConflict' => false
    ],
    [
        'id' => '8',
        'subject' => 'Art Appreciation',
        'teacher' => 'Prof. Wilson',
        'room' => 'Studio 101',
        'section' => 'Section F',
        'day' => 'Friday',
        'startTime' => '10:00 AM',
        'endTime' => '12:00 PM',
        'hasConflict' => false
    ]
];

// Function to get class sessions for a specific day and time slot
function getSessionsForTimeSlot($classSessions, $day, $timeSlot) {
    $sessions = [];
    foreach ($classSessions as $session) {
        if ($session['day'] === $day && 
            $session['startTime'] <= $timeSlot && 
            $session['endTime'] > $timeSlot) {
            $sessions[] = $session;
        }
    }
    return $sessions;
}

// Default filter and zoom values
$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
$department = isset($_GET['department']) ? $_GET['department'] : 'all';
$zoomLevel = isset($_GET['zoom']) ? (int)$_GET['zoom'] : 50;
$view = isset($_GET['view']) ? $_GET['view'] : 'week';

// Calculate cell height based on zoom level
$cellHeight = 60 + $zoomLevel * 0.6; // 60px at minimum, scales up with zoom
?>

<div class="timetable-container">
    <!-- Controls Header -->
    <div class="timetable-controls">
        <div class="view-tabs">
            <button class="tab-btn <?php echo ($view === 'week') ? 'active' : ''; ?>" data-view="week">
                <i class="fas fa-calendar"></i> Week
            </button>
            <button class="tab-btn <?php echo ($view === 'day') ? 'active' : ''; ?>" data-view="day">
                <i class="fas fa-clock"></i> Day
            </button>
        </div>

        <div class="filter-controls">
            <div class="filter-group">
                <i class="fas fa-filter"></i>
                <select id="filter" class="filter-select">
                    <option value="all" <?php echo ($filter === 'all') ? 'selected' : ''; ?>>All</option>
                    <option value="room" <?php echo ($filter === 'room') ? 'selected' : ''; ?>>Room</option>
                    <option value="teacher" <?php echo ($filter === 'teacher') ? 'selected' : ''; ?>>Teacher</option>
                    <option value="section" <?php echo ($filter === 'section') ? 'selected' : ''; ?>>Section</option>
                </select>
            </div>

            <div class="filter-group">
                <select id="department" class="filter-select">
                    <option value="all" <?php echo ($department === 'all') ? 'selected' : ''; ?>>All Departments</option>
                    <option value="cs" <?php echo ($department === 'cs') ? 'selected' : ''; ?>>Computer Science</option>
                    <option value="math" <?php echo ($department === 'math') ? 'selected' : ''; ?>>Mathematics</option>
                    <option value="eng" <?php echo ($department === 'eng') ? 'selected' : ''; ?>>Engineering</option>
                    <option value="arts" <?php echo ($department === 'arts') ? 'selected' : ''; ?>>Arts & Humanities</option>
                    <option value="sci" <?php echo ($department === 'sci') ? 'selected' : ''; ?>>Natural Sciences</option>
                </select>
            </div>

            <div class="zoom-control">
                <i class="fas fa-search-minus"></i>
                <input type="range" id="zoom" min="0" max="100" step="10" value="<?php echo $zoomLevel; ?>" class="zoom-slider">
                <i class="fas fa-search-plus"></i>
            </div>
        </div>
    </div>

    <!-- Timetable Grid -->
    <div class="timetable-grid-container">
        <div class="timetable-grid" style="grid-template-columns: 100px repeat(<?php echo count($days); ?>, 1fr);">
            <!-- Header row with days -->
            <div class="grid-header">Time / Day</div>
            <?php foreach ($days as $day): ?>
                <div class="grid-header"><?php echo $day; ?></div>
            <?php endforeach; ?>

            <!-- Time slots rows -->
            <?php foreach ($timeSlots as $timeSlot): ?>
                <!-- Time slot label -->
                <div class="time-slot" style="height: <?php echo $cellHeight; ?>px;">
                    <?php echo $timeSlot; ?>
                </div>

                <!-- Day cells for this time slot -->
                <?php foreach ($days as $day): ?>
                    <div class="grid-cell" style="height: <?php echo $cellHeight; ?>px;" data-day="<?php echo $day; ?>" data-time="<?php echo $timeSlot; ?>">
                        <?php 
                        $sessions = getSessionsForTimeSlot($classSessions, $day, $timeSlot);
                        foreach ($sessions as $session):
                        ?>
                            <div class="session-card <?php echo $session['hasConflict'] ? 'has-conflict' : ''; ?>" data-id="<?php echo $session['id']; ?>" draggable="true">
                                <div class="session-title"><?php echo $session['subject']; ?></div>
                                <div class="session-details"><?php echo $session['teacher']; ?></div>
                                <div class="session-details"><?php echo $session['room']; ?></div>
                                <div class="session-details"><?php echo $session['section']; ?></div>
                                <?php if ($session['hasConflict']): ?>
                                    <div class="conflict-badge">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        <?php echo ($session['conflictType'] === 'room') ? 'Room Conflict' : 
                                            (($session['conflictType'] === 'teacher') ? 'Teacher Conflict' : 'Section Conflict'); ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endforeach; ?>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Legend -->
    <div class="timetable-legend">
        <div class="legend-item">
            <div class="legend-color conflict"></div>
            <span>Conflict</span>
        </div>
        <div class="legend-item">
            <div class="legend-color scheduled"></div>
            <span>Scheduled Class</span>
        </div>
    </div>

    <!-- Action buttons -->
    <div class="timetable-actions">
        <button class="btn btn-outline">Reset View</button>
        <button class="btn btn-outline">Print Schedule</button>
        <button class="btn btn-primary">Save Changes</button>
    </div>
</div>

<style>
.timetable-container {
    background-color: var(--background);
    padding: 1rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.timetable-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.view-tabs {
    display: flex;
    gap: 0.5rem;
}

.tab-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background-color: var(--background);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
}

.tab-btn.active {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
}

.filter-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-select {
    padding: 0.5rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background-color: var(--background);
    font-size: 0.875rem;
    min-width: 150px;
}

.zoom-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 200px;
}

.zoom-slider {
    flex: 1;
}

.timetable-grid-container {
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    flex: 1;
}

.timetable-grid {
    display: grid;
    min-width: 900px;
}

.grid-header {
    background-color: var(--muted);
    padding: 0.5rem;
    font-weight: 500;
    text-align: center;
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
}

.time-slot {
    padding: 0.5rem;
    font-weight: 500;
    text-align: center;
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
}

.grid-cell {
    padding: 0.25rem;
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
    position: relative;
    overflow: auto;
}

.session-card {
    margin-bottom: 0.25rem;
    padding: 0.5rem;
    border-radius: calc(var(--radius) - 2px);
    background-color: var(--card);
    border: 1px solid var(--border);
    cursor: grab;
}

.session-card.has-conflict {
    border: 2px solid var(--destructive);
}

.session-title {
    font-size: 0.75rem;
    font-weight: 600;
}

.session-details {
    font-size: 0.75rem;
}

.conflict-badge {
    margin-top: 0.25rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    background-color: var(--destructive);
    color: var(--destructive-foreground);
    font-size: 0.75rem;
    font-weight: 500;
}

.timetable-legend {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
}

.legend-color {
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
    border: 1px solid var(--border);
}

.legend-color.conflict {
    border: 2px solid var(--destructive);
}

.legend-color.scheduled {
    background-color: var(--card);
}

.timetable-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
}
</style>

<script>
// This will be included in assets/js/timetable.js
</script>
