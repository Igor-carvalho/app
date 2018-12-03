import * as _ from 'underscore';


export class ArrayUtils {

    public array_remove(array, object) {
        return _.without(array, _.findWhere(array, object));
    }

    public array_add(array, object) {
        array.push(object);
        return array;
    }

    public search_string_array(array, string) {
        string = string + '';
        return array.indexOf(string) != -1
    }

    public toggle_element_array(array, object) {
        if (_.where(array, object)) {
            this.array_remove(array, object)
        } else {
            this.array_add(array, object);
        }
    }

}
