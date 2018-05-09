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
    public $hour_from = 0;
    public $hour_to = 0;

    public $scheduled_hour_from;
    public $scheduled_hour_to;

    public $distances_activity;
    public $duration = 30; //minutes
    public $activity;

    public $debug = ""; //TODO: Remvoe This
}