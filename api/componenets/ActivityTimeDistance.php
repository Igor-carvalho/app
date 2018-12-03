<?php
/**
 * Created by PhpStorm.
 * User: abdullahmateen
 * Date: 07/05/2018
 * Time: 13:15
 */

namespace app\componenets;


class ActivityTimeDistance
{

    private $DRIVINGS_SPEED = 25; // KM per hour
    private $SAFE_PLACEHOLDER_TIME = 30; // Minutes: placeholder to be between each activities

    public function __construct()
    {
    }

    public function calculate_time($distance)
    {
        $hourToTravel = $distance / $this->DRIVINGS_SPEED;
        $minuteToTravel = $hourToTravel * 60;

        $timeWithSafe = $minuteToTravel + $this->SAFE_PLACEHOLDER_TIME;

        return $timeWithSafe;
    }
}