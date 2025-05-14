<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="app-container">
        <!-- Sidebar Navigation -->
        <div class="sidebar">
            <div class="sidebar-header">
                <i class="fas fa-calendar"></i>
                <h1><?php echo APP_NAME; ?></h1>
            </div>
            <nav class="sidebar-nav">
                <a href="index.php?page=timetable" class="nav-item <?php echo ($page === 'timetable') ? 'active' : ''; ?>">
                    <i class="fas fa-calendar-days"></i>
                    Timetable Grid
                </a>
                <a href="index.php?page=resources" class="nav-item <?php echo ($page === 'resources') ? 'active' : ''; ?>">
                    <i class="fas fa-users"></i>
                    Resource Management
                </a>
                <a href="index.php?page=generator" class="nav-item <?php echo ($page === 'generator') ? 'active' : ''; ?>">
                    <i class="fas fa-book"></i>
                    Schedule Generator
                </a>
                <a href="index.php" class="nav-item <?php echo ($page === 'home' && !isset($_GET['page'])) ? 'active' : ''; ?>">
                    <i class="fas fa-home"></i>
                    Dashboard
                </a>
                <a href="#" class="nav-item">
                    <i class="fas fa-cog"></i>
                    Settings
                </a>
            </nav>
            <div class="sidebar-footer">
                <div class="user-info">
                    <div class="avatar">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="User Avatar">
                    </div>
                    <div>
                        <p class="user-name">DREYZIE</p>
                        <p class="user-role">Administrator</p>
                    </div>
                </div>
                <a href="#" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </a>
            </div>
        </div>
        
        <!-- Main Content Area -->
        <div class="main-content">
            <!-- Header -->
            <header class="main-header">
                <h2 class="page-title">
                    <?php 
                    switch ($page) {
                        case 'timetable':
                            echo 'Timetable Grid';
                            break;
                        case 'resources':
                            echo 'Resource Management';
                            break;
                        case 'generator':
                            echo 'Schedule Generator';
                            break;
                        default:
                            echo 'Dashboard';
                            break;
                    }
                    ?>
                </h2>
                <div class="header-actions">
                    <button class="notification-btn">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge">3</span>
                    </button>
                    <button class="preferences-btn">
                        <i class="fas fa-cog"></i>
                        Preferences
                    </button>
                </div>
            </header>
            
            <!-- Content Container -->
            <div class="content-container">
