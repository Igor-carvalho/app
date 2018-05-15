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
import {ActivityFilter} from "../model/ActivityFilter";
import {StaticDataService} from "../services/static-data.service";
import {ArrayUtils} from "../utilities/ArrayUtils";

import {Router} from "@angular/router";

@Component({
    selector: 'app-tutorial-two',
    templateUrl: './tutorial-two.component.html',
})

export class TutorialTwoComponent implements OnInit {

    public _activityFilter: ActivityFilter;
    public _arrayUtils: ArrayUtils;

    public macroCategories: any;

    constructor(private _staticDataService: StaticDataService,
                private _router: Router) {
        this._activityFilter = new ActivityFilter();
        this.macroCategories = [];
        this._arrayUtils = new ArrayUtils();

    }

    ngOnInit() {
        // setTimeout(() => {
        //     $("#how-many-days").click();
        //     $(".daterangepicker").appendTo("#days-selector");
        // }, 1500);
        this.getMacroCategories();
        var slideWidth = document.getElementById('slider_container').clientWidth;
        var slider = document.getElementsByClassName('slider_wrapper')[0];
        var nextButton = document.getElementById('nextButton');
        var previousButton = document.getElementById('previousButton');
        var clickCount = 0;
        var personNumberContainer = document.getElementById('person_number');
        var childNumberContainer = document.getElementById('child_number');
        var lowBudget = document.getElementById('low_budget_image');
        var lowBudgetChecked = document.getElementById('low_budget_image_checked');
        var middleRangeBudget = document.getElementById('middle_range_budget_image');
        var middleRangeBudgetChecked = document.getElementById('middle_range_budget_image_checked');
        var highRangeBudget = document.getElementById('high_range_budget_image');
        var highRangeBudgetChecked = document.getElementById('high_range_budget_image_checked');
        var sliderDots = document.getElementsByClassName('slider_dot');
        var $headingOne = $('.heading-one');
        var $sliderDot = $('.slider_dot'), $nextButton = $('#nextButton'),
            $previousButton = $('#previousButton'), $addChildClickCount = 0, $addPersonClickCount = 1;

        nextButton.onclick = function () {
            clickCount++;
            console.log('click count:' + clickCount);
            console.log("position: " + (clickCount * slideWidth));
            TweenLite.to(slider, 0.5, {x: -clickCount * slideWidth});
            previousButton.style.visibility = "visible";
            if (clickCount > 2) {
                nextButton.style.visibility = "hidden";
            }
            for (var j = 0; j < sliderDots.length; j++) {
                sliderDots[j].classList.remove("active_dot");
            }
            sliderDots[clickCount].classList.add("active_dot");
        };
        previousButton.onclick = function () {
            clickCount--;
            console.log('click count minus:' + clickCount);
            nextButton.style.visibility = "visible";
            if (clickCount >= 0) {
                TweenLite.to(slider, 0.5, {x: -(clickCount * slideWidth)});
                if (clickCount == 0) {
                    previousButton.style.visibility = "hidden";
                }
            }
            for (var i = 0; i < sliderDots.length; i++) {
                sliderDots[i].classList.remove("active_dot");
            }
            sliderDots[clickCount].classList.add("active_dot");
        };
        /*
        addChild.onclick = function () {
            $addChildClickCount += 1;
            $("#childNumberCountInput").val($addChildClickCount);
            this._activityFilter.num_childs = $addChildClickCount;
            if (($addChildClickCount + $addPersonClickCount) <= 6) {
                childNumberContainer.innerHTML += "<img src='assets/img/child.svg' alt='child' class='child_image child_image_added'>";
                var childElemCount = childNumberContainer.childElementCount;
                for (var k = childElemCount; k > (childElemCount - 1); k--) {
                    var $nthChild = $('.child_image_added:nth-child(' + (k) + ')');
                    TweenLite.from($nthChild, 0.8, {scale: 0, ease: Back.easeOut});
                }
            }
            if (($addChildClickCount + $addPersonClickCount) > 6) {
                childNumberContainer.style.display = "none";
                personNumberContainer.style.display = "none";
                document.getElementById('person_number_display').style.display = "inline-block";
                document.getElementById('child_number_display').style.display = "inline-block";
                childNumberContainer.innerHTML += "<img src='assets/img/child.svg' alt='child' class='child_image child_image_added'>";
            }
            $('.child_number_count').html($addChildClickCount);
            if (childNumberContainer.childElementCount > 0) {
                $removeChild.css('display', 'inline-block');
            }
        }.bind(this);
        removeChild.onclick = function () {
            if ($addChildClickCount > 0) {
                $addChildClickCount -= 1;
                $("#childNumberCountInput").val($addChildClickCount);
                this._activityFilter.num_childs = $addChildClickCount;
                childNumberContainer.removeChild(childNumberContainer.lastChild);
                if (($addChildClickCount + $addPersonClickCount) <= 6) {
                    childNumberContainer.style.display = "inline";
                    personNumberContainer.style.display = "inline-block";
                    document.getElementById('person_number_display').style.display = "none";
                    document.getElementById('child_number_display').style.display = "none";
                }
            }
            $('.child_number_count').html($addChildClickCount);
            if (childNumberContainer.childElementCount == 0) {
                $removeChild.hide(400);
            }
        }.bind(this);
        addAdult.onclick = function () {
            $addPersonClickCount += 1;
            $("#personNumberCountInput").val($addPersonClickCount);
            this._activityFilter.num_adults = $addPersonClickCount;
            personNumberContainer.innerHTML += "<img src='assets/img/person.svg' alt='person' class='person_image_added'>";
            if (($addChildClickCount + $addPersonClickCount) <= 6) {
                var personElemCount = personNumberContainer.childElementCount;
                for (var k = personElemCount; k > (personElemCount - 1); k--) {
                    var $nthPerson = $('.person_image_added:nth-child(' + (k) + ')');
                    TweenLite.from($nthPerson, 0.8, {scale: 0, ease: Back.easeOut});
                }
            }
            if (($addChildClickCount + $addPersonClickCount) > 6) {
                childNumberContainer.style.display = "none";
                personNumberContainer.style.display = "none";
                document.getElementById('person_number_display').style.display = "inline-block";
                document.getElementById('child_number_display').style.display = "inline-block";
            }
            $('.person_number_count').html($addPersonClickCount);
            if (personNumberContainer.childElementCount > 1) {
                $removePerson.css('display', 'inline-block');
            }
        }.bind(this);
        removeAdult.onclick = function () {
            if ($addPersonClickCount > 1) {
                $addPersonClickCount -= 1;
                $("#personNumberCountInput").val($addPersonClickCount);
                this._activityFilter.num_adults = $addPersonClickCount;
                personNumberContainer.removeChild(personNumberContainer.lastChild);
                if (($addChildClickCount + $addPersonClickCount) <= 6) {
                    document.getElementById('person_number_display').style.display = "none";
                    document.getElementById('child_number_display').style.display = "none";
                    childNumberContainer.style.display = "inline";
                    personNumberContainer.style.display = "inline-block";
                }
            }
            $('.person_number_count').html($addPersonClickCount);
            if (personNumberContainer.childElementCount == 1) {
                $removePerson.hide(400);
            }
        }.bind(this);
        */
        if($(window).width() < 480) {
            lowBudget.onclick = function () {
                lowBudget.style.display = "none";
                lowBudgetChecked.style.display = "block";
                middleRangeBudgetChecked.style.display = "none";
                middleRangeBudget.style.display = "block";
                highRangeBudgetChecked.style.display = "none";
                highRangeBudget.style.display = "block";
                this._activityFilter.budget_type = 1;
            }.bind(this);
            lowBudgetChecked.onclick = function () {
                lowBudgetChecked.style.display = "none";
                lowBudget.style.display = "block";
            };
            middleRangeBudget.onclick = function () {
                middleRangeBudget.style.display = "none";
                middleRangeBudgetChecked.style.display = "block";
                lowBudgetChecked.style.display = "none";
                lowBudget.style.display = "block";
                highRangeBudgetChecked.style.display = "none";
                highRangeBudget.style.display = "block";
                this._activityFilter.budget_type = 2;
            }.bind(this);
            ;
            middleRangeBudgetChecked.onclick = function () {
                middleRangeBudgetChecked.style.display = "none";
                middleRangeBudget.style.display = "block";
            };
            highRangeBudget.onclick = function () {
                highRangeBudget.style.display = "none";
                highRangeBudgetChecked.style.display = "block";
                lowBudgetChecked.style.display = "none";
                lowBudget.style.display = "block";
                middleRangeBudgetChecked.style.display = "none";
                middleRangeBudget.style.display = "block";
                this._activityFilter.budget_type = 3;
            }.bind(this);
            highRangeBudgetChecked.onclick = function () {
                highRangeBudgetChecked.style.display = "none";
                highRangeBudget.style.display = "block";
            };
        } else {
            lowBudget.onclick = function () {
                lowBudget.style.display = "none";
                lowBudgetChecked.style.display = "inline-block";
                middleRangeBudgetChecked.style.display = "none";
                middleRangeBudget.style.display = "inline-block";
                highRangeBudgetChecked.style.display = "none";
                highRangeBudget.style.display = "inline-block";
                this._activityFilter.budget_type = 1;
            }.bind(this);
            lowBudgetChecked.onclick = function () {
                lowBudgetChecked.style.display = "none";
                lowBudget.style.display = "inline-block";
            };
            middleRangeBudget.onclick = function () {
                middleRangeBudget.style.display = "none";
                middleRangeBudgetChecked.style.display = "inline-block";
                lowBudgetChecked.style.display = "none";
                lowBudget.style.display = "inline-block";
                highRangeBudgetChecked.style.display = "none";
                highRangeBudget.style.display = "inline-block";
                this._activityFilter.budget_type = 2;
            }.bind(this);
            ;
            middleRangeBudgetChecked.onclick = function () {
                middleRangeBudgetChecked.style.display = "none";
                middleRangeBudget.style.display = "inline-block";
            };
            highRangeBudget.onclick = function () {
                highRangeBudget.style.display = "none";
                highRangeBudgetChecked.style.display = "inline-block";
                lowBudgetChecked.style.display = "none";
                lowBudget.style.display = "inline-block";
                middleRangeBudgetChecked.style.display = "none";
                middleRangeBudget.style.display = "inline-block";
                this._activityFilter.budget_type = 3;
            }.bind(this);
            highRangeBudgetChecked.onclick = function () {
                highRangeBudgetChecked.style.display = "none";
                highRangeBudget.style.display = "inline-block";
            };
        }
        //TweenLite.from(".adult_person", 0.8, {scale: 0, rotation: -50, ease: Back.easeOut});
        TweenLite.from(".adult_person", 0.8, {scale: 0, rotation: -50, ease: Back.easeOut});
        TweenLite.from(".add_person_icon", 0.8, {scale: 0, delay: 0.8, ease: Back.easeOut});
        TweenLite.from(".remove_person_icon", 0.8, {scale: 0, delay: 0.8, ease: Back.easeOut});
        //TweenLite.from($nextButton, 1, {left: 1000, delay: 1, ease: Bounce.easeOut});
        TweenLite.from($nextButton, 0.5, {scale: 0, delay: 1, ease: Back.easeOut});
        TweenMax.staggerFrom($sliderDot, 0.4, {delay: 0.9, scale: 0, ease: Elastic.easeOut.config(1.75, 0.4)}, 0.1);
        $nextButton.click(function () {
            if (clickCount == 1) {

            }
            if (clickCount == 2) {
                //console.log($('.heading-one:nth-child(1)');
                //TweenLite.from($headingOne, 0.5, {scale: 0, delay: 0.4, rotation:-10, ease: Back.easeOut});
                TweenLite.from("#low_budget_image", 0.5, {scale: 0, delay: 1, rotation: -70, ease: Back.easeOut});
                TweenLite.from("#middle_range_budget_image", 0.5, {
                    scale: 0,
                    delay: 1.2,
                    rotation: -70,
                    ease: Back.easeOut
                });
                TweenLite.from("#high_range_budget_image", 0.5, {
                    scale: 0,
                    delay: 1.4,
                    rotation: -70,
                    ease: Back.easeOut
                });
            }
            if (clickCount == 3) {
                //TweenMax.staggerFrom($(".checkbox"), 0.8, {delay: 0.5, left: 1000, ease: Bounce.easeOut}, 0.3);
                TweenMax.staggerFrom($(".checkbox"), 0.4, {scale: 0, delay: 1, rotation: -10, ease: Back.easeOut}, 0.3);
            }
        });
        $previousButton.click(function () {
            if (clickCount == 1) {
                console.log("click count is one.");
            }
        });

        $('.adult_number_display').html($('#personNumberCountInput').val());
        $('.child_number_display').html($('#childNumberCountInput').val());

        var day = new Date(this._activityFilter.date_starts).getDate();
        var month  = new Date(this._activityFilter.date_starts).getMonth();


        var day = new Date(this._activityFilter.date_starts).getDate();
        var month  = new Date(this._activityFilter.date_starts).getMonth();

        var monthsArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

        $('#date_one').val(day);
        $('#date_two').val(day);
        $('#month-one').val(monthsArray[month]);
        $('#month-two').val(monthsArray[month]);


        $('#day_one').html($('#date_one').val());
        $('#day_two').html($('#date_two').val());
        $('#month_one').html($('#month-one').val());
        $('#month_two').html($('#month-two').val());
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

    getStarted() {

        console.log(this._activityFilter);
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
        var childCountInputVal = parseFloat((<HTMLInputElement>document.getElementById("childNumberCountInput")).value);
        var personCountInputVal = parseFloat((<HTMLInputElement>document.getElementById("personNumberCountInput")).value);
        if (personId == 'adult') {
            personCountInputVal++;
            $('#personNumberCountInput').val(personCountInputVal);
            $('.adult_number_display').html(personCountInputVal);

            this._activityFilter.num_adults = personCountInputVal;
        }
        if(personId == 'child') {
            childCountInputVal++;
            $('#childNumberCountInput').val(childCountInputVal);
            $('.child_number_display').html(childCountInputVal);
            this._activityFilter.num_childs = childCountInputVal;
        }
    }

    removePerson(personId) {       
        var childCountInputVal = parseFloat((<HTMLInputElement>document.getElementById("childNumberCountInput")).value);
        var personCountInputVal = parseFloat((<HTMLInputElement>document.getElementById("personNumberCountInput")).value);
        if (personId == 'adult' && personCountInputVal > 1) {
            personCountInputVal--;
            $('#personNumberCountInput').val(personCountInputVal);
            $('.adult_number_display').html(personCountInputVal);
            this._activityFilter.num_adults = personCountInputVal;
        }
        if(personId == 'child' && childCountInputVal > 0) {
            childCountInputVal--;
            $('#childNumberCountInput').val(childCountInputVal);
            $('.child_number_display').html(childCountInputVal);
            this._activityFilter.num_childs = childCountInputVal;
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
                    document.getElementById('day_one').innerHTML = '1';
                    $('#date_one').val(1);

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
                    document.getElementById('day_one').innerHTML = '1';
                    $('#date_one').val(1);

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
                    $('#month-' + monthId).val(getNextMonth);

                    var date = new Date(this._activityFilter.date_starts);
                    var monthNumber = indexOfMonth + 1;
                    date.setMonth(monthNumber);

                    this._activityFilter.date_starts = date.toISOString().substring(0, 10);
                }
            }
            if (monthId == 'two') {
                document.getElementById("month_" + monthId).innerHTML = getNextMonth;
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
                console.log('index of day: ' + indexOfDay);
                if (thirtyOneDayMonths.indexOf(monthTwo) > -1) {
                    if (indexOfDay < 30) {
                        getHigherDay = indexOfDay + 2;
                        document.getElementById('day_one').innerHTML = getHigherDay;
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
                        $('#date_one').val(getHigherDay);

                        var date = new Date(this._activityFilter.date_starts);
                        var dayNumber = indexOfDay + 2;
                        date.setDate(dayNumber);

                        this._activityFilter.date_starts = date.toISOString().substring(0, 10);
                    }
                }
                if (frbruaryMonth.indexOf(monthTwo) > -1) {
                    if (indexOfDay < 27) {
                        console.log('index of the day is: ' + indexOfDay);
                        getHigherDay = indexOfDay + 2;
                        document.getElementById('day_one').innerHTML = getHigherDay;
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
}
