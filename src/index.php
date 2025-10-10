<?php
// inc/config.php
define('DB_HOST','127.0.0.1');
define('DB_NAME','web_dev_db');
define('DB_USER','root');
define('DB_PASS','root_password');

ini_set('session.cookie_httponly', 1);
session_start();
?>

<?php
// inc/functions.php
require_once __DIR__ . '/db.php';

function json_response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function sanitize($str) {
    return htmlspecialchars(trim($str), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function is_post_json() {
    return ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false);
}

function get_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
?>
<?php
// inc/functions.php
require_once __DIR__ . '/db.php';

function json_response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function sanitize($str) {
    return htmlspecialchars(trim($str), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function is_post_json() {
    return ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false);
}

function get_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
?>
<?php
// inc/csrf.php
function csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(24));
    }
    return $_SESSION['csrf_token'];
}

function csrf_check($token) {
    return hash_equals($_SESSION['csrf_token'] ?? '', $token ?? '');
}
?>
<?php
// inc/auth.php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

function attempt_login($username, $password) {
    $pdo = getPDO();
    $sql = "SELECT id, username, password_hash, role_id, display_name, credits FROM users WHERE username = ? LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    if ($user && password_verify($password, $user['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id'=>$user['id'],
            'username'=>$user['username'],
            'display_name'=>$user['display_name'],
            'role_id'=>$user['role_id'],
            'credits'=>$user['credits']
        ];
        return true;
    }
    return false;
}

function require_login_json() {
    if (!isset($_SESSION['user']['id'])) {
        json_response(['error'=>'Authentication required'], 401);
    }
}

function current_user() {
    return $_SESSION['user'] ?? null;
}

function user_has_role($roleName) {
    if (!isset($_SESSION['user']['id'])) return false;
    $pdo = getPDO();
    $stmt = $pdo->prepare('SELECT name FROM roles WHERE id = ?');
    $stmt->execute([$_SESSION['user']['role_id']]);
    $name = $stmt->fetchColumn();
    return $name === $roleName;
}
?>
<?php
require_once __DIR__.'/../../inc/db.php';
require_once __DIR__.'/../../inc/functions.php';

$data = get_json_body();

$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$display_name = trim($data['display_name'] ?? '');

if (!$username || !$email || !$password) {
    json_response(['error'=>'Missing required fields'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['error'=>'Invalid email'], 400);
}

$pdo = getPDO();
$stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE username = ? OR email = ?');
$stmt->execute([$username, $email]);
if ($stmt->fetchColumn() > 0) {
    json_response(['error'=>'Username or email already exists'], 409);
}

$password_hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (username, email, password_hash, display_name, credits, role_id) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([$username, $email, $password_hash, $display_name, 5, 3]);

json_response(['success'=>true, 'message'=>'Registered successfully']);
?>
<?php
require_once __DIR__.'/../../inc/auth.php';
require_once __DIR__.'/../../inc/functions.php';

$data = get_json_body();
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) json_response(['error'=>'Missing credentials'], 400);

if (attempt_login($username, $password)) {
    json_response(['success'=>true, 'user'=>current_user()]);
} else {
    json_response(['error'=>'Invalid username or password'], 401);
}
?>
<?php
require_once __DIR__.'/../../inc/functions.php';
session_start();
session_unset();
session_destroy();
json_response(['success'=>true]);
?>
<?php
require_once __DIR__.'/../../inc/db.php';
require_once __DIR__.'/../../inc/functions.php';

$pdo = getPDO();
$stmt = $pdo->query('SELECT id, username, email, display_name, credits, role_id, created_at FROM users ORDER BY created_at DESC LIMIT 500');
json_response(['users'=>$stmt->fetchAll()]);
?>
<?php
require_once __DIR__.'/../../inc/auth.php';
require_once __DIR__.'/../../inc/functions.php';
require_login_json();

$data = get_json_body();
$title = trim($data['title'] ?? '');
$category = trim($data['category'] ?? '');
$description = trim($data['description'] ?? '');
$hourly_rate = (int)($data['hourly_rate'] ?? 1);
$location = trim($data['location'] ?? '');

if (!$title) json_response(['error'=>'Title required'], 400);

$pdo = getPDO();
$stmt = $pdo->prepare('INSERT INTO skills (user_id, title, category, description, hourly_rate, location) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([$_SESSION['user']['id'], $title, $category, $description, $hourly_rate, $location]);

json_response(['success'=>true, 'skill_id'=>$pdo->lastInsertId()]);
?>
<?php
require_once __DIR__.'/../../inc/functions.php';
$pdo = getPDO();

$q = trim($_GET['q'] ?? '');
$category = trim($_GET['category'] ?? '');
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;

$sql = "SELECT s.*, u.display_name FROM skills s JOIN users u ON s.user_id = u.id WHERE 1=1 ";
$params = [];
if ($q !== '') {
    $sql .= " AND (s.title LIKE ? OR s.description LIKE ?) ";
    $like = '%' . $q . '%';
    $params[] = $like; $params[] = $like;
}
if ($category !== '') {
    $sql .= " AND s.category = ? ";
    $params[] = $category;
}
if ($user_id) {
    $sql .= " AND s.user_id = ? ";
    $params[] = $user_id;
}
$sql .= " ORDER BY s.created_at DESC LIMIT 200";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

json_response(['skills'=>$rows]);
?>
<?php
require_once __DIR__.'/../../inc/auth.php';
require_once __DIR__.'/../../inc/functions.php';
require_login_json();

$data = get_json_body();
$id = (int)($data['id'] ?? 0);
$title = trim($data['title'] ?? '');
$category = trim($data['category'] ?? '');
$description = trim($data['description'] ?? '');
$hourly_rate = (int)($data['hourly_rate'] ?? 1);
$location = trim($data['location'] ?? '');

if (!$id || !$title) json_response(['error'=>'Missing fields'], 400);

$pdo = getPDO();
$stmt = $pdo->prepare('SELECT user_id FROM skills WHERE id = ?');
$stmt->execute([$id]);
$skill = $stmt->fetch();
if (!$skill) json_response(['error'=>'Skill not found'], 404);

if ($skill['user_id'] != $_SESSION['user']['id'] && !user_has_role('admin')) {
    json_response(['error'=>'Permission denied'], 403);
}

$stmt = $pdo->prepare('UPDATE skills SET title=?, category=?, description=?, hourly_rate=?, location=? WHERE id=?');
$stmt->execute([$title,$category,$description,$hourly_rate,$location,$id]);

json_response(['success'=>true]);
?>
<?php
require_once __DIR__.'/../../inc/auth.php';
require_once __DIR__.'/../../inc/functions.php';
require_login_json();

$data = get_json_body();
$id = (int)($data['id'] ?? 0);
if (!$id) json_response(['error'=>'Missing id'], 400);

$pdo = getPDO();
$stmt = $pdo->prepare('SELECT user_id FROM skills WHERE id=?');
$stmt->execute([$id]);
$skill = $stmt->fetch();
if (!$skill) json_response(['error'=>'Not found'], 404);

if ($skill['user_id'] != $_SESSION['user']['id'] && !user_has_role('admin')) {
    json_response(['error'=>'Permission denied'], 403);
}

$stmt = $pdo->prepare('DELETE FROM skills WHERE id=?');
$stmt->execute([$id]);

json_response(['success'=>true]);
?>
<?php
require_once __DIR__.'/../../inc/auth.php';
require_once __DIR__.'/../../inc/functions.php';
require_login_json();

$data = get_json_body();
$skill_id = (int)($data['skill_id'] ?? 0);
$requested_hours = max(1, (int)($data['requested_hours'] ?? 1));
$proposed_time = trim($data['proposed_time'] ?? '');

if (!$skill_id) json_response(['error'=>'Missing skill_id'], 400);

$pdo = getPDO();
$stmt = $pdo->prepare('SELECT user_id, hourly_rate FROM skills WHERE id=?');
$stmt->execute([$skill_id]);
$skill = $stmt->fetch();
if (!$skill) json_response(['error'=>'Skill not found'], 404);

$provider_id = $skill['user_id'];
$requester_id = $_SESSION['user']['id'];

if ($provider_id == $requester_id) json_response(['error'=>'Cannot request your own skill'], 400);

$stmt = $pdo->prepare('INSERT INTO requests (skill_id, requester_id, provider_id, requested_hours, proposed_time) VALUES (?, ?, ?, ?, ?)');
$stmt->execute([$skill_id, $requester_id, $provider_id, $requested_hours, $proposed_time]);

json_response(['success'=>true,'request_id'=>$pdo->lastInsertId()]);
?>
<?php
require_once __DIR__.'/../../inc/auth.php';
require_once __DIR__.'/../../inc/functions.php';
require_login_json();

$pdo = getPDO();
$role = $_GET['role'] ?? 'all';
$userId = $_SESSION['user']['id'];

$sql = "SELECT r.*, s.title as skill_title, u_req.display_name as requester_name, u_pro.display_name as provider_name
        FROM requests r
        JOIN skills s ON r.skill_id = s.id
        JOIN users u_req ON r.requester_id = u_req.id
        JOIN users u_pro ON r.provider_id = u_pro.id
        WHERE 1=1 ";
$params = [];

if ($role === 'provider') {
    $sql .= " AND r.provider_id = ? ";
    $params[] = $userId;
} elseif ($role === 'requester') {
    $sql .= " AND r.requester_id = ? ";
    $params[] = $userId;
} else {
    $sql .= " AND (r.provider_id = ? OR r.requester_id = ?) ";
    $params[] = $userId; $params[] = $userId;
}

$sql .= " ORDER BY r.created_at DESC LIMIT 300";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

json_response(['requests'=>$rows]);
?>
<?php
require_once __DIR__.'/../../inc/auth.php';
require_once __DIR__.'/../../inc/functions.php';
require_login_json();

$data = get_json_body();
$receiver_id = (int)($data['receiver_id'] ?? 0);
$subject = trim($data['subject'] ?? '');
$body = trim($data['body'] ?? '');

if (!$receiver_id || !$body) json_response(['error'=>'Missing fields'], 400);

$pdo = getPDO();
$stmt = $pdo->prepare('SELECT id FROM users WHERE id = ?');
$stmt->execute([$receiver_id]);
if (!$stmt->fetchColumn()) json_response(['error'=>'Receiver not found'], 404);

$stmt = $pdo->prepare('INSERT INTO messages (sender_id, receiver_id, subject, body) VALUES (?, ?, ?, ?)');
$stmt->execute([$_SESSION['user']['id'], $receiver_id, $subject, $body]);

json_response(['success'=>true, 'message_id'=>$pdo->lastInsertId()]);
?>
<?php
require_once __DIR__.'/../../inc/auth.php';
require_once __DIR__.'/../../inc/functions.php';
require_login_json();

$pdo = getPDO();
$userId = $_SESSION['user']['id'];

$stmt = $pdo->prepare('SELECT m.*, su.display_name as sender_name, ru.display_name as receiver_name FROM messages m JOIN users su ON m.sender_id = su.id JOIN users ru ON m.receiver_id = ru.id WHERE m.receiver_id = ? OR m.sender_id = ? ORDER BY m.created_at DESC LIMIT 200');
$stmt->execute([$userId, $userId]);
json_response(['messages'=>$stmt->fetchAll()]);
?>
<?php
require_once __DIR__.'/../../inc/auth.php';
require_once __DIR__.'/../../inc/functions.php';
require_login_json();

$data = get_json_body();
$reviewed_user_id = (int)($data['reviewed_user_id'] ?? 0);
$rating = (int)($data['rating'] ?? 0);
$comment = trim($data['comment'] ?? '');

if (!$reviewed_user_id || $rating < 1 || $rating > 5) json_response(['error'=>'Missing/invalid fields'], 400);

$pdo = getPDO();
$stmt = $pdo->prepare('SELECT id FROM users WHERE id = ?');
$stmt->execute([$reviewed_user_id]);
if (!$stmt->fetchColumn()) json_response(['error'=>'User not found'], 404);

$stmt = $pdo->prepare('INSERT INTO reviews (reviewer_id, reviewed_user_id, rating, comment) VALUES (?, ?, ?, ?)');
$stmt->execute([$_SESSION['user']['id'], $reviewed_user_id, $rating, $comment]);

json_response(['success'=>true, 'review_id'=>$pdo->lastInsertId()]);
?>
<?php
require_once __DIR__.'/../../inc/auth.php';
require_once __DIR__.'/../../inc/functions.php';
require_login_json();

$pdo = getPDO();
$userId = $_SESSION['user']['id'];

$stmt = $pdo->prepare('SELECT t.*, fu.display_name as from_name, tu.display_name as to_name FROM transactions t LEFT JOIN users fu ON t.from_user=fu.id LEFT JOIN users tu ON t.to_user=tu.id WHERE t.from_user = ? OR t.to_user = ? ORDER BY t.created_at DESC LIMIT 500');
$stmt->execute([$userId, $userId]);
json_response(['transactions'=>$stmt->fetchAll()]);
?>
