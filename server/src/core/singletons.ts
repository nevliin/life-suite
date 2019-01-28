import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {LoggingUtil} from "./logging/logging.util";
import {AuthService} from "./auth/auth.service";

export class Singletons {

    public static async init() {
        ErrorCodeUtil.init();
        LoggingUtil.init();
        await AuthService.init();

    }

}