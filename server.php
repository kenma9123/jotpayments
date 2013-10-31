<?php
//global file that will automatically call the required class
require_once( __DIR__ . '/lib/init.php' );

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$httpresponse = new HttpResponse();

$request = $_POST ? $_POST : $_GET;
try
{
    switch($request['action'])
    {
        case 'handleAccount':
            if ( User::isLoggedIn() )
            {
                $userData = User::getUserData();
                $httpresponse->success("Currently logged in as " . $userData['jotform_username'], array('user_data' => $userData) );
            }

            $user = new User($request['username'], $request['email'], $request['key']);
            $response = $user->handleAccount();
            $userData = User::getUserData(false);
            $httpresponse->success($response, array('user_data' => $userData));
        break;
        case 'logout':
            Session::destroy();
            $httpresponse->success("Successfully logged out");
        break;
        default:
            $httpresponse->error("Invalid method - " . $request['action'] . " not found.");
        break;
    }
} catch (Exception $e)
{
    $httpresponse->error($e->getMessage());
}
?>
