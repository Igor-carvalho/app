import {Component, OnInit} from '@angular/core';
import {TweenMax, Power2, TimelineLite, TweenLite} from "gsap";

@Component({
    selector: 'app-tutorial-two',
    templateUrl: './tutorial-two.component.html',
})

export class TutorialTwoComponent implements OnInit {
    constructor() {


    }

    ngOnInit() {
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

        nextButton.onclick = function() {
            clickCount++;
            console.log(clickCount);
            console.log("position: " + (clickCount*slideWidth));
            TweenLite.to(slider, 0.5, {x: -clickCount * slideWidth});
            previousButton.style.visibility = "visible";
            if (clickCount > 2){
                nextButton.style.visibility = "hidden";
            }
        };
        previousButton.onclick = function() {
            clickCount--;
            console.log("previous button clicked... clickCount: " + clickCount);
            console.log("position: " + (clickCount*slideWidth));
            nextButton.style.visibility = "visible";
            if(clickCount >= 0){
                TweenLite.to(slider, 0.5, {x: -(clickCount * slideWidth)});
                if(clickCount == 0) {
                    previousButton.style.visibility = "hidden";
                }
            }
        };
        addChild.onclick = function() {
            childNumberContainer.innerHTML += "<img src='assets/img/child.svg' alt='child' class='child_image child_image_added'>";
        };
        removeChild.onclick = function() {
            if (childNumberContainer.hasChildNodes()) {
                childNumberContainer.removeChild(childNumberContainer.lastChild);
            }
        };
        addAdult.onclick = function() {
            personNumberContainer.innerHTML += "<img src='assets/img/person.svg' alt='person' class=''>";
        };
        removeAdult.onclick = function() {
            if (personNumberContainer.hasChildNodes() && personNumberContainer.childElementCount > 1) {
                personNumberContainer.removeChild(personNumberContainer.lastChild);
            }
        };
        lowBudget.onclick = function() {
            lowBudget.style.display = "none";
            lowBudgetChecked.style.display = "inline-block";
        };
        lowBudgetChecked.onclick = function() {
            lowBudgetChecked.style.display = "none";
            lowBudget.style.display = "inline-block";
        };
        middleRangeBudget.onclick = function() {
            middleRangeBudget.style.display = "none";
            middleRangeBudgetChecked.style.display = "inline-block";
        };
        middleRangeBudgetChecked.onclick = function() {
            middleRangeBudgetChecked.style.display = "none";
            middleRangeBudget.style.display = "inline-block";
        };
        highRangeBudget.onclick = function() {
            highRangeBudget.style.display = "none";
            highRangeBudgetChecked.style.display = "inline-block";
        };
        highRangeBudgetChecked.onclick = function() {
            highRangeBudgetChecked.style.display = "none";
            highRangeBudget.style.display = "inline-block";
        };
    }
}
