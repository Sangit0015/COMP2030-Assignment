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
    $stmt=$pdo->query("SELECT id,username,display_name,email,credits,role_id FROM users");
    json_response(['users'=>$stmt->fetchAll()]);
}

// Admin: get user details (with profile)
if($action==='admin_user_get'){
    require_login();
    if((int)($_SESSION['user']['role_id']??0)!==1) json_response(['error'=>'Forbidden'],403);
    $uid=(int)($_GET['user_id']??0);
    if(!$uid) json_response(['error'=>'Missing user_id'],400);
    $pdo=getPDO();
    $stmt=$pdo->prepare("SELECT id, username, display_name, email, credits, role_id, IFNULL(suspended,0) AS suspended FROM users WHERE id=? LIMIT 1");
    try{
        $stmt->execute([$uid]);
    }catch(Throwable $e){
        // If suspended column does not exist
        $stmt=$pdo->prepare("SELECT id, username, display_name, email, credits, role_id, 0 AS suspended FROM users WHERE id=? LIMIT 1");
        $stmt->execute([$uid]);
    }
    $u=$stmt->fetch();
    if(!$u) json_response(['error'=>'User not found'],404);
    $stmt=$pdo->prepare("SELECT course, about, avatar_url FROM user_profiles WHERE user_id=? LIMIT 1");
    $stmt->execute([$uid]);
    $p=$stmt->fetch()?:['course'=>null,'about'=>null,'avatar_url'=>null];
    json_response(['user'=>$u,'profile'=>$p]);
}

// Admin: update user details (display_name, email, credits, suspended if supported)
if($action==='admin_user_update' && $method==='POST'){
    require_login();
    if((int)($_SESSION['user']['role_id']??0)!==1) json_response(['error'=>'Forbidden'],403);
    $pdo=getPDO();
    $data=get_input();
    $uid=(int)($data['user_id']??0);
    if(!$uid) json_response(['error'=>'Missing user_id'],400);
    $display_name=isset($data['display_name'])?trim($data['display_name']):null;
    $username=isset($data['username'])?trim($data['username']):null;
    $email=isset($data['email'])?trim($data['email']):null;
    $credits=isset($data['credits'])? (int)$data['credits'] : null;
    $suspended = isset($data['suspended'])? (int)!!$data['suspended'] : null;
    // Build dynamic update
    $fields=[]; $vals=[];
    if($display_name!==null){ $fields[]='display_name=?'; $vals[]=$display_name; }
    if($username!==null){ $fields[]='username=?'; $vals[]=$username; }
    if($email!==null){ $fields[]='email=?'; $vals[]=$email; }
    if($credits!==null){ $fields[]='credits=?'; $vals[]=$credits; }
    $suspendIncluded=false;
    if($suspended!==null){ $fields[]='suspended=?'; $vals[]=$suspended; $suspendIncluded=true; }
    if($fields){
        $vals[]=$uid;
        $sql="UPDATE users SET ".implode(',', $fields)." WHERE id=?";
        try{
            $stmt=$pdo->prepare($sql);
            $stmt->execute($vals);
        }catch(Throwable $e){
            if($suspendIncluded){
                // Rebuild UPDATE without suspended field to handle DBs without this column
                $fields2=[]; $vals2=[];
                if($display_name!==null){ $fields2[]='display_name=?'; $vals2[]=$display_name; }
                if($username!==null){ $fields2[]='username=?'; $vals2[]=$username; }
                if($email!==null){ $fields2[]='email=?'; $vals2[]=$email; }
                if($credits!==null){ $fields2[]='credits=?'; $vals2[]=$credits; }
                if($fields2){
                    $vals2[]=$uid;
                    $stmt=$pdo->prepare("UPDATE users SET ".implode(',', $fields2)." WHERE id=?");
                    $stmt->execute($vals2);
                }
            } else throw $e;
        }
    }
    // Optional profile updates
    if(isset($data['course'])||isset($data['about'])){
        $course=isset($data['course'])?trim($data['course']):null;
        $about=isset($data['about'])?trim($data['about']):null;
        $stmt=$pdo->prepare("INSERT INTO user_profiles (user_id, course, about) VALUES (?,?,?) ON DUPLICATE KEY UPDATE course=VALUES(course), about=VALUES(about)");
        $stmt->execute([$uid,$course,$about]);
    }
    json_response(['success'=>true]);
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

// Update a skill (owner or admin)
if($action==='skill_update' && $method==='POST'){
    require_login();
    $pdo=getPDO();
    $data=get_json_body();
    $id=(int)($data['id']??0);
    $title=trim($data['title']??'');
    $category=trim($data['category']??'');
    $description=trim($data['description']??'');
    if(!$id) json_response(['error'=>'Missing skill id'],400);
    // check ownership
    $stmt=$pdo->prepare("SELECT user_id FROM skills WHERE id=?");
    $stmt->execute([$id]);
    $row=$stmt->fetch();
    if(!$row) json_response(['error'=>'Skill not found'],404);
    $isOwner = ((int)$row['user_id'] === (int)$_SESSION['user']['id']);
    $isAdmin = ((int)($_SESSION['user']['role_id']??0) === 1);
    if(!$isOwner && !$isAdmin) json_response(['error'=>'Forbidden'],403);
    $stmt=$pdo->prepare("UPDATE skills SET title=?, category=?, description=? WHERE id=?");
    $stmt->execute([$title,$category,$description,$id]);
    json_response(['success'=>true]);
}

// Delete a skill (owner or admin)
if($action==='skill_delete'){
    require_login();
    $pdo=getPDO();
    $id=(int)($_GET['id'] ?? $_POST['id'] ?? 0);
    if(!$id) json_response(['error'=>'Missing skill id'],400);
    $stmt=$pdo->prepare("SELECT user_id FROM skills WHERE id=?");
    $stmt->execute([$id]);
    $row=$stmt->fetch();
    if(!$row) json_response(['error'=>'Skill not found'],404);
    $isOwner = ((int)$row['user_id'] === (int)$_SESSION['user']['id']);
    $isAdmin = ((int)($_SESSION['user']['role_id']??0) === 1);
    if(!$isOwner && !$isAdmin) json_response(['error'=>'Forbidden'],403);
    $stmt=$pdo->prepare("DELETE FROM skills WHERE id=?");
    $stmt->execute([$id]);
    json_response(['success'=>true]);
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

// Fetch profile for current user or another user by id
if($action==='profile_get'){
    require_login();
    $pdo=getPDO();
    $target_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : (int)$_SESSION['user']['id'];
    // base user
    $stmt=$pdo->prepare("SELECT id, username, display_name, email, credits, role_id FROM users WHERE id=? LIMIT 1");
    $stmt->execute([$target_id]);
    $u=$stmt->fetch();
    if(!$u){ json_response(['error'=>'User not found'],404); }
    // extra profile
    $stmt=$pdo->prepare("SELECT course, about, avatar_url FROM user_profiles WHERE user_id=? LIMIT 1");
    $stmt->execute([$target_id]);
    $p=$stmt->fetch() ?: ['course'=>null,'about'=>null,'avatar_url'=>null];
    // skills titles
    $stmt=$pdo->prepare("SELECT title FROM skills WHERE user_id=? ORDER BY id DESC");
    $stmt->execute([$target_id]);
    $skills=array_map(fn($r)=>$r['title'],$stmt->fetchAll());
    // rating averages and count
    $stmt=$pdo->prepare("SELECT 
        AVG(rating_skill) AS rating_skill, 
        AVG(rating_help)  AS rating_help,
        AVG(rating_trust) AS rating_trust,
        AVG(rating_comm)  AS rating_comm,
        COUNT(*) AS count
      FROM ratings WHERE ratee_id=?");
    $stmt->execute([$target_id]);
    $avg=$stmt->fetch();
    // rater's own rating if viewing someone else
    $mine=null;
    if($target_id !== (int)$_SESSION['user']['id']){
        $stmt=$pdo->prepare("SELECT rating_skill, rating_help, rating_trust, rating_comm FROM ratings WHERE rater_id=? AND ratee_id=?");
        $stmt->execute([$_SESSION['user']['id'],$target_id]);
        $mine=$stmt->fetch() ?: null;
    }
    json_response([
        'user'=>[
            'id'=>$u['id'],
            'username'=>$u['username'],
            'display_name'=>$u['display_name'],
            'email'=>$u['email'],
            'credits'=>$u['credits'],
            'role_id'=>$u['role_id'],
        ],
        'profile'=>[
            'course'=>$p['course'],
            'about'=>$p['about'],
            'avatar_url'=>$p['avatar_url'],
            'skills'=>$skills,
        ],
        'ratings'=>[
            'average'=>[
                'rating_skill'=> $avg['rating_skill']!==null? (float)$avg['rating_skill'] : null,
                'rating_help' => $avg['rating_help'] !==null? (float)$avg['rating_help']  : null,
                'rating_trust'=> $avg['rating_trust']!==null? (float)$avg['rating_trust'] : null,
                'rating_comm' => $avg['rating_comm'] !==null? (float)$avg['rating_comm']  : null,
            ],
            'count'=> (int)($avg['count']??0),
            'mine'=>$mine
        ]
    ]);
}

// Update current user's profile
if($action==='profile_update' && $method==='POST'){
    require_login();
    $pdo=getPDO();
    $data=get_input();
    $display_name=isset($data['display_name'])?trim($data['display_name']):null;
    $course=isset($data['course'])?trim($data['course']):null;
    $about=isset($data['about'])?trim($data['about']):null;
    $pdo->beginTransaction();
    try{
        if($display_name!==null){
            $stmt=$pdo->prepare("UPDATE users SET display_name=? WHERE id=?");
            $stmt->execute([$display_name,$_SESSION['user']['id']]);
            $_SESSION['user']['display_name']=$display_name;
        }
        // upsert user_profiles
        $stmt=$pdo->prepare("INSERT INTO user_profiles (user_id, course, about) VALUES (?,?,?)
            ON DUPLICATE KEY UPDATE course=VALUES(course), about=VALUES(about)");
        $stmt->execute([$_SESSION['user']['id'],$course,$about]);
        $pdo->commit();
        json_response(['success'=>true]);
    }catch(Throwable $e){
        $pdo->rollBack();
        json_response(['error'=>'Failed to update profile'],500);
    }
}

// Create or update a rating for a given user
if($action==='rating_set' && ($method==='POST' || $method==='GET')){
    require_login();
    $pdo=getPDO();
    $data=get_input();
    $ratee_id = (int)($data['ratee_id'] ?? 0);
    if(!$ratee_id) json_response(['error'=>'Missing ratee_id'],400);
    if($ratee_id === (int)$_SESSION['user']['id']) json_response(['error'=>'Cannot rate yourself'],400);
    $rs = isset($data['rating_skill']) ? (int)$data['rating_skill'] : null;
    $rh = isset($data['rating_help']) ? (int)$data['rating_help'] : null;
    $rt = isset($data['rating_trust'])? (int)$data['rating_trust']: null;
    $rc = isset($data['rating_comm']) ? (int)$data['rating_comm'] : null;
    $stmt=$pdo->prepare("INSERT INTO ratings (rater_id, ratee_id, rating_skill, rating_help, rating_trust, rating_comm)
        VALUES (?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE rating_skill=VALUES(rating_skill), rating_help=VALUES(rating_help), rating_trust=VALUES(rating_trust), rating_comm=VALUES(rating_comm)");
    $stmt->execute([$_SESSION['user']['id'],$ratee_id,$rs,$rh,$rt,$rc]);
    json_response(['success'=>true]);
}

json_response(['error'=>'No action found','available'=>['?action=register','?action=login','?action=logout','?action=me','?action=users','?action=skills','?action=skill_create','?action=requests','?action=request_create','?action=messages','?action=message_send','?action=transactions','?action=profile_get','?action=profile_update','?action=rating_set']],400);