import * as moment from 'moment';


export class DateUtils {

    public mysqlDateToMonthName(date) {
        // date = new Date(date + ' 00:00:00'); // 2018-05-01
        var parts = date.split('-');
        // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
        var _date = new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
        return moment(_date).format('MMMM');
    }

    public mysqlDateToDayhName(date) {
        // date = new Date(date + ' 00:00:00');
        var parts = date.split('-');
        // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
        var _date = new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
        return moment(_date).format('dddd');
    }

    public mysqlDateToDay(date) {
        // date = new Date(date + ' 00:00:00');
        var parts = date.split('-');
        // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
        var _date = new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
        return moment(_date).date();
    }

    public mysqlDateTimeToDate(datetime) {

        let t, result = null;

        if (typeof datetime === 'string') {
            t = datetime.split(/[- :]/);

            // when t[3], t[4] and t[5] are missing they defaults to zero
            result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
        }

        return result;
    }

    public mysqlDateTimeHour(datetime) {
        const date = this.mysqlDateTimeToDate(datetime);
        const hour = moment(date).format('HH');
        const minute = moment(date).format('MM');

        let time = '';


        time = hour + ':' + minute;
        return time;
    }

    public getDateString(date) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const arr_date = date.split('-');
        return arr_date[2] + ' ' + monthNames[Number(arr_date[1]) - 1];
    }
}
