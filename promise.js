var _Promise = function (asyncFn) {
    let resolveCallbackFn = [];
    let rejectedCallbackFn = [];
    this.status = 'PENDING';

    this.then = (fn) => {
        resolveCallbackFn.push(fn)
    };

    this.catch = function (fn) {
        rejectedCallbackFn.push(fn)
    };

    let resolve = (data) => {
        this.status = 'FULFILLED';
        resolveCallbackFn.forEach((fn) => {
            fn(data)
        })
    };

    let reject = (err) => {
        this.status = 'REJECTED';
        rejectedCallbackFn.forEach((fn) => {
            fn(err)
        })
    };

    asyncFn(resolve, reject);

    return {then: this.then, catch: this.catch, status: this.status}
};

var p = new _Promise(function (rs, rj) {
    setTimeout(function () {
        rs(123)
    })
});
console.log(p)
p.then((data) => {
    console.log(data)
    console.log(p)
});

