## Usage
```
const valid = new FishValidator({
    type:'student',
    grade:1,
    name:'Tom',
    age:14,
    love:'basketball',
    chinese_score:100,
    reg:'450000',
    phone:'15012345678',
    email:'123456@164.com',
    zip:'450001',
    id:'410823198704318679'
},{
    type:'require|min:1,max:20',
    grade:'require|egt:1|elt:6',
    name:'require|size:1,4',
    'age|年龄':'require|range:1,15',
    love:'require|include:basketball,football,tennis',
    chinese_score:'require|gt:0|elt:100',
    reg:'require|reg:^[0-9]+$',
    phone:'phone',
    email:'email',
    zip:'require|zip',
    id:'require|id'
})
if( ! valid.check()){
    console.log(valid.getError())
}
```