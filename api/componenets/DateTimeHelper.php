<?php
/**
 * Created by PhpStorm.
 * User: abdullahmateen
 * Date: 30/05/2018
 * Time: 14:40
 */

namespace app\componenets;

use DateInterval;
use DateTime;
use DatePeriod;


class DateTimeHelper
{

    public static function getDatesFromRange($start, $end, $format = 'Y-m-d')
    {
        $array = array();
        $interval = new DateInterval('P1D');

        $realEnd = new DateTime($end);
        $realEnd->add($interval);

        $period = new DatePeriod(new DateTime($start), $interval, $realEnd);

        foreach ($period as $date) {
            $array[] = $date->format($format);
        }

        return $array;
    }

    public static function dateIsBetween($from, $to, $date = "now")
    {

        if (is_string($from))
            $from = new \DateTime($from);
        if (is_string($date))
            $date = new \DateTime($date);
        if (is_string($to))
            $to = new \DateTime($to);


        if ($date >= $from && $date <= $to) {
            return true;
        }
        return false;
    }

}