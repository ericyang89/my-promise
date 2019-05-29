import { on } from "cluster";

const noop=()=>{}
enum Status {
  pending = "pending",
  rejected = "rejected",
  resolved = "resolved"
}

export default class MyPromise{
  constructor(exclutor){
    this._resolveArray=[];
    this.value;
    this.status=Status.pending;
    exclutor(this._resolve.bind(this),this._reject.bind(this))
  }
  public value: any;
  public status: Status;

  _resolve(val){
   if(this.status===Status.pending){
     this.status=Status.resolved;
     this.value=val;
     this._runResolveArray()
   }
  }
  _reject(){
    // todo
  }
  _resolveArray:any[];
  _runResolveArray(){
    while(this._resolveArray.length>0){
      const item=this._resolveArray.shift();
      const result=item.handle(this.value);

   

      if(result&&result instanceof MyPromise){
        result.then(val=>{
          item.promise._resolve(val)
        });
        continue;
      }

      if(result!==undefined){
        this.value=result;
      }

      item.promise._resolve(this.value);
    }

  }
  then(onFullfilled:any,onRejected:any=noop){
    const newPromise= new MyPromise(()=>{});

    this._resolveArray.push({
      handle:onFullfilled,
      promise:newPromise
    })

    if(this.status===Status.resolved){
      this._runResolveArray()
    }
    return newPromise;

  }
  catch(onRejected:any){
    //todo
  }
}
