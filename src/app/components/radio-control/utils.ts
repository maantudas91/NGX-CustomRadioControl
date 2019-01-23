
export const isDefined = (value:any) => value !== undefined && value !== null;

export const isObject = (value: any) => typeof value === 'object' && isDefined(value);


export const isPromise = (value: any)  => value instanceof Promise;

export const isFunction = (value: any) => value instanceof Function;

export const newId = () => {
    return 'axxxxxxxxxxx'.replace(/[x]/g, function (_) {
        const val = Math.random() * 16 | 0;
        return val.toString(16);
    });
}