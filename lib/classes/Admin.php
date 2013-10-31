<?php

class Admin
{
    const USER_TABLE = 'accounts';

    public static function getAllUsers()
    {
        $_db = new MySQL(MYSQL_CONNECTION);

        $queryStatement = "SELECT * FROM `". USER_TABLE ."`";
        $stmt = $this->_db->prepare($queryStatement);
        $stmt->execute($binds);
        $results = $stmt->fetchAllAssoc();
    }
}

?>