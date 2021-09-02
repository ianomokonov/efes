<?php
require_once __DIR__ . '/../utils/database.php';
require_once __DIR__ . '/../utils/token.php';
require_once __DIR__ . '/../utils/filesUpload.php';
class User
{
    private $dataBase;
    private $table = 'User';
    private $token;
    private $fileUploader;
    // private $baseUrl = 'http://localhost:4200/back';
    private $baseUrl = 'http://stand2.progoff.ru/back';

    // конструктор класса User
    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
        $this->token = new Token();
        $this->fileUploader = new FilesUpload();
    }

    public function create($userData)
    {
        $userData = (object) $this->dataBase->stripAll((array)$userData);

        // Вставляем запрос
        $userData->password = password_hash($userData->password, PASSWORD_BCRYPT);
        
        if ($this->LoginOrEmailExists($userData->login, $userData->email)) {
            throw new Exception('Пользователь уже существует');
        }
        $query = $this->dataBase->genInsertQuery(
            $userData,
            $this->table
        );

        // подготовка запроса
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        $userId = $this->dataBase->db->lastInsertId();
        if ($userId) {
            $tokens = $this->token->encode(array("id" => $userId));
            $this->addRefreshToken($tokens["refreshToken"], $userId);
            return $tokens;
        }
        return null;
    }

    // Получение пользовательских ролей
    public function getRoles()
    {
        $query = "SELECT * FROM UserRole";
        return $this->dataBase->db->query($query)->fetchAll();;
    }

    // Получение пользовательской информации
    public function read($userId)
    {
        $query = "SELECT login, email, phone FROM $this->table WHERE id='$userId'";
        $user = $this->dataBase->db->query($query)->fetch();
        // if($user == true){
        //     throw new Exception("User not found", 404);
        // }
        // file_put_contents('logs.txt', PHP_EOL.json_encode($user), FILE_APPEND);
        return $user;
    }

    // Получение пользовательской информации

    public function update($userId, $userData, $image = null)
    {
    }

    public function getUsers()
    {
        $query = "SELECT login, email, phone FROM " . $this->table;
        $stmt = $this->dataBase->db->query($query);
        $users = [];
        while ($user = $stmt->fetch()) {
            $user = $user;
            $users[] = $user;
        }
        return $users;
    }

    public function checkAdmin($userId)
    {
        $query = "SELECT isAdmin FROM $this->table WHERE id = $userId";
        $stmt = $this->dataBase->db->query($query);
        if ($stmt->fetch()['isAdmin']) {
            return true;
        }
        return false;
    }

    public function getUserImage($userId)
    {
        $query = "SELECT image FROM $this->table WHERE id = $userId";
        $stmt = $this->dataBase->db->query($query);

        return $stmt->fetch()['image'];
    }

    public function login($login, $password)
    {
        if ($login != null) {
            $sth = $this->dataBase->db->prepare("SELECT id, password FROM " . $this->table . " WHERE login = ? LIMIT 1");
            $sth->execute(array($login));
            $fullUser = $sth->fetch();
            if ($fullUser) {
                if (!password_verify($password, $fullUser['password'])) {
                    throw new Exception("User not found", 404);
                }
                $tokens = $this->token->encode(array("id" => $fullUser['id']));
                $this->addRefreshToken($tokens["refreshToken"], $fullUser['id']);
                return $tokens;
            } else {
                throw new Exception("User not found", 404);
            }
        } else {
            return array("message" => "Введите данные для регистрации");
        }
    }

    public function isRefreshTokenActual($token, $userId)
    {
        $query = "SELECT id FROM RefreshTokens WHERE token = ? AND userId = ?";

        // подготовка запроса
        $stmt = $this->dataBase->db->prepare($query);
        // инъекция
        $token = htmlspecialchars(strip_tags($token));
        $userId = htmlspecialchars(strip_tags($userId));
        // выполняем запрос
        $stmt->execute(array($token, $userId));

        // получаем количество строк
        $num = $stmt->rowCount();

        if ($num > 0) {
            return true;
        }

        return $num > 0;
    }

    // Обновление пароля
    public function updatePassword($userId, $password)
    {
        if ($userId) {
            $password = json_encode(password_hash($password, PASSWORD_BCRYPT));
            $query = "UPDATE $this->table SET password = '$password' WHERE id=$userId";
            $stmt = $this->dataBase->db->query($query);
        } else {
            return array("message" => "Токен неверен");
        }
    }

    // Отправление сообщений

    public function sendMessage($userId, $request)
    {
        $request = $this->dataBase->stripAll($request);
        $request['userId'] = $userId;
        $query = $this->dataBase->genInsertQuery(
            $request,
            'messages'
        );
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
    }

    public function addRefreshToken($tokenn, $userId)
    {
        $query = "DELETE FROM RefreshTokens WHERE userId=$userId";
        $this->dataBase->db->query($query);
        $query = "INSERT INTO RefreshTokens (token, userId) VALUES ('$tokenn', $userId)";
        $this->dataBase->db->query($query);
    }

    public function removeRefreshToken($token)
    {
        $userId = $this->token->decode($token, true)->data->id;
        $query = "DELETE FROM RefreshTokens WHERE userId = $userId";
        $this->dataBase->db->query($query);
    }

    public function refreshToken($token)
    {
        $userId = $this->token->decode($token, true)->data->id;

        if (!$this->isRefreshTokenActual($token, $userId)) {
            throw new Exception("Unauthorized", 401);
        }

        $this->removeRefreshToken($userId);

        $tokens = $this->token->encode(array("id" => $userId));
        $this->addRefreshToken($tokens[1], $userId);
        return $tokens;
    }

    public function getUpdateLink($email)
    {
        $userId = $this->LoginExists($email);
        $path = 'logs.txt';

        if (!$userId) {
            throw new Exception("Bad request", 400);
        }

        $tokens = $this->token->encode(array("id" => $userId));
        $url = $this->baseUrl . "/update?updatePassword=" . urlencode($tokens[0]);
        $subject = "Изменение пароля для jungliki.com";

        $message = "<h2>Чтобы изменить пароль перейдите по ссылке <a href='$url'>$url</a>!</h2>";

        $headers  = "Content-type: text/html; charset=utf-8 \r\n";

        mail($email, $subject, $message, $headers);
        file_put_contents($path, PHP_EOL . $email . " " . date("m.d.y H:i:s"), FILE_APPEND);
        return true;
    }

    private function LoginOrEmailExists(string $login, string $email)
    {
        $query = "SELECT id FROM " . $this->table . " WHERE login = ? OR email = ?";
        

        // подготовка запроса
        $stmt = $this->dataBase->db->prepare($query);
        // выполняем запрос
        $stmt->execute(array($login, $email));

        // получаем количество строк
        $num = $stmt->rowCount();

        if ($num > 0) {
            return true;
        }

        return false;
    }
}
