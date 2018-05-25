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
import {ItineraryDataService} from "../services/itinerary-data.service";
import {Params, Router} from "@angular/router";
import {UserService} from "../model/user.service";
import {ActivityFilter} from "../model/ActivityFilter";
import {Itinerary} from "../model/itinerary/Itinerary";
import {DateUtils} from "../utilities/date-utils";
import * as moment from 'moment';
import {ItineraryActivities} from "../model/ItineraryActivities";

@Component({
    selector: 'app-itinerary',
    templateUrl: './itinerary.component.html',
})
export class ItineraryComponent implements OnInit {

    private _itineraryId: number;
    private _itinerary: Itinerary;

    private dateUtils: DateUtils;
    private deletedActivities: number[];

    constructor(private _router: Router,
                private _userService: UserService,
                private _itineraryDataService: ItineraryDataService,) {
        this.dateUtils = new DateUtils();
        this.deletedActivities = [];
        this._router.routerState.root.queryParams.subscribe((params: Params) => {
            this._itineraryId = params.id;
        });
    }

    ngOnInit() {

        $('#menu_back_icon').css('display', 'inline-block');


        if (window.location.href.indexOf("itinerary") > -1) {
            $('.app').css('background-color', "#f0f0f0");
        }
        this.getItinerary();
        //TweenLite.to("#heading", 2, {rotation:360});
        var $weekDay = $(".date-weekday"), $dateSpan = $(".date-span"), $temperature = $(".temperature"),
            $weatherIcon = $(".weather-icon"), $redBar = $(".red-line"), $circleOne = $(".circle_one"),
            $circleTwo = $(".circle_two"), $timeOne = $(".time_one"), $timeTwo = $(".time_two"), $events = $(".events");

        //TweenLite.from($weekDay, 0.4, {scale: 0, delay: 0.2, rotation:-70, ease: Back.easeOut});
        TweenLite.from($weekDay, 0.7, {scale: 0, delay: 0.6, ease: Back.easeOut});
        //TweenLite.from($dateSpan, 0.4, {scale: 0, delay: 0.4, rotation:-70, ease: Back.easeOut});
        TweenLite.from($dateSpan, 0.7, {scale: 0, delay: 0.9, ease: Back.easeOut});
        //TweenLite.from($temperature, 0.4, {scale: 0, delay: 0.6, rotation:-70, ease: Back.easeOut});
        TweenLite.from($temperature, 0.7, {scale: 0, delay: 1.2, ease: Back.easeOut});
        //TweenLite.from($weatherIcon, 0.4, {scale: 0, delay: 0.8, rotation:-70, ease: Back.easeOut});
        TweenLite.from($weatherIcon, 0.7, {scale: 0, delay: 1.5, ease: Back.easeOut});
        //TweenLite.from($redBar, 0.8, {scale: 0, delay: 0.4, ease: Back.easeOut});
        TweenLite.from($redBar, 1.4, {scale: 0, delay: 0.8, ease: Back.easeOut});
        //TweenLite.from($circleOne, 0.2, {scale: 0, delay: 1.2, ease: Back.easeOut});
        TweenLite.from($circleOne, 0.8, {scale: 0, delay: 2.2, ease: Back.easeOut});
        //TweenLite.from($circleTwo, 0.2, {scale: 0, delay: 1.2, ease: Back.easeOut});
        TweenLite.from($circleTwo, 0.8, {scale: 0, delay: 2.2, ease: Back.easeOut});
        TweenLite.from($timeOne, 0.8, {scale: 0, delay: 2.4, ease: Back.easeOut});
        TweenLite.from($timeTwo, 0.8, {scale: 0, delay: 2.4, ease: Back.easeOut});
        TweenMax.staggerFrom($events, 0.4, {delay: 0.8, opacity: 0, rotationX: -90, transformOrigin: "50% top"}, 0.2);

        // code for modal pop-ups
        var $closeModals = $('.toggle_close_modal');
        $('#modalClickButton').click(function () {
            $('#myModal').css('display', 'block');
        });
        $closeModals.click(function () {
            $('#myModal').css('display', 'none');
        });

    }

    editItinerary() {
        var $itineraryImages = $(".itinerary_images"), $timings = $(".time"), $cart = $(".cart"),
            $deleteAvtivity = $(".cross"), $addActivity = $(".double_arrow"),
            $backgroundLayer = $(".events_transparent_layer"), $itineraryWrapperOne = $("#edit_itinerary_wrapper_one"),
            $itineraryWrapperTwo = $("#edit_itinerary_wrapper_two");
        TweenLite.to($itineraryImages, 0.4, {top: -160});
        TweenLite.to($backgroundLayer, 0.4, {backgroundColor: "rgba(229, 32, 80, 1)", delay: 0.2});
        TweenLite.to($timings, 0.4, {bottom: 60, delay: 0.2});
        TweenLite.to($cart, 0.4, {bottom: 60, delay: 0.2});
        TweenLite.to($deleteAvtivity, 0.4, {bottom: 6, delay: 0.4});
        TweenLite.to($addActivity, 0.4, {bottom: 6, delay: 0.4});
        TweenLite.to($itineraryWrapperOne, 0.4, {top: -50});
        TweenLite.to($itineraryWrapperTwo, 0.4, {top: -50});


    }

    showActivityDetails(activity_id) {
        $("#modal-activity-details-" + activity_id).show();
    }

    closeActivityDetails(activity_id) {

        $("#modal-activity-details-" + activity_id).hide('slow');
    }

    reCookItinerary() {
        console.log("reCookItinerary()");
        let itineraryActivities = [];

        this._itinerary.itinerary_cook_raw.days.forEach((eachDay) => {

            eachDay.hours.forEach((eachHour) => {

                let itineraryActivity = new ItineraryActivities();
                itineraryActivity.activities_id = eachHour.activity.id + "";
                itineraryActivity.start_time = eachHour.scheduled_hour_from;
                itineraryActivity.end_time = eachHour.scheduled_hour_to;
                itineraryActivities.push(itineraryActivity);
            });

        });


        this._itineraryDataService
            .updatePublic(this._itinerary.id, itineraryActivities)
            .subscribe(
                response => {
                    console.log("Update Public");
                    console.log(response);
                    this.getItinerary();
                },
                error => {
                    console.log(error);
                    // unauthorized access
                    if (error.status == 401 || error.status == 403) {
                        this._userService.unauthorizedAccess(error);
                    } else {
                        //this._errorMessage = error.data.message; // TODO: uncomment later
                    }
                }
            );
        this.backToItinerary();
    }

    backToItinerary() {
        var $itineraryImages = $(".itinerary_images"), $timings = $(".time"), $cart = $(".cart"),
            $deleteAvtivity = $(".cross"), $addActivity = $(".double_arrow"),
            $backgroundLayer = $(".events_transparent_layer"), $itineraryWrapperOne = $("#edit_itinerary_wrapper_one"),
            $itineraryWrapperTwo = $("#edit_itinerary_wrapper_two");
        TweenLite.to($itineraryImages, 0.4, {top: 0, delay: 0.4});
        TweenLite.to($backgroundLayer, 0.4, {backgroundColor: "rgba(229, 34, 81, 0.5)", delay: 0.2});
        TweenLite.to($timings, 0.4, {bottom: 6, delay: 0.2});
        TweenLite.to($cart, 0.4, {bottom: 6, delay: 0.2});
        TweenLite.to($deleteAvtivity, 0.4, {bottom: -44});
        TweenLite.to($addActivity, 0.4, {bottom: -44});
        TweenLite.to($itineraryWrapperOne, 0.4, {top: 0});
        TweenLite.to($itineraryWrapperTwo, 0.4, {top: 0});
    }

    getItinerary() {
        this._itineraryDataService
            .getPublic(this._itineraryId)
            .subscribe(
                itinerary => {
                    this._itinerary = itinerary;
                    console.log(this._itinerary.itinerary_cook_raw.days);
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

    ngOnDestroy() {
        $("#menu_back_icon").hide();
    }

    deleteItinerary(activity_id) {
        this._itinerary.itinerary_cook_raw.days.forEach((eachDay, dayIndex) => {

            let index_to_remove = -1;
            eachDay.hours.forEach((eachHour, hourIndex) => {
                if (eachHour.activity.id == activity_id) {
                    index_to_remove = hourIndex;
                }
            });

            if (index_to_remove > -1) {
                console.log("Index To Remove: ", index_to_remove);
                let remainingArray = eachDay.hours.splice(index_to_remove, 1);
                // eachDay.hours = remainingArray;
                console.log("Remaining Element");
                console.log(remainingArray);
                index_to_remove = -1;
            }

        });
        console.log(this._itinerary.itinerary_cook_raw.days);
    }

    getDayStartTime(datetime) {
        let date = this.dateUtils.mysqlDateTimeToDate(datetime);

        return moment(date).format("hh");
    }

    getDayEndTime(datetime) {
        let date = this.dateUtils.mysqlDateTimeToDate(datetime);

        return moment(date).format("mm");
    }
}
