'use strict';

{

    const $btn= document.getElementsByTagName('button');
    const $input= document.getElementById('input');
    var formula= "0";
    var result= 0;
    var answer_flag= 0;   //answerが更新された直後かどうか
    var log_flag= 0;      //対数を扱っているかどうか
    var e_flag= 0;        //eを扱っているかどうか
    var target_digit="0";  //routeの計算を最後に行うための変数
   


    $input.textContent= formula;
    let buttonIndex= 0;
    const buttonLength= $btn.length;

    //ボタンに応じたテキストをUIに表示
    while(buttonLength > buttonIndex){
        $btn[buttonIndex].addEventListener('click', (e)=>{
           
            if(isNaN(e.target.textContent) & e.target.textContent!= '.'){
                //入力された値が数字でない、かつ小数点でもない場合

                //（　を押したときの処理
                if(e.target.textContent=== "("){
                    brackets_start(e);
                }

                // ）を押したときの処理
                if(e.target.textContent === ")"){
                    brackets_end(e);
                }

                //算術演算子を押したときの処理
                if(e.target.textContent=== "＋" 
                || e.target.textContent=== "x"
                || e.target.textContent=== "÷"
                || e.target.textContent=== "％"
                ){
                    if($input.textContent.substring($input.textContent.length-1)!= "g"){
                        calc(e);
                        answer_flag=0;  //回答直後の状態を解除する
                    }   
                }

                if(e.target.textContent=== "ー"){    //expのためにーだけは独立
                    if($input.textContent.substring($input.textContent.length-1)!= "g"){
                        calc(e);
                        answer_flag=0;  //回答直後の状態を解除する
                    }
                }

                //Ansを押したときの処理
                if(e.target.textContent==="Ans"){
                    ans_button();
                }

                // ＝押したときの処理
                if(e.target.textContent==="＝"){
                    answer();
                }

                //CEキーを押したときの処理
                if(e.target.textContent=== "CE"){
                    ce_key();
                }
                //ACキーを押したときの処理
                if(e.target.textContent=== "AC"){
                    ac_key();
                }

                if(e.target.textContent==="log"){
                    logarithm(e);
                }
                

                if(e.target.textContent==="sin"||
                  e.target.textContent==="cos"||
                  e.target.textContent==="tan"){
                      sin_cos_tan(e);
                  }

                if(e.target.textContent==="π"){
                    pi(e);
                }

                if(e.target.textContent=== "√"){
                    rout(e);
                }
                if(e.target.textContent==="X^y"){
                    pow();
                }

                e_flag=0;　　　　　　　　　　　　　　　//e_flagは演算子等を入力して、
                                                    //そのあとに数字を入力した場合に、ｘが付け加えられるのを防止するため


                if( e.target.textContent==="e"){   //eの処理は最後に持ってくる
                    napier(e);
                }
                      

            }else{
                //数字または小数点を入力したときの処理
                suji_shori(e);
                
            }
        });
        
        buttonIndex++;
    }


    const suji_shori= (e) =>{

        
        if(answer_flag===1){
            //＝を押した直後に数字を入力したときの処理
            $input.textContent= "0";
            formula= "0";
            answer_flag= 0; 
              
        }


        if(e_flag===1){
            $input.textContent+="x";
            e_flag=0;
        }
        if($input.textContent==="0"){
            //formulaが初期値(０)のとき
            if(e.target.textContent==="."){
                //formulaが初期値のままで小数点が入力された時の処理
                $input.textContent += e.target.textContent;
            }else{
                //formulaが初期値で数字が入力された時の処理
                $input.textContent = e.target.textContent;
            }               
        }else{
            //formulaが初期値（0）でないときの処理
            if(formula.indexOf(".") === -1 || e.target.textContent!= "."){
                //formulaに小数点がないまたは入力された文字も小数点ではないときの処理
                //（formulaに小数点があり、かつ入力された文字も小数点である場合は何もしない）
            
                $input.textContent += e.target.textContent;　　　
            
                console.log("a");


            }
            
        }
    
        
        formula = $input.textContent;
        
    };


    //算術演算子を入力したときの関数
    const calc = (e) =>{
        if(formula.substring(formula.length-1) ==="＋"　||
        formula.substring(formula.length-1) === "ー" ||
        formula.substring(formula.length-1) === "x" ||
        formula.substring(formula.length-1) === "÷" ||
        formula.substring(formula.length-1) === "％" ){
            //式の末尾に既に+か-かxか÷か%がある場合
            $input.textContent = $input.textContent.slice(0, -1); //既にある末尾の演算子を削除する
            
           // $input.textContent = formula.replace(formula.substring(formula.length-1), e.target.textContent);　//末尾の算術演算子を新たに入力された算術演算子に置き換える                    
        }
        $input.textContent += e.target.textContent;     //新たに入力された演算子を追加する
        formula = $input.textContent;      //formulaを更新する
        
    };

    //＝を入力したときの関数
    const answer= ()=>{
        //＋　ー　ｘ　÷　などの文字をコンピューターが計算できるように正規の算術演算子に置き換える
        
        while(formula.indexOf("＋")!= -1){
            formula= formula.replace("＋", "+");
        }
        while(formula.indexOf("ー")!= -1){
            formula= formula.replace("ー", "-");
        }
        while(formula.indexOf("x")!= -1){
            formula= formula.replace("x", "*");
        }
        while(formula.indexOf("÷")!= -1){
            formula= formula.replace("÷", "/");
        }
        while(formula.indexOf("％")!= -1){
            formula= formula.replace("％", "%");
        }

        //＝が押された後のlogの処理
        while(formula.indexOf("log")!= -1){
            formula= formula.replace("log", "Log");
        }
        while(formula.indexOf("Log")!= -1){
            formula= formula.replace("Log", "Math.log");
        }

        //＝が押された後のsinの処理
        while(formula.indexOf("sin")!= -1){
            formula= formula.replace("sin", "Sin");
        }
        while(formula.indexOf("Sin")!= -1){
            formula= formula.replace("Sin", "Math.sin");
        }

        //＝が押された後のcosの処理
        while(formula.indexOf("cos")!= -1){
            formula= formula.replace("cos", "Cos");
        }
        while(formula.indexOf("Cos")!= -1){
            formula= formula.replace("Cos", "Math.cos");
        }

        //＝が押された後のtanの処理
        while(formula.indexOf("tan")!= -1){
            formula= formula.replace("tan", "Tan");
        }
        while(formula.indexOf("Tan")!= -1){
            formula= formula.replace("Tan", "Math.tan");
        }

        //＝が押された後のπの処理
        while(formula.indexOf("π")!= -1){
            formula= formula.replace("π", "Math.PI");
        }

        //＝が押された後のネイピア数eの処理
        while(formula.indexOf("e")!= -1){
            formula= formula.replace("e", "E");
        }
        while(formula.indexOf("E")!= -1){
            formula= formula.replace("E", "Math.exp(1)");
        }
        
        //＝が押された後の^の処理
        while(formula.indexOf("^")!= -1){
            var pow_locate= formula.indexOf("^");    //^の位置を取得
            var bracket_start_location= formula.indexOf("(", pow_locate);  //^の直後に来る（の位置を取得
            var bracket_end_location= formula.indexOf(")", pow_locate);   //^の後にくる）の位置を取得
            var exponent= formula.substring(bracket_start_location+1, bracket_end_location); //先程取得した（と）の間から数字を抜き出してexponentに保持
            
            var base_front= formula.search(/[-+/*%][1-9e]+\^/); //算術演算子の次に数字またはe(ネイピア数)が１つ以上入って
            var base= "0";                                        //その次に^が来る文字列の先頭にインデックスを保持する
            if(base_front=== -1){
                base= formula.substring(0, pow_locate);
            }else{
                base= formula.substring(base_front+1, pow_locate);
            }
            formula= formula.replace(base+ "^("+ exponent + ")", "sub");
            console.log(base);
            console.log(exponent);
            console.log(formula);
            formula= formula.replace("sub", "Math.pow("+ base +"," +exponent+ ")");
            
            
            // console.log(base_front);
            // console.log(exponent);
            // console.log(base);

        }

        //＝が押された後のルートの処理
        while(formula.indexOf("√")!= -1){
            var route_locate= formula.indexOf("√");
            var bracket_start_location= formula.indexOf("(", route_locate);
            var bracket_end_location= formula.indexOf(")", route_locate);
            target_digit= formula.substring(bracket_start_location+1, bracket_end_location);
            console.log(target_digit);
            
            formula= formula.replace("√("+ target_digit + ")", "ROUTE");
            formula= formula.replace("ROUTE", "Math.sqrt("+ target_digit+")");
            
            console.log(formula);

            // formula= formula.replace("ROUTE", `Math.sqrt(${target_digit})`);
            // console.log("b");
        }

        //＝が押された後の）　の処理
        while(formula.search(/\)[^-+*/%]/)!= -1 || formula.indexOf(")(")!=-1){
        formula= formula.replace(/\)([^-+*/%])/g, ')*$1');
        formula= formula.replace(")(", ")*(");

        }

        // //＝が押された後、前に数字がない.が見つかった場合
        // while(formula.search(/[^1-9]*\./)!= -1){
        //     period_index= formula.search(/[^1-9]*\./);
        //     if(period_index===0){
        //         //小数点の前に数字がない値が一番先頭にあった場合
        //         formula.replace("0.", ".");
        //     }else{
        //         formula.replace(".")
        //     }
            
        // }

        result = Function('return('+formula+');')();


        $input.textContent= result;　//答えを表示
        answer_flag= 1;                  //回答した直後を表すフラグをオンにする
        
    };

    //Ansを入力したときの関数
    const ans_button= () =>{
        if(formula.substring(formula.length-1) ==="＋"　||
        formula.substring(formula.length-1) === "ー" ||
        formula.substring(formula.length-1) === "x" ||
        formula.substring(formula.length-1) === "÷" ||
        formula.substring(formula.length-1) === "％" ){
            //新たに入力するansの前に算術演算子がある場合の処理
            $input.textContent += String(result);
            

        }else{
            //ansの前に算術演算子がない場合、ansと共にxを付け加えて積の計算をさせる
            $input.textContent += "x" + String(result);
        }
        formula = $input.textContent;
    };

    const brackets_start= (e) =>{
        if(formula.substring(formula.length-1)!= "."){
            
            if(isNaN(formula.substring(formula.length-1))){
            //(　の前が数字じゃないときの処理
                $input.textContent += e.target.textContent;
                formula= $input.textContent;
            }else{
                console.log("test");
                if(formula==="0"){
                    $input.textContent= e.target.textContent;
                }else{//formulaが初期値でないとき
                    console.log(formula);
                    //（の前が数字であるときの処理
                    if(log_flag===1){
                    //logフラグが立っているときの処理(logを扱っているとき)
                    
                        $input.textContent += e.target.textContent;   // ( を追加する

                    }else{
                        //logフラグが立っていないとき
                        $input.textContent += "x"+e.target.textContent;
                        formula =$input.textContent;
                    
                    }
                }
            }
           
            
        }
        
        
      
    };

    const brackets_end= (e)=>{
        // formulaの中にある"("と")"の個数をカウントする
        // arr= str.match(/a/g);

        var count_start_bracket=0;
        var count_end_bracket= 0;

        var arr_start= formula.match(/\(/g);
        var arr_end = formula.match(/\)/g);
        //　(　の数を数えてcount_start_bracketに入れる処理
        if(arr_start == null){
            count_start_bracket = 0;
        }else{
            count_start_bracket= arr_start.length;
        }
        //　） の数を数えてcount_end_bracketに入れる処理
        if(arr_end == null){
            count_end_bracket= 0;
        }else{
            count_end_bracket= arr_end.length;
        }
        
        
        //　(　と　)　の個数が異なっているときに、）が入力された場合、それをformulaに追加する
        if(count_end_bracket!= count_start_bracket){
            $input.textContent += e.target.textContent;
            formula= $input.textContent;

            
        }





    
    };

    const ac_key= () =>{
        formula = "0";
        result= 0;
        $input.textContent= "0";
        answer_flag= 0;
        log_flag= 0;
    };

    const ce_key= () =>{
        if($input.textContent.slice(-3)==="log"){
            $input.textContent = $input.textContent.slice(0, -3); //既にある末尾の演算子を削除する
            log_flag=0;
        }else{
            $input.textContent = $input.textContent.slice(0, -1); //既にある末尾の演算子を削除する
        }
        formula= $input.textContent;
    };

    const logarithm= (e) =>{
        if(formula.substring(formula.length-1)!= "."){
            
            if(isNaN(formula.substring(formula.length-1))){
                //formulaの末尾が数字じゃないなら
                $input.textContent += e.target.textContent;
                
            }else{
                //logを入力したとき、formulaが初期値のままか否か
                if(formula!="0"){
                    $input.textContent += "x" + e.target.textContent;
                }else{
                    $input.textContent= e.target.textContent;  //初期値のときはlogを上書きする.
                }                                               //ただし、formulaにはまだ書き換えない
            }
            log_flag= 1;    //logのフラグを立てる
           
        }     
    };
    const napier = (e) =>{
        if (formula.substring(formula.length-1)!= "."){
            if(isNaN(formula.substring(formula.length-1))){
                $input.textContent += e.target.textContent;
            }else{
                if(formula!="0"){
                    $input.textContent += "x" + e.target.textContent;
                }else{
                    $input.textContent= e.target.textContent;  //初期値のときはlogを上書きする.
                }         
            }
        }

        formula= $input.textContent;
        e_flag= 1;

        
    };

    const sin_cos_tan= (e)=>{
        if (formula.substring(formula.length-1)!= "."){
            if(isNaN(formula.substring(formula.length-1))){
                $input.textContent += e.target.textContent;
            }else{
                if(formula!="0"){
                    $input.textContent += "x" + e.target.textContent;
                }else{
                    $input.textContent= e.target.textContent;  //初期値のときはlogを上書きする.
                }
                       
            }
            $input.textContent += "(";    
        }
    }

    const pi= (e)=>{
        if (formula.substring(formula.length-1)!= "."){
            //formulaの末尾が小数点でないとき
            if(isNaN(formula.substring(formula.length-1))){
                //formulaの末尾が数字でないとき
                $input.textContent += e.target.textContent;
            }else{
                //formulaの末尾が数字であるとき
                if($input.textContent!="0"){
                    //$input.textContentが初期値でないとき
                    if(isNaN($input.textContent.substring($input.textContent.length-1))){
                        //input.textContentの末尾が数字でないとき
                        $input.textContent+= e.target.textContent;
                    }else{
                        $input.textContent += "x" + e.target.textContent;
                    }
                }else{
                    //$input.textContentが初期値であるとき
                    $input.textContent= e.target.textContent;  //初期値のときはπを上書きする.
                }
                        
            }

            formula= $input.textContent;
        }
    };



    const rout= (e)=>{
        if (formula.substring(formula.length-1)!= "."){
            if(isNaN(formula.substring(formula.length-1))){
                $input.textContent += e.target.textContent+ "(";
            }else{
                if(formula!="0"){
                    $input.textContent += "x" + e.target.textContent+ "(";
                }else{
                    $input.textContent= e.target.textContent + "(";  //初期値のときはπを上書きする.
                }
                        
            }

            formula= $input.textContent;
        }
    };

    const pow=()=>{
        if(isNaN(formula.substring(formula.length-1)) === false||
        formula.substring(formula.length-1)==="e"){
            $input.textContent+= "^(";
        }
        formula= $input.textContent;
    };


    
 



    


    
    

}
