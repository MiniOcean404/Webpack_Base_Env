/**
 * 定义函数或者类，遇到不明确的类型使用泛型
 */
function fn<T>(a:T):T {
  return a
}

fn(10) //不指定泛型，ts自动推断 最好手动加上，可能会出错
fn<string>('hellow') //指定泛型

/**
 * 指定多个
 */
function fn2<T,K>(a:T,b:K):T {
  return a
}
fn2<string,number>('你好',123)

/**
 * T extends inter代表T必须是Inter实现类（子类）
 */

interface inter{
  length:number
}

class a  implements inter{
  length:number
  constructor (length:number){
    this.length = length
  }
}

function fn3<T extends inter>(a:T):number {
  return a.length
}

/**
 * class中使用
 */
class b <T>{
  name:T
  constructor(name:T){
    this.name = name
  }
}
const B = new b<string>('s')