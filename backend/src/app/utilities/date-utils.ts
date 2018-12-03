import * as moment from 'moment';


export class DateUtils {

    public mysqlDateToMonthName(date) {
        date = new Date(date);
        return moment(date).format('MMMM');
    }

    public mysqlDateToDayhName(date) {
        date = new Date(date);
        return moment(date).format('dddd');
    }

    public mysqlDateToDay(date) {
        date = new Date(date);
        return moment(date).date();
    }

    public mysqlDateTimeToDate(datetime) {

        var t, result = null;

        if (typeof datetime === 'string') {
            t = datetime.split(/[- :]/);

            //when t[3], t[4] and t[5] are missing they defaults to zero
            result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
        }

        return result;
    }

    public mysqlDateTimeHour(datetime) {
        let date = this.mysqlDateTimeToDate(datetime);
        let hour = moment(date).format("HH");
        let minute = moment(date).format("MM");

        var time = "";


        time = hour + ":" + minute;
        return time;
    }
}