<?php
// Simple Messages API
// Methods:
// - GET /api/messages.php            → list all messages (JSON)
// - POST /api/messages.php           → create message with { message }
// - DELETE /api/messages.php?id=123  → delete by id

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../inc/dbconn.inc.php';

function ensureTable($conn) {
    $sql = "CREATE TABLE IF NOT EXISTS messages (\n        id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n        message VARCHAR(255) NOT NULL,\n        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    return (bool)$conn->query($sql);
}

if (!ensureTable($conn)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to ensure messages table exists', 'details' => $conn->error]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $result = $conn->query("SELECT id, message, reg_date FROM messages ORDER BY id DESC");
        $rows = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
        }
        echo json_encode(['items' => $rows]);
        exit;
    }

    if ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (!is_array($data)) $data = $_POST; // support form posts
        $msg = isset($data['message']) ? trim((string)$data['message']) : '';
        if ($msg === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Field "message" is required']);
            exit;
        }
        $stmt = $conn->prepare('INSERT INTO messages(message) VALUES (?)');
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['error' => 'Prepare failed', 'details' => $conn->error]);
            exit;
        }
        $stmt->bind_param('s', $msg);
        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(['error' => 'Execute failed', 'details' => $stmt->error]);
            exit;
        }
        $id = $stmt->insert_id;
        $stmt->close();
        $rowRes = $conn->query('SELECT id, message, reg_date FROM messages WHERE id=' . (int)$id . ' LIMIT 1');
        $row = $rowRes ? $rowRes->fetch_assoc() : null;
        http_response_code(201);
        echo json_encode(['item' => $row]);
        exit;
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid id is required']);
            exit;
        }
        $stmt = $conn->prepare('DELETE FROM messages WHERE id=?');
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['error' => 'Prepare failed', 'details' => $conn->error]);
            exit;
        }
        $stmt->bind_param('i', $id);
        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(['error' => 'Execute failed', 'details' => $stmt->error]);
            exit;
        }
        echo json_encode(['ok' => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} finally {
    if (isset($conn) && $conn instanceof mysqli) $conn->close();
}
