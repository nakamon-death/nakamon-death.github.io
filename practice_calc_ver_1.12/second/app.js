'use strict'

//本プログラムは296行目から実行部分です。　それまでは関数や変数

//ここからはURLからパラメータを取り出す処理です
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

//ここまでがURLからパラメータを取り出す処理です


const display_formula= document.getElementById('formula_core');   //数式を表示する場所
const input_digit= document.getElementById('input_digit');        //答えを入力する場所
const del= document.getElementById('del');                         //一文字消す場所
const check= document.getElementById('check_and_next'); 
const setting= document.getElementById('setting_button');   //セッティングボタン
const result_display= document.getElementById('result');


var next_key_enable_flag= 0;   //ネクストボタンが有効か無効かを表すフラグ

//時間を計測するための変数
var start_time = performance.now();


//キー入力かパッド入力かを分ける
var key_or_pad=queryObject["input"];

var hope_figures= 3;        //ユーザーの希望桁数
var arith= queryObject["arith"];
var arithmetic_operator= "";       //算術演算子



//初期化処理
const question_number=Number(queryObject["practice"]);       //問題数
const max= Number(queryObject["max"]);                   //取り扱う最大の数字
const min= Number(queryObject["min"]);                   //取り扱う最小の数字

let question_init= 0;       //問題のカウント用の変数

var answer= 0;               //答えを初期化しておく
var formula= "";             //問題を初期化
var digit= '0';
var correct= 0;              //正解数を格納する変数
input_digit.textContent= digit;

//ここまで初期化処理

//plusなどの文字になっているarith変数を人間にとって分かりやすい算術演算子に変える
if(arith==="plus"){
    arithmetic_operator="＋";
}else if(arith==="minus"){
    arithmetic_operator= "ー";
}else if(arith==="multiple"){
    arithmetic_operator= "x";
}else if(arith==="division"){
    arithmetic_operator= "÷";
}




//delボタンを押したときの処理
const del_button= () =>{
    console.log(digit.length);
    
    if(digit!="0"){
        
        if(digit.length!= 1){
            //digitが１文字じゃないときの処理       
            digit= digit.slice(0, -1);         
        }else{
            //digitが１文字のときの処理
            digit= "0";
        }
        input_digit.textContent= digit;   
    }
};

const all_del_button= () =>{
    digit= "0";
    input_digit.textContent= digit;
}

//checkボタンを押したときの処理
function check_button(){
    
    next_key_enable_flag=1;
    if(Number(digit)===answer){
        // input_digit.classList.add('right');
        result_display.textContent="正解です！";
        result_display.classList.add('right');
        correct++;
    }else{
        result_display.textContent="不正解:答えは"+ String(answer);
        result_display.classList.add('wrong');
        // input_digit.classList.add('wrong');
    }

    //check_buttonをnext_buttonに入れ替える
    if(key_or_pad==="pad"){
        check.onclick= next_button;
    }

    
    check.classList.add('next_button_enable');
    check.textContent="Next";
    
};

function next_button(){
    question_init++;
    if(question_number> question_init){
        answer= 0;               //答えを初期化しておく
        formula= "";             //問題を初期化
        digit= '0';
        input_digit.textContent= digit;

        //resultの表示切替
        if(result_display.classList.contains('right')){
            result_display.classList.remove('right');
        }else if(result_display.classList.contains('wrong')){
            result_display.classList.remove('wrong');
        }

        result_display.textContent=String(question_init+1)+ "/"+ String(question_number)+ "問";
        
  
        //nextからcheckへの入れ替え処理
        next_key_enable_flag= 0;
        if(key_or_pad==="pad"){
            check.onclick= check_button;
        }
        check.textContent= "Check";
        
        make_and_output_formula();

   
    }else{
        window.alert('結果ページを表示します');
        to_result_page();
    }


};

//numberパッドを入力したときの処理
const suji_nyuryoku = (e) =>{
    if(digit==='0'){
        digit= e.target.textContent;
    }else{
        digit+= e.target.textContent;
    }
    input_digit.textContent= digit;  
};

const suji_nyuryoku_key = (number) =>{
    if(digit==='0'){
        digit= number;
    }else{
        digit+= number;
    }

    
    input_digit.textContent= digit;  
};

// settingボタンを押したときの処理
const setting_button = ()=>{
    question_init= 0;       //問題のカウント用の変数

    answer= 0;               //答えを初期化しておく
    formula= "";             //問題を初期化
    digit= '0';
    correct= 0;             //正解数を初期化
    input_digit.textContent= digit;
    location.href= 'https://nakamon-death.github.io/practice_calc_ver_1.12/';
};




//数式をランダムに作って表示する
const make_and_output_formula= ()=>{
    
    
    //無効化したcheckボタンを次の問題が始まると有効化する
    // check.addEventListener('click', {handleEvent: check_button()});
    
    //有効化していたnextボタンを次の問題が始まると無効化する

    if(key_or_pad==="pad"){
        check.onclick= check_button;
    }
    
    
    

    //数式を作る
    var number1= Math.floor(Math.random() * max + min);
    var number2= Math.floor(Math.random() * max + min);

    if(arithmetic_operator==="÷"){
        //もしも算術演算子が商だった場合
        while(number1% number2!=0 || number1===number2 || number2===1){
            //number2でnumber1が割り切れるようなnumber1とnumber2になるまで更新を続ける
            number1= Math.floor(Math.random() * max + min);
            number2= Math.floor(Math.random() * max + min);
        }
    }else if(arithmetic_operator==="ー"){
        //もしも算術演算子が差だった場合
        while(number1< number2){
            number1= Math.floor(Math.random() * max + min);
            number2= Math.floor(Math.random() * max + min);
        }
    }

    formula+= String(number1);
    formula+= arithmetic_operator;
    formula+= String(number2);


    display_formula.textContent= formula;   //ユーザーに問題を出題する

    //内部で計算のためにユーザーフレンドリーな算術演算子を
    //コンピューターフレンドリーな記述に切り替える
    while(formula.indexOf("÷")!= -1){
        formula= formula.replace("÷", "/");
    }
    while(formula.indexOf("＋")!= -1){
        formula= formula.replace("＋", "+");
    }
    while(formula.indexOf("ー")!= -1){
        formula= formula.replace("ー", "-");
    }
    while(formula.indexOf("x")!= -1){
        formula= formula.replace("x", "*");
    }
    
    
    answer= Function('return('+formula +');')();//文字列型のformulaをプログラム上で読み込める数式にして答えを得る   
    
};

const to_result_page= () =>{
    //時間計測をこの関数実行された時の終了する
    var end_time= performance.now();

    var calc_time= ((end_time - start_time) /1000).toFixed(2); //ミリ秒なので1/1000倍する

    //Resultページへ行く
    var question= escape(question_number);
    var arith_param= escape(arith);
    var max_param= escape(max);
    var min_param= escape(min);
    var correct_param= escape(correct);
    var time_param= escape(calc_time);

    var param= "question="+ question + "&arith=" + arith_param + "&max=" + max_param + "&min=" + min_param + "&correct="+ correct + "&time="+ time_param;
    location.href= "https://nakamon-death.github.io/practice_calc_ver_1.12/second/third/result.html?" + param;

    
}





//実行部分
//問題数を表示
result_display.textContent=String(question_init+1)+ "/"+ String(question_number)+ "問";

make_and_output_formula();//一番最初の問題表示

if(key_or_pad==="pad"){
del.addEventListener('click', ()=>{
    del_button();
});

del.addEventListener('dblclick', ()=>{
    all_del_button();
});

setting.addEventListener('click', ()=>{
    setting_button();
});


}






//numberパッド表示
for (let i= 0; i < 10; i++){
    const button_num =document.createElement('button');
    button_num.textContent= String(i);
    button_num.classList.add('number');
    if(i < 5){
        document.getElementById('pad1').appendChild(button_num);
    }else{
        document.getElementById('pad2').appendChild(button_num);
    }

    //入力モードがパッドだったら
    if(key_or_pad==="pad"){
        button_num.addEventListener('click', (e)=>{
            if(next_key_enable_flag===0){
                suji_nyuryoku(e);
            }
        });   
    }
}

if(key_or_pad==="key"){
    document.addEventListener('keyup', (event)=>{
        
        var keyName= event.key;
        
        if (keyName.match(/[0-9]/)!= null) {
            if(next_key_enable_flag===0){
                suji_nyuryoku_key(keyName);
            }
        }else if(keyName==="Backspace"){
            del_button();
        }else if(keyName==="Delete"){
            all_del_button();
        }else if(keyName==="Escape"){
            setting_button();
        }else if(keyName==="Enter"){
            if(next_key_enable_flag===0){
                next_key_enable_flag=1;     
                check_button();  
                
            }else{
                next_key_enable_flag=0;
                next_button();
            }
        }

    });
}








