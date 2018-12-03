export class HttpUtils {
    public static ObjectToUriParams(object) {
        return Object.keys(object).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(object[k])}`).join('&');

    }
}