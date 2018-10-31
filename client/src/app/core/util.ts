export function isNullOrUndefined(obj: any | null | undefined): obj is null | undefined {
    return typeof obj === "undefined" || obj === null;
}

export function sleep(time: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}