class A{
  callMe(){
    console.log(111111);
    return new A();
  }
}

const a=new A();
a.callMe().callMe().callMe();