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
import {ItineraryDataService} from "../services/itinerary-data.service";
import {Itinerary} from "../model/itinerary/Itinerary";
import {StaticDataService} from "../services/static-data.service";
import {FrontendLayoutComponent} from "../layouts/frontend-layout.component";
import {AppInitialSettings} from "../model/AppInitialSettings";
import {ItineraryExport} from "../model/ItineraryExport";
import {ItineraryActivities} from "../model/ItineraryActivities";

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {

    public _activityFilter: ActivityFilter;
    public _activities: any;
    public _selectedActivities: any;
    public macroCategories: any;
    public _arrayUtils: ArrayUtils;
    public _singleDayTemporaryItinerary: Itinerary;

    public _itinerary: Itinerary;
    public loading: boolean;
    public appInitSettings: AppInitialSettings;
    private itineraryExport: ItineraryExport;

    constructor(private _router: Router,
                private _userService: UserService,
                private _staticDataService: StaticDataService,
                private _itineraryDataService: ItineraryDataService,
                private _activitesDataService: ActivitiesDataService) {
        this._selectedActivities = [];
        this.loading = true;
        this._activities = [];
        this.appInitSettings = new AppInitialSettings();
        this.itineraryExport = new ItineraryExport();
        this._singleDayTemporaryItinerary = new Itinerary();

        this._router.routerState.root.queryParams.subscribe((params: Params) => {
            // this._activityFilter = <ActivityFilter> params;
            this._activityFilter = new ActivityFilter(params);
            console.log(this._activityFilter);
        });
        this._arrayUtils = new ArrayUtils();
        this.macroCategories = [];

    }

    populateFilterValues() {
        $("#adult_number").html(this._activityFilter.num_adults);
        $("#adults_number_input").val(this._activityFilter.num_adults);


        $("#child_number").html(this._activityFilter.num_childs);
        $("#children_number_input").val(this._activityFilter.num_childs);


        var monthsArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        var startDate = new Date(this._activityFilter.date_starts);
        var endDate = new Date(this._activityFilter.date_ends);
        var getLowerMonthOne = monthsArray[startDate.getMonth()];
        document.getElementById("month_one").innerHTML = getLowerMonthOne;
        $('#month-one').val(getLowerMonthOne);
        document.getElementById('calendar_dates_month_display_one').innerHTML = getLowerMonthOne;

        var getLowerMonthTwo = monthsArray[endDate.getMonth()];
        document.getElementById("month_two").innerHTML = getLowerMonthOne;
        $('#month-two').val(getLowerMonthOne);
        document.getElementById('calendar_dates_month_display_two').innerHTML = getLowerMonthOne;


        $('#date_one').val(startDate.getDate());
        $('#date_two').val(endDate.getDate());
        var budgetType = "low";

        if (this._activityFilter.budget_type == 2)
            budgetType = "medium";
        else if (this._activityFilter.budget_type == 3)
            budgetType = "high";

        $("#" + budgetType + "-budget-radio").click();
        this.budgetSelection(budgetType);


    }

    ngOnInit() {
        if (window.location.href.indexOf("wishlist") > -1) {
            console.log('this is working');
            $('.app').css('background-color', "#f0f0f0");
        }
        console.log("ngInit");

        $("#edit-filter").show();
        this.populateFilterValues();
        this.getMacroCategories();

        if (this.appInitSettings.isSingleDay) {
            this.getOneDayItinerary(this._activityFilter);
        } else {
            this.getActivities(this._activityFilter);
        }
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

        $('#edit-filter').click(function () {
            $(".sidebar_section").toggle(400);
        });
        if ($(window).width() <= 480) {
            TweenLite.to('.budget_icons_container', 0.4, {float: 'none'});
        }

        var dateFunction = new Date();
        var todaysDate = dateFunction.getDate();
        var currentMonth = dateFunction.getMonth();
        var currentTime = dateFunction.getHours();
        var endTime = currentTime + 1;


        var monthsArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        $('#month_of_day_flow').html(monthsArray[currentMonth]);
        $('#calendar_dates_month_display').html(monthsArray[currentMonth]);
        $('#one-day-flow-month').val(monthsArray[currentMonth]);
        $('#day_of_one_day_flow').html(todaysDate);
        $('#calendar_dates_day_display').html(todaysDate);
        $('#one-day-flow-day').val(todaysDate);
        $('#time_of_arrival').html(currentTime);
        $('#calendar_dates_from_display').html(currentTime);
        $('#one-day-flow-time-one').val(currentTime);
        $('#time_of_exit').html(endTime);
        $('#calendar_dates_to_display').html(endTime);
        $('#one-day-flow-time-two').val(endTime);

        var timeOneInputVal = parseFloat((<HTMLInputElement>document.getElementById("one-day-flow-time-one")).value);
        var timeTwoInputVal = parseFloat((<HTMLInputElement>document.getElementById("one-day-flow-time-two")).value);
        if (timeOneInputVal > 11) {
            $('#AmPmOne').html('pm');
            $('#AmPmSpanOne').html('pm');
        }
        if (timeOneInputVal <= 11) {
            $('#AmPmOne').html('am');
            $('#AmPmSpanOne').html('am');
        }
        if (timeTwoInputVal > 11) {
            $('#AmPmTwo').html('pm');
            $('#AmPmSpanTwo').html('am');
        }
        if (timeTwoInputVal <= 11) {
            $('#AmPmTwo').html('am');
            $('#AmPmSpanTwo').html('am');
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
        TweenLite.to('.one_day_calendar_wrapper', 0.4, {display: 'block', delay: 0.4, clearProps: "transform"});
        TweenLite.from('.one_day_calendar_wrapper', 0.4, {scale: 0, delay: 0.4});
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
        TweenLite.to('.one_day_calendar_wrapper', 0.4, {display: 'none', scale: 0, clearProps: "transform"});
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
        $("#edit-filter").click();
        this._router.navigate(['/wishlist'], {queryParams: this._activityFilter});

        if (!this.appInitSettings.isSingleDay)
            this.getActivities(this._activityFilter);
        else {
            this.getOneDayItinerary(this._activityFilter);
        }
    }

    addAdults() {
        var $adultCount = $("#adults_number_input").val();
        $adultCount++;
        $("#adult_number").html($adultCount);
        $("#adults_number_input").val($adultCount);
        this._activityFilter.num_adults = $adultCount;
    }

    removeAdults() {
        var $adultCount = $("#adults_number_input").val();
        if ($adultCount > 1) {
            $adultCount--;
            $("#adult_number").html($adultCount);
            $("#adults_number_input").val($adultCount);
        }
        this._activityFilter.num_adults = $adultCount;
    }

    addChild(id) {
        console.log(id);
        var $childCount = $("#children_number_input").val();
        $childCount++;
        $("#child_number").html($childCount);
        $("#children_number_input").val($childCount);
        this._activityFilter.num_childs = $childCount;
    }

    removeChild() {
        var $childCount = $("#children_number_input").val();
        if ($childCount > 0) {
            $childCount--;
            $("#child_number").html($childCount);
            $("#children_number_input").val($childCount);
        }
        this._activityFilter.num_childs = $childCount;
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

                    var date = new Date(this._activityFilter.date_ends);
                    var monthNumber = indexOfMonth - 1;
                    date.setMonth(monthNumber);


                    this._activityFilter.date_ends = date.toISOString().substring(0, 10);
                } else {
                }
            }
            if (monthId == 'one') {
                var getLowerMonth = monthsArray[indexOfMonth - 1];
                console.log(getLowerMonth);
                document.getElementById("month_" + monthId).innerHTML = getLowerMonth;
                $('#month-' + monthId).val(getLowerMonth);
                document.getElementById('calendar_dates_month_display_one').innerHTML = getLowerMonth;


                var date = new Date(this._activityFilter.date_starts);
                var monthNumber = indexOfMonth - 1;
                date.setMonth(monthNumber);

                this._activityFilter.date_starts = date.toISOString().substring(0, 10);
                // console.log(date);
            }
        }
        console.log(this._activityFilter);
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

                    var date = new Date(this._activityFilter.date_ends);
                    var monthNumber = indexOfMonth + 1;
                    date.setMonth(monthNumber);

                    this._activityFilter.date_ends = date.toISOString().substring(0, 10);

                    var dateEnd = new Date(this._activityFilter.date_starts);
                    var monthNumber = indexOfMonth + 1;
                    dateEnd.setMonth(monthNumber);
                    dateEnd.setDate(1);

                    this._activityFilter.date_starts = dateEnd.toISOString().substring(0, 10);


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

                    var date = new Date(this._activityFilter.date_ends);
                    var monthNumber = indexOfMonth + 1;
                    date.setMonth(monthNumber);

                    this._activityFilter.date_ends = date.toISOString().substring(0, 10);

                    var dateEnd = new Date(this._activityFilter.date_starts);
                    var monthNumber = indexOfMonth + 1;
                    dateEnd.setMonth(monthNumber);
                    dateEnd.setDate(1);

                    this._activityFilter.date_starts = dateEnd.toISOString().substring(0, 10);
                } else {
                    document.getElementById("month_" + monthId).innerHTML = getNextMonth;
                    document.getElementById("calendar_dates_month_display_" + monthId).innerHTML = getNextMonth;
                    $('#month-' + monthId).val(getNextMonth);

                    var date = new Date(this._activityFilter.date_starts);
                    var monthNumber = indexOfMonth + 1;
                    date.setMonth(monthNumber);

                    this._activityFilter.date_starts = date.toISOString().substring(0, 10);
                }
            }
            if (monthId == 'two') {
                document.getElementById("month_" + monthId).innerHTML = getNextMonth;
                document.getElementById("calendar_dates_month_display_" + monthId).innerHTML = getNextMonth;
                $('#month-' + monthId).val(getNextMonth);

                var date = new Date(this._activityFilter.date_ends);
                var monthNumber = indexOfMonth + 1;
                date.setMonth(monthNumber);


                this._activityFilter.date_ends = date.toISOString().substring(0, 10);
            }
        }
        console.log(this._activityFilter);
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

                    var date = new Date(this._activityFilter.date_ends);
                    var dayNumber = indexOfDay;
                    console.log(dayNumber);
                    date.setDate(dayNumber);

                    this._activityFilter.date_ends = date.toISOString().substring(0, 10);
                }
                if (indexOfMonthTwo == indexOfMonthOne) {
                    if (dayTwoValue > dayOneValue) {
                        getLowerDay = daysArray.indexOf(indexOfDay + 1);
                        document.getElementById('day_two').innerHTML = getLowerDay;
                        document.getElementById('calendar_dates_day_display_two').innerHTML = getLowerDay;
                        $('#date_two').val(getLowerDay);

                        var date = new Date(this._activityFilter.date_ends);
                        var dayNumber = indexOfDay;
                        console.log(dayNumber);
                        date.setDate(dayNumber);

                        this._activityFilter.date_ends = date.toISOString().substring(0, 10);
                    }
                } else {
                }
            }
            if (dayId == 'one') {
                getLowerDay = daysArray.indexOf(indexOfDay + 1);
                document.getElementById('day_one').innerHTML = getLowerDay;
                document.getElementById('calendar_dates_day_display_one').innerHTML = getLowerDay;
                $('#date_one').val(getLowerDay);

                var date = new Date(this._activityFilter.date_starts);
                var dayNumber = indexOfDay;
                console.log(dayNumber);
                date.setDate(dayNumber);

                this._activityFilter.date_starts = date.toISOString().substring(0, 10);
            }
        }
        console.log(this._activityFilter);

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

                    var date = new Date(this._activityFilter.date_ends);
                    var dayNumber = indexOfDay + 2;
                    date.setDate(dayNumber);

                    this._activityFilter.date_ends = date.toISOString().substring(0, 10);
                }
            }
            if (thirtyDayMonths.indexOf(monthTwo) > -1) {
                if (indexOfDay < 29) {
                    getHigherDay = indexOfDay + 2;
                    document.getElementById('day_two').innerHTML = getHigherDay;
                    document.getElementById('calendar_dates_day_display_two').innerHTML = getHigherDay;
                    $('#date_two').val(getHigherDay);

                    var date = new Date(this._activityFilter.date_ends);
                    var dayNumber = indexOfDay + 2;
                    date.setDate(dayNumber);

                    this._activityFilter.date_ends = date.toISOString().substring(0, 10);
                }
            }
            if (frbruaryMonth.indexOf(monthTwo) > -1) {
                if (indexOfDay < 27) {
                    getHigherDay = indexOfDay + 2;
                    document.getElementById('day_two').innerHTML = getHigherDay;
                    document.getElementById('calendar_dates_day_display_two').innerHTML = getHigherDay;
                    $('#date_two').val(getHigherDay);

                    var date = new Date(this._activityFilter.date_ends);
                    var dayNumber = indexOfDay + 2;
                    date.setDate(dayNumber);

                    this._activityFilter.date_ends = date.toISOString().substring(0, 10);
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

                            var date = new Date(this._activityFilter.date_starts);
                            var dayNumber = indexOfDay + 2;
                            date.setDate(dayNumber);

                            this._activityFilter.date_starts = date.toISOString().substring(0, 10);
                        }
                    }
                    if (thirtyDayMonths.indexOf(monthTwo) > -1) {
                        if (indexOfDay < 29) {
                            getHigherDay = indexOfDay + 2;
                            document.getElementById('day_one').innerHTML = getHigherDay;
                            document.getElementById('calendar_dates_day_display_one').innerHTML = getHigherDay;
                            $('#date_one').val(getHigherDay);

                            var date = new Date(this._activityFilter.date_starts);
                            var dayNumber = indexOfDay + 2;
                            date.setDate(dayNumber);

                            this._activityFilter.date_starts = date.toISOString().substring(0, 10);
                        }
                    }
                    if (frbruaryMonth.indexOf(monthTwo) > -1) {
                        if (indexOfDay < 27) {
                            getHigherDay = indexOfDay + 2;
                            document.getElementById('day_one').innerHTML = getHigherDay;
                            document.getElementById('calendar_dates_day_display_one').innerHTML = getHigherDay;
                            $('#date_one').val(getHigherDay);

                            var date = new Date(this._activityFilter.date_starts);
                            var dayNumber = indexOfDay + 2;
                            date.setDate(dayNumber);

                            this._activityFilter.date_starts = date.toISOString().substring(0, 10);
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

                        var date = new Date(this._activityFilter.date_starts);
                        var dayNumber = indexOfDay + 2;
                        date.setDate(dayNumber);

                        this._activityFilter.date_starts = date.toISOString().substring(0, 10);
                    }
                }
                if (thirtyDayMonths.indexOf(monthTwo) > -1) {
                    if (indexOfDay < 29) {
                        getHigherDay = indexOfDay + 2;
                        document.getElementById('day_one').innerHTML = getHigherDay;
                        document.getElementById('calendar_dates_day_display_one').innerHTML = getHigherDay;
                        $('#date_one').val(getHigherDay);

                        var date = new Date(this._activityFilter.date_starts);
                        var dayNumber = indexOfDay + 2;
                        date.setDate(dayNumber);

                        this._activityFilter.date_starts = date.toISOString().substring(0, 10);
                    }
                }
                if (frbruaryMonth.indexOf(monthTwo) > -1) {
                    if (indexOfDay < 27) {
                        getHigherDay = indexOfDay + 2;
                        document.getElementById('day_one').innerHTML = getHigherDay;
                        document.getElementById('calendar_dates_day_display_one').innerHTML = getHigherDay;
                        $('#date_one').val(getHigherDay);

                        var date = new Date(this._activityFilter.date_starts);
                        var dayNumber = indexOfDay + 2;
                        date.setDate(dayNumber);

                        this._activityFilter.date_starts = date.toISOString().substring(0, 10);
                    }
                }
            }
        }


        console.log(this._activityFilter);
    }

    budgetSelection(budgetType) {
        if (budgetType == 'low') {
            $('.low_budget_icon').attr('src', 'assets/img/low-budget-selected.svg');
            $('.mid_budget_icon').attr('src', 'assets/img/middle-range-budget.svg');
            $('.high_budget_icon').attr('src', 'assets/img/high-range-budget.svg');
            this._activityFilter.budget_type = 1;
        }
        if (budgetType == 'medium') {
            $('.low_budget_icon').attr('src', 'assets/img/low-budget.svg');
            $('.mid_budget_icon').attr('src', 'assets/img/middle-range-budget-selected.svg');
            $('.high_budget_icon').attr('src', 'assets/img/high-range-budget.svg');
            this._activityFilter.budget_type = 2;
        }
        if (budgetType == 'high') {
            $('.low_budget_icon').attr('src', 'assets/img/low-budget.svg');
            $('.mid_budget_icon').attr('src', 'assets/img/middle-range-budget.svg');
            $('.high_budget_icon').attr('src', 'assets/img/high-budget-selected.svg');
            this._activityFilter.budget_type = 3;
        }
    }

    getActivities(activity: ActivityFilter) {
        this.loading = true;
        this._activitesDataService
            .filterActivites(activity.num_adults, activity.budget_type, activity.macro_categories, activity.date_starts, activity.date_ends)
            .subscribe(
                activities => {
                    this._activities = activities;
                    this.loading = false;
                },
                error => {
                    this.loading = false;
                    // unauthorized access
                    if (error.status == 401 || error.status == 403) {
                        this._userService.unauthorizedAccess(error);
                    } else {
                        //this._errorMessage = error.data.message; // TODO: uncomment later
                    }
                }
            );
    }

    getOneDayItinerary(filter: ActivityFilter) {
        this.loading = true;
        this._activitesDataService
            .filterSingleDay(filter.num_adults,
                filter.budget_type,
                filter.macro_categories,
                filter.date_starts,
                filter.date_ends,
                filter.time_from,
                filter.time_to
            )
            .subscribe(
                itinerary => {
                    this._singleDayTemporaryItinerary = itinerary;
                    this.loading = false;
                    this.itineraryExport.calculateTotalActivities(this._singleDayTemporaryItinerary.itinerary_cook_raw);
                    console.log(this._singleDayTemporaryItinerary);
                },
                error => {
                    this.loading = false;
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

    show_my_itinerary() {
        if (this._selectedActivities.length == 0) {
            $(".select_activity_container").show();
            setTimeout(() => {
                $(".select_activity_container").hide();
            }, 3000)
            // alert("Wishlist is empty, Please select one or more items. ");
        } else {
            this.loading = true;
            this._itineraryDataService
                .cookItinerary(this._selectedActivities, this._activityFilter)
                .subscribe(
                    itinerary => {
                        this.loading = false;
                        this._itinerary = itinerary;
                        this._router.navigate(['/itinerary'], {queryParams: {id: this._itinerary.id}});
                    },
                    error => {
                        // unauthorized access
                        if (error.status == 401 || error.status == 403) {
                            this._userService.unauthorizedAccess(error);
                        } else {
                            alert(error.data.message);
                            //this._errorMessage = error.data.message; // TODO: uncomment later
                        }
                    }
                );

        }
    }

    private getMacroCategories() {
        this._staticDataService.getMacroCategories()
            .subscribe(
                result => {
                    // console.log(result);
                    var requiredFormat = [];
                    result.forEach(each => {
                        requiredFormat.push({id: each.id, name: each.label});
                    });
                    this.macroCategories = requiredFormat;
                },
                error => {

                }
            );
    }

    toggleMacroCategory(id) {

    }

    ngOnDestroy() {
        console.log("ngOnDestroy");

        $('.app').css('background-color', "");

        $("#edit-filter").hide();
        $("#edit-filter").unbind('click');
        $("#global-page-loader").hide('');

    }

    ngDoCheck() {
        // console.log("ngDoCheck");
        var globalLoader = document.getElementById("global-page-loader").style.display;
        if ($("#global-page-loader").css('display') == 'none' && this.loading) {
            $("#global-page-loader").show();
        } else if ($("#global-page-loader").css('display') == 'block' && !this.loading) {
            $("#global-page-loader").hide('slow');
        }
    }

    showExportItineraryModalWishlist() {

        if (this._selectedActivities.length == 0) {
            $(".select_activity_container").show();
            setTimeout(() => {
                $(".select_activity_container").hide();
            }, 3000)
            // alert("Wishlist is empty, Please select one or more items. ");
        } else {
            $("#exportItineraryModalWishlist").show();
        }

    }

    closeExportItineraryModalWishlist() {
        console.log("closeExportItineraryModalWishlist()");
        $("#exportItineraryModalWishlist").hide('slow');
    }


    skipExportActivity(activity_id) {
        if (!this.itineraryExport.skip_export_activities.includes(activity_id)) {
            this.itineraryExport.skip_export_activities.push(activity_id);
        }
    }


    exportItinerary() {
        if (this._selectedActivities.length == 0) {
            $(".select_activity_container").show();
            setTimeout(() => {
                $(".select_activity_container").hide();
            }, 3000)
            // alert("Wishlist is empty, Please select one or more items. ");
        } else {

            this.closeExportItineraryModalWishlist();
            let itineraryActivities = [];
            let selectActivities = this._selectedActivities;
            this._singleDayTemporaryItinerary.itinerary_cook_raw.days.forEach((day) => {
                day.hours.forEach(function (hour) {

                    if (selectActivities.includes(hour.activity.id)) {
                        let itineraryActivity = new ItineraryActivities();
                        itineraryActivity.start_time = hour.scheduled_hour_from;
                        itineraryActivity.end_time = hour.scheduled_hour_to;
                        itineraryActivity.activities_id = hour.activity.id + "";

                        itineraryActivities.push(itineraryActivity);
                    }
                });
            });

            this.loading = true;
            this._itineraryDataService
                .cookSingleDay(itineraryActivities, this._activityFilter)
                .subscribe(
                    itinerary => {
                        this.loading = false;
                        this._itinerary = itinerary;
                        this.exportItineraryEmail(this._itinerary.id);
                    },
                    error => {
                        // unauthorized access
                        if (error.status == 401 || error.status == 403) {
                            this._userService.unauthorizedAccess(error);
                        } else {
                            alert(error.data.message);
                            //this._errorMessage = error.data.message; // TODO: uncomment later
                        }
                    }
                );

        }
    }

    exportItineraryEmail(itinerary_id) {

        let activityToSkip = "";
        if (!this.itineraryExport.export_all) {
            activityToSkip = this.itineraryExport.skip_export_activities.join(",");
        }

        this._itineraryDataService
            .exportItinerary(itinerary_id, activityToSkip)
            .subscribe(
                itinerary => {
                    alert("Itinerary have been successfully exported. ");
                    // this._router.navigate(['/tutorial-two']); TODO: Uncomment this
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

    oneDayMonth(monthID) {
        var monthsArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        var monthInputVal = parseFloat((<HTMLInputElement>document.getElementById("one-day-flow-month")).value);
        var monthDisplayString = document.getElementById("month_of_day_flow").innerHTML;
        monthDisplayString = monthDisplayString.toLowerCase();
        var indexOfMonth = monthsArray.indexOf(monthDisplayString);
        var dateFunction = new Date();
        var thisMonth = dateFunction.getMonth();
        if (monthID == 'minus' && ((indexOfMonth - 1) >= thisMonth)) {
            var getLowerMonth = monthsArray[indexOfMonth - 1];
            console.log(getLowerMonth);
            document.getElementById('month_of_day_flow').innerHTML = getLowerMonth;
            $('#one-day-flow-month').val(getLowerMonth);
            $('#calendar_dates_month_display').html(getLowerMonth);

            var date = new Date(this._activityFilter.date_starts);
            var monthNumber = indexOfMonth + 1;
            date.setMonth(monthNumber);


            this._activityFilter.date_starts = date.toISOString().substring(0, 10);
            this._activityFilter.date_ends = date.toISOString().substring(0, 10);
        }
        if (monthID == 'plus' && ((indexOfMonth + 1) <= 11)) {
            var getNextMonth = monthsArray[indexOfMonth + 1];
            document.getElementById('month_of_day_flow').innerHTML = getNextMonth;
            $('#one-day-flow-month').val(getNextMonth);
            $('#calendar_dates_month_display').html(getNextMonth);


            var date = new Date(this._activityFilter.date_starts);
            var monthNumber = indexOfMonth + 1;
            date.setMonth(monthNumber);

            this._activityFilter.date_starts = date.toISOString().substring(0, 10);
            this._activityFilter.date_ends = date.toISOString().substring(0, 10);

        }
        console.log(this._activityFilter);
    }

    oneDayFlowDay(dayID) {
        var monthsArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        var thirtyOneDayMonths = ['january', 'march', 'may', 'july', 'august', 'october', 'december'];
        var thirtyDayMonths = ['april', 'june', 'september', 'november'];
        var februaryMonth = ['february'];
        var month = document.getElementById("month_of_day_flow").innerHTML;
        month = month.toLowerCase();
        var indexOfMonth = monthsArray.indexOf(month);
        var daysArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        var dateFunction = new Date();
        var todaysDate = dateFunction.getDate();
        var thisMonth = dateFunction.getMonth();
        var dayInputVal = parseFloat((<HTMLInputElement>document.getElementById("one-day-flow-day")).value);
        var dayDisplayedValue = document.getElementById('day_of_one_day_flow').innerHTML;
        var indexOfDay = daysArray.indexOf(dayInputVal);
        console.log("dayInputVal", dayInputVal);
        var getHigherDay;
        if (dayID == 'minus' && (monthsArray[thisMonth] == month) && indexOfDay >= todaysDate) {
            var getLowerDay = daysArray.indexOf(indexOfDay + 1);
            $('#day_of_one_day_flow').html(getLowerDay);
            $('#one-day-flow-day').val(getLowerDay);
            $('#calendar_dates_day_display').html(getLowerDay);

            var date = new Date(this._activityFilter.date_starts);
            var dayNumber = getLowerDay;
            console.log(dayNumber);
            date.setDate(dayNumber);

            this._activityFilter.date_starts = date.toISOString().substring(0, 10);
            this._activityFilter.date_ends = date.toISOString().substring(0, 10);
        }
        if (dayID == 'minus' && monthsArray[thisMonth] != month && indexOfDay > 0) {
            var getLowerDay = daysArray.indexOf(indexOfDay + 1);
            $('#day_of_one_day_flow').html(getLowerDay);
            $('#one-day-flow-day').val(getLowerDay);
            $('#calendar_dates_day_display').html(getLowerDay);

            var date = new Date(this._activityFilter.date_starts);
            var dayNumber = getLowerDay;
            console.log(dayNumber);
            date.setDate(dayNumber);

            this._activityFilter.date_starts = date.toISOString().substring(0, 10);
            this._activityFilter.date_ends = date.toISOString().substring(0, 10);
        }
        if (dayID == 'plus' && (thirtyOneDayMonths.indexOf(month) > -1) && (dayInputVal < 31)) {
            getHigherDay = dayInputVal + 1;
            $('#day_of_one_day_flow').html(getHigherDay);
            $('#one-day-flow-day').val(getHigherDay);
            $('#calendar_dates_day_display').html(getHigherDay);

            var date = new Date(this._activityFilter.date_starts);
            let dayNumber: number = getHigherDay;
            console.log(dayNumber);
            date.setDate(dayNumber);

            this._activityFilter.date_starts = date.toISOString().substring(0, 10);
            this._activityFilter.date_ends = date.toISOString().substring(0, 10);
        }
        if (dayID == 'plus' && (thirtyDayMonths.indexOf(month) > -1) && (dayInputVal < 30)) {
            getHigherDay = dayInputVal + 1;
            $('#day_of_one_day_flow').html(getHigherDay);
            $('#one-day-flow-day').val(getHigherDay);
            $('#calendar_dates_day_display').html(getHigherDay);

            var date = new Date(this._activityFilter.date_starts);
            let dayNumber: number = getHigherDay;
            console.log(dayNumber);
            date.setDate(dayNumber);

            this._activityFilter.date_starts = date.toISOString().substring(0, 10);
            this._activityFilter.date_ends = date.toISOString().substring(0, 10);
        }
        if (dayID == 'plus' && (februaryMonth.indexOf(month) > -1) && (dayInputVal < 28)) {
            getHigherDay = dayInputVal + 1;
            $('#day_of_one_day_flow').html(getHigherDay);
            $('#one-day-flow-day').val(getHigherDay);
            $('#calendar_dates_day_display').html(getHigherDay);

            var date = new Date(this._activityFilter.date_starts);
            let dayNumber: number = getHigherDay;
            console.log(dayNumber);
            date.setDate(dayNumber);

            this._activityFilter.date_starts = date.toISOString().substring(0, 10);
            this._activityFilter.date_ends = date.toISOString().substring(0, 10);
        }

        console.log(this._activityFilter);
    }

    oneDayTime(timeID) {
        var timeOneInputVal = parseFloat((<HTMLInputElement>document.getElementById("one-day-flow-time-one")).value);
        var timeTwoInputVal = parseFloat((<HTMLInputElement>document.getElementById("one-day-flow-time-two")).value);
        var timeOneDisplayed = document.getElementById('time_of_arrival').innerHTML;
        var timeTwoDisplayed = document.getElementById('time_of_exit').innerHTML;
        var dayInputVal = parseFloat((<HTMLInputElement>document.getElementById("one-day-flow-day")).value);
        var dateFunction = new Date();
        var currentTime = dateFunction.getHours();
        var currentDay = dateFunction.getDate();
        if (timeID == 'minus_one' && timeOneInputVal > 0) {
            if (dayInputVal > currentDay) {
                timeOneInputVal -= 1;
            }
            if (dayInputVal == currentDay && timeOneInputVal > currentTime) {
                timeOneInputVal -= 1;
            }
        }
        if (timeID == 'plus_one' && timeOneInputVal < 23) {
            if ((timeTwoInputVal - timeOneInputVal) == 1) {
                timeOneInputVal += 1;
                timeTwoInputVal += 1;
            }
            if (timeOneInputVal < timeTwoInputVal && (timeTwoInputVal - timeOneInputVal) > 1) {
                timeOneInputVal += 1;
            }
        }
        if (timeID == 'minus_two' && timeTwoInputVal > 1) {
            if ((timeTwoInputVal - timeOneInputVal) == 1) {
                timeOneInputVal -= 1;
                timeTwoInputVal -= 1;
            }
            if ((timeTwoInputVal - timeOneInputVal) > 1) {
                timeTwoInputVal -= 1;
            }
        }
        if (timeID == 'plus_two' && timeTwoInputVal < 24) {
            timeTwoInputVal += 1;
        }
        $('#time_of_arrival').html(timeOneInputVal);
        $('#calendar_dates_from_display').html(timeOneInputVal);
        $('#time_of_exit').html(timeTwoInputVal);
        $('#calendar_dates_to_display').html(timeTwoInputVal);
        $('#one-day-flow-time-one').val(timeOneInputVal);
        $('#one-day-flow-time-two').val(timeTwoInputVal);
        if (timeOneInputVal > 11) {
            $('#AmPmOne').html('pm');
            $('#AmPmSpanOne').html('pm');
        }
        if (timeOneInputVal <= 11) {
            $('#AmPmOne').html('am');
            $('#AmPmSpanOne').html('am');
        }
        if (timeTwoInputVal > 11) {
            $('#AmPmTwo').html('pm');
            $('#AmPmSpanTwo').html('am');
        }
        if (timeTwoInputVal <= 11) {
            $('#AmPmTwo').html('am');
            $('#AmPmSpanTwo').html('am');
        }

        this._activityFilter.time_from = timeOneInputVal;
        this._activityFilter.time_to = timeTwoInputVal;

        console.log(this._activityFilter);
    }

    showActivityDetails(activity_id) {
        $("#modal-activity-details-" + activity_id).show();
    }

    closeActivityDetails(activity_id) {
        $("#modal-activity-details-" + activity_id).hide('slow');
    }


}
