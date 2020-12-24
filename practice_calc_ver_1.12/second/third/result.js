'use strict';


const bumon = document.getElementById('bumon');
const correct_and_whole= document.getElementById('correct_and_whole');
const persent= document.getElementById('persent');
const time = document.getElementById('time');
const max_and_min= document.getElementById('max_and_min');
const to_setting= document.getElementById("to_setting");




//パラメータ取得
var queryString= window.location.search;
var queryObject= new Object();

if(queryString){
    queryString= queryString.substring(1);
    var parameters= queryString.split('&');

    for (var i = 0; i < parameters.length; i++){
        var element = parameters[i].split('=');

        var paramName= decodeURIComponent(element[0]);
        var paramValue= decodeURIComponent(element[1]);
        
        queryObject[paramName]= paramValue;            
    }
}

var arith= queryObject["arith"];
var question= queryObject["question"];
var max= queryObject["max"];
var min= queryObject["min"];
var time_value= queryObject["time"];


var bumonText="";
var correct_and_whole_text= "";
var persent_text="";
var max_and_min_text= "";
var time_text="";

if(arith==="plus"){
    bumonText+= "和";
}else if(arith==="minus"){
    bumonText+= "差";
}else if(arith==="multiple"){
    bumonText+= "積";
}else if(arith==="division"){
    bumonText+= "商";
}
bumonText+= "の部門";


correct_and_whole_text= queryObject["question"] + "問中"　+ queryObject["correct"]+ "問正解";

persent_text= String(Math.floor(Number(queryObject["correct"])/ Number(queryObject["question"])*100)) + "％"

max_and_min_text = queryObject["min"] + "~" + queryObject["max"];

time_text= time_value + "秒";



bumon.textContent = bumonText;
correct_and_whole.textContent= correct_and_whole_text;
persent.textContent= persent_text;

max_and_min.textContent= max_and_min_text;
time.textContent= time_text;

console.log(correct_and_whole_text);

to_setting.addEventListener('click', ()=>{
    location.href= 'https://nakamon-death.github.io/practice_calc_ver_1.12/';
});

document.addEventListener('keyup', (event)=>{
    if(event.key==="Escape"){
        location.href= 'https://nakamon-death.github.io/practice_calc_ver_1.12/';

    }
})