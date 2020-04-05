function _new (Con, ...args){
    let o = Object.create(Con.prototype);
    Con.apply(o, args);
    return o
}

function Animal(name){
    this.name = name;
}

Animal.prototype.say = function(){
    console.log(`${this.name} is an animal`)
};

const d = _new(Animal, 'Dog');
