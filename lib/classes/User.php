<?php

Class User
{
    protected $apikey;
    protected $_db;
    protected $_session;
	protected $tablename = "accounts";

    public static $sessionVariable = "_accounts_jotpayment_session";

	function __construct($username = null, $email = null, $apikey = null)
	{
        if ( is_null($username) ) throw new Exception("Username cannot be empty");
        if ( is_null($email) ) throw new Exception("Email cannot be empty");
        if ( is_null($apikey) ) throw new Exception("API key is missing");

        $this->jot_apikey = $apikey;
        $this->jot_username = $username;
        $this->jot_email = $email;

        //initialize session
        // $this->_session = new Session();

        //initialize mysql
        $this->_db = new MySQL(MYSQL_CONNECTION);
	}

    private function getAccountID()
    {
        return $this->_db->insertId;
    }

    public static function isLoggedIn()
    {
        // Session::destroy();
        // exit;die;
        return (Session::read(self::$sessionVariable)) ? true : false;
    }

    public static function getUserData($fromSession = true, $uid = null)
    {
        $user_data = array('empty');
        if ( Session::read(self::$sessionVariable) )
        {
            $user_data = Session::read(self::$sessionVariable);
        }

        if ( !$fromSession )
        {
            $user_id = (is_null($uid)) ? $user_data['id'] : $uid;
            $_db = new MySQL(MYSQL_CONNECTION);
            $stmt = $_db->query("SELECT `id`,`jotform_username`, `jotform_email`, `created_at` FROM `accounts` WHERE `id` = :id", array('id' => $user_id))->limit(1);
            $user_data = $stmt->fetchAssoc();
        }

        //merge session id
        $user_data['user_session'] = Session::getSessionID();
        return $user_data;
    }

    public function createAccount()
    {
        $values = array(
            'jotform_username' => $this->jot_username,
            'jotform_email' => $this->jot_email,
            'created_at' => $this->_db->expr('CURRENT_TIMESTAMP')
        );

        return $this->_db->insert($this->tablename, $values);
    }

    public function login($user = null, $email = null)
    {
        if ( is_null($user) || is_null($email) ) throw new Exception("Username and email are missing");

        $binds = array('j_u' => $user, 'j_e' => $email);
        $queryStatement = "SELECT `id`,`jotform_username`, `jotform_email`, `created_at` FROM `".$this->tablename."` WHERE `jotform_username` = :j_u AND `jotform_email` = :j_e LIMIT 1";
        $stmt = $this->_db->prepare($queryStatement);
        $stmt->execute($binds);
        $userData = $stmt->fetchAssoc();

        if ( $userData ) {
            Session::save(self::$sessionVariable, $userData);
            $user = Session::read(self::$sessionVariable);

            //after successfull login, update the API key just in case
            $this->updateUser_APIkey();

            return "Successfully logged in as : " . $user['jotform_username'];
        } else {
            return "Cannot login, incorrect username and email";
        }
    }

	public function handleAccount()
	{
        if ( self::isLoggedIn() ) {
            $userData = self::getUserData();
            return "Currently logged in as " . $userData['jotform_username'];
        }

        $binds = array('j_u' => $this->jot_username, 'j_e' => $this->jot_email);
        $queryStatement = "SELECT id FROM `".$this->tablename."` WHERE `jotform_username` = :j_u AND `jotform_email` = :j_e LIMIT 1";
        $stmt = $this->_db->prepare($queryStatement);
        $stmt->execute($binds);
        $results = $stmt->fetchAllAssoc();

        if ( $results ) {
            //account already existed
            $logged_in = $this->login($this->jot_username, $this->jot_email);
            return "Account already existed : " . $logged_in;
        } else {
            //create new account
            if ( $this->createAccount() ) {
                $accountID = $this->getAccountID();
                $logged_in = $this->login($this->jot_username, $this->jot_email);
                return "Account successfully created with accountID: " . $accountID . " AND " . $logged_in;
            }
        }
    }

    public static function getUser_APIKey()
    {
        $user = User::getUserData();
        $_db = new MySQL(MYSQL_CONNECTION);
        $stmt = $_db->query("SELECT `jotform_apikey` FROM `accounts` WHERE `id` = :id", array('id' => $user['id']))->limit(1);
        $result = $stmt->fetchAssoc();

        return ( $result ) ? $result['jotform_apikey'] : false;
    }

    private function updateUser_APIkey()
    {
        $user = User::getUserData();

        //save/update the json encoded to db
        $values = array('jotform_apikey' => $this->jot_apikey);
        $where = "`id` = :id AND `jotform_username` = :jotform_username";
        $binds = array('id' => $user['id'], 'jotform_username' => $user['jotform_username']);
        
        $this->_db->update('accounts', $values, $where, $binds);
    }
}

?>