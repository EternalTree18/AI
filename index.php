<?php
// Start session for user authentication
session_start();

// Include configuration and database connection
require_once 'config/config.php';
require_once 'config/database.php';

// Simple routing based on URL parameter
$page = isset($_GET['page']) ? $_GET['page'] : 'home';

// Header
include 'includes/header.php';

// Main content based on route
switch ($page) {
    case 'timetable':
        include 'pages/timetable.php';
        break;
    case 'resources':
        include 'pages/resources.php';
        break;
    case 'generator':
        include 'pages/generator.php';
        break;
    case 'home':
    default:
        include 'pages/home.php';
        break;
}

// Footer
include 'includes/footer.php';
?>
