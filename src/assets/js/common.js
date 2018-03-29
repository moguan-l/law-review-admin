export const typeOf = (arg) => {
    return Object.prototype.toString.call(arg).toLowerCase().slice(8, -1);
};