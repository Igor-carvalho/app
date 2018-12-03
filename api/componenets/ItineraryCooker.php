<?php
/**
 * Created by PhpStorm.
 * User: abdullah
 * Date: 5/4/18
 * Time: 15:09
 */

namespace app\componenets;


use app\models\custom\itinerary\ActivityDistances;
use app\models\custom\itinerary\Day;
use app\models\custom\itinerary\Hour;
use app\models\custom\itinerary\Itinerary;
use app\models\database\Activities;
use Symfony\Component\Console\Command\HelpCommand;
use yii\web\HttpException;

class ItineraryCooker
{
    private $activities;
    private $activity_day_breakdown;
    private $activity_day_key;

    private $date_start, $date_ends;
    private $time_from, $time_to;
    private $isSingleDay = false;
    private $eachDayLimit = 0;

    public function __construct($activities, $date_start, $date_end, $isSingleDay = false, $time_from = null, $time_to = null)
    {
        $this->isSingleDay = $isSingleDay;

        $this->date_start = new \DateTime($date_start);
        $this->date_ends = new \DateTime($date_end);
        $this->time_from = $time_from;
        $this->time_to = $time_to;

        $difference = $this->date_ends->diff($this->date_start);
        $dayDifference = $difference->days;
        if ($dayDifference > 0)
            $this->eachDayLimit = count((array)$activities) / intval($difference->days);
        if ($dayDifference > count((array)$activities)) {
            throw new HttpException(404, json_encode("No much activities available for your itinerary"));
        }

        $this->activities = $activities;
        $this->activity_day_key = [];
        $this->assign_activities_day_key();
//        $this->expand_activity_day_key(); // put all activities in date array with key by date
        $this->expand_activity_by_day(); // make an object specific to date
        $this->calculate_distance(); // calculate distance between first activity and others in the same day
    }

    //break down all activities with days prospective
    private function expand_activity_by_day()
    {
//        HelperFunction::output($this->activity_day_key);
        $iteraries = new Itinerary();
        $iteraries->days = [];

        foreach ($this->activity_day_key as $date => $activities) {

            $object = new Day();
            $object->day = $date;
            $object->hours = [];

//            $weather_str = $this->getWeather($date);
//            $object->weather = $weather_str;
//            $weather = json_decode($weather_str);
//
//            if (isset($weather) && $weather->currently->temperature !='') {
//                $object->weather_temp = (($weather->currently->temperature) - 32) * 5/9;
//                $object->weather_icon = $weather->currently->icon;
//            } else {
//                $object->weather_temp = '';
//                $object->weather_icon = '';
//            }

            foreach ($activities as $activity) {
                $activity = json_decode(json_encode($activity));
                $hour = new Hour();

                $hour->hour_from = intval($activity->time_start_hh);
                $hour->hour_to = intval($activity->time_end_hh);
                $hour->duration = intval($activity->duration);

                $hour->activity = $activity; //TODO: uncomment this
                $hour->distances_activity = 0;

                array_push($object->hours, $hour);
            }

            usort($object->hours, function ($a, $b) {
                return $a->hour_from <=> $b->hour_from;
            });
            array_push($iteraries->days, $object);
        }


        $this->activity_day_breakdown = $iteraries;
    }

    private function expand_activity_day_key()
    {
        foreach ($this->activities as $activity) {

            $startDate = new \DateTime($activity->date_starts);
            $endDate = new \DateTime($activity->date_ends);

            $endDate = $endDate->modify('+1 day'); //to include end date

            $interval = \DateInterval::createFromDateString('1 day');
            $period = new \DatePeriod($startDate, $interval, $endDate);
            foreach ($period as $dt) {

                if ($dt < $this->date_start || $dt > $this->date_ends) {
                    continue;
                }

                $date = $dt->format("Y-m-d");
                if (!isset($this->activity_day_key[$date]) || !is_array($this->activity_day_key[$date])) {
                    $this->activity_day_key[$date] = [];
                }

                $this->activity_day_key[$date][] = $activity;
            }
        }
//        HelperFunction::output($this->activity_day_key);
        ksort($this->activity_day_key);
//        echo '<pre>';
//        print_r($this->activity_day_key);exit;
    }

    private function calculate_distance()
    {
//        HelperFunction::output($this->activity_day_breakdown->days);
        foreach ($this->activity_day_breakdown->days as $day) {

            $baseActivity = $day->hours[0]->activity;
            foreach ($day->hours as $hour) {
                $currentActivity = $hour->activity;
                $hour->distances_activity = DistanceHelper::long_lat_distance(
                    doubleval($baseActivity->latitude),
                    doubleval($baseActivity->longitude),
                    doubleval($currentActivity->latitude),
                    doubleval($currentActivity->longitude)
                );
            }


        }
    }

    public function sort_activities()
    {
//        echo '<pre>';print_r(($this->activity_day_breakdown));exit;
        $distanceTimeCalculator = new ActivityTimeDistance();
        $activities_assigned = [];

        foreach ($this->activity_day_breakdown->days as $day) {

            $previousHour = null;
            $successScheduleCounter = 0;

            foreach ($day->hours as $key => $hour) {
//
//                if ($this->eachDayLimit > 0 && $successScheduleCounter >= $this->eachDayLimit) {
////                    echo $hour->activity['id'], ", ";
//                    unset($day->hours[$key]);
//                    continue;
//                }

                if (in_array($hour->activity->id, $activities_assigned)) {
                    unset($day->hours[$key]);
                    continue;
                }

                $activityScheduleStarts = new \DateTime("{$day->day} {$hour->hour_from}:00");

                if (intval($hour->hour_to) < intval($hour->hour_from)) {
                    $hour->hour_to = 24;
//                    print_r(intval($hour->hour_to) );exit;
                }
                $activityScheduleEnds = new \DateTime("{$day->day} {$hour->hour_to}:00");

                if ($previousHour == null) {

                    $startTime = null;

                    // Start the day from user selected start date.
                    if ($this->isSingleDay) {

                        if ($hour->hour_from < $this->time_from) {
                            $startTime = new \DateTime("{$day->day} {$this->time_from}:00");
                        } else {
                            $startTime = new \DateTime("{$day->day} {$hour->hour_from}:00");
                        }
                    } else {
                        $startTime = new \DateTime("{$day->day} {$hour->hour_from}:00");
                    }

                    $endTime = clone $startTime;
                    $endTime->modify("+{$hour->duration} minutes");

                    if ($this->isSingleDay && intval($endTime->format('H')) > $this->time_to) {
//                        HelperFunction::output($this->time_to, false);
//                        echo "{$hour->activity->id} ";
//                        echo " - unset, ";
                        unset($day->hours[$key]);
                        continue;
                    }


                    if (!($startTime >= $activityScheduleStarts &&
                        $startTime <= $activityScheduleEnds &&
                        $endTime >= $activityScheduleStarts &&
                        $endTime <= $activityScheduleEnds)) {
//                        echo "Unset {$hour->activity->id} <br>";
                        unset($day->hours[$key]);
                        continue;
                    }

                    $hour->distances_activity = 0;

                    $hour->scheduled_hour_from = $startTime;
                    $hour->scheduled_hour_to = $endTime;
                    $hour->debug = "{$hour->activity->longitude}, {$hour->activity->latitude}, {$hour->activity->name}";

                    $activities_assigned[] = $hour->activity->id;
                }
                else {

                    $distanceToPreviousActivity = DistanceHelper::long_lat_distance($previousHour->activity->latitude, $previousHour->activity->longitude,
                        $hour->activity->latitude, $hour->activity->longitude);
                    $hour->distances_activity = $distanceToPreviousActivity;
                    $timeToTravelMinutes = ceil($distanceTimeCalculator->calculate_time($distanceToPreviousActivity));

                    $startTime = clone $previousHour->scheduled_hour_to;
//                    echo '<pre>';
//                    print_r($startTime);

                    if ($startTime < $activityScheduleStarts) {
                        $startTime = clone $activityScheduleStarts;
                    }


                    $startTime->modify("+$timeToTravelMinutes minutes");
                    $endTime = clone $startTime;
                    $endTime->modify("+{$hour->duration} minutes");

                    if ($this->isSingleDay && intval($endTime->format('H')) > $this->time_to) {
//                        HelperFunction::output($this->time_to, false);
//                        echo "{$hour->activity->id} ";
//                        echo " - unset, ";
                        unset($day->hours[$key]);
                        continue;
                    }

//                    if ($hour->activity->id == 30) {
//                        HelperFunction::output($distanceToPreviousActivity);
//                    }

                    $startTimeFormatted = $startTime->format("Y-m-d H:i:s");
                    $endTimeFormatted = $endTime->format("Y-m-d H:i:s");

                    $activityTimeFormattedStart = $activityScheduleStarts->format("Y-m-d H:i:s");
                    $activityTimeFormattedEnds = $activityScheduleEnds->format("Y-m-d H:i:s");


                    if (!($startTime >= $activityScheduleStarts &&
                        $startTime <= $activityScheduleEnds &&
                        $endTime >= $activityScheduleStarts &&
                        $endTime <= $activityScheduleEnds)) {
//                        echo "Unset {$hour->activity->id} <br>Activity Time {$activityTimeFormattedStart} ---- {$activityTimeFormattedEnds}<br> Schedul Time {$startTimeFormatted} ---- {$endTimeFormatted} <br><br>";
//                        var_dump($startTime >= $activityScheduleStarts);
//                        var_dump($startTime <= $activityScheduleEnds);
//                        var_dump($endTime >= $activityScheduleStarts);
//                        var_dump($endTime <= $activityScheduleEnds);
                        unset($day->hours[$key]);
                        continue;
                    }


                    $hour->scheduled_hour_from = $startTime;
                    $hour->scheduled_hour_to = $endTime;

                    $hour->debug = "{$hour->activity->longitude}, {$hour->activity->latitude}, {$hour->activity->name}";
                    $activities_assigned[] = $hour->activity->id;

                    $successScheduleCounter++;
                }

                $previousHour = $hour;

            }
//            exit;

            $day->hours = array_values($day->hours);
//            usort($day->hours, function ($a, $b) {
//                return $a->scheduled_hour_from <=> $b->scheduled_hour_to;
//            });


        }

        $this->format_sorted_data();

//        HelperFunction::output($this->activity_day_breakdown);
        return $this->activity_day_breakdown;
    }

    private function format_sorted_data()
    {
//        $this->activity_day_breakdown = array_values($this->activity_day_breakdown);

//        HelperFunction::output($this->activity_day_breakdown);
        foreach ($this->activity_day_breakdown->days as $day) {
            foreach ($day->hours as $hour) {
                $hour->activity = $hour->activity;
                $hour->scheduled_hour_from = $hour->scheduled_hour_from->format("Y-m-d H:i:s");
                $hour->scheduled_hour_to = $hour->scheduled_hour_to->format("Y-m-d H:i:s");
//                echo $hour->debug . "<br>";
            }
//            echo "<br>";
        }
    }


    private function assign_activities_day_key() {
        // number of activities per day

        $startDate = $this->date_start;
        $endDate = $this->date_ends;

        $endDate = $endDate->modify('+1 day'); //to include end date

        $interval = \DateInterval::createFromDateString('1 day');
        $period = new \DatePeriod($startDate, $interval, $endDate);
        $date_diff = $endDate->diff($startDate)->days;
//        print_r([$startDate,$endDate]);exit;

        if ($date_diff > 0) {
            $numOfActivities = count($this->activities);
            $date = $this->date_start->format("Y-m-d");
            if ($numOfActivities <= $date_diff) {
                for ($i = 0;$i < $numOfActivities;$i++) {
                    $this->activity_day_key[$date][] = $this->activities[$i];
                    $date = date('Y-m-d', strtotime("+1 day", strtotime($date)));
                }
            } else {
                $list = $this->activities;
                $p = $date_diff;
                $listlen = $numOfActivities;
                $partlen = floor( $listlen / $p );
                $partrem = $listlen % $p;
                $partition = array();
                $mark = 0;
                for ($px = 0; $px < $p; $px++) {
                    $incr = ($px < $partrem) ? $partlen+1 : $partlen;
//                    if ($px == 0) {
//                        $incr = $partlen;
//                        $partrem++;
//                    }
                    $partition[$date] = array_slice( $list, $mark, $incr );
                    $mark += $incr;
                    $date = date('Y-m-d', strtotime("+1 day", strtotime($date)));
                }
                $this->activity_day_key = $partition;
            }
        } else {
            foreach ($this->activities as $activity) {
                $date = $activity->date_starts->format("Y-m-d");
                if (!isset($this->activity_day_key[$date]) || !is_array($this->activity_day_key[$date])) {
                    $this->activity_day_key[$date] = [];
                }

                $this->activity_day_key[$date][] = $activity;
            }
        }
    }


    private function getWeather($day){
        return [];
        $apiKey = 'a75faa7064f87561cf9b73aa921310cb';
        $exclude = '?exclude=minutely,hourly,daily,alerts,flags';
        $unit = '?units=si';
        $lat = '14.2484765';
        $long = '40.8382879';

        $day = '2018-10-29';
        $localtime = $day.'T12:00:00+02:00';
//        return $localtime;
//        $url = 'https://api.darksky.net/forecast/a75faa7064f87561cf9b73aa921310cb/14.2484765,40.8382879,2018-05-24T12:00:00+02:00?exclude=minutely,hourly,daily,alerts,flags?units=si';
        $url = 'https://api.darksky.net/forecast/'.$apiKey.'/'.$lat.','.$long.','.$localtime.$exclude.$unit;

        $curlSession = curl_init();
        curl_setopt($curlSession, CURLOPT_URL, $url);
        curl_setopt($curlSession, CURLOPT_BINARYTRANSFER, true);
        curl_setopt($curlSession, CURLOPT_RETURNTRANSFER, true);

        $jsonData = (curl_exec($curlSession));
        curl_close($curlSession);
//        print_r($url);
        return $jsonData;
    }
}