<?php
// Connect to PostgreSQL
$host = 'localhost';
$dbname = 'your_database_name';
$user = 'your_username';
$password = 'your_password';

try {
  $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die("Error: " . $e->getMessage());
}

// Process signup form
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = $_POST['username'];
  $password = $_POST['password'];

  // Insert user into the database
  $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");

  try {
    $stmt->execute([$username, $password]);
    echo "Signup successful!";
  } catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
  }
}
?>
