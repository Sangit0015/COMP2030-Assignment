<?php
require_once __DIR__ . '/inc/dbconn.inc.php';

echo '<!doctype html><html><head><meta charset="utf-8"><title>Backend Status</title>';
echo '<style>body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;margin:2rem;line-height:1.5}code,a{color:#0b69a3} .ok{color:#0a7b28}.err{color:#b00020} .small{color:#666;font-size:.9em}</style></head><body>';
echo '<h1>COMP2030 Backend is running</h1>';

// Ensure messages table exists (no seeding here)
$sql = "CREATE TABLE IF NOT EXISTS messages (\n    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n    message VARCHAR(255) NOT NULL,\n    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if ($conn->query($sql) === TRUE) {
    echo '<p class="ok">Database connected and messages table is ready.</p>';
} else {
    echo '<p class="err">Error creating table: ' . htmlspecialchars($conn->error) . '</p>';
}

$count = 0;
$res = $conn->query('SELECT COUNT(*) AS c FROM messages');
if ($res) { $row = $res->fetch_assoc(); $count = (int)$row['c']; }

echo '<p>Messages rows: <strong>' . $count . '</strong></p>';

echo '<h2>Useful endpoints</h2>';
echo '<ul>';
echo '<li><a href="api/messages.php">GET /api/messages.php</a> <span class="small">→ list messages (JSON)</span></li>';
echo '<li><code>POST /api/messages.php</code> with JSON {"message":"Hi"} <span class="small">→ create</span></li>';
echo '<li><code>DELETE /api/messages.php?id=1</code> <span class="small">→ delete</span></li>';
echo '</ul>';

echo '<p class="small">Tip: Set MySQL env vars MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD (see inc/dbconn.inc.php).</p>';

echo '</body></html>';

$conn->close();