import {Component, OnInit} from '@angular/core';
import {
    TweenMax,
    Power2,
    Back,
    Power0,
    Elastic,
    Bounce,
    SplitText,
    TimelineLite,
    TweenLite,
    CSSPlugin,
    EasePack
} from "gsap";
import * as $ from 'jquery';
import {Params, Router} from "@angular/router";
import {ActivityFilter} from "../model/ActivityFilter";
import {ActivitiesDataService} from "../services/activities-data.service";
import {UserService} from "../model/user.service";
import {ArrayUtils} from "../utilities/ArrayUtils";

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {

    public _activityFilter: ActivityFilter;
    public _activities: any;
    public _selectedActivities: any;

    constructor(private _router: Router,
                private _userService: UserService,
                private _activitesDataService: ActivitiesDataService) {
        this._selectedActivities = [];
        this._router.routerState.root.queryParams.subscribe((params: Params) => {
            this._activityFilter = <ActivityFilter> params;
            this.getActivities(this._activityFilter);
        });
    }

    ngOnInit() {
        TweenLite.to("#heading", 2, {rotation: 360});
        $('#day_one').html($('#date_one').val());
        $('#calendar_dates_day_display_one').html($('#date_one').val());
        $('#day_two').html($('#date_two').val());
        $('#calendar_dates_day_display_two').html($('#date_two').val());
        $('#month_one').html($('#month-one').val());
        $('#calendar_dates_month_display_one').html($('#month-one').val());
        $('#month_two').html($('#month-two').val());
        $('#calendar_dates_month_display_two').html($('#month-two').val());

        if ($('input[name=budget_input]:checked').val() == 'low_budget') {
            $('.low_budget_icon').attr('src', 'assets/img/low-budget-selected.svg');
            $('.budget_icons_container_two').css('display', 'none');
            $('.budget_icons_container_three').css('display', 'none');
            $('.budget_range_text_display').html('low range');
        }

        if ($('input[name=budget_input]:checked').val() == 'mid_range_budget') {
            $('.budget_icons_container_one').css('display', 'none');
            $('.mid_budget_icon').attr('src', 'assets/img/middle-range-budget-selected.svg');
            $('.budget_icons_container_three').css('display', 'none');
            $('.budget_range_text_display').html('mid range');
        }

        if ($('input[name=budget_input]:checked').val() == 'high_range_budget') {
            $('.budget_icons_container_one').css('display', 'none');
            $('.budget_icons_container_two').css('display', 'none');
            $('.high_budget_icon').attr('src', 'assets/img/high-budget-selected.svg');
            $('.budget_range_text_display').html('high range');
        }

        $('.edit_filters_icon').click(function(){
            $(".sidebar_section").toggle(400);
        });
        if ($(window).width() <= 480) {
            TweenLite.to('.budget_icons_container', 0.4, {float: 'none'});
        }

    }

    toggleSidebar() {
        $('.sidebar_section').toggle(400);
    }

    edifFiltersFunction() {
        if ($(window).width() > 768) {
            TweenLite.to('.sidebar_section', 0.4, {width: 530});
        }
        if ($(window).width() > 480) {
            TweenLite.to('.budget_icons_container', 0.4, {float: 'left'});
        }
        if ($(window).width() <= 480) {
            TweenLite.to('.budget_icons_container', 0.4, {float: 'left'});
        }
        TweenLite.to('.editFilters', 0.4, {visibility: 'hidden', borderBottomWidth: 0});
        TweenLite.to('.applyFilters', 0.4, {borderBottomWidth: 5, visibility: 'visible'});
        TweenLite.to('.add_person', 0.4, {display: 'block', delay: 0.4, clearProps: "transform"});
        TweenLite.from('.add_person', 0.4, {scale: 0, delay: 0.4});
        TweenLite.to('.remove_person', 0.4, {display: 'block', delay: 0.4, clearProps: "transform"});
        TweenLite.from('.remove_person', 0.4, {scale: 0, delay: 0.4});
        TweenLite.to('.calendar_dates_display', 0.4, {display: 'none', clearProps: "transform"});
        TweenLite.to('.calendar_container', 0.4, {display: 'block', delay: 0.4, clearProps: "transform"});
        TweenLite.from('.calendar_container', 0.4, {scale: 0, delay: 0.4});
        TweenLite.to('.budget_range_text_display', 0.4, {display: 'none', clearProps: "transform"});
        TweenLite.to('.budget_icons_container', 0.4, {
            display: 'inline-block',
            textAlign: 'center',
            delay: 0.4,
            clearProps: "transform"
        });
        TweenLite.from('.budget_icons_container', 0.4, {scale: 0, delay: 0.4});

    }

    applyFiltersFunction() {

        TweenLite.to('.sidebar_section', 0.4, {width: 460, delay: 0.6});
        TweenLite.to('.applyFilters', 0.4, {visibility: 'hidden', borderBottomWidth: 0});
        TweenLite.to('.editFilters', 0.4, {borderBottomWidth: 5, visibility: 'visible'});
        TweenLite.to('.add_person', 0.4, {display: 'none', scale: 0, clearProps: "transform"});
        TweenLite.to('.remove_person', 0.4, {display: 'none', scale: 0, clearProps: "transform"});
        TweenLite.to('.calendar_dates_display', 0.4, {display: 'inline-block', delay: 0.4, clearProps: "transform"});
        TweenLite.from('.calendar_dates_display', 0.4, {scale: 0, delay: 0.4});
        TweenLite.to('.calendar_container', 0.4, {display: 'none', scale: 0, clearProps: "transform"});
        TweenLite.to('.budget_range_text_display', 0.4, {display: 'inline-block', delay: 0.4, clearProps: "transform"});
        TweenLite.from('.budget_range_text_display', 0.4, {scale: 0, delay: 0.4});
        //TweenLite.to('.budget_icons_container', 0.4, {display: 'none', textAlign: 'left', clearProps:"transform"});
        if ($('input[name=budget_input]:checked').val() == 'low_budget') {
            $('.low_budget_icon').attr('src', 'assets/img/low-budget-selected.svg');
            $('.budget_icons_container_two').css('display', 'none');
            $('.budget_icons_container_three').css('display', 'none');
            $('.budget_range_text_display').html('low range');
            if ($(window).width() > 480) {
                $('.budget_icons_container').css('text-align', 'left');
            }
            if ($(window).width() <= 480) {
                $('.budget_icons_container').css('float', 'none');
            }
        }

        if ($('input[name=budget_input]:checked').val() == 'mid_range_budget') {
            $('.budget_icons_container_one').css('display', 'none');
            $('.mid_budget_icon').attr('src', 'assets/img/middle-range-budget-selected.svg');
            $('.budget_icons_container_three').css('display', 'none');
            $('.budget_range_text_display').html('mid range');
            if ($(window).width() > 480) {
                $('.budget_icons_container').css('text-align', 'left');
            }
            if ($(window).width() <= 480) {
                $('.budget_icons_container').css('float', 'none');
            }
        }

        if ($('input[name=budget_input]:checked').val() == 'high_range_budget') {
            $('.budget_icons_container_one').css('display', 'none');
            $('.budget_icons_container_two').css('display', 'none');
            $('.high_budget_icon').attr('src', 'assets/img/high-budget-selected.svg');
            $('.budget_range_text_display').html('high range');
            if ($(window).width() > 480) {
                $('.budget_icons_container').css('text-align', 'left');
            }
            if ($(window).width() <= 480) {
                $('.budget_icons_container').css('float', 'none');
            }
        }
    }

    addAdults() {
        var $adultCount = $("#adults_number_input").val();
        $adultCount++;
        $("#adult_number").html($adultCount);
        $("#adults_number_input").val($adultCount);
    }

    removeAdults() {
        var $adultCount = $("#adults_number_input").val();
        if ($adultCount > 1) {
            $adultCount--;
            $("#adult_number").html($adultCount);
            $("#adults_number_input").val($adultCount);
        }
    }

    addChild(id) {
        console.log(id);
        var $childCount = $("#children_number_input").val();
        $childCount++;
        $("#child_number").html($childCount);
        $("#children_number_input").val($childCount);
    }

    removeChild() {
        var $childCount = $("#children_number_input").val();
        if ($childCount > 0) {
            $childCount--;
            $("#child_number").html($childCount);
            $("#children_number_input").val($childCount);
        }
    }

    minusMonth(monthId) {
        var monthsArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        var monthOneInputVal = parseFloat((<HTMLInputElement>document.getElementById("month-one")).value);
        var monthTwoInputVal = parseFloat((<HTMLInputElement>document.getElementById("month-two")).value);
        var monthOne = document.getElementById("month_one").innerHTML;
        monthOne = monthOne.toLowerCase();
        var indexOfMonthOne = monthsArray.indexOf(monthOne);
        var monthTwo = document.getElementById("month_two").innerHTML;
        monthTwo = monthTwo.toLowerCase();
        var indexOfMonthTwo = monthsArray.indexOf(monthTwo);
        var monthDisplay = document.getElementById("month_" + monthId).innerHTML;
        monthDisplay = monthDisplay.toLowerCase();
        var indexOfMonth = monthsArray.indexOf(monthDisplay);
        if ((indexOfMonth - 1) >= 0) {
            if (monthId == 'two') {
                if (indexOfMonthTwo > indexOfMonthOne) {
                    var getLowerMonth = monthsArray[indexOfMonth - 1];
                    console.log(getLowerMonth);
                    document.getElementById("month_" + monthId).innerHTML = getLowerMonth;
                    $('#month-' + monthId).val(getLowerMonth);
                    document.getElementById('calendar_dates_month_display_two').innerHTML = getLowerMonth;
                } else {
                }
            }
            if (monthId == 'one') {
                var getLowerMonth = monthsArray[indexOfMonth - 1];
                console.log(getLowerMonth);
                document.getElementById("month_" + monthId).innerHTML = getLowerMonth;
                $('#month-' + monthId).val(getLowerMonth);
                document.getElementById('calendar_dates_month_display_one').innerHTML = getLowerMonth;
            }
        }
    }

    plusMonth(monthId) {
        var monthsArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        var monthOneInputVal = parseFloat((<HTMLInputElement>document.getElementById("month-one")).value);
        var monthTwoInputVal = parseFloat((<HTMLInputElement>document.getElementById("month-two")).value);
        var monthOne = document.getElementById("month_one").innerHTML;
        monthOne = monthOne.toLowerCase();
        var indexOfMonthOne = monthsArray.indexOf(monthOne);
        var monthTwo = document.getElementById("month_two").innerHTML;
        monthTwo = monthTwo.toLowerCase();
        var indexOfMonthTwo = monthsArray.indexOf(monthTwo);
        var monthDisplay = document.getElementById("month_" + monthId).innerHTML;
        monthDisplay = monthDisplay.toLowerCase();
        var indexOfMonth = monthsArray.indexOf(monthDisplay);
        var getNextMonth = monthsArray[indexOfMonth + 1];
        if ((indexOfMonth + 1) <= 11) {
            if (monthId == 'one') {
                if (indexOfMonthOne == (indexOfMonthTwo - 1)) {
                    document.getElementById("month_one").innerHTML = getNextMonth;
                    document.getElementById("month_two").innerHTML = getNextMonth;
                    $('#month-one').val(getNextMonth);
                    $('#month-two').val(getNextMonth);
                    $('#calendar_dates_month_display_one').val(getNextMonth);
                    $('#calendar_dates_month_display_one').val(getNextMonth);
                    document.getElementById('day_one').innerHTML = '1';
                    $('#date_one').val(1);
                    $('#calendar_dates_day_display_one').val(1);
                }
                if (indexOfMonthOne >= indexOfMonthTwo) {
                    document.getElementById("month_one").innerHTML = getNextMonth;
                    document.getElementById("month_two").innerHTML = getNextMonth;
                    $('#month-one').val(getNextMonth);
                    $('#month-two').val(getNextMonth);
                    $('#calendar_dates_month_display_one').val(getNextMonth);
                    $('#calendar_dates_month_display_one').val(getNextMonth);
                    document.getElementById('day_one').innerHTML = '1';
                    $('#date_one').val(1);
                    $('#calendar_dates_day_display_one').val(1);
                } else {
                    document.getElementById("month_" + monthId).innerHTML = getNextMonth;
                    document.getElementById("calendar_dates_month_display_" + monthId).innerHTML = getNextMonth;
                    $('#month-' + monthId).val(getNextMonth);
                }
            }
            if (monthId == 'two') {
                document.getElementById("month_" + monthId).innerHTML = getNextMonth;
                document.getElementById("calendar_dates_month_display_" + monthId).innerHTML = getNextMonth;
                $('#month-' + monthId).val(getNextMonth);
            }
        }
    }

    minusDay(dayId) {
        var monthsArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        var monthOne = document.getElementById("month_one").innerHTML;
        monthOne = monthOne.toLowerCase();
        var indexOfMonthOne = monthsArray.indexOf(monthOne);
        var monthTwo = document.getElementById("month_two").innerHTML;
        monthTwo = monthTwo.toLowerCase();
        var indexOfMonthTwo = monthsArray.indexOf(monthTwo);
        var daysArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        var dayValue = parseFloat((<HTMLInputElement>document.getElementById("date_" + dayId)).value);
        var indexOfDay = daysArray.indexOf(dayValue);
        var getLowerDay;
        var dayOneString = document.getElementById('day_one').innerHTML;
        var dayOneValue = +dayOneString;
        var dayTwoString = document.getElementById('day_two').innerHTML;
        var dayTwoValue = +dayTwoString;
        if (indexOfDay > 0) {
            if (dayId == 'two') {
                if (indexOfMonthTwo > indexOfMonthOne) {
                    getLowerDay = daysArray.indexOf(indexOfDay + 1);
                    document.getElementById('day_two').innerHTML = getLowerDay;
                    document.getElementById('calendar_dates_day_display_two').innerHTML = getLowerDay;
                    $('#date_two').val(getLowerDay);
                }
                if (indexOfMonthTwo == indexOfMonthOne) {
                    if (dayTwoValue > dayOneValue) {
                        getLowerDay = daysArray.indexOf(indexOfDay + 1);
                        document.getElementById('day_two').innerHTML = getLowerDay;
                        document.getElementById('calendar_dates_day_display_two').innerHTML = getLowerDay;
                        $('#date_two').val(getLowerDay);
                    }
                } else {
                }
            }
            if (dayId == 'one') {
                getLowerDay = daysArray.indexOf(indexOfDay + 1);
                document.getElementById('day_one').innerHTML = getLowerDay;
                document.getElementById('calendar_dates_day_display_one').innerHTML = getLowerDay;
                $('#date_one').val(getLowerDay);
            }
        }

    }

    plusDay(dayId) {
        var monthsArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        var thirtyOneDayMonths = ['january', 'march', 'may', 'july', 'august', 'october', 'december'];
        var thirtyDayMonths = ['april', 'june', 'september', 'november'];
        var frbruaryMonth = ['february'];
        var monthOne = document.getElementById("month_one").innerHTML;
        monthOne = monthOne.toLowerCase();
        var indexOfMonthOne = monthsArray.indexOf(monthOne);
        var monthTwo = document.getElementById("month_two").innerHTML;
        monthTwo = monthTwo.toLowerCase();
        var indexOfMonthTwo = monthsArray.indexOf(monthTwo);
        var daysArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        var dayValue = parseFloat((<HTMLInputElement>document.getElementById("date_" + dayId)).value);
        var indexOfDay = daysArray.indexOf(dayValue);
        var getHigherDay;
        var dayOneString = document.getElementById('day_one').innerHTML;
        var dayOneValue = +dayOneString;
        var dayTwoString = document.getElementById('day_two').innerHTML;
        var dayTwoValue = +dayTwoString;
        if (dayId == 'two') {
            if (thirtyOneDayMonths.indexOf(monthTwo) > -1) {
                if (indexOfDay < 30) {
                    getHigherDay = indexOfDay + 2;
                    document.getElementById('day_two').innerHTML = getHigherDay;
                    document.getElementById('calendar_dates_day_display_two').innerHTML = getHigherDay;
                    $('#date_two').val(getHigherDay);
                }
            }
            if (thirtyDayMonths.indexOf(monthTwo) > -1) {
                if (indexOfDay < 29) {
                    getHigherDay = indexOfDay + 2;
                    document.getElementById('day_two').innerHTML = getHigherDay;
                    document.getElementById('calendar_dates_day_display_two').innerHTML = getHigherDay;
                    $('#date_two').val(getHigherDay);
                }
            }
            if (frbruaryMonth.indexOf(monthTwo) > -1) {
                if (indexOfDay < 27) {
                    getHigherDay = indexOfDay + 2;
                    document.getElementById('day_two').innerHTML = getHigherDay;
                    document.getElementById('calendar_dates_day_display_two').innerHTML = getHigherDay;
                    $('#date_two').val(getHigherDay);
                }
            }
        }
        if (dayId == 'one') {
            if (indexOfMonthOne == indexOfMonthTwo) {
                if (dayOneValue < dayTwoValue) {
                    if (thirtyOneDayMonths.indexOf(monthTwo) > -1) {
                        if (indexOfDay < 30) {
                            getHigherDay = indexOfDay + 2;
                            document.getElementById('day_one').innerHTML = getHigherDay;
                            document.getElementById('calendar_dates_day_display_one').innerHTML = getHigherDay;
                            $('#date_one').val(getHigherDay);
                        }
                    }
                    if (thirtyDayMonths.indexOf(monthTwo) > -1) {
                        if (indexOfDay < 29) {
                            getHigherDay = indexOfDay + 2;
                            document.getElementById('day_one').innerHTML = getHigherDay;
                            document.getElementById('calendar_dates_day_display_one').innerHTML = getHigherDay;
                            $('#date_one').val(getHigherDay);
                        }
                    }
                    if (frbruaryMonth.indexOf(monthTwo) > -1) {
                        if (indexOfDay < 27) {
                            getHigherDay = indexOfDay + 2;
                            document.getElementById('day_one').innerHTML = getHigherDay;
                            document.getElementById('calendar_dates_day_display_one').innerHTML = getHigherDay;
                            $('#date_one').val(getHigherDay);
                        }
                    }
                }
            }
            if (indexOfMonthOne < indexOfMonthTwo) {
                if (thirtyOneDayMonths.indexOf(monthTwo) > -1) {
                    if (indexOfDay < 30) {
                        getHigherDay = indexOfDay + 2;
                        document.getElementById('day_one').innerHTML = getHigherDay;
                        document.getElementById('calendar_dates_day_display_one').innerHTML = getHigherDay;
                        $('#date_one').val(getHigherDay);
                    }
                }
                if (thirtyDayMonths.indexOf(monthTwo) > -1) {
                    if (indexOfDay < 29) {
                        getHigherDay = indexOfDay + 2;
                        document.getElementById('day_one').innerHTML = getHigherDay;
                        document.getElementById('calendar_dates_day_display_one').innerHTML = getHigherDay;
                        $('#date_one').val(getHigherDay);
                    }
                }
                if (frbruaryMonth.indexOf(monthTwo) > -1) {
                    if (indexOfDay < 27) {
                        getHigherDay = indexOfDay + 2;
                        document.getElementById('day_one').innerHTML = getHigherDay;
                        document.getElementById('calendar_dates_day_display_one').innerHTML = getHigherDay;
                        $('#date_one').val(getHigherDay);
                    }
                }
            }
        }
    }

    budgetSelection(budgetType) {
        if (budgetType == 'low') {
            $('.low_budget_icon').attr('src', 'assets/img/low-budget-selected.svg');
            $('.mid_budget_icon').attr('src', 'assets/img/middle-range-budget.svg');
            $('.high_budget_icon').attr('src', 'assets/img/high-range-budget.svg');
        }
        if (budgetType == 'medium') {
            $('.low_budget_icon').attr('src', 'assets/img/low-budget.svg');
            $('.mid_budget_icon').attr('src', 'assets/img/middle-range-budget-selected.svg');
            $('.high_budget_icon').attr('src', 'assets/img/high-range-budget.svg');
        }
        if (budgetType == 'high') {
            $('.low_budget_icon').attr('src', 'assets/img/low-budget.svg');
            $('.mid_budget_icon').attr('src', 'assets/img/middle-range-budget.svg');
            $('.high_budget_icon').attr('src', 'assets/img/high-budget-selected.svg');
        }
    }

    getActivities(activity: ActivityFilter) {
        this._activitesDataService
            .filterActivites(activity.num_adults, activity.budget_type, activity.macro_categories, activity.date_starts, activity.date_ends)
            .subscribe(
                activities => {
                    this._activities = activities;
                },
                error => {
                    // unauthorized access
                    if (error.status == 401 || error.status == 403) {
                        this._userService.unauthorizedAccess(error);
                    } else {
                        //this._errorMessage = error.data.message; // TODO: uncomment later
                    }
                }
            );
    }

    toggle_selected_acctivity(id) {
        var index = this._selectedActivities.indexOf(id);
        if (index != -1) {
            this._selectedActivities.splice(index, 1);
        } else {
            this._selectedActivities.push(id);
        }
    }

    check_activity_selected(id) {
        return this._selectedActivities.indexOf(id) != -1;
    }



}
