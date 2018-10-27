var player = [];

var json = {"name": "Frank",
            "age": 15}

player.push(json);
var json = {"name": "Pascal",
            "age": 17}
player.push(json);
var json = {"name": "Tobias",
            "age": 21}
player.push(json);


console.log(player);

for(person in player){
    if(player[person].name == 'Tobias'){
        player.pop(person)
    }
}
console.log();
console.log(player);

