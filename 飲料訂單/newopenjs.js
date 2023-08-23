var firebase;

$(function(){

        $(".masterMenu a").click(function(){
                var _this = $(this);

                var href_val = _this.attr('href');
                if(href_val[0] === "#"){ //判斷 a 連結網址部分 是不是 id  或是 網址
                        $('.int_box').removeClass('int_box_open')
                        $(href_val).addClass('int_box_open');
                }
                if(_this.attr('data-id')){
                        $('html').css('height','auto');
                }
                else{
                        $('html').css('height','100%');
                }
        });

        var $showtext = $('#showtext'),
        $announcement = $('#announcement'),
        // time = new Date(), //抓取現在時間
        $select = $('select'),
        clearAllLock = true,
        postName = {
                name: ""
        },
        postLight = { //工作資料
                light: ""
        }
        reMark = { //備註資料
                remark: ""
        },
        // timeout,
        // month = "月",
        // nowYear = time.getFullYear(),
        // nowMonth = time.getMonth()+1,
        // nowDay = time.getDate(),
        // nowHour = time.getHours(),
        // nowMinutes = time.getMinutes(),
        // nowSeconds = time.getSeconds(),
        // timeAll = "",
        // day = "日",
        // dateAll = "",
        cool = {
                lock: false
        }
        // changeWorkLock = true,
        // changeWorkLockTime= 0,
        // allSeconds = 0  //接收現在時間到23:59:59的間隔時間戳函式輸出的值
        // console.log(changeWorkLock);
        // allCountDay = new Date(nowYear,nowMonth,0).getDate();

        // dateAll = nowMonth+month+nowDay+day;
        // timeAll = nowHour+':'+nowMinutes+':'+nowSeconds;

        
        //設定驗收單確認時間部分
        var ccc =  setInterval(function(){
                var cooltime = new Date();
                var HH = cooltime.getHours();
                var MM = cooltime.getMinutes();
                var SS = cooltime.getSeconds();
                var allclock = HH+':'+MM+':'+SS;

                if(HH >= 17 && MM >= 0 && SS >= 1){
                        clearTimeout(ccc);
                }
                else{
                        timeCheck(allclock);
                }

        },1000);
        //設定驗收單3點 5點跳出提示
        function timeCheck(TT){
                var x = TT;
                console.log(x);
                if(x == "17:0:0"){
                        swal("5點了 ! 值日生該出動了! 我只會提醒一次喔 ! ", "請按按鈕關閉 !", "success");
                }
                else if(x == "15:0:0"){
                        swal("3點了 ! 請下一位驗收單嘍 ! 也不用看Slack告警喔 ! ", "請按按鈕關閉 !", "success");
                        //clearTimeout(ccc);
                }
        }

        // function allSecond(){ //抓取現在時間到23:59:59的間隔時間戳
        //         var nowTime = time.getTime();//現在時間的時間戳
        //         time = new Date(""+nowYear+"-"+nowMonth+"-"+(nowDay+1)+" 00:00:00") // 指定明天00:00前的時間戳
        //         var unixTime2022 = 1640966400;//  2022/1/1 的時間戳
        //         var unixTomorrowTime = time.getTime();// 明天00:00的時間戳
        //         var leap_year = parseInt(((nowYear-1970)-2)/4); //1970到今年有閏年多了幾天
        //         var toDay_23_59_59 = (((nowYear-1970)*365)+leap_year)*24*60*60+(unixTomorrowTime-unixTime2022)+57000;
        //         var nowTime_To_23_59_59 = toDay_23_59_59 - nowTime;
        //         console.log(unixTomorrowTime);
        //         return nowTime_To_23_59_59;
        // }
        // allSeconds = allSecond();

        var config = {
                databaseURL: "https://work-group-64a7d-default-rtdb.firebaseio.com/" //David的
                //databaseURL: "https://chat-16802-default-rtdb.firebaseio.com/" //你的資料庫名稱
        };
        firebase.initializeApp(config);

        var database = firebase.database().ref('/grouping/'); //資料庫的目錄 ref('/test/')<-指定路徑目錄
        var databaseApi = firebase.database().ref('/grouping/API');
        var databaseOpe = firebase.database().ref('/grouping/OPE');
        var databaseOther = firebase.database().ref('/grouping/Other');
        var databaseAll = firebase.database().ref('/grouping/ALL');
        var database2 = firebase.database().ref('/announcement/');
        var getDB = firebase.database().ref('/styleChange/');
        var openCool = firebase.database().ref();

        //載入資料庫時顯示所有內容，並當資料庫有變動立即刷新
        database.on('value', function(snapshot) {
                // $showtext.html('<div class="morning_shift"><div id="api" class="work_box"><div class="buttonAreaApi"><div class="clearAllApi"><img src="images/trash.png" width="36px" height="36px" alt="" srcset=""></div></div><div class="mark">i<p class="allRemark">1. OPE<br>2. fastpb<br>3. acecric<br>4. 鬥牛直播<br>5. YOLO<br>6. Egame<br>7. BoTV <br>8. 印度彩票<br>9. RG棋牌<br>10. Grafana(HBO模板、SSC、HJ 、Mabu、YD)</p></div><h1>代理/包網&遊戲</h1></div><div id="all_work" class="work_box"><div class="buttonAreaAll"><div class="clearAllAll"><img src="images/trash.png" width="36px" height="36px" alt="" srcset=""></div></div><div class="mark">i<p class="allRemark">1. 全部產品<br>2. 平日中班 18:00後<br>3. 非平日早中班</p></div><h1>ALL</h1></div><div id="ope" class="work_box"><div class="buttonAreaOpe"><div class="clearAllOpe"><img src="images/trash.png" width="36px" height="36px" alt="" srcset=""></div></div><div class="mark">i<p class="allRemark">1. Fastapi<br>2. GSC<br>3. 舊API<br>4. Grafana(CY)</p></div><h1>API</h1></div></div>');
                $showtext.html('<div class="morning_shift"><div id="all_work" class="work_box"><div class="buttonAreaAll"><div class="clearAllAll"><img src="images/trash.png" width="36px" height="36px" alt="" srcset=""></div></div><div class="mark">i <p class="allRemark">1. 全部產品</p></div><h1>ALL</h1><div id="all_work_content"></div></div></div>');
                
                //原始API部分
                // databaseApi.once('value', function(snapshot) {
                //         for(var i in snapshot.val()){ 
                //                 if(snapshot.val()[i].light == "greenLight"){
                //                         $('#api').append('<div class="member_work"><div class="member_name"><select name="'+i+'" id="'+i+'"><option value="chose">選擇姓名</option><option value="Jill">Jill</option><option value="Pocky">Pocky</option><option value="Shaun">Shaun</option><option value="Ben">Ben</option><option value="Peter">Peter</option><option value="Lone">Lone</option><option value="Gary">Gary</option><option value="Mars">Mars</option><option value="Joanne">Joanne</option><option value="Neil">Neil</option><option value="Ian">Ian</option><option value="Chris">Chris</option></select></div><div class="work_light geryColor greenLight" data-id="'+i+'"></div><div class="work_notice"><textarea data-id="'+[i]+'">'+snapshot.val()[i].remark+'</textarea></div></div>');
                //                 }
                //                 else{
                //                         $('#api').append('<div class="member_work"><div class="member_name"><select name="'+i+'" id="'+i+'"><option value="chose">選擇姓名</option><option value="Jill">Jill</option><option value="Pocky">Pocky</option><option value="Shaun">Shaun</option><option value="Ben">Ben</option><option value="Peter">Peter</option><option value="Lone">Lone</option><option value="Gary">Gary</option><option value="Mars">Mars</option><option value="Joanne">Joanne</option><option value="Neil">Neil</option><option value="Ian">Ian</option><option value="Chris">Chris</option></select></div><div class="work_light geryColor" data-id="'+i+'"></div><div class="work_notice"><textarea data-id="'+[i]+'">'+snapshot.val()[i].remark+'</textarea></div></div>');
                //                 }
                //                 $('#api #'+i+'').find("option[value='"+snapshot.val()[i].name+"']").attr("selected",true);
                               
                //         }

                //         $('#api select').change(function(){
                                
                //                 var _this = $(this);
                //                 var getDataId = _this.attr('id')
                //                 var dataDB = firebase.database().ref('/grouping/API/'+getDataId+'')
                //                 postName = {
                //                         name: _this.val()
                //                 }
                //                 dataDB.update(postName);
                //         });

                //         $('#api .work_light').click(function(){
                //                 var _this = $(this)

                //                 var getDataId = _this.attr('data-id')
                //                 var dataDB = firebase.database().ref('/grouping/API/'+getDataId+'')
                                
                //                 if(_this.hasClass('greenLight')){
                //                         postLight = {
                //                                 light: ""
                //                         }
                //                         dataDB.update(postLight);
                //                         // _this.removeClass('greenLight');
                //                 }
                //                 else{
                //                         postLight = {
                //                                 light: "greenLight"
                //                         }
                //                         dataDB.update(postLight);
                //                         // _this.addClass('greenLight');
                //                 }
                //         });

                //         $('#api textarea').change(function(){
                //                 var _this = $(this);
                //                 var getDataId = _this.attr('data-id')
                //                 var dataDB = firebase.database().ref('/grouping/API/'+getDataId+'')
                //                 reMark = {
                //                         remark: _this.val()
                //                 }
                //                 dataDB.update(reMark);
                //         });

                // });
               
               
                // 原始包網部分
                // databaseOpe.once('value', function(snapshot) {
                //         for(var i in snapshot.val()){
                //                 if(snapshot.val()[i].light == "greenLight"){
                //                         $('#ope').append('<div class="member_work"><div class="member_name"><select name="'+i+'" id="'+i+'"><option value="chose">選擇姓名</option><option value="Jill">Jill</option><option value="Pocky">Pocky</option><option value="Shaun">Shaun</option><option value="Ben">Ben</option><option value="Peter">Peter</option><option value="Lone">Lone</option><option value="Gary">Gary</option><option value="Mars">Mars</option><option value="Joanne">Joanne</option><option value="Neil">Neil</option><option value="Ian">Ian</option><option value="Chris">Chris</option></select></div><div class="work_light geryColor greenLight" data-id="'+i+'"></div><div class="work_notice"><textarea data-id="'+[i]+'">'+snapshot.val()[i].remark+'</textarea></div></div>');
                //                 }
                //                 else{
                //                         $('#ope').append('<div class="member_work"><div class="member_name"><select name="'+i+'" id="'+i+'"><option value="chose">選擇姓名</option><option value="Jill">Jill</option><option value="Pocky">Pocky</option><option value="Shaun">Shaun</option><option value="Ben">Ben</option><option value="Peter">Peter</option><option value="Lone">Lone</option><option value="Gary">Gary</option><option value="Mars">Mars</option><option value="Joanne">Joanne</option><option value="Neil">Neil</option><option value="Ian">Ian</option><option value="Chris">Chris</option></select></div><div class="work_light geryColor" data-id="'+i+'"></div><div class="work_notice"><textarea data-id="'+[i]+'">'+snapshot.val()[i].remark+'</textarea></div></div>');
                //                 }  

                //                 $('#ope #'+i+'').find("option[value='"+snapshot.val()[i].name+"']").attr("selected",true);
                            
                //         }

                //         $('#ope select').change(function(){
                                
                //                 var _this = $(this);
                //                 var getDataId = _this.attr('id')
                //                 var dataDB = firebase.database().ref('/grouping/OPE/'+getDataId+'')
                //                 postName = {
                //                         name: _this.val()
                //                 }
                //                 dataDB.update(postName);
                //         });

                //         $('#ope .work_light').click(function(){
                //                 var _this = $(this)

                //                 var getDataId = _this.attr('data-id')
                //                 var dataDB = firebase.database().ref('/grouping/OPE/'+getDataId+'')
                                
                //                 if(_this.hasClass('greenLight')){
                //                         postLight = {
                //                                 light: ""
                //                         }
                //                         dataDB.update(postLight);
                //                         // _this.removeClass('greenLight');
                //                 }
                //                 else{
                //                         postLight = {
                //                                 light: "greenLight"
                //                         }
                //                         dataDB.update(postLight);
                //                         // _this.addClass('greenLight');
                //                 }
                //         });

                //         $('#ope textarea').change(function(){
                                
                //                 var _this = $(this);
                //                 var getDataId = _this.attr('data-id')
                //                 var dataDB = firebase.database().ref('/grouping/OPE/'+getDataId+'')
                //                 reMark = {
                //                         remark: _this.val()
                //                 }
                //                 dataDB.update(reMark);
                //         });
                // });


/*-------------------------------------------------------------------------------------------------------*/

                // databaseOther.once('value', function(snapshot) {
                //         for(var i in snapshot.val()){  
                //                 if(snapshot.val()[i].light == "greenLight"){
                //                         $('#other').append('<div class="member_work"><div class="member_name"><select name="'+i+'" id="'+i+'"><option value="chose">選擇姓名</option><option value="Jill">Jill</option><option value="Pocky">Pocky</option><option value="Shaun">Shaun</option><option value="Ben">Ben</option><option value="Peter">Peter</option><option value="Lone">Lone</option><option value="Gary">Gary</option><option value="Mars">Mars</option><option value="Joanne">Joanne</option><option value="Neil">Neil</option><option value="Ian">Ian</option><option value="Chris">Chris</option></select></div><div class="work_light geryColor greenLight" data-id="'+i+'"></div><div class="work_notice"><textarea data-id="'+[i]+'">'+snapshot.val()[i].remark+'</textarea></div></div>');
                //                 }
                //                 else{
                //                         $('#other').append('<div class="member_work"><div class="member_name"><select name="'+i+'" id="'+i+'"><option value="chose">選擇姓名</option><option value="Jill">Jill</option><option value="Pocky">Pocky</option><option value="Shaun">Shaun</option><option value="Ben">Ben</option><option value="Peter">Peter</option><option value="Lone">Lone</option><option value="Gary">Gary</option><option value="Mars">Mars</option><option value="Joanne">Joanne</option><option value="Neil">Neil</option><option value="Ian">Ian</option><option value="Chris">Chris</option></select></div><div class="work_light geryColor" data-id="'+i+'"></div><div class="work_notice"><textarea data-id="'+[i]+'">'+snapshot.val()[i].remark+'</textarea></div></div>');
                //                 }

                //                 $('#other #'+i+'').find("option[value='"+snapshot.val()[i].name+"']").attr("selected",true);
                //         }

                //         $('#other select').change(function(){
                                
                //                 var _this = $(this);
                //                 var getDataId = _this.attr('id')
                //                 var dataDB = firebase.database().ref('/grouping/Other/'+getDataId+'')
                //                 postName = {
                //                         name: _this.val()
                //                 }
                //                 dataDB.update(postName);
                //         });

                //         $('#other .work_light').click(function(){
                //                 var _this = $(this)
                //                 var getDataId = _this.attr('data-id')
                //                 var dataDB = firebase.database().ref('/grouping/Other/'+getDataId+'')
                                
                //                 if(_this.hasClass('greenLight')){
                //                         postLight = {
                //                                 light: ""
                //                         }
                //                         dataDB.update(postLight);
                //                         // _this.removeClass('greenLight');
                //                 }
                //                 else{
                //                         postLight = {
                //                                 light: "greenLight"
                //                         }
                //                         dataDB.update(postLight);
                //                         // _this.addClass('greenLight');
                //                 }
                //         });

                //         $('#other textarea').change(function(){
                                
                //                 var _this = $(this);
                //                 var getDataId = _this.attr('data-id')
                //                 var dataDB = firebase.database().ref('/grouping/Other/'+getDataId+'')
                //                 reMark = {
                //                         remark: _this.val()
                //                 }
                //                 dataDB.update(reMark);
                //         });
                // });



                //原始全部
                // databaseAll.once('value', function(snapshot) {
                //         for(var i in snapshot.val()){  
                //                 if(snapshot.val()[i].light == "greenLight"){
                //                         $('#all_work').append('<div class="member_work"><div class="member_name"><select name="'+i+'" id="'+i+'"><option value="chose">選擇姓名</option><option value="Jill">Jill</option><option value="Pocky">Pocky</option><option value="Shaun">Shaun</option><option value="Ben">Ben</option><option value="Peter">Peter</option><option value="Lone">Lone</option><option value="Gary">Gary</option><option value="Mars">Mars</option><option value="Joanne">Joanne</option><option value="Neil">Neil</option><option value="Ian">Ian</option><option value="Chris">Chris</option></select></div><div class="work_light geryColor greenLight" data-id="'+i+'"></div><div class="work_notice"><textarea data-id="'+[i]+'">'+snapshot.val()[i].remark+'</textarea></div></div>');
                //                 }
                //                 else{
                //                         $('#all_work').append('<div class="member_work"><div class="member_name"><select name="'+i+'" id="'+i+'"><option value="chose">選擇姓名</option><option value="Jill">Jill</option><option value="Pocky">Pocky</option><option value="Shaun">Shaun</option><option value="Ben">Ben</option><option value="Peter">Peter</option><option value="Lone">Lone</option><option value="Gary">Gary</option><option value="Mars">Mars</option><option value="Joanne">Joanne</option><option value="Neil">Neil</option><option value="Ian">Ian</option><option value="Chris">Chris</option></select></div><div class="work_light geryColor" data-id="'+i+'"></div><div class="work_notice"><textarea data-id="'+[i]+'">'+snapshot.val()[i].remark+'</textarea></div></div>');
                //                 }  

                //                 $('#all_work #'+i+'').find("option[value='"+snapshot.val()[i].name+"']").attr("selected",true);

                //         }

                //         $('#all_work select').change(function(){
                                
                //                 var _this = $(this);
                //                 var getDataId = _this.attr('id')
                //                 var dataDB = firebase.database().ref('/grouping/ALL/'+getDataId+'')
                //                 postName = {
                //                         name: _this.val()
                //                 }
                //                 dataDB.update(postName);
                //         });

                //         $('#all_work .work_light').click(function(){
                //                 var _this = $(this)
                //                 var getDataId = _this.attr('data-id')
                //                 var dataDB = firebase.database().ref('/grouping/ALL/'+getDataId+'')
                                
                //                 if(_this.hasClass('greenLight')){
                //                         postLight = {
                //                                 light: ""
                //                         }
                //                         dataDB.update(postLight);
                //                         // _this.removeClass('greenLight');
                //                 }
                //                 else{
                //                         postLight = {
                //                                 light: "greenLight"
                //                         }
                //                         dataDB.update(postLight);
                //                         // _this.addClass('greenLight');
                //                 }
                //         });

                //         $('#all_work textarea').change(function(){
                                
                //                 var _this = $(this);
                //                 var getDataId = _this.attr('data-id')
                //                 var dataDB = firebase.database().ref('/grouping/ALL/'+getDataId+'')
                //                 reMark = {
                //                         remark: _this.val()
                //                 }
                //                 dataDB.update(reMark);
                //         });
                // });

/*----------------------------------------------------------------------------------*/


                //全部中間的
                databaseAll.once('value', function(snapshot) {
                        for(var i in snapshot.val()){  
                                if(snapshot.val()[i].light == "greenLight"){
                                        $('#all_work_content').append('<div class="member_work"><div class="member_name"><select name="'+i+'" id="'+i+'"><option value="chose">選擇姓名</option><option value="Jill">Jill</option><option value="Pocky">Pocky</option><option value="Shaun">Shaun</option><option value="Peter">Peter</option><option value="Lone">Lone</option><option value="Gary">Gary</option><option value="Mars">Mars</option><option value="Joanne">Joanne</option><option value="Neil">Neil</option><option value="Ian">Ian</option><option value="Chris">Chris</option><option value="Wayne">Wayne</option></select></div><div class="work_light geryColor greenLight" data-id="'+i+'"></div><div class="work_notice"><textarea data-id="'+[i]+'">'+snapshot.val()[i].remark+'</textarea></div><div class="clear_notice" data-id="'+i+'" title="清除備註"></div></div>');
                                }
                                else{
                                        $('#all_work_content').append('<div class="member_work"><div class="member_name"><select name="'+i+'" id="'+i+'"><option value="chose">選擇姓名</option><option value="Jill">Jill</option><option value="Pocky">Pocky</option><option value="Shaun">Shaun</option><option value="Peter">Peter</option><option value="Lone">Lone</option><option value="Gary">Gary</option><option value="Mars">Mars</option><option value="Joanne">Joanne</option><option value="Neil">Neil</option><option value="Ian">Ian</option><option value="Chris">Chris</option><option value="Wayne">Wayne</option></select></div><div class="work_light geryColor" data-id="'+i+'"></div><div class="work_notice"><textarea data-id="'+[i]+'">'+snapshot.val()[i].remark+'</textarea></div><div class="clear_notice" data-id="'+i+'" title="清除備註"></div></div>');
                                }  

                                $('#all_work_content #'+i+'').find("option[value='"+snapshot.val()[i].name+"']").attr("selected",true);

                        }

                        $('#all_work_content select').change(function(){
                                
                                var _this = $(this);
                                var getDataId = _this.attr('id')
                                var dataDB = firebase.database().ref('/grouping/ALL/'+getDataId+'')
                                postName = {
                                        name: _this.val()
                                }
                                dataDB.update(postName);
                        });

                        $('#all_work_content .work_light').click(function(){
                                var _this = $(this)
                                var getDataId = _this.attr('data-id')
                                var dataDB = firebase.database().ref('/grouping/ALL/'+getDataId+'')
                                
                                if(_this.hasClass('greenLight')){
                                        postLight = {
                                                light: ""
                                        }
                                        dataDB.update(postLight);
                                        // _this.removeClass('greenLight');
                                }
                                else{
                                        postLight = {
                                                light: "greenLight"
                                        }
                                        dataDB.update(postLight);
                                        // _this.addClass('greenLight');
                                }
                        });

                        //備註各別修改
                        $('#all_work_content textarea').change(function(){
                                
                                var _this = $(this);
                                var getDataId = _this.attr('data-id');
                                var dataDB = firebase.database().ref('/grouping/ALL/'+getDataId+'');
                                reMark = {
                                        remark: _this.val()
                                }
                                dataDB.update(reMark);
                        });
                        //備註各別清除
                        $('.clear_notice').click(function(){
                                var _this = $(this);
                                var getDataId = _this.attr('data-id');
                                var dataDB = firebase.database().ref('/grouping/ALL/'+getDataId+'');
                                reMark = {
                                        remark: ""
                                }
                                dataDB.update(reMark);

                        });
                });




                //簡易登入
                $('#loginName').change(function(){
                        var catchName = $(this).val();
                        catchName = catchName[0].toUpperCase() + catchName.toLowerCase().slice(1); //首字大寫
                        $('#catchName').text(catchName);
                        $('#loginBg').css('display','none');
                        var catchDB = 0;
                        getDB.on('value', function(snapshot) {
                                for(var i in snapshot.val()){
                                        var dbName = i[0].toUpperCase() + i.toLowerCase().slice(1); //判斷資料表裡的資料 名子有開頭小寫的全部轉成大寫
                        
                                        if(dbName == catchName){
                                                catchDB = firebase.database().ref('/styleChange/'+dbName+'/');
                        
                                                catchDB.once('value',function(snapshot3){
                                                        document.documentElement.style.setProperty('--color1',snapshot3.val().colorVecation);
                                                        document.documentElement.style.setProperty('--color2',snapshot3.val().colorLight);
                                                        document.documentElement.style.setProperty('--color3',snapshot3.val().colorBg);
                                                        document.documentElement.style.setProperty('--color4',snapshot3.val().colorFont);
                                                        document.documentElement.style.setProperty('--color5',snapshot3.val().allRemark);

                                                        $('body').css('background-image', 'url(images/'+snapshot3.val().BgImg+')');
                                                });
                                        }
                                }
                        });
                });


                //Api清除
                $('.clearAllApi').click(function(){
                        postLight.light = ""
                //      postName.name = "選擇姓名"
                //      cool.lock = 'open';
                //      openCool.update(cool);

                    if(clearAllLock == true){
                        clearAllLock = false;

                        databaseApi.once('value', function(snapshot) {
                            for(var i in snapshot.val()){
                                var clearDB = firebase.database().ref('/grouping/API/'+i+'');
                                //clearDB.update(postName);
                                clearDB.update(postLight);
                            }
                        });

                        setTimeout(function(){
                            clearAllLock = true;
                        },1000);
                    }

                //     cool.lock = false;
                //     openCool.update(cool);
                });

                //Ope清除
                $('.clearAllOpe').click(function(){
                    
                        postLight.light = ""
                //      postName.name = "選擇姓名"
                //      cool.lock = 'open';
                //      openCool.update(cool);

                    if(clearAllLock == true){
                        clearAllLock = false;

                        databaseOpe.once('value', function(snapshot) {
                                for(var i in snapshot.val()){
                                        var clearDB = firebase.database().ref('/grouping/OPE/'+i+'');
                                        //clearDB.update(postName);                              
                                        clearDB.update(postLight);
                                }
                        });

                        setTimeout(function(){
                            clearAllLock = true;
                        },1000);
                    }
                //     cool.lock = false;
                //     openCool.update(cool);
                                      
                });

                // //Other清除
                // $('.clearAllOther').click(function(){
                    
                //         postLight.light = ""
                //         //postName.name = "選擇姓名"
                // //     cool.lock = 'open';
                // //     openCool.update(cool);

                //     if(clearAllLock == true){
                //         clearAllLock = false;

                //         databaseOther.once('value', function(snapshot) {
                //                 for(var i in snapshot.val()){
                //                         var clearDB = firebase.database().ref('/grouping/Other/'+i+'');
                //                         //clearDB.update(postName);                              
                //                         clearDB.update(postLight);
                //                 }
                //         });

                //         setTimeout(function(){
                //             clearAllLock = true;
                //         },1000);
                //     }
                // //     cool.lock = false;
                // //     openCool.update(cool);
                                      
                // });

                //All清除
                $('.clearAllAll').click(function(){
                        var _this = this
                        postLight.light = ""
                        //postName.name = "選擇姓名"
                //     cool.lock = 'open';
                //     openCool.update(cool);

                    if(clearAllLock == true){
                        clearAllLock = false;

                        databaseAll.once('value', function(snapshot) {
                                for(var i in snapshot.val()){
                                        var clearDB = firebase.database().ref('/grouping/ALL/'+i+'');
                                        //clearDB.update(postName);                              
                                        clearDB.update(postLight);

                                }
                        });

                        setTimeout(function(){
                            clearAllLock = true;
                        },1000);
                    }
                    
                //     cool.lock = false;
                //     openCool.update(cool);
                                      
                });
                
                 //未工作燈顏色修改
                $('#colorVecation').change(function(){
                        var newColor = $(this).val()
                        var userName = $('#catchName').text();
                        var colorChange = {
                                colorVecation: ""
                        }
                        var catchDB = 0;
                        // cool.lock = 'open';
                        // openCool.update(cool);
                        if(userName){
                                catchDB = firebase.database().ref('/styleChange/'+userName+'/');
                                document.documentElement.style.setProperty('--color1',newColor);
                                colorChange.colorVecation = newColor;
                                catchDB.update(colorChange);                      
                        }
                        else{
                                document.documentElement.style.setProperty('--color1',newColor);
                        }
                        document.documentElement.style.setProperty('--color1',newColor);
                        // cool.lock = false;
                        // openCool.update(cool);
                });
                //工作燈顏色修改
                $('#colorLight').change(function(){
                        var newColor = $(this).val();
                        var userName = $('#catchName').text();
                        var colorChange = {
                                colorLight: ""
                        }
                        var catchDB = 0;
                        // cool.lock = 'open';
                        // openCool.update(cool);
                        if(userName){
                                catchDB = firebase.database().ref('/styleChange/'+userName+'/');
                                document.documentElement.style.setProperty('--color2',newColor);
                                colorChange.colorLight = newColor;
                                catchDB.update(colorChange);                       
                        }
                        else{
                                document.documentElement.style.setProperty('--color2',newColor);
                        }
                        document.documentElement.style.setProperty('--color2',newColor);
                        // cool.lock = false;
                        // openCool.update(cool);
                });
                //工作格顏色修改
                $('#colorBg').change(function(){
                        var newColor = $(this).val();
                        var userName = $('#catchName').text();
                        var colorChange = {
                                colorBg: ""
                        }
                        var catchDB = 0;
                        // cool.lock = 'open';
                        // openCool.update(cool);
                        if(userName){
                                catchDB = firebase.database().ref('/styleChange/'+userName+'/');
                                document.documentElement.style.setProperty('--color3',newColor);
                                colorChange.colorBg = newColor;
                                catchDB.update(colorChange);                      
                        }
                        else{
                                document.documentElement.style.setProperty('--color3',newColor);
                        }
                        document.documentElement.style.setProperty('--color3',newColor);
                        // cool.lock = false;
                        // openCool.update(cool);
                });
                //文字顏色修改
                $('#colorFont').change(function(){
                        var newColor = $(this).val();
                
                        var userName = $('#catchName').text();
                        var colorChange = {
                                colorFont: ""
                        }
                        var catchDB = 0;
                        // cool.lock = 'open';
                        // openCool.update(cool);
                        if(userName){
                                catchDB = firebase.database().ref('/styleChange/'+userName+'/');
                                document.documentElement.style.setProperty('--color4',newColor);
                                colorChange.colorFont = newColor;
                                catchDB.update(colorChange);                    
                        }
                        else{
                                document.documentElement.style.setProperty('--color4',newColor);
                        }
                        document.documentElement.style.setProperty('--color4',newColor);
                        // cool.lock = false;
                        // openCool.update(cool);
                });
                //備註背景顏色修改
                $('#allRemark').change(function(){
                        var newColor = $(this).val();
                
                        var userName = $('#catchName').text();
                        var colorChange = {
                                allRemark: ""
                        }
                        var catchDB = 0;
                        // cool.lock = 'open';
                        // openCool.update(cool);
                        if(userName){
                                catchDB = firebase.database().ref('/styleChange/'+userName+'/');
                                document.documentElement.style.setProperty('--color5',newColor);
                                colorChange.allRemark = newColor;
                                catchDB.update(colorChange);                    
                        }
                        else{
                                document.documentElement.style.setProperty('--color5',newColor);
                        }
                        document.documentElement.style.setProperty('--color5',newColor);
                        // cool.lock = false;
                        // openCool.update(cool);
                });
                //背景修改
                $('#BgImg').change(function(){
                        var newBg = $(this).val();
                        var userName = $('#catchName').text();
                        var colorChange = {
                                BgImg: ""
                        }
                        var catchDB = 0;
                        // cool.lock = 'open';
                        // openCool.update(cool);
                        if(userName){
                                catchDB = firebase.database().ref('/styleChange/'+userName+'/');
                                $('body').css('background-image', 'url(images/'+newBg+')');
                                colorChange.BgImg = newBg;
                                catchDB.update(colorChange);
                        }
                        else{
                                $('body').css('background-image', 'url(images/'+newBg+')');
                        }
                
                        $('body').css('background-image', 'url(images/'+newBg+')');
                        // cool.lock = false;
                        // openCool.update(cool);
                });

        });


        //新增公告格子 -> 因為新增公告是在全域物件裡產生，所以要把動作寫在最外面
        $('#addBox').click(function(){
                // cool.lock = 'open';
                // openCool.update(cool);

                var createId = time.getTime();
                var creatAnnouncement = {
                        id: createId,
                        content: ""
                }
                database2.push(creatAnnouncement);

                // cool.lock = false;
                // openCool.update(cool);
        });

        //載入資料庫顯示公告內容，並當資料庫有變動立即刷新
        database2.on('value',function(snapshot2){
                $announcement.html('');

                for(var i in snapshot2.val()){
                    $('#announcement').append('<div id="'+i+'" class="divBox"><div class="delete" data-id="'+i+'"></div><div class="content" data-id="'+i+'">'+snapshot2.val()[i].content+'</div></div>')
                }

                //拖曳公告
                $('#announcement .divBox').click(function(){ //點擊一次 
                    var _this = $(this);
                    var divId = _this.attr('id');
                    _this.draggable({
                        cancel: '#'+divId+''
                    });                    
                });             
                $('#announcement .divBox').dblclick(function(){//點擊兩次 
                    var _this = $(this);                    
                    _this.draggable({
                        cancel: ''
                    });                    
                });
                //編輯公告
                var before ="";
                var after = "";
                $('#announcement .divBox .content').click(function(){
                    var _this = $(this);
                    _this.attr('contenteditable',true);
                    $('#announcement .divBox .delete').attr('contenteditable',false);
                    _this.focus();
                })
                $('#announcement .divBox .content').focus(function(){
                    cool.lock = 'open';
                    openCool.update(cool);

                    var _this = $(this);                    
                    before = _this.html();
                }).blur(function(){
                    var _this = $(this);
                    var dataId = _this.attr('data-id');
                    after = _this.html();
                    if(before != after){
                        // after = after.replace(/<[^>]+>/g,""); //拔掉html格式
                        database2.child(''+dataId+'').update({content: after});
                    }
                    _this.attr('contenteditable',false);

                    cool.lock = false;
                    openCool.update(cool);
                });
                //刪除公告
                $('#announcement .divBox .delete').click(function(){
                    var _this = $(this)
                    var dataId = _this.attr('data-id');
                    cool.lock = 'open';
                    openCool.update(cool);
                    $('#announcement .divBox').attr('contenteditable',false);

                    if(confirm('請問確定要刪除此公告嗎?')){
                        $('#'+dataId+'').remove();
                        database2.child(''+dataId+'').remove();
                    }
                    cool.lock = false;
                    openCool.update(cool);
                });
        });
});