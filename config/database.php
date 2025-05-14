<?php
/**
 * Database Connection Class
 * 
 * This class handles the database connection and query execution
 * for the Academic Scheduling System.
 */
class Database {
    private $host = 'localhost';
    private $username = 'root';
    private $password = '';
    private $database = 'academic_scheduler';
    private $conn;
    private static $instance = null;
    
    /**
     * Constructor - Creates database connection
     */
    private function __construct() {
        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->database);
            
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
            
            $this->conn->set_charset("utf8mb4");
        } catch (Exception $e) {
            error_log("Database Connection Error: " . $e->getMessage());
            // If database doesn't exist, try to create it
            if (strpos($e->getMessage(), "Unknown database") !== false) {
                $this->createDatabase();
            } else {
                die("Database connection failed: " . $e->getMessage());
            }
        }
    }
    
    /**
     * Get Database Instance (Singleton Pattern)
     */
    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    /**
     * Create the database if it doesn't exist
     */
    private function createDatabase() {
        try {
            $tempConn = new mysqli($this->host, $this->username, $this->password);
            
            if ($tempConn->connect_error) {
                throw new Exception("Connection failed: " . $tempConn->connect_error);
            }
            
            $sql = "CREATE DATABASE IF NOT EXISTS " . $this->database;
            if ($tempConn->query($sql) === TRUE) {
                $tempConn->close();
                // Connect to the newly created database
                $this->conn = new mysqli($this->host, $this->username, $this->password, $this->database);
                $this->conn->set_charset("utf8mb4");
                
                // Inform user to import the schema
                echo "<div class='notification success'>
                        <div class='notification-icon'><i class='fas fa-check-circle'></i></div>
                        <div class='notification-message'>Database created successfully. Please import the database schema.</div>
                        <button class='notification-close'><i class='fas fa-times'></i></button>
                      </div>";
            } else {
                throw new Exception("Error creating database: " . $tempConn->error);
            }
        } catch (Exception $e) {
            die("Failed to create database: " . $e->getMessage());
        }
    }
    
    /**
     * Execute a query
     */
    public function query($sql, $params = []) {
        try {
            $stmt = $this->conn->prepare($sql);
            
            if (!$stmt) {
                throw new Exception("Query preparation failed: " . $this->conn->error);
            }
            
            if (!empty($params)) {
                $types = '';
                $bindParams = [];
                
                foreach ($params as $param) {
                    if (is_int($param)) {
                        $types .= 'i';
                    } elseif (is_float($param)) {
                        $types .= 'd';
                    } elseif (is_string($param)) {
                        $types .= 's';
                    } else {
                        $types .= 'b';
                    }
                    $bindParams[] = $param;
                }
                
                array_unshift($bindParams, $types);
                call_user_func_array([$stmt, 'bind_param'], $this->refValues($bindParams));
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            
            return $result;
        } catch (Exception $e) {
            error_log("Query Error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Helper function for binding parameters by reference
     */
    private function refValues($arr) {
        $refs = [];
        foreach ($arr as $key => $value) {
            $refs[$key] = &$arr[$key];
        }
        return $refs;
    }
    
    /**
     * Get a single row from a query result
     */
    public function fetchRow($result) {
        return $result->fetch_assoc();
    }
    
    /**
     * Get all rows from a query result
     */
    public function fetchAll($result) {
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        return $rows;
    }
    
    /**
     * Get the number of rows in a result
     */
    public function numRows($result) {
        return $result->num_rows;
    }
    
    /**
     * Get the ID of the last inserted row
     */
    public function lastInsertId() {
        return $this->conn->insert_id;
    }
    
    /**
     * Close the database connection
     */
    public function close() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}
?>