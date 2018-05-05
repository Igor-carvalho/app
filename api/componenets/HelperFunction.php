<?php
/**
 * Created by PhpStorm.
 * User: abdullah
 * Date: 5/4/18
 * Time: 15:26
 */

namespace app\componenets;


class HelperFunction
{
    public static function output($arr, $exit = true)
    {
        echo "<pre>";
        print_r($arr);

        if ($exit)
            exit;
    }
}