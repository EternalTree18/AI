<?php
// Application configuration
define('APP_NAME', 'Academic Scheduler');
define('APP_URL', 'http://localhost/academic-scheduler');

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'academic_scheduler');

// Error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Time zone
date_default_timezone_set('UTC');
?>
