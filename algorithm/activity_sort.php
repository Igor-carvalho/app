<?php
/**
 * Created by PhpStorm.
 * User: abdullah
 * Date: 5/5/18
 * Time: 12:58
 */

echo "<pre>";

$activities = [
    ['distance' => 100, 'time' => 00],
    ['distance' => 200, 'time' => 02],
    ['distance' => 600, 'time' => 00],
    ['distance' => 800, 'time' => 01],
    ['distance' => 1100, 'time' => 9],
    ['distance' => 1500, 'time' => 11],

];


echo "Before Sorting: ";
print_r($activities);

$sorted = array_orderby($activities, 'time', SORT_ASC, 'distance', SORT_ASC);

echo "After Sorting: ";
print_r($sorted);





function array_orderby()
{
    $args = func_get_args();
    $data = array_shift($args);
    foreach ($args as $n => $field) {
        if (is_string($field)) {
            $tmp = array();
            foreach ($data as $key => $row)
                $tmp[$key] = $row[$field];
            $args[$n] = $tmp;
        }
    }
    $args[] = &$data;
    call_user_func_array('array_multisort', $args);
    return array_pop($args);
}


?>