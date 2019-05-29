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

// // 8
// it("rejection handler is called when promise is rejected", function(done) {
//   var testError = new Error("Something went wrong");

//   var promise = new MyPromise(function(resolve, reject) {
//     setTimeout(function() {
//       reject(testError);
//     }, 20);
//   });

//   promise.catch(function(value) {
//     expect(value).toBe(testError);
//     done();
//   });
// },500);

// // 9
// it("rejections are passed downstream", function(done) {
//   var testError = 'eeeee'
//   // new Error("Something went wrong");

//   var promise = new MyPromise(function(resolve, reject) {
//     setTimeout(function() {
//       reject(testError);
//     }, 20);
//   });

//   const p2=  promise
//     .then(function() {
//       return new MyPromise(function(resolve) {
//         setTimeout(function() {
//           resolve(testError);
//         }, 20);
//       });
//     });

//     p2.catch(function(value) {
//       expect(value).toBe(testError);
//       done();
//     });
// },500);

// // 10
// it("rejecting promises returned from resolution handlers are caught properly", function(done) {
//   var testError = new Error("Something went wrong");

//   var promise = new MyPromise(function(resolve) {
//     setTimeout(function() {
//       resolve();
//     }, 20);
//   });

//   promise
//     .then(function() {
//       return new MyPromise(function(resolve, reject) {
//         setTimeout(function() {
//           reject(testError);
//         }, 20);
//       });
//     })
//     .catch(function(value) {
//       expect(value).toBe(testError);
//       done();
//     });
// },500);

// // 11
// test("rejection handlers catch synchronous errors in resolution handlers", function(done) {
//   var testError = new Error("Something went wrong");

//   var promise = new MyPromise(function(resolve) {
//     setTimeout(function() {
//       resolve();
//     }, 20);
//   });

//   promise
//     .then(function() {
//       throw testError;
//     })
//     .catch(function(value) {
//       expect(value).toBe(testError);
//       done();
//     });
// },500);

// it("rejection handlers catch synchronous errors in the executor function", function(done) {
//   var testError = new Error("Something went wrong");

//   var promise = new MyPromise(function() {
//     throw testError;
//   });

//   promise
//     .then(function() {
//       return new MyPromise(function(resolve) {
//         setTimeout(function() {
//           resolve(testError);
//         }, 20);
//       });
//     })
//     .catch(function(value) {
//       expect(value).toBe(testError);
//       done();
//     });
// },500);

// test("rejection handlers catch synchronous erros", function(done) {
//   var testError = new Error("Something went wrong");

//   var promise = new MyPromise(function(resolve) {
//     setTimeout(function() {
//       resolve();
//     }, 20);
//   });

//   promise
//     .then(function() {
//       throw new Error("some Error");
//     })
//     .catch(function() {
//       throw testError;
//     })
//     .catch(function(value) {
//       expect(value).toBe(testError);
//       done();
//     });
// },500);

// it('chaining works after "catch"', function(done) {
//   var testString = "foo";

//   var promise = new MyPromise(function(resolve) {
//     setTimeout(function() {
//       resolve();
//     }, 20);
//   });

//   promise
//     .then(function() {
//       throw new Error("some Error");
//     })
//     .catch(function() {
//       return new MyPromise(function(resolve) {
//         setTimeout(function() {
//           resolve(testString);
//         }, 20);
//       });
//     })
//     .then(function(value) {
//       expect(value).toBe(testString);
//       done();
//     });
// },500);

// it("rejecting promises returned from rejection handlers are caught properly", function(done) {
//   var testError = new Error("Something went wrong");

//   var promise = new MyPromise(function(resolve) {
//     setTimeout(function() {
//       resolve();
//     }, 20);
//   });

//   promise
//     .then(function() {
//       throw new Error("some Error");
//     })
//     .catch(function() {
//       return new MyPromise(function(resolve, reject) {
//         setTimeout(function() {
//           reject(testError);
//         }, 20);
//       });
//     })
//     .catch(function(value) {
//       expect(value).toBe(testError);
//       done();
//     });
// },500);

// it("second argument in then is treated as a rejection handler", function(done) {
//   var testError = new Error("Something went wrong");

//   var promise = new MyPromise(function(resolve, reject) {
//     setTimeout(function() {
//       reject(testError);
//     }, 20);
//   });

//   promise.then(
//     function() {},
//     function(error) {
//       expect(error).toBe(testError);
//       done();
//       return undefined;
//     }
//   );
// },500);

// it("second argument in then is attached to the promise then is called on", function(done) {
//   var testError = new Error("Something went wrong");
//   var didRun = false;

//   var promise = new MyPromise(function(resolve) {
//     setTimeout(function() {
//       resolve();
//     }, 20);
//   });

//   promise
//     .then(
//       function() {
//         return new MyPromise(function(resolve, reject) {
//           setTimeout(function() {
//             reject(testError);
//           }, 20);
//         });
//       },
//       function() {
//         didRun = true;
//       }
//     )
//     .catch(function(error) {
//       expect(error).toBe(testError);
//       expect(didRun).toBe(false);
//       done();
//     });
// },500);
