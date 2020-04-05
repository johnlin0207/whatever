/**
 * 用函数模拟实现一个new过程，要求可以接收初始化参数
 * @param Con
 * @param args
 * @returns {*}
 * @private
 */
function _new (Con, ...args){
    let o = Object.create(Con.prototype); //创建以构造函数原型属性为原型的对象
    Con.apply(o, args); //为o对象创建原型属性
    return o
}

function Animal(name){
    this.name = name;
}

Animal.prototype.say = function(){
    console.log(`${this.name} is an animal`)
};

const d = _new(Animal, 'Dog');
