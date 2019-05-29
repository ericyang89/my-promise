class A{
  callMe(){
    console.log('1111')
    return new A()
  }
}

const a=new A();
a.callMe().callMe().callMe()