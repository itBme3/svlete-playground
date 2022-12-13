import BaseCurrent from "./base";
import BaseObject from "./base-obj";

class ArrayErrors extends BaseCurrent {
    
    protected validators: Record<string, (item: any, value: any, current: any, updating: boolean) => string | undefined> = {
        name(_item, value, _current, _updating) {
            if(typeof value !== "string" || value.length === 0) {
                return "name is required"
            }
        },
        count(_item, value, _current, _updating) {
            if(typeof value !== "number" || value < 1) {
                return "count must be greater than one"
            }
        }
    }
}

class ObjErrors extends BaseObject {
    
    protected validators: Record<string, (item: any, value: any, current: any, updating: boolean) => string | undefined> = {
        name(_item, value, _current, _updating) {
            if(typeof value !== "string" || value.length === 0) {
                return "name is required"
            }
        },
        count(_item, value, _current, _updating) {
            if(typeof value !== "number" || value < 1) {
                return "count must be greater than one"
            }
        }
    }
}

export const objErrors = new ObjErrors();
export const arrayErrors = new ArrayErrors();