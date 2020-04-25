/**
 * 模拟实现一个Promise A规范
 * @param asyncFn
 * @returns {{then: _Promise.then, catch: _Promise.catch, status: _Promise.status}}
 * @private
 */
const _Promise = function (asyncFn) {
    this.resolveCallbackFn = [];
    this.rejectedCallbackFn = [];
    this.PENDING = 'PENDING';
    this.FULFILLED = 'FULFILLED';
    this.REJECTED = 'REJECTED';
    this.status = this.PENDING;
    this.data = null;
    this.catch = function (fn) {
        this.rejectedCallbackFn.push(fn)
    };

    let resolve = (data) => {
        // debugger
        if (this.status === this.PENDING) {
            this.status = this.FULFILLED;
            this.data = data;
            this.resolveCallbackFn.forEach((fn) => {
                fn(data)
            })
        }
    };

    let reject = (err) => {
        if (this.status === this.PENDING) {
            this.status = this.REJECTED;
            this.data = err;
            this.rejectedCallbackFn.forEach((fn) => {
                fn(err)
            })
        }
    };

    asyncFn(resolve, reject);
};

_Promise.prototype.then = function (onFulfilled, onRejected) {

    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (d) => d;
    onRejected = typeof onRejected === 'function' ? onRejected : (err) => {throw Error(err)};

    //PENDING时是在初始化then
    if (this.status === this.PENDING) {
        this.resolveCallbackFn.push(onFulfilled);
        this.rejectedCallbackFn.push(onRejected);
    }

    //FULFILLED时是在成功后调用成功的回调
    if (this.status === this.FULFILLED) {
        this.resolveCallbackFn.forEach((fn) => {
            fn(this.data)
        })
    }

    //REJECTED时是在失败后调用失败的回调
    if (this.status === this.REJECTED) {
        this.resolveCallbackFn.forEach((fn) => {
            fn(this.data)
        })
    }
    // return this
};

const p = new _Promise(function (rs, rj) {
    setTimeout(function () {
        rs('done');
    }, 100)
});

p.then((data) => {
    console.log('data:' + data)
}, (err) => {
    console.log('err:'+ err)
});