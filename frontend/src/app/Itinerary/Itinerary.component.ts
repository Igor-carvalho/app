import {Component, OnInit} from '@angular/core';
import {TweenMax, Power2, Back, Power0, Elastic, Bounce, SplitText, TimelineLite, TweenLite, CSSPlugin, EasePack} from "gsap";
import * as $ from 'jquery';

@Component({
    selector: 'app-itinerary',
    templateUrl: './itinerary.component.html',
})
export class ItineraryComponent implements OnInit {

    constructor() {


    }

    ngOnInit() {
        //TweenLite.to("#heading", 2, {rotation:360});
        var $weekDay = $(".date-weekday"), $dateSpan = $(".date-span"), $temperature = $(".temperature"), $weatherIcon = $(".weather-icon"), $redBar = $(".red-line"), $circleOne = $(".circle_one"), $circleTwo = $(".circle_two"), $timeOne = $(".time_one"), $timeTwo = $(".time_two"), $events = $(".events");
        
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
        TweenMax.staggerFrom($events, 0.4, {delay: 0.8, opacity:0, rotationX: -90, transformOrigin:"50% top"}, 0.2);
        
        // code for modal pop-ups
        var $closeModals = $('.toggle_close_modal');
        $('#modalClickButton').click(function(){
            $('#myModal').css('display', 'block');
        });
        $closeModals.click(function() {
            $('#myModal').css('display', 'none');
        });
 
    }
    editItinerary() {
        var $itineraryImages = $(".itinerary_images"), $timings = $(".time"), $cart = $(".cart"), $deleteAvtivity = $(".cross"), $addActivity = $(".double_arrow"), $backgroundLayer = $(".events_transparent_layer"), $itineraryWrapperOne = $("#edit_itinerary_wrapper_one"), $itineraryWrapperTwo = $("#edit_itinerary_wrapper_two");
        TweenLite.to($itineraryImages, 0.4, {top: -160});
        TweenLite.to($backgroundLayer, 0.4, {backgroundColor: "rgba(229, 32, 80, 1)", delay: 0.2});
        TweenLite.to($timings, 0.4, {bottom: 60, delay: 0.2});
        TweenLite.to($cart, 0.4, {bottom: 60, delay: 0.2});
        TweenLite.to($deleteAvtivity, 0.4, {bottom:6, delay: 0.4});
        TweenLite.to($addActivity, 0.4, {bottom:6, delay: 0.4});
        TweenLite.to($itineraryWrapperOne, 0.4, {top:-50});
        TweenLite.to($itineraryWrapperTwo, 0.4, {top:-50});
    }
    backToItinerary() {
        var $itineraryImages = $(".itinerary_images"), $timings = $(".time"), $cart = $(".cart"), $deleteAvtivity = $(".cross"), $addActivity = $(".double_arrow"), $backgroundLayer = $(".events_transparent_layer"), $itineraryWrapperOne = $("#edit_itinerary_wrapper_one"), $itineraryWrapperTwo = $("#edit_itinerary_wrapper_two");
        TweenLite.to($itineraryImages, 0.4, {top: 0, delay: 0.4});
        TweenLite.to($backgroundLayer, 0.4, {backgroundColor: "rgba(229, 34, 81, 0.5)", delay: 0.2});
        TweenLite.to($timings, 0.4, {bottom: 6, delay: 0.2});
        TweenLite.to($cart, 0.4, {bottom: 6, delay: 0.2});
        TweenLite.to($deleteAvtivity, 0.4, {bottom:-44});
        TweenLite.to($addActivity, 0.4, {bottom:-44});
        TweenLite.to($itineraryWrapperOne, 0.4, {top:0});
        TweenLite.to($itineraryWrapperTwo, 0.4, {top:0});
    }
}
