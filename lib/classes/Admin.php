<?php

class Admin
{
    const USER_TABLE = 'accounts';

    public static function getAllUsers( $pretty_print = false )
    {
        $_db = new MySQL(MYSQL_CONNECTION);

        $queryStatement = "SELECT * FROM `". self::USER_TABLE ."`";
        $stmt = $_db->query($queryStatement);
        $result = $stmt->fetchAllAssoc();

        if ( $pretty_print )
        {
            $table = "<table cellspacing='0' border=\"1\" width=\"100%\"><tbody><tr><th>Username</th><th>Email</th><th>Date join</th></tr>";
            foreach( $result as $user )
            {
                $table .= sprintf("<tr style=\"text-align:center;\"><td>%s</td><td>%s</td><td>%s</td></tr>",
                                    $user['jotform_username'], $user['jotform_email'], $user['created_at']);
            }

            $table .= "</tbod></table>";

            return $table;
        }

        return $result;
    }
}

?>