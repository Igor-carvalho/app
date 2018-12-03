import {Component, OnInit, OnDestroy} from '@angular/core';
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
import {ItineraryDataService} from '../services/itinerary-data.service';
import {Params, Router} from '@angular/router';
import {UserService} from '../model/user.service';
import {Itinerary} from '../model/itinerary/Itinerary';
import {DateUtils} from '../utilities/date-utils';
import * as moment from 'moment';
import {ItineraryActivities} from '../model/ItineraryActivities';
import {ActivitiesDataService} from '../services/activities-data.service';
import {Activities} from '../model/Activities';
import {ItineraryExport} from '../model/ItineraryExport';
import {forEach} from '@angular/router/src/utils/collection';
import {ActivityFilter} from '../model/ActivityFilter';

declare var Skycons: any;

@Component({
    selector: 'app-itinerary',
    templateUrl: './Itinerary.component.html',
})
export class ItineraryComponent implements OnInit, OnDestroy {

    private _itineraryId: number;
    private _itinerary: Itinerary;
    private _itineraryClone: Itinerary;
    private _replaceActivities: Activities[];
    private _selectedActivity: number;

    private dateUtils: DateUtils;
    private itineraryExport: ItineraryExport;

    private enableEditMode: boolean;
    private replaceActivityLoading: boolean;

    private _activities;
    filterParams;

    constructor(private _router: Router,
                private _userService: UserService,
                private _activityDataService: ActivitiesDataService,
                private _itineraryDataService: ItineraryDataService, ) {
        this.dateUtils = new DateUtils();
        this.itineraryExport = new ItineraryExport();

        this.enableEditMode = false;
        this.replaceActivityLoading = false;
        this._replaceActivities = [];
        this._selectedActivity = null;

        this._router.routerState.root.queryParams.subscribe((params: Params) => {
            // this._activityFilter = <ActivityFilter> params;
            this.filterParams = new ActivityFilter(params);
            this._activities = params.activities;
        });
    }

    ngOnInit() {
        if (this.filterParams == null || this.filterParams.activities == null || this.filterParams.activities.length == 0) {
            this._router.navigate(['/']);
            return;
        } else {
            localStorage.setItem('itinerary', JSON.stringify(this.filterParams));
            this.showItinerary(this.filterParams);
        }

        if (window.location.href.indexOf('itinerary') > -1) {
            $('.app').css('background-color', '#f0f0f0');
        }

        $('#menu_back_icon').css('display', 'inline-block');


        // this.getItinerary();
        // TweenLite.to("#heading", 2, {rotation:360});
        const $weekDay = $('.date-weekday'), $dateSpan = $('.date-span'), $temperature = $('.temperature'),
            $weatherIcon = $('.weather-icon'), $redBar = $('.red-line'), $circleOne = $('.circle_one'),
            $circleTwo = $('.circle_two'), $timeOne = $('.time_one'), $timeTwo = $('.time_two'), $events = $('.events');

        // TweenLite.from($weekDay, 0.4, {scale: 0, delay: 0.2, rotation:-70, ease: Back.easeOut});
        TweenLite.from($weekDay, 0.7, {scale: 0, delay: 0.6, ease: Back.easeOut});
        // TweenLite.from($dateSpan, 0.4, {scale: 0, delay: 0.4, rotation:-70, ease: Back.easeOut});
        TweenLite.from($dateSpan, 0.7, {scale: 0, delay: 0.9, ease: Back.easeOut});
        // TweenLite.from($temperature, 0.4, {scale: 0, delay: 0.6, rotation:-70, ease: Back.easeOut});
        TweenLite.from($temperature, 0.7, {scale: 0, delay: 1.2, ease: Back.easeOut});
        // TweenLite.from($weatherIcon, 0.4, {scale: 0, delay: 0.8, rotation:-70, ease: Back.easeOut});
        TweenLite.from($weatherIcon, 0.7, {scale: 0, delay: 1.5, ease: Back.easeOut});
        // TweenLite.from($redBar, 0.8, {scale: 0, delay: 0.4, ease: Back.easeOut});
        TweenLite.from($redBar, 1.4, {scale: 0, delay: 0.8, ease: Back.easeOut});
        // TweenLite.from($circleOne, 0.2, {scale: 0, delay: 1.2, ease: Back.easeOut});
        TweenLite.from($circleOne, 0.8, {scale: 0, delay: 2.2, ease: Back.easeOut});
        // TweenLite.from($circleTwo, 0.2, {scale: 0, delay: 1.2, ease: Back.easeOut});
        TweenLite.from($circleTwo, 0.8, {scale: 0, delay: 2.2, ease: Back.easeOut});
        TweenLite.from($timeOne, 0.8, {scale: 0, delay: 2.4, ease: Back.easeOut});
        TweenLite.from($timeTwo, 0.8, {scale: 0, delay: 2.4, ease: Back.easeOut});
        TweenMax.staggerFrom($events, 0.4, {delay: 0.8, opacity: 0, rotationX: -90, transformOrigin: '50% top'}, 0.2);

        // code for modal pop-ups
        const $closeModals = $('.toggle_close_modal');
        $('#modalClickButton').click(function () {
            $('#myModal').css('display', 'block');
        });
        $closeModals.click(function () {
            $('#myModal').css('display', 'none');
        });

    }

    editItinerary() {
        this.enableEditMode = true;
        this._itineraryClone = new Itinerary(this._itinerary);
        const $itineraryImages = $('.itinerary_images'), $timings = $('.time'), $cart = $('.cart'),
            $deleteAvtivity = $('.cross'), $addActivity = $('.double_arrow'),
            $backgroundLayer = $('.events_transparent_layer'), $itineraryWrapperOne = $('#edit_itinerary_wrapper_one'),
            $itineraryWrapperTwo = $('#edit_itinerary_wrapper_two'), $editItineraryImage = $('#edit_itinerary_image'),
            $closeItineraryImage = $('#close_itinerary_image');
        TweenLite.to($itineraryImages, 0.4, {top: -160});
        TweenLite.to($backgroundLayer, 0.4, {backgroundColor: 'rgba(229, 32, 80, 1)', delay: 0.2});
        TweenLite.to($timings, 0.4, {bottom: 60, delay: 0.2});
        TweenLite.to($cart, 0.4, {bottom: 60, delay: 0.2});
        TweenLite.to($deleteAvtivity, 0.4, {bottom: 6, delay: 0.4});
        TweenLite.to($addActivity, 0.4, {bottom: 6, delay: 0.4});
        TweenLite.to($itineraryWrapperOne, 0.4, {top: -50});
        TweenLite.to($itineraryWrapperTwo, 0.4, {top: -50});
        TweenLite.to($editItineraryImage, 0.2, {display: 'none'});
        TweenLite.to($closeItineraryImage, 0.4, {display: 'block', delay: 0.4});
        TweenLite.from($closeItineraryImage, 0.4, {scale: 0, delay: 0.4});


    }

    showActivityDetails(activity_id) {
        if (!this.enableEditMode) {
            $('#modal-activity-details-' + activity_id).show();
        }
    }

    closeActivityDetails(activity_id) {

        $('#modal-activity-details-' + activity_id).hide('slow');
    }

    showAddEventModal(activity_id, time_from, time_to) {
        $('#addEventModal').show();
        this.getReplaceableActivity(activity_id, time_from, time_to);
    }

    closeAddEventModal() {
        this._selectedActivity = null;
        $('#addEventModal').hide('slow');
    }

    showExportItineraryModal() {
        this.itineraryExport.skip_export_activities = [];
        $('#exportItineraryModal').show();
    }

    closeExportItineraryModal() {
        $('#exportItineraryModal').hide('slow');
    }

    reCookItinerary() {
        // console.log('reCookItinerary()');
        // const itineraryActivities = [];
        //
        // this._itinerary.itinerary_cook_raw.days.forEach((eachDay) => {
        //
        //     eachDay.hours.forEach((eachHour) => {
        //
        //         const itineraryActivity = new ItineraryActivities();
        //         itineraryActivity.activities_id = eachHour.activity.id + '';
        //         itineraryActivity.start_time = eachHour.scheduled_hour_from;
        //         itineraryActivity.end_time = eachHour.scheduled_hour_to;
        //         itineraryActivities.push(itineraryActivity);
        //     });
        //
        // });
        //
        //
        // this._itineraryDataService
        //     // .updatePublic(this._itinerary.id, itineraryActivities)
        //     .reSchedule(this._itinerary.id, itineraryActivities)
        //     .subscribe(
        //         response => {
        //             console.log('Update Public');
        //             console.log(response);
        //             // this.getItinerary();
        //             // this.showItinerary()
        //         },
        //         error => {
        //             console.log(error);
        //             // unauthorized access
        //             if (error.status === 401 || error.status === 403) {
        //                 this._userService.unauthorizedAccess(error);
        //             } else {
        //                 // this._errorMessage = error.data.message; // TODO: uncomment later
        //             }
        //         }
        //     );
        this.enableEditMode = false;
        this.backToItinerary();
    }

    backToItinerary() {
        const $itineraryImages = $('.itinerary_images'), $timings = $('.time'), $cart = $('.cart'),
            $deleteAvtivity = $('.cross'), $addActivity = $('.double_arrow'),
            $backgroundLayer = $('.events_transparent_layer'), $itineraryWrapperOne = $('#edit_itinerary_wrapper_one'),
            $itineraryWrapperTwo = $('#edit_itinerary_wrapper_two'), $editItineraryImage = $('#edit_itinerary_image'),
            $closeItineraryImage = $('#close_itinerary_image');
        TweenLite.to($itineraryImages, 0.4, {top: 0, delay: 0.4});
        TweenLite.to($backgroundLayer, 0.4, {backgroundColor: 'rgba(229, 34, 81, 0.5)', delay: 0.2});
        TweenLite.to($timings, 0.4, {bottom: 6, delay: 0.2});
        TweenLite.to($cart, 0.4, {bottom: 6, delay: 0.2});
        TweenLite.to($deleteAvtivity, 0.4, {bottom: -44});
        TweenLite.to($addActivity, 0.4, {bottom: -44});
        TweenLite.to($itineraryWrapperOne, 0.4, {top: 0});
        TweenLite.to($itineraryWrapperTwo, 0.4, {top: 0});
        TweenLite.to($closeItineraryImage, 0.2, {display: 'none'});
        TweenLite.to($editItineraryImage, 0.4, {display: 'block', delay: 0.4});
        TweenLite.from($editItineraryImage, 0.4, {scale: 0, delay: 0.4});
    }

    showItinerary(params) {
        this._itineraryDataService
            .getItinerary(params)
            .subscribe(
                itinerary => {
                    this._itinerary = itinerary;

                    this.itineraryExport.calculateTotalActivities(this._itinerary.itinerary_cook_raw);
                    console.log('iti_ini', itinerary);
                },
                error => {
                    // unauthorized access
                    if (error.status === 401 || error.status === 403) {
                        this._userService.unauthorizedAccess(error);
                    } else {
                        // this._errorMessage = error.data.message; // TODO: uncomment later
                    }
                }
            );
    }

    getItinerary() {
        this._itineraryDataService
            .getPublic(this._itineraryId)
            .subscribe(
                itinerary => {
                    this._itinerary = itinerary;

                    this.itineraryExport.calculateTotalActivities(this._itinerary.itinerary_cook_raw);
                    console.log(this._itinerary.itinerary_cook_raw.days);
                },
                error => {
                    // unauthorized access
                    if (error.status === 401 || error.status === 403) {
                        this._userService.unauthorizedAccess(error);
                    } else {
                        // this._errorMessage = error.data.message; // TODO: uncomment later
                    }
                }
            );
    }

    // getReplaceableActivity(activity_id) {
    //
    //     const currentActivities = this.getCurrentActivities().join(',');
    //
    //     this._replaceActivities = [];
    //     this.replaceActivityLoading = true;
    //     this._selectedActivity = activity_id;
    //     this._activityDataService
    //         .replaceActivity(this._itinerary, activity_id, currentActivities)
    //         .subscribe(
    //             itinerary => {
    //                 this.replaceActivityLoading = false;
    //                 this._replaceActivities = itinerary;
    //                 console.log(this._replaceActivities);
    //             },
    //             error => {
    //                 this.replaceActivityLoading = false;
    //                 // unauthorized access
    //                 if (error.status === 401 || error.status === 403) {
    //                     this._userService.unauthorizedAccess(error);
    //                 } else {
    //                     // this._errorMessage = error.data.message; // TODO: uncomment later
    //                 }
    //             }
    //         );
    // }

    replaceActivity(activity) {
        this._itinerary.itinerary_cook_raw.days.forEach((eachDay) => {
            eachDay.hours.forEach((eachHour) => {
                if (eachHour.activity.id === this._selectedActivity) {
                    eachHour.activity = activity;
                }
            })
        });
        this.closeAddEventModal();
        // this.reCookItinerary();
    }

    exportItinerary() {
        if (!this._userService.isLoggedIn()) {
            this._router.navigate(['/login'], {queryParams: {r: this._router.url}});
        }

        this.closeExportItineraryModal();
        this._itineraryDataService
            .exportItinerary( this._itinerary )
            .subscribe(
                itinerary => {
                    // alert('Itinerary have been successfully exported. ');
                    localStorage.removeItem('filterParams');
                    localStorage.removeItem('selectedActivities');
                },
                error => {
                    // unauthorized access
                    if (error.status === 401 || error.status === 403) {
                        this._userService.unauthorizedAccess(error);
                    } else {
                        // this._errorMessage = error.data.message; // TODO: uncomment later
                    }
                }
            );
    }

    ngOnDestroy() {
        $('#menu_back_icon').hide();
    }

    deleteItinerary(activity_id) {
        this._itinerary.itinerary_cook_raw.days.forEach((eachDay, dayIndex) => {
            // if ()

            let index_to_remove = -1;
            eachDay.hours.forEach((eachHour, hourIndex) => {
                if (eachHour.activity.id === activity_id) {
                    index_to_remove = hourIndex;
                }
            });

            if (index_to_remove > -1) {
                console.log('Index To Remove: ', index_to_remove);
                const remainingArray = eachDay.hours.splice(index_to_remove, 1);
                // eachDay.hours = remainingArray;
                console.log('Remaining Element');
                console.log(remainingArray);
                index_to_remove = -1;
            }

            if (eachDay.hours.length === 0) {
                if (this._itinerary.itinerary_cook_raw.days.length === 1) {
                    this._router.navigate(['/wishlist']);
                }
                this._itinerary.itinerary_cook_raw.days.splice(dayIndex, 1);
            }

        });
        console.log(this._itinerary.itinerary_cook_raw.days);
    }

    // getDayStartTime(datetime) {
    //     const date = this.dateUtils.mysqlDateTimeToDate(datetime);
    //
    //     return moment(date).format('hh');
    // }
    //
    // getDayEndTime(datetime) {
    //     const date = this.dateUtils.mysqlDateTimeToDate(datetime);
    //
    //     return moment(date).format('mm');
    // }

    getCurrentActivities() {
        const activities = [];

        this._itinerary.itinerary_cook_raw.days.forEach((eachDay) => {

            eachDay.hours.forEach((eachHour) => {

                activities.push(eachHour.activity.id);

            });

        });

        return activities;
    }

    skipExportActivity(activity_id) {
        if (!this.itineraryExport.skip_export_activities.includes(activity_id)) {
            this.itineraryExport.skip_export_activities.push(activity_id);
        }
    }

    getReplaceableActivity(activity_id, time_from, time_to) {

        const currentActivities = this.getCurrentActivities().join(',');

        this._replaceActivities = [];
        this.replaceActivityLoading = true;
        this._selectedActivity = activity_id;
        this._activityDataService
            .replaceActivity(this._itinerary, activity_id, currentActivities, time_from, time_to)
            .subscribe(
                itinerary => {
                    this.replaceActivityLoading = false;
                    this._replaceActivities = itinerary;
                    console.log(this._replaceActivities);
                },
                error => {
                    this.replaceActivityLoading = false;
                    // unauthorized access
                    if (error.status === 401 || error.status === 403) {
                        this._userService.unauthorizedAccess(error);
                    } else {
                        // this._errorMessage = error.data.message; // TODO: uncomment later
                    }
                }
            );
    }

    diplayWeatherIcon(icon, day) {
        const skycons = new Skycons({'color': '#E52050'});
        skycons.add(document.getElementById('weather-skycons' + day), icon);
        skycons.play();
    }
}
