<?php
/**
 * Created by PhpStorm.
 * User: abdullah
 * Date: 4/27/18
 * Time: 13:57
 */

namespace app\models\custom;


class PriceBudget
{
    public $id;
    public $name;

    public static $LOW = "1";
    public static $LOW_LABEL = "Low";

    public static $MID = "2";
    public static $MID_LABEL = "Mid";

    public static $HIGH = "3";
    public static $HIGH_LABEL = "High";

    public static function BUDGET_LIST()
    {
        $list = [];

        $list[0] = new PriceBudget();
        $list[0]->id = self::$LOW;
        $list[0]->name = self::$LOW_LABEL;

        $list[1] = new PriceBudget();
        $list[1]->id = self::$MID;
        $list[1]->name = self::$MID_LABEL;

        $list[2] = new PriceBudget();
        $list[2]->id = self::$HIGH;
        $list[2]->name = self::$HIGH_LABEL;

        return $list;
    }

}