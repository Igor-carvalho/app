import {Component, OnInit, ViewChild} from '@angular/core';
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
} from 'gsap';
import * as $ from 'jquery';
import {ActivityFilter} from '../model/ActivityFilter';
import {StaticDataService} from '../services/static-data.service';
import {ArrayUtils} from '../utilities/ArrayUtils';

import {Params, Router} from '@angular/router';
import {AppInitialSettings} from '../model/AppInitialSettings';
import {UserService} from '../model/user.service';

@Component({
    selector: 'app-tutorial-two',
    templateUrl: './tutorial-two.component.html',
})

export class TutorialTwoComponent implements OnInit {
    filterParams;

    public _activityFilter: ActivityFilter;
    public _arrayUtils: ArrayUtils;
    public appInitSettings: AppInitialSettings;

    public macroCategories: any;

    constructor(private _staticDataService: StaticDataService,
                private _userService: UserService,
                private _router: Router) {
        this._arrayUtils = new ArrayUtils();
        this.appInitSettings = new AppInitialSettings();

        console.log('isSingle', this.appInitSettings);
        this._router.routerState.root.queryParams.subscribe((params: Params) => {
            // this._activityFilter = <ActivityFilter> params;
            this.filterParams = params;
            this._activityFilter = new ActivityFilter(params);
        });
    }

    ngOnInit() {
        // this._activityFilter = new ActivityFilter();
        this.macroCategories = [];
        $('#header-button-wrapper').css('display', 'list-item');
        $('#edit-filter').css('display', 'hidden');
        $('#menu_back_icon').css('display', 'inline-block');
        // setTimeout(() => {
        //     $("#how-many-days").click();
        //     $(".daterangepicker").appendTo("#days-selector");
        // }, 1500);
        this.getMacroCategories();
        const slideWidth = document.getElementById('slider_container').clientWidth;
        const slider = document.getElementsByClassName('slider_wrapper')[0];
        const nextButton = document.getElementById('nextButton');
        const previousButton = document.getElementById('previousButton');
        let clickCount = 0;
        // const personNumberContainer = document.getElementById('person_number');
        // const childNumberContainer = document.getElementById('child_number');
        const lowBudget = document.getElementById('low_budget_image');
        const lowBudgetChecked = document.getElementById('low_budget_image_checked');
        const middleRangeBudget = document.getElementById('middle_range_budget_image');
        const middleRangeBudgetChecked = document.getElementById('middle_range_budget_image_checked');
        const highRangeBudget = document.getElementById('high_range_budget_image');
        const highRangeBudgetChecked = document.getElementById('high_range_budget_image_checked');
        const sliderDots = document.getElementsByClassName('slider_dot');
        // const $headingOne = $('.heading-one');
        const $sliderDot = $('.slider_dot');
        const $nextButton = $('#nextButton');
        const $previousButton = $('#previousButton');
        // const  $addChildClickCount = 0;
        // const $addPersonClickCount = 1;

        nextButton.onclick = function () {
            clickCount++;
            // console.log('click count:' + clickCount);
            // console.log('position: ' + (clickCount * slideWidth));
            TweenLite.to(slider, 0.5, {x: -clickCount * slideWidth});
            previousButton.style.visibility = 'visible';
            if (clickCount > 2) {
                nextButton.style.visibility = 'hidden';
            }
            for (let j = 0; j < sliderDots.length; j++) {
                sliderDots[j].classList.remove('active_dot');
            }
            sliderDots[clickCount].classList.add('active_dot');
        };
        previousButton.onclick = function () {
            clickCount--;
            // console.log('click count minus:' + clickCount);
            nextButton.style.visibility = 'visible';
            if (clickCount >= 0) {
                TweenLite.to(slider, 0.5, {x: -(clickCount * slideWidth)});
                if (clickCount === 0) {
                    previousButton.style.visibility = 'hidden';
                }
            }
            for (let i = 0; i < sliderDots.length; i++) {
                sliderDots[i].classList.remove('active_dot');
            }
            sliderDots[clickCount].classList.add('active_dot');
        };

        if ($(window).width() < 480) {
            lowBudget.onclick = function () {
                lowBudget.style.display = 'none';
                lowBudgetChecked.style.display = 'block';
                middleRangeBudgetChecked.style.display = 'none';
                middleRangeBudget.style.display = 'block';
                highRangeBudgetChecked.style.display = 'none';
                highRangeBudget.style.display = 'block';
                this._activityFilter.budget_type = 1;
            }.bind(this);
            lowBudgetChecked.onclick = function () {
                lowBudgetChecked.style.display = 'none';
                lowBudget.style.display = 'block';
            };
            middleRangeBudget.onclick = function () {
                middleRangeBudget.style.display = 'none';
                middleRangeBudgetChecked.style.display = 'block';
                lowBudgetChecked.style.display = 'none';
                lowBudget.style.display = 'block';
                highRangeBudgetChecked.style.display = 'none';
                highRangeBudget.style.display = 'block';
                this._activityFilter.budget_type = 2;
            }.bind(this);
            ;
            middleRangeBudgetChecked.onclick = function () {
                middleRangeBudgetChecked.style.display = 'none';
                middleRangeBudget.style.display = 'block';
            };
            highRangeBudget.onclick = function () {
                highRangeBudget.style.display = 'none';
                highRangeBudgetChecked.style.display = 'block';
                lowBudgetChecked.style.display = 'none';
                lowBudget.style.display = 'block';
                middleRangeBudgetChecked.style.display = 'none';
                middleRangeBudget.style.display = 'block';
                this._activityFilter.budget_type = 3;
            }.bind(this);
            highRangeBudgetChecked.onclick = function () {
                highRangeBudgetChecked.style.display = 'none';
                highRangeBudget.style.display = 'block';
            };
        } else {
            lowBudget.onclick = function () {
                lowBudget.style.display = 'none';
                lowBudgetChecked.style.display = 'inline-block';
                middleRangeBudgetChecked.style.display = 'none';
                middleRangeBudget.style.display = 'inline-block';
                highRangeBudgetChecked.style.display = 'none';
                highRangeBudget.style.display = 'inline-block';
                this._activityFilter.budget_type = 1;
            }.bind(this);
            lowBudgetChecked.onclick = function () {
                lowBudgetChecked.style.display = 'none';
                lowBudget.style.display = 'inline-block';
            };
            middleRangeBudget.onclick = function () {
                middleRangeBudget.style.display = 'none';
                middleRangeBudgetChecked.style.display = 'inline-block';
                lowBudgetChecked.style.display = 'none';
                lowBudget.style.display = 'inline-block';
                highRangeBudgetChecked.style.display = 'none';
                highRangeBudget.style.display = 'inline-block';
                this._activityFilter.budget_type = 2;
            }.bind(this);
            middleRangeBudgetChecked.onclick = function () {
                middleRangeBudgetChecked.style.display = 'none';
                middleRangeBudget.style.display = 'inline-block';
            };
            highRangeBudget.onclick = function () {
                highRangeBudget.style.display = 'none';
                highRangeBudgetChecked.style.display = 'inline-block';
                lowBudgetChecked.style.display = 'none';
                lowBudget.style.display = 'inline-block';
                middleRangeBudgetChecked.style.display = 'none';
                middleRangeBudget.style.display = 'inline-block';
                this._activityFilter.budget_type = 3;
            }.bind(this);
            highRangeBudgetChecked.onclick = function () {
                highRangeBudgetChecked.style.display = 'none';
                highRangeBudget.style.display = 'inline-block';
            };
        }

        // TweenLite.from(".adult_person", 0.8, {scale: 0, rotation: -50, ease: Back.easeOut});
        TweenLite.from('.adult_person', 0.8, {scale: 0, rotation: -50, ease: Back.easeOut});
        TweenLite.from('.add_person_icon', 0.8, {scale: 0, delay: 0.8, ease: Back.easeOut});
        TweenLite.from('.remove_person_icon', 0.8, {scale: 0, delay: 0.8, ease: Back.easeOut});
        // TweenLite.from($nextButton, 1, {left: 1000, delay: 1, ease: Bounce.easeOut});
        TweenLite.from($nextButton, 0.5, {scale: 0, delay: 1, ease: Back.easeOut});
        TweenMax.staggerFrom($sliderDot, 0.4, {delay: 0.9, scale: 0, ease: Elastic.easeOut.config(1.75, 0.4)}, 0.1);
        $nextButton.click(function () {
            if (clickCount === 0) {

            }
            if (clickCount === 1) {
                // console.log($('.heading-one:nth-child(1)');
                // TweenLite.from($headingOne, 0.5, {scale: 0, delay: 0.4, rotation:-10, ease: Back.easeOut});
                TweenLite.from('#low_budget_image', 0.5, {scale: 0, delay: 1, rotation: -70, ease: Back.easeOut});
                TweenLite.from('#middle_range_budget_image', 0.5, {
                    scale: 0,
                    delay: 1.2,
                    rotation: -70,
                    ease: Back.easeOut
                });
                TweenLite.from('#high_range_budget_image', 0.5, {
                    scale: 0,
                    delay: 1.4,
                    rotation: -70,
                    ease: Back.easeOut
                });
            }
            if (clickCount === 2) {
                // TweenMax.staggerFrom($(".checkbox"), 0.8, {delay: 0.5, left: 1000, ease: Bounce.easeOut}, 0.3);
                TweenMax.staggerFrom($('.checkbox'), 0.4, {scale: 0, delay: 1, rotation: -10, ease: Back.easeOut}, 0.3);
            }
        });
        $previousButton.click(function () {
            if (clickCount === 1) {
                // console.log('click count is one.');
            }
        });

        $('.adult_number_display').html($('#personNumberCountInput').val());
        $('.child_number_display').html($('#childNumberCountInput').val());

        const day = new Date().getDate();
        const month = new Date().getMonth();

        const monthsArray = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

        $('#date_one').val(day);
        $('#date_two').val(day);
        $('#month-one').val(monthsArray[month]);
        $('#month-two').val(monthsArray[month]);

        $('#day_one').html($('#date_one').val());
        $('#day_two').html($('#date_two').val());
        $('#month_one').html($('#month-one').val());
        $('#month_two').html($('#month-two').val());

        const dateFunction = new Date();
        const todaysDate = dateFunction.getDate();
        const currentMonth = dateFunction.getMonth();
        const currentTime = this._activityFilter.time_from;
        const endTime = this._activityFilter.time_to;

        $('#month_of_day_flow').html(monthsArray[currentMonth]);
        $('#one-day-flow-month').val(monthsArray[currentMonth]);
        $('#day_of_one_day_flow').html(todaysDate);
        $('#one-day-flow-day').val(todaysDate);
        $('#time_of_arrival').html(currentTime);
        $('#one-day-flow-time-one').val(currentTime);
        $('#time_of_exit').html(endTime);
        $('#one-day-flow-time-two').val(endTime);

        const timeOneInputVal = parseFloat((<HTMLInputElement>document.getElementById('one-day-flow-time-one')).value);
        const timeTwoInputVal = parseFloat((<HTMLInputElement>document.getElementById('one-day-flow-time-two')).value);
        if (timeOneInputVal > 11) {
            $('#AmPmOne').html('pm');
        }
        if (timeOneInputVal <= 11) {
            $('#AmPmOne').html('am');
        }
        if (timeTwoInputVal > 11) {
            $('#AmPmTwo').html('pm');
        }
        if (timeTwoInputVal <= 11) {
            $('#AmPmTwo').html('am');
        }

        // console.log(this._activityFilter);
    }

    private getMacroCategories() {
        this._staticDataService.getMacroCategories()
            .subscribe(
                result => {
                    const requiredFormat = [];
                    result.forEach(each => {
                        requiredFormat.push({id: each.id, name: each.label});
                    });
                    this.macroCategories = requiredFormat;
                },
                error => {
                    if (error.status === 401 || error.status === 403) {
                        this._userService.unauthorizedAccess(error);
                    }
                }
            );
    }

    getStarted() {
        console.log('tutorial-two(get_started)', this._activityFilter);
        // localStorage.setItem('filterParams', JSON.stringify(this._activityFilter));
        // this._router.navigate(['/wishlist']);
        this._router.navigate(['/wishlist'], {queryParams: this._activityFilter});
    }

    showGetStarted() {
        if (
            this._activityFilter.budget_type != null &&
            this._activityFilter.date_ends != null &&
            this._activityFilter.date_starts != null &&
            this._activityFilter.macro_categories.length > 0 &&
            this._activityFilter.num_adults > 0
        ) {
            return true;
        } else {
            return false;
        }
    }

    addPerson(personId) {
        let childCountInputVal = parseFloat((<HTMLInputElement>document.getElementById('childNumberCountInput')).value);
        let personCountInputVal = parseFloat((<HTMLInputElement>document.getElementById('personNumberCountInput')).value);
        if (personId === 'adult') {
            personCountInputVal++;
            $('#personNumberCountInput').val(personCountInputVal);
            $('.adult_number_display').html(personCountInputVal);

            this._activityFilter.num_adults = personCountInputVal;
        }
        if (personId === 'child') {
            childCountInputVal++;
            $('#childNumberCountInput').val(childCountInputVal);
            $('.child_number_display').html(childCountInputVal);
            this._activityFilter.num_childs = childCountInputVal;
        }
    }

    removePerson(personId) {
        let childCountInputVal = parseFloat((<HTMLInputElement>document.getElementById('childNumberCountInput')).value);
        let personCountInputVal = parseFloat((<HTMLInputElement>document.getElementById('personNumberCountInput')).value);
        if (personId === 'adult' && personCountInputVal > 1) {
            personCountInputVal--;
            $('#personNumberCountInput').val(personCountInputVal);
            $('.adult_number_display').html(personCountInputVal);
            this._activityFilter.num_adults = personCountInputVal;
        }
        if (personId === 'child' && childCountInputVal > 0) {
            childCountInputVal--;
            $('#childNumberCountInput').val(childCountInputVal);
            $('.child_number_display').html(childCountInputVal);
            this._activityFilter.num_childs = childCountInputVal;
        }
    }

    minusMonth(monthId) {
        const monthsArray = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        // const monthOneInputVal = parseFloat((<HTMLInputElement>document.getElementById('month-one')).value);
        // const monthTwoInputVal = parseFloat((<HTMLInputElement>document.getElementById('month-two')).value);
        let monthOne = document.getElementById('month_one').innerHTML;
        monthOne = monthOne.toLowerCase();
        const indexOfMonthOne = monthsArray.indexOf(monthOne);
        let monthTwo = document.getElementById('month_two').innerHTML;
        monthTwo = monthTwo.toLowerCase();
        const indexOfMonthTwo = monthsArray.indexOf(monthTwo);
        let monthDisplay = document.getElementById('month_' + monthId).innerHTML;
        monthDisplay = monthDisplay.toLowerCase();
        const indexOfMonth = monthsArray.indexOf(monthDisplay);
        if ((indexOfMonth - 1) >= 0) {
            if (monthId === 'two') {
                if (indexOfMonthTwo > indexOfMonthOne) {
                    const getLowerMonth = monthsArray[indexOfMonth - 1];
                    // console.log(getLowerMonth);
                    document.getElementById('month_' + monthId).innerHTML = getLowerMonth;
                    $('#month-' + monthId).val(getLowerMonth);

                    const date = new Date(this._activityFilter.date_ends);
                    const monthNumber = indexOfMonth - 1;
                    date.setMonth(monthNumber);

                    this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                } else {
                }
            }
            if (monthId === 'one') {
                const getLowerMonth = monthsArray[indexOfMonth - 1];
                // console.log(getLowerMonth);
                document.getElementById('month_' + monthId).innerHTML = getLowerMonth;
                $('#month-' + monthId).val(getLowerMonth);

                const date = new Date(this._activityFilter.date_starts);
                const monthNumber = indexOfMonth - 1;
                date.setMonth(monthNumber);

                this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                // console.log(date);
            }
        }
        console.log(this._activityFilter);
    }

    plusMonth(monthId) {
        const monthsArray = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        // const monthOneInputVal = parseFloat((<HTMLInputElement>document.getElementById('month-one')).value);
        // const monthTwoInputVal = parseFloat((<HTMLInputElement>document.getElementById('month-two')).value);
        let monthOne = document.getElementById('month_one').innerHTML;
        monthOne = monthOne.toLowerCase();
        const indexOfMonthOne = monthsArray.indexOf(monthOne);
        let monthTwo = document.getElementById('month_two').innerHTML;
        monthTwo = monthTwo.toLowerCase();
        const indexOfMonthTwo = monthsArray.indexOf(monthTwo);
        let monthDisplay = document.getElementById('month_' + monthId).innerHTML;
        monthDisplay = monthDisplay.toLowerCase();
        const indexOfMonth = monthsArray.indexOf(monthDisplay);
        const getNextMonth = monthsArray[indexOfMonth + 1];
        if ((indexOfMonth + 1) <= 11) {
            if (monthId === 'one') {
                if (indexOfMonthOne === (indexOfMonthTwo - 1)) {
                    document.getElementById('month_one').innerHTML = getNextMonth;
                    document.getElementById('month_two').innerHTML = getNextMonth;
                    $('#month-one').val(getNextMonth);
                    $('#month-two').val(getNextMonth);
                    document.getElementById('day_one').innerHTML = '1';
                    $('#date_one').val(1);

                    const date = new Date(this._activityFilter.date_ends);
                    const monthNumber = indexOfMonth + 1;
                    date.setMonth(monthNumber);

                    this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

                    const dateEnd = new Date(this._activityFilter.date_starts);
                    dateEnd.setMonth(monthNumber);
                    dateEnd.setDate(1);

                    this._activityFilter.date_starts = dateEnd.toISOString().substring(0, 10);


                }
                if (indexOfMonthOne >= indexOfMonthTwo) {
                    document.getElementById('month_one').innerHTML = getNextMonth;
                    document.getElementById('month_two').innerHTML = getNextMonth;
                    $('#month-one').val(getNextMonth);
                    $('#month-two').val(getNextMonth);
                    document.getElementById('day_one').innerHTML = '1';
                    $('#date_one').val(1);

                    const date = new Date(this._activityFilter.date_ends);
                    const monthNumber = indexOfMonth + 1;
                    date.setMonth(monthNumber);

                    this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

                    const dateEnd = new Date(this._activityFilter.date_starts);
                    dateEnd.setMonth(monthNumber);
                    dateEnd.setDate(1);

                    this._activityFilter.date_starts = dateEnd.toISOString().substring(0, 10);
                } else {
                    document.getElementById('month_' + monthId).innerHTML = getNextMonth;
                    $('#month-' + monthId).val(getNextMonth);

                    const date = new Date(this._activityFilter.date_starts);
                    const monthNumber = indexOfMonth + 1;
                    date.setMonth(monthNumber);

                    this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                }
            }
            if (monthId === 'two') {
                document.getElementById('month_' + monthId).innerHTML = getNextMonth;
                $('#month-' + monthId).val(getNextMonth);

                const date = new Date(this._activityFilter.date_ends);
                const monthNumber = indexOfMonth + 1;
                date.setMonth(monthNumber);


                this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            }
        }
        console.log(this._activityFilter);
    }

    oneDayMonth(monthID) {
        const monthsArray = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        // const monthInputVal = parseFloat((<HTMLInputElement>document.getElementById('one-day-flow-month')).value);
        let monthDisplayString = document.getElementById('month_of_day_flow').innerHTML;
        monthDisplayString = monthDisplayString.toLowerCase();
        const indexOfMonth = monthsArray.indexOf(monthDisplayString);
        const dateFunction = new Date();
        const thisMonth = dateFunction.getMonth();
        if (monthID === 'minus' && ((indexOfMonth - 1) >= thisMonth)) {
            const getLowerMonth = monthsArray[indexOfMonth - 1];
            console.log(getLowerMonth);
            document.getElementById('month_of_day_flow').innerHTML = getLowerMonth;
            $('#one-day-flow-month').val(getLowerMonth);

            const date = new Date(this._activityFilter.date_starts);
            const monthNumber = indexOfMonth + 1;
            date.setMonth(monthNumber);


            this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        if (monthID === 'plus' && ((indexOfMonth + 1) <= 11)) {
            const getNextMonth = monthsArray[indexOfMonth + 1];
            document.getElementById('month_of_day_flow').innerHTML = getNextMonth;
            $('#one-day-flow-month').val(getNextMonth);


            const date = new Date(this._activityFilter.date_starts);
            const monthNumber = indexOfMonth + 1;
            date.setMonth(monthNumber);


            this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

        }
        console.log(this._activityFilter);
    }

    oneDayFlowDay(dayID) {
        const monthsArray = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const thirtyOneDayMonths = ['january', 'march', 'may', 'july', 'august', 'october', 'december'];
        const thirtyDayMonths = ['april', 'june', 'september', 'november'];
        const februaryMonth = ['february'];
        let month = document.getElementById('month_of_day_flow').innerHTML;
        month = month.toLowerCase();
        const indexOfMonth = monthsArray.indexOf(month);
        const daysArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        const dateFunction = new Date();
        const todaysDate = dateFunction.getDate();
        const thisMonth = dateFunction.getMonth();
        const dayInputVal = parseFloat((<HTMLInputElement>document.getElementById('one-day-flow-day')).value);
        const dayDisplayedValue = document.getElementById('day_of_one_day_flow').innerHTML;
        const indexOfDay = daysArray.indexOf(dayInputVal);
        console.log('dayInputVal', dayInputVal);
        let getHigherDay;
        if (dayID == 'minus' && (monthsArray[thisMonth] == month) && indexOfDay >= todaysDate) {
            const getLowerDay = daysArray.indexOf(indexOfDay + 1);
            $('#day_of_one_day_flow').html(getLowerDay);
            $('#one-day-flow-day').val(getLowerDay);

            const date = new Date(this._activityFilter.date_starts);
            const dayNumber = getLowerDay;
            console.log(dayNumber);
            date.setDate(dayNumber);

            this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        if (dayID == 'minus' && monthsArray[thisMonth] != month && indexOfDay > 0) {
            const getLowerDay = daysArray.indexOf(indexOfDay + 1);
            $('#day_of_one_day_flow').html(getLowerDay);
            $('#one-day-flow-day').val(getLowerDay);

            const date = new Date(this._activityFilter.date_starts);
            const dayNumber = getLowerDay;
            console.log(dayNumber);
            date.setDate(dayNumber);

            this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        if (dayID == 'plus' && (thirtyOneDayMonths.indexOf(month) > -1) && (dayInputVal < 31)) {
            getHigherDay = dayInputVal + 1;
            $('#day_of_one_day_flow').html(getHigherDay);
            $('#one-day-flow-day').val(getHigherDay);

            const date = new Date(this._activityFilter.date_starts);
            const dayNumber: number = getHigherDay;
            console.log(dayNumber);
            date.setDate(dayNumber);

            this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        if (dayID == 'plus' && (thirtyDayMonths.indexOf(month) > -1) && (dayInputVal < 30)) {
            getHigherDay = dayInputVal + 1;
            $('#day_of_one_day_flow').html(getHigherDay);
            $('#one-day-flow-day').val(getHigherDay);

            const date = new Date(this._activityFilter.date_starts);
            const dayNumber: number = getHigherDay;
            console.log(dayNumber);
            date.setDate(dayNumber);

            this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        if (dayID == 'plus' && (februaryMonth.indexOf(month) > -1) && (dayInputVal < 28)) {
            getHigherDay = dayInputVal + 1;
            $('#day_of_one_day_flow').html(getHigherDay);
            $('#one-day-flow-day').val(getHigherDay);

            const date = new Date(this._activityFilter.date_starts);
            const dayNumber: number = getHigherDay;
            console.log(dayNumber);
            date.setDate(dayNumber);

            this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }

        console.log(this._activityFilter);
    }

    oneDayTime(timeID) {
        let timeOneInputVal = parseFloat((<HTMLInputElement>document.getElementById('one-day-flow-time-one')).value);
        let timeTwoInputVal = parseFloat((<HTMLInputElement>document.getElementById('one-day-flow-time-two')).value);
        const timeOneDisplayed = document.getElementById('time_of_arrival').innerHTML;
        const timeTwoDisplayed = document.getElementById('time_of_exit').innerHTML;
        const dayInputVal = parseFloat((<HTMLInputElement>document.getElementById('one-day-flow-day')).value);
        const dateFunction = new Date();
        const currentTime = dateFunction.getHours();
        const currentDay = dateFunction.getDate();
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
        $('#time_of_exit').html(timeTwoInputVal);
        $('#one-day-flow-time-one').val(timeOneInputVal);
        $('#one-day-flow-time-two').val(timeTwoInputVal);
        if (timeOneInputVal > 11) {
            $('#AmPmOne').html('pm');
        }
        if (timeOneInputVal <= 11) {
            $('#AmPmOne').html('am');
        }
        if (timeTwoInputVal > 11) {
            $('#AmPmTwo').html('pm');
        }
        if (timeTwoInputVal <= 11) {
            $('#AmPmTwo').html('am');
        }

        this._activityFilter.time_from = timeOneInputVal;
        this._activityFilter.time_to = timeTwoInputVal;

        console.log(this._activityFilter);
    }

    minusDay(dayId) {
        const monthsArray = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        let monthOne = document.getElementById('month_one').innerHTML;
        monthOne = monthOne.toLowerCase();
        const indexOfMonthOne = monthsArray.indexOf(monthOne);
        let monthTwo = document.getElementById('month_two').innerHTML;
        monthTwo = monthTwo.toLowerCase();
        const indexOfMonthTwo = monthsArray.indexOf(monthTwo);
        const daysArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        const dayValue = parseFloat((<HTMLInputElement>document.getElementById('date_' + dayId)).value);
        const indexOfDay = daysArray.indexOf(dayValue);
        let getLowerDay;
        const dayOneString = document.getElementById('day_one').innerHTML;
        const dayOneValue = +dayOneString;
        const dayTwoString = document.getElementById('day_two').innerHTML;
        const dayTwoValue = +dayTwoString;
        if (indexOfDay > 0) {
            if (dayId == 'two') {
                if (indexOfMonthTwo > indexOfMonthOne) {
                    getLowerDay = daysArray.indexOf(indexOfDay + 1);
                    document.getElementById('day_two').innerHTML = getLowerDay;
                    $('#date_two').val(getLowerDay);

                    const date = new Date(this._activityFilter.date_ends);
                    const dayNumber = indexOfDay;
                    console.log(dayNumber);
                    date.setDate(dayNumber);

                    this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                }
                if (indexOfMonthTwo == indexOfMonthOne) {
                    if (dayTwoValue > dayOneValue) {
                        getLowerDay = daysArray.indexOf(indexOfDay + 1);
                        document.getElementById('day_two').innerHTML = getLowerDay;
                        $('#date_two').val(getLowerDay);

                        const date = new Date(this._activityFilter.date_ends);
                        const dayNumber = indexOfDay;
                        console.log(dayNumber);
                        date.setDate(dayNumber);

                        this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                    }
                } else {
                }
            }
            if (dayId == 'one') {
                getLowerDay = daysArray.indexOf(indexOfDay + 1);
                document.getElementById('day_one').innerHTML = getLowerDay;
                $('#date_one').val(getLowerDay);

                const date = new Date(this._activityFilter.date_starts);
                const dayNumber = indexOfDay;
                console.log(dayNumber);
                date.setDate(dayNumber);

                this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            }
        }
        console.log(this._activityFilter);

    }

    plusDay(dayId) {
        const monthsArray = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const thirtyOneDayMonths = ['january', 'march', 'may', 'july', 'august', 'october', 'december'];
        const thirtyDayMonths = ['april', 'june', 'september', 'november'];
        const frbruaryMonth = ['february'];
        let monthOne = document.getElementById('month_one').innerHTML;
        monthOne = monthOne.toLowerCase();
        const indexOfMonthOne = monthsArray.indexOf(monthOne);
        let monthTwo = document.getElementById('month_two').innerHTML;
        monthTwo = monthTwo.toLowerCase();
        const indexOfMonthTwo = monthsArray.indexOf(monthTwo);
        const daysArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        const dayValue = parseFloat((<HTMLInputElement>document.getElementById('date_' + dayId)).value);
        const indexOfDay = daysArray.indexOf(dayValue);
        // console.log(indexOfDay);
        let getHigherDay;
        const dayOneString = document.getElementById('day_one').innerHTML;
        const dayOneValue = +dayOneString;
        const dayTwoString = document.getElementById('day_two').innerHTML;
        const dayTwoValue = +dayTwoString;
        if (dayId == 'two') {
            if (thirtyOneDayMonths.indexOf(monthTwo) > -1) {
                if (indexOfDay < 30) {
                    getHigherDay = indexOfDay + 2;
                    document.getElementById('day_two').innerHTML = getHigherDay;
                    $('#date_two').val(getHigherDay);

                    const date = new Date(this._activityFilter.date_ends);
                    const dayNumber = indexOfDay + 2;
                    date.setDate(dayNumber);
                    // console.log(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
                    // this._activityFilter.date_ends = date.toISOString().substring(0, 10);
                    this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                }
            }
            if (thirtyDayMonths.indexOf(monthTwo) > -1) {
                if (indexOfDay < 29) {
                    getHigherDay = indexOfDay + 2;
                    document.getElementById('day_two').innerHTML = getHigherDay;
                    $('#date_two').val(getHigherDay);

                    const date = new Date(this._activityFilter.date_ends);
                    const dayNumber = indexOfDay + 2;
                    date.setDate(dayNumber);

                    this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                }
            }
            if (frbruaryMonth.indexOf(monthTwo) > -1) {
                if (indexOfDay < 27) {
                    getHigherDay = indexOfDay + 2;
                    document.getElementById('day_two').innerHTML = getHigherDay;
                    $('#date_two').val(getHigherDay);

                    const date = new Date(this._activityFilter.date_ends);
                    const dayNumber = indexOfDay + 2;
                    date.setDate(dayNumber);

                    this._activityFilter.date_ends = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                }
            }
        }
        if (dayId == 'one') {
            // console.log('test', [indexOfMonthOne,indexOfMonthTwo]);
            if (indexOfMonthOne == indexOfMonthTwo) {
                if (dayOneValue < dayTwoValue) {
                    if (thirtyOneDayMonths.indexOf(monthTwo) > -1) {
                        if (indexOfDay < 30) {
                            getHigherDay = indexOfDay + 2;
                            document.getElementById('day_one').innerHTML = getHigherDay;
                            $('#date_one').val(getHigherDay);

                            const date = new Date(this._activityFilter.date_starts);
                            const dayNumber = indexOfDay + 2;
                            date.setDate(dayNumber);

                            this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                        }
                    }
                    if (thirtyDayMonths.indexOf(monthTwo) > -1) {
                        if (indexOfDay < 29) {
                            getHigherDay = indexOfDay + 2;
                            document.getElementById('day_one').innerHTML = getHigherDay;
                            $('#date_one').val(getHigherDay);

                            const date = new Date(this._activityFilter.date_starts);
                            const dayNumber = indexOfDay + 2;
                            date.setDate(dayNumber);

                            this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                        }
                    }
                    if (frbruaryMonth.indexOf(monthTwo) > -1) {
                        if (indexOfDay < 27) {
                            getHigherDay = indexOfDay + 2;
                            document.getElementById('day_one').innerHTML = getHigherDay;
                            $('#date_one').val(getHigherDay);

                            const date = new Date(this._activityFilter.date_starts);
                            const dayNumber = indexOfDay + 2;
                            date.setDate(dayNumber);

                            this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                        }
                    }
                }
            }
            if (indexOfMonthOne < indexOfMonthTwo) {
                console.log('index of day: ' + indexOfDay);
                if (thirtyOneDayMonths.indexOf(monthTwo) > -1) {
                    if (indexOfDay < 30) {
                        getHigherDay = indexOfDay + 2;
                        document.getElementById('day_one').innerHTML = getHigherDay;
                        $('#date_one').val(getHigherDay);

                        const date = new Date(this._activityFilter.date_starts);
                        const dayNumber = indexOfDay + 2;
                        date.setDate(dayNumber);

                        this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                    }
                }
                if (thirtyDayMonths.indexOf(monthTwo) > -1) {
                    if (indexOfDay < 29) {
                        getHigherDay = indexOfDay + 2;
                        document.getElementById('day_one').innerHTML = getHigherDay;
                        $('#date_one').val(getHigherDay);

                        const date = new Date(this._activityFilter.date_starts);
                        const dayNumber = indexOfDay + 2;
                        date.setDate(dayNumber);

                        this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                    }
                }
                if (frbruaryMonth.indexOf(monthTwo) > -1) {
                    if (indexOfDay < 27) {
                        console.log('index of the day is: ' + indexOfDay);
                        getHigherDay = indexOfDay + 2;
                        document.getElementById('day_one').innerHTML = getHigherDay;
                        $('#date_one').val(getHigherDay);

                        const date = new Date(this._activityFilter.date_starts);
                        const dayNumber = indexOfDay + 2;
                        date.setDate(dayNumber);

                        this._activityFilter.date_starts = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                    }
                }
            }
        }


        console.log(this._activityFilter);
    }


    lat = 41.9028;
    lng = 12.4964;
    mapClick(event) {
        this._activityFilter.lat = event.coords.lat;
        this._activityFilter.lng = event.coords.lng;
        console.log('geolocation(lat, lng)', [this._activityFilter.lat, this._activityFilter.lng]);
    }
}
