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

class ItineraryCooker
{
    private $activities;
    private $activity_day_breakdown;
    private $activity_day_key;

    private $date_start, $date_ends;

    public function __construct($activities, $date_start, $date_end)
    {

        $this->date_start = new \DateTime($date_start);
        $this->date_ends = new \DateTime($date_end);

        $this->activities = $activities;
        $this->expand_activity_day_key(); // put all activities in date array with key by date
        $this->expand_activity_by_day(); // make an object specific to date
        $this->calculate_distance(); // calculate distance


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

            foreach ($activities as $activity) {
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
                if (!is_array($this->activity_day_key[$date])) {
                    $this->activity_day_key[$date] = [];
                }

                $this->activity_day_key[$date][] = $activity;
            }
        }
//        HelperFunction::output($this->activity_day_key);
        ksort($this->activity_day_key);
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
        $distanceTimeCalculator = new ActivityTimeDistance();
        $activities_assigned = [];

        foreach ($this->activity_day_breakdown->days as $day) {

            $previousHour = null;

            foreach ($day->hours as $key => $hour) {

                if (in_array($hour->activity->id, $activities_assigned)) {
                    unset($day->hours[$key]);
                    continue;
                }

                $activityScheduleStarts = new \DateTime("{$day->day} {$hour->hour_from}:00");
                $activityScheduleEnds = new \DateTime("{$day->day} {$hour->hour_to}:00");

                if ($previousHour == null) {
                    $startTime = new \DateTime("{$day->day} {$hour->hour_from}:00");
                    $endTime = new \DateTime("{$day->day} {$hour->hour_from}:00");
                    $endTime->modify("+{$hour->duration} minutes");

                    if (!($startTime >= $activityScheduleStarts &&
                        $startTime <= $activityScheduleEnds &&
                        $endTime >= $activityScheduleStarts &&
                        $endTime <= $activityScheduleEnds)) {
                        unset($day->hours[$key]);
                        continue;
                    }

                    $hour->distances_activity = 0;

                    $hour->scheduled_hour_from = $startTime;
                    $hour->scheduled_hour_to = $endTime;
                    $hour->debug = "{$hour->activity->longitude}, {$hour->activity->latitude}, {$hour->activity->name}";

                    $activities_assigned[] = $hour->activity->id;
                } else {

                    $distanceToPreviousActivity = DistanceHelper::long_lat_distance($previousHour->activity->latitude, $previousHour->longitude,
                        $hour->activity->latitude, $hour->longitude);
                    $hour->distances_activity = $distanceToPreviousActivity;
                    $timeToTravelMinutes = ceil($distanceTimeCalculator->calculate_time($distanceToPreviousActivity));

                    $startTime = clone $previousHour->scheduled_hour_to;

                    $startTime->modify("+$timeToTravelMinutes minutes");
                    $endTime = clone $startTime;
                    $endTime->modify("+{$hour->duration} minutes");

                    if (!($startTime >= $activityScheduleStarts &&
                        $startTime <= $activityScheduleEnds &&
                        $endTime >= $activityScheduleStarts &&
                        $endTime <= $activityScheduleEnds)) {
                        unset($day->hours[$key]);
                        continue;
                    }


                    $hour->scheduled_hour_from = $startTime;
                    $hour->scheduled_hour_to = $endTime;

                    $hour->debug = "{$hour->activity->longitude}, {$hour->activity->latitude}, {$hour->activity->name}";
                    $activities_assigned[] = $hour->activity->id;
                }

                $previousHour = $hour;

            }

            $day->hours = array_values($day->hours);
//            usort($day->hours, function ($a, $b) {
//                return $a->scheduled_hour_from <=> $b->scheduled_hour_to;
//            });


        }

        $this->format_sorted_data();
        return $this->activity_day_breakdown;
    }

    private function format_sorted_data()
    {

//        $this->activity_day_breakdown = array_values($this->activity_day_breakdown);
        foreach ($this->activity_day_breakdown->days as $day) {

            foreach ($day->hours as $hour) {
                $hour->activity = $hour->activity->toArray();
                $hour->scheduled_hour_from = $hour->scheduled_hour_from->format("Y-m-d H:i:s");
                $hour->scheduled_hour_to = $hour->scheduled_hour_to->format("Y-m-d H:i:s");

//                echo $hour->debug . "<br>";
            }

//            echo "<br>";

        }
    }


}