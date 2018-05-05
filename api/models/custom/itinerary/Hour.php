<?php
/**
 * Created by PhpStorm.
 * User: abdullah
 * Date: 5/4/18
 * Time: 15:01
 */

namespace app\models\custom\itinerary;


class Hour
{
    public $hour_from;
    public $hour_to;
    public $activity;
    public $distances_activity;
    public $duration = 2; //hours TODO: implement this on database end
}