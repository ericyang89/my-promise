import MyPromise from "./index";

// 1
test("1.promise 参数函数会立即执行", function() {
  var string;

  new MyPromise(function() {
    string = "foo";
  });

  expect(string).toBe("foo");

},500);


it("2. promise 在 then 的回调函数中可以拿到 resolve 的数据。", function(done) {
  var testString = "foo";

  var promise = new MyPromise(function(resolve) {
    setTimeout(function() {
      resolve(testString);
    }, 20);
  });

  promise.then(function(string) {
    expect(string).toBe(testString);
    done();
  });
},500);

// 3
it("promise 可以有多个 then，并且会依次执行", function(done) {
  var testString = "foo";

  var promise = new MyPromise(function(resolve) {
    setTimeout(function() {
      resolve(testString);
    }, 20);
  });

  promise.then(function(string) {
    expect(string).toBe(testString);
  });

  promise.then(function(string) {
    expect(string).toBe(testString);
    done();
  });
},500);


it("4.promise 可以嵌套多个 then，then的回调中可以返回 promise ", function(done) {
  var testString = "foo";

  var promise = new MyPromise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, 20);
  });

  promise
    .then(function() {
      return new MyPromise(function(resolve) {
        setTimeout(function() {
          resolve(testString);
        }, 20);
      });
    })
    .then(function(string) {
      expect(string).toBe(testString);
      done();
    });
},500);

// 5
it("5.promise 可以嵌套多个 then，then的回调中可以返回 一个普通值", function(done) {
  var testString = "foo";

  var promise = new MyPromise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, 20);
  });

  promise
    .then(function() {
      return testString;
    })
    .then(function(string) {
      expect(string).toBe(testString);
      done();
    });
},500);

// 6
it("6.resolved 状态的promise ，如果调用 then 方法会立即执行", function(done) {
  var testString = "foo";

  var promise = new MyPromise(function(resolve) {
    setTimeout(function() {
      resolve(testString);
    }, 20);
  });

  setTimeout(function() {
    promise.then(function(value) {
      expect(value).toBe(testString);
      done();
    });
  }, 200);

  // promise.then(function() {
  //   setTimeout(function() {
  //     promise.then(function(value) {
  //       expect(value).toBe(testString);
  //       done();
  //     });
  //   }, 200);
  // });

},500);


it("7. 二次调用 resolve 不会产生影响。", function(done) {
  var testString = "foo";
  var testString2 = "bar";

  var promise = new MyPromise(function(resolve) {
    setTimeout(function() {
      resolve(testString);
      resolve(testString2);
    }, 20);
  });

  promise.then(function(value) {
    expect(value).toBe(testString);
  });

  setTimeout(function() {
    promise.then(function(value) {
      expect(value).toBe(testString);
      done();
    });
  }, 50);

},500);