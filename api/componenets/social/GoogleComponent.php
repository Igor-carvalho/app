<?php
/**
 * Created by PhpStorm.
 * User: abdullahmateen
 * Date: 02/07/2018
 * Time: 13:00
 */


namespace app\componenets\social;

use app\componenets\HelperFunction;
use Symfony\Component\Console\Helper\Helper;

class GoogleComponent
{
    private $CLIENT_ID = "468914330550-ehmk8qsfdna76v3tmdm9mqpfa3i2nnd8.apps.googleusercontent.com";
    private $CLIENT_SECRET = "c9O-uCt4HmRttmS10jRp7k_d";

    private $client = null;


    public function __construct()
    {
        $this->client = new \Google_Client();
        $this->client->setClientId($this->CLIENT_ID);
        $this->client->setClientSecret($this->CLIENT_SECRET);
    }


    public function me($authToken)
    {

        $this->client->setAccessToken($authToken);
        $oauth2 = new \Google_Service_Oauth2($this->client);
        $me = $oauth2->userinfo_v2_me->get();

        return $me;
    }

}