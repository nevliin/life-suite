import {ErrorCodeUtil} from '../error-code/error-code.util';

export class ValidatorUtil {

    static valNum(num: number) {
        if (Number.isNaN(Number.parseFloat(num.toString()))) {
            ErrorCodeUtil.findErrorCodeAndThrow('INVALID_PARAMETER');
        }
    }

    static valDate(date: Date) {
        if (!(date instanceof Date)) {
            ErrorCodeUtil.findErrorCodeAndThrow('INVALID_PARAMETER');
        }
    }
}