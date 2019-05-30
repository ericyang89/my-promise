
export default class MyPromise {
  public resolver;
  constructor(fn) {

    this.resolver = new Resolver();

    const _self = this;
    fn((data) => {
      _self.resolver.resolve(data)
    }, (err) => {
      _self.resolver.reject(err)
    });
  }

  then(callback, errCallback?:any) {
    let _self = this;

    let promise = new MyPromise((resolve, reject) => {
      _self.resolver.nextPromiseResolve = resolve;
      _self.resolver.nextPromiseReject = reject;
    });

    this.resolver.addCallback(
      {handler:callback,promise},
       {handler:errCallback,promise}
       );

    return promise;
  }

  catch() {}

  finally() {}
}

enum State  {
  pending = 1,
  fulfilled = 2,
  rejected = 3
}

class Resolver {
  public state;
  public result;
  public callbackList;
  public errCallbackList;

  public nextPromiseResolve;
  public nextPromiseReject;

  constructor() {
    this.state = State.pending;
    this.result = undefined;
    this.callbackList = [];
    this.errCallbackList = [];
  }

  resolve(result) {
    

    if(this.state === State.pending) {
      this.state = State.fulfilled;
      this.result = result;
      // todo run then
      this.runThens();
    }
  }

  reject(err) {
    this.state = State.rejected;

  }

  runThens() {
    if(this.state !== State.fulfilled) {
      return;
    }

    let list = this.callbackList;
    let result = this.result;

    // 
    let tmp = undefined;

    while(list.length>0){
      const item=list.shift();
      try{
        tmp = item.handler(result);

        if(! (tmp instanceof MyPromise)) {
          item.promise.resolver.resolve(tmp);
        } else {
          tmp.then((aa) => {
            item.promise.resolver.resolve(aa);
          }, () => {})
        }
      } catch(e) {
        this.nextPromiseReject(e);
      }
    }
  }

  addCallback(callbackObj, errCallbackObj) {
    this.callbackList.push(callbackObj);
    this.errCallbackList.push(errCallbackObj);

    // todo thens
    this.runThens();
  }
}