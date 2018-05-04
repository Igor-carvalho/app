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
        var addChild = document.getElementById('add_child');
        var removeChild = document.getElementById('remove_child');
        var addAdult = document.getElementById('add_adult');
        var removeAdult = document.getElementById('remove_adult');
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
        var $addChild = $('#add_child'), $removeChild = $('#remove_child'), $addPerson = $('#add_adult'),
            $removePerson = $('#remove_adult'), $sliderDot = $('.slider_dot'), $nextButton = $('#nextButton'),
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

        }.bind(this);
        removeChild.onclick = function () {
            if ($addChildClickCount > 0) {
                $addChildClickCount -= 1;
                $("#childNumberCountInput").val($addChildClickCount);
                this._activityFilter.num_childs = $addChildClickCount;
                childNumberContainer.removeChild(childNumberContainer.lastChild);
                if (($addChildClickCount + $addPersonClickCount) <= 6) {
                    childNumberContainer.style.display = "inline-block";
                    personNumberContainer.style.display = "inline-block";
                    document.getElementById('person_number_display').style.display = "none";
                    document.getElementById('child_number_display').style.display = "none";
                }
            }
            $('.child_number_count').html($addChildClickCount);
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
                    childNumberContainer.style.display = "inline-block";
                    personNumberContainer.style.display = "inline-block";
                }
            }
            $('.person_number_count').html($addPersonClickCount);
        }.bind(this);
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
        //TweenLite.from(".adult_person", 0.8, {scale: 0, rotation: -50, ease: Back.easeOut});
        TweenLite.from(".adult_person", 0.8, {scale: 0, rotation: -50, ease: Back.easeOut});
        //TweenLite.from($headingOne, 0.5, {scale: 0, rotation:-70, ease: Back.easeOut});
        TweenLite.from($headingOne, 0.5, {scale: 0, rotation: -30, ease: Back.easeOut});
        //TweenLite.from($addChild, 1, {left: -500, delay: 0.8, opacity: 0});
        TweenLite.from($addChild, 0.5, {scale: 0, delay: 0.8, rotation: -70, ease: Back.easeOut});
        //TweenLite.from($removeChild, 1, {left: -500, delay: 0.5, opacity: 0});
        TweenLite.from($removeChild, 0.5, {scale: 0, delay: 0.5, rotation: -70, ease: Back.easeOut});
        //TweenLite.from($addPerson, 1, {left: 500, delay: 0.8, opacity: 0});
        TweenLite.from($addPerson, 0.5, {scale: 0, delay: 0.8, rotation: -70, ease: Back.easeOut});
        //TweenLite.from($removePerson, 1, {left: 500, delay: 0.5, opacity: 0});
        TweenLite.from($removePerson, 0.5, {scale: 0, delay: 0.5, rotation: -70, ease: Back.easeOut});
        //TweenLite.from($nextButton, 1, {left: 1000, delay: 1, ease: Bounce.easeOut});
        TweenLite.from($nextButton, 0.5, {scale: 0, delay: 1, ease: Back.easeOut});
        TweenMax.staggerFrom($sliderDot, 0.4, {delay: 0.9, scale: 0, ease: Elastic.easeOut.config(1.75, 0.4)}, 0.1);
        $nextButton.click(function () {
            if (clickCount == 1) {
                TweenLite.from($headingOne, 0.5, {scale: 0, delay: 0.4, rotation: -10, ease: Back.easeOut});
            }
            if (clickCount == 2) {
                TweenLite.from($('.heading-one:nth-child(' + (clickCount - 1) + ')'), 0.5, {
                    scale: 0,
                    delay: 0.4,
                    rotation: -10,
                    ease: Back.easeOut
                });
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
                TweenLite.from($headingOne, 0.5, {scale: 0, delay: 0.4, rotation: -10, ease: Back.easeOut});
                //TweenMax.staggerFrom($(".checkbox"), 0.8, {delay: 0.5, left: 1000, ease: Bounce.easeOut}, 0.3);
                TweenMax.staggerFrom($(".checkbox"), 0.4, {scale: 0, delay: 1, rotation: -10, ease: Back.easeOut}, 0.3);
            }
        });
        $previousButton.click(function () {
            if (clickCount == 1) {
                console.log("click count is one.");
            }
        });
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

}
