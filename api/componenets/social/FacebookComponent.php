<?php
/**
 * Created by PhpStorm.
 * User: abdullahmateen
 * Date: 02/07/2018
 * Time: 13:00
 */


namespace app\componenets\social;

class FacebookComponent
{
    private $APP_ID = "427439887695383";
    private $APP_SECRET = "381c323f219363595f1b55890ab0b869";

    private $client = null;


    public function __construct()
    {
        $this->client = new \Facebook\Facebook([
            'app_id' => $this->APP_ID,
            'app_secret' => $this->APP_SECRET,
            'default_graph_version' => 'v2.10',
        ]);
    }


    public function me($authToken)
    {
        try {
            // Get the \Facebook\GraphNodes\GraphUser object for the current user.
            // If you provided a 'default_access_token', the '{access-token}' is optional.
            $response = $this->client->get('/me?fields=name,email,picture,first_name,last_name', $authToken );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            return null;
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            return null;
        }

        $me = $response->getGraphUser();

        return $me;
    }

}