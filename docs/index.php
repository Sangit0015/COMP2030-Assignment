<?php
define('DB_HOST','127.0.0.1');
define('DB_NAME','web_dev_db');
define('DB_USER','root');
define('DB_PASS','root');
ini_set('session.cookie_httponly',1);
session_start();

function getPDO(){
    static $pdo=null;
    if($pdo===null){
        $dsn="mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4";
        $opts=[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC];
        $pdo=new PDO($dsn,DB_USER,DB_PASS,$opts);
    }
    return $pdo;
}
function json_response($data,$status=200){
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
function get_json_body(){
    $raw=file_get_contents('php://input');
    $data=json_decode($raw,true);
    return is_array($data)?$data:[];
}
function get_input(){
    // Merge JSON body with POST/GET for flexibility
    $json = get_json_body();
    return array_merge($_GET, $_POST, $json ?: []);
}
function require_login(){
    if(!isset($_SESSION['user']['id'])){
        json_response(['error'=>'Login required'],401);
    }
}
function current_user(){
    return $_SESSION['user']??null;
}

$action=$_GET['action']??'';
$method=$_SERVER['REQUEST_METHOD'];

// Allow preflight/lenient method handling
if($method==='OPTIONS'){
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    json_response(['ok'=>true]);
}

if($action==='register'&&($method==='POST'||$method==='GET')){
    $data=get_input();
    $username=trim($data['username']??'');
    $email=trim($data['email']??'');
    $password=$data['password']??'';
    $display_name=trim($data['display_name']??'');
    if(!$username||!$email||!$password)json_response(['error'=>'Missing fields'],400);
    $pdo=getPDO();
    $stmt=$pdo->prepare("SELECT COUNT(*) FROM users WHERE username=? OR email=?");
    $stmt->execute([$username,$email]);
    if($stmt->fetchColumn()>0)json_response(['error'=>'Username/email exists'],409);
    $hash=password_hash($password,PASSWORD_DEFAULT);
    $stmt=$pdo->prepare("INSERT INTO users (username,email,password_hash,display_name,credits,role_id) VALUES (?,?,?,?,5,3)");
    $stmt->execute([$username,$email,$hash,$display_name]);
    json_response(['success'=>true,'message'=>'Registered successfully']);
}

if($action==='login'&&($method==='POST'||$method==='GET')){
    $data=get_input();
    $username=$data['username']??'';
    $password=$data['password']??'';
    if(!$username||!$password)json_response(['error'=>'Missing credentials'],400);
    $pdo=getPDO();
    $stmt=$pdo->prepare("SELECT * FROM users WHERE username=? OR email=? LIMIT 1");
    $stmt->execute([$username,$username]);
    $user=$stmt->fetch();
    if($user&&password_verify($password,$user['password_hash'])){
        session_regenerate_id(true);
        $_SESSION['user']=['id'=>$user['id'],'username'=>$user['username'],'display_name'=>$user['display_name'],'role_id'=>$user['role_id'],'credits'=>$user['credits']];
        json_response(['success'=>true,'user'=>$_SESSION['user']]);
    }else json_response(['error'=>'Invalid login'],401);
}

if($action==='logout'){
    session_destroy();
    json_response(['success'=>true]);
}

if($action==='users'){
    $pdo=getPDO();
    $stmt=$pdo->query("SELECT id,username,display_name,credits,role_id FROM users");
    json_response(['users'=>$stmt->fetchAll()]);
}

if($action==='skill_create'&&$method==='POST'){
    require_login();
    $data=get_json_body();
    $title=trim($data['title']??'');
    $category=trim($data['category']??'');
    $desc=trim($data['description']??'');
    if(!$title)json_response(['error'=>'Title required'],400);
    $pdo=getPDO();
    $stmt=$pdo->prepare("INSERT INTO skills (user_id,title,category,description) VALUES (?,?,?,?)");
    $stmt->execute([$_SESSION['user']['id'],$title,$category,$desc]);
    json_response(['success'=>true]);
}

if($action==='skills'){
    $pdo=getPDO();
    $stmt=$pdo->query("SELECT s.*,u.display_name FROM skills s JOIN users u ON s.user_id=u.id");
    json_response(['skills'=>$stmt->fetchAll()]);
}

if($action==='request_create'&&$method==='POST'){
    require_login();
    $data=get_json_body();
    $skill_id=(int)($data['skill_id']??0);
    $hours=(int)($data['hours']??1);
    $pdo=getPDO();
    $stmt=$pdo->prepare("INSERT INTO requests (skill_id,requester_id,requested_hours) VALUES (?,?,?)");
    $stmt->execute([$skill_id,$_SESSION['user']['id'],$hours]);
    json_response(['success'=>true]);
}

if($action==='requests'){
    require_login();
    $pdo=getPDO();
    $stmt=$pdo->prepare("SELECT r.*,s.title,u.display_name AS provider FROM requests r JOIN skills s ON s.id=r.skill_id JOIN users u ON u.id=s.user_id WHERE r.requester_id=? OR r.provider_id=?");
    $stmt->execute([$_SESSION['user']['id'],$_SESSION['user']['id']]);
    json_response(['requests'=>$stmt->fetchAll()]);
}

if($action==='message_send'&&$method==='POST'){
    require_login();
    $data=get_json_body();
    $receiver=(int)($data['receiver_id']??0);
    $msg=trim($data['body']??'');
    if(!$receiver||!$msg)json_response(['error'=>'Missing fields'],400);
    $pdo=getPDO();
    $stmt=$pdo->prepare("INSERT INTO messages (sender_id,receiver_id,body) VALUES (?,?,?)");
    $stmt->execute([$_SESSION['user']['id'],$receiver,$msg]);
    json_response(['success'=>true]);
}

if($action==='messages'){
    require_login();
    $pdo=getPDO();
    $stmt=$pdo->prepare("SELECT m.*,u1.display_name AS sender,u2.display_name AS receiver FROM messages m JOIN users u1 ON u1.id=m.sender_id JOIN users u2 ON u2.id=m.receiver_id WHERE m.sender_id=? OR m.receiver_id=? ORDER BY m.created_at DESC");
    $stmt->execute([$_SESSION['user']['id'],$_SESSION['user']['id']]);
    json_response(['messages'=>$stmt->fetchAll()]);
}

if($action==='transactions'){
    require_login();
    $pdo=getPDO();
    $stmt=$pdo->prepare("SELECT date, type, description AS `desc`, credits FROM transactions WHERE user_id=? ORDER BY date DESC LIMIT 100");
    $stmt->execute([$_SESSION['user']['id']]);
    json_response(['transactions'=>$stmt->fetchAll()]);
}

if($action==='me'){
    $user=current_user();
    json_response(['user'=>$user]);
}

json_response(['error'=>'No action found','available'=>['?action=register','?action=login','?action=logout','?action=me','?action=users','?action=skills','?action=skill_create','?action=requests','?action=request_create','?action=messages','?action=message_send','?action=transactions']],400);