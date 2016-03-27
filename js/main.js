(function () {
    //矢印キーのコード
    var KEY_CODE = {
        left: 37,
        right: 39
    }
    //取得したキーの値
    var key_value = 0;
    var snow_man_rightLimit = 0;
    
    //オーディオ再生用変数
    var audio = null;
    var audioPlayed = false;
    
    var canvas;
    var ctx;
    var img = {snow:null, snow_man:null};
    var snow_x = 0;
    var snow_y = 0;
    var snow_man_x = 0;
    var snow_man_y = 0;
    var requestId = 0;
    //domのロードが完了したら実行
    document.addEventListener('DOMContentLoaded',function(){
        loadAssets();   
        setHandlers();     
    });
    
    function setHandlers() {
        //キーイベントの取得（キーダウン）
        document.addEventListener('keydown', function(event){
            if (event.which == KEY_CODE.left) {
                key_value = -3;
            } else if(event.which == KEY_CODE.right) {
                key_value = 3;
            }
        });
        //雪だるまが進みっぱなしにならないように、キーが上がったら０に
        document.addEventListener('keyup', function () {
            key_value = 0;
        });
    }
    
    function loadAssets() {
        //HTMLファイル上のcanvasエレメントのインスタンスを取得
        canvas = document.getElementById('bg');
        
        //アニメーションの開始
        canvas.addEventListener('click',function(){
            if(!requestId){renderFrame();}
        });
        
        //2Dコンテキストを取得
        ctx = canvas.getContext('2d');
        
        //Audio インスタンスの生成
        audio = new Audio('./audio/kiiiin1.mp3')
        
        //imageオブジェクトのインスタンスを生成
        img.snow = new Image();
        //imageオブジェクトに画像をロード
        img.snow.src = './img/snow.png';
        //画像読み込み完了後、canvasに画像を表示する。
        img.snow.onload = function () {
            //snow_x = getCenterPosition(canvas.clientWidth,img.snow.width);
            //snow_y = 0;
            //表示位置をランダムな値に設定
            snow_x = getRandomInt(0, canvas.clientWidth - img.snow.width);
            snow_y = getRandomInt(-img.snow.height, -500);
            
            ctx.drawImage(img.snow,snow_x,snow_y);
        }
        
        //雪だるまインスタンスの生成
        img.snow_man = new Image();
        img.snow_man.src = './img/snow_man.png';
        
        img.snow_man.onload = function () {
            snow_man_x = getCenterPosition(canvas.clientWidth,img.snow_man.width);
            //雪だるま画像は、表示領域の底辺に画像の底辺がつくように
            snow_man_y = canvas.clientHeight - img.snow_man.height;
            //雪だるまの移動可能な最大X座標の計算
            snow_man_rightLimit = canvas.clientWidth - img.snow_man.width;
            
            ctx.drawImage(img.snow_man,snow_man_x,snow_man_y);
        }
        
    }
    
    //中央のLeft位置を求める関数
    function getCenterPosition(containerWidth, itemWidth) {
        return (containerWidth /2 ) - (itemWidth / 2);
    }
    
    function renderFrame() {
        //snowのy値（縦位置）がcanvasからはみ出たら先頭に戻す
        if(snow_y > canvas.clientHeight){
          
            //snow_y = 0;
            //表示座標をランダムな値に設定
            snow_x = getRandomInt(0,canvas.clientWidth - img.snow.width);
            snow_y = getRandomInt(-img.snow.height, -500);
            
            //オーディオ再生のリセット
            audio.pause();
            audio.currentTime = 0;
            audioPlayed = false;   
            
            
        }
        //canvasをクリア
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //snowのy値を増分
        snow_y += 4;
        
        //キーの状態によって雪だるまの表示位置を変更する。
        if ((snow_man_x < snow_man_rightLimit && key_value > 0) ||
            (snow_man_x >= 3 && key_value < 0)) {
                snow_man_x += key_value;
            }
        
        //画像を描画
        ctx.drawImage(img.snow,snow_x,snow_y);
        ctx.drawImage(img.snow_man,snow_man_x,snow_man_y);
        
        //あたり判定処理
        if (isHit(img.snow,snow_x,snow_y,
                img.snow_man, snow_man_x,snow_man_y)) {
                    hitJob();
        }
        
        //ループを開始
        requestId = window.requestAnimationFrame(renderFrame);
     }
     
     //あたり判定
     function isHit(a, ax, ay, b, bx, by) {
         return (((ax <= bx && bx <= ax + a.width) ||
                  (bx <= ax && ax <= bx + b.width)) &&
                 ((ay <= by && by <= ay + a.height) ||
                  (by <= ay && ay <= by + b.height)));
     }
     //当たり判定の処理
     function hitJob() {
         ctx.font = 'bold 20px sans-serif';
         ctx.fillStyle = 'red';
         ctx.fillText('Hit!!', 5, 24);
         
         //オーディオの再生
         if (!audioPlayed) {
             audio.play();
             audioPlayed = true;
         }
     }
     
     //指定した最小値と最大値の間でランダムな整数値を生成
     function getRandomInt(min, max) {
         return Math.floor(Math.random() * (max - min + 1)) + min;
     }
    
    
})();