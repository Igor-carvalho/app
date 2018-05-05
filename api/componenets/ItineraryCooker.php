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

    public function __construct($activities)
    {
        $this->activities = $activities;
        $this->expand_activity_day_key();
        $this->expand_activity_by_day();
        $this->calculate_distance();
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

                $hour->activity = $activity;
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
                $date = $dt->format("Y-m-d");
                if (!is_array($this->activity_day_key[$date])) {
                    $this->activity_day_key[$date] = [];
                }

                $this->activity_day_key[$date][] = $activity;
            }
        }

        ksort($this->activity_day_key);
    }

    private function calculate_distance()
    {
//        HelperFunction::output($this->activity_day_breakdown->days);
        foreach ($this->activity_day_breakdown->days as $day) {

            $baseActivity = $day->hours[0]->activity;
            foreach ($day->hours as $hour) {
                $currentActivity = $hour->activity;
                $hour->distances_activity = DistanceHelper::long_lat_distance($baseActivity->latitude, $baseActivity->longitude, $currentActivity->latitude, $currentActivity->longitude);
            }


        }
    }

    public function sort_activities()
    {
        HelperFunction::output(json_encode($this->activity_day_breakdown));
    }


}