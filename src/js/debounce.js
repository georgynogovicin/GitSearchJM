const debounce = (fn, delay = 0) => {
    let inDebounce;

    return function () {
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => fn.apply(this, arguments), delay);
    }
};

export default debounce;