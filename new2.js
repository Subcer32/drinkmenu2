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

        var $showtext = $('#showtext');
        var $count_money_all =  $('#showtext_all_count .count_money_all .moneyGO');
        var $count_items = $('#showtext_all_count .count_items .itemsGO');
        var $count_all_items = $('#showtext_all_count .count_all_items');
        $announcement = $('#announcement'),
        time = new Date(), //抓取現在時間
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
        // var ccc =  setInterval(function(){
        //         var cooltime = new Date();
        //         var HH = cooltime.getHours();
        //         var MM = cooltime.getMinutes();
        //         var SS = cooltime.getSeconds();
        //         var allclock = HH+':'+MM+':'+SS;

        //         if(HH >= 17 && MM >= 0 && SS >= 1){
        //                 clearTimeout(ccc);
        //         }
        //         else{
        //                 timeCheck(allclock);
        //         }

        // },1000);

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

        var name = '';
        var items = '';
        var sugar = '';
        var ice = '';
        var feed = '';
        var money = 0;
        var remark = '';
        var config = {
                databaseURL: "https://drink-cool-default-rtdb.firebaseio.com/"
        };
        firebase.initializeApp(config);
        var database = firebase.database();
        var databaseItems = firebase.database().ref('/items');

        //載入資料庫時顯示所有內容，並當資料庫有變動立即刷新
        databaseItems.on('value', function(snapshot) {
                // $showtext.html('<div class="morning_shift"><div id="api" class="work_box"><div class="buttonAreaApi"><div class="clearAllApi"><img src="images/trash.png" width="36px" height="36px" alt="" srcset=""></div></div><div class="mark">i<p class="allRemark">1. OPE<br>2. fastpb<br>3. acecric<br>4. 鬥牛直播<br>5. YOLO<br>6. Egame<br>7. BoTV <br>8. 印度彩票<br>9. RG棋牌<br>10. Grafana(HBO模板、SSC、HJ 、Mabu、YD)</p></div><h1>代理/包網&遊戲</h1></div><div id="all_work" class="work_box"><div class="buttonAreaAll"><div class="clearAllAll"><img src="images/trash.png" width="36px" height="36px" alt="" srcset=""></div></div><div class="mark">i<p class="allRemark">1. 全部產品<br>2. 平日中班 18:00後<br>3. 非平日早中班</p></div><h1>ALL</h1></div><div id="ope" class="work_box"><div class="buttonAreaOpe"><div class="clearAllOpe"><img src="images/trash.png" width="36px" height="36px" alt="" srcset=""></div></div><div class="mark">i<p class="allRemark">1. Fastapi<br>2. GSC<br>3. 舊API<br>4. Grafana(CY)</p></div><h1>API</h1></div></div>');
                $showtext.html('');
                // console.log(snapshot.val());
                for(var i in snapshot.val()){
                        $showtext.prepend('<div id="'+i+'" class="items_box_box"><div class="style_name">'+snapshot.val()[i].name+'</div><div class="style_items">'+snapshot.val()[i].items+'</div><div class="style_sugar">'+snapshot.val()[i].sugar+'</div><div class="style_ice">'+snapshot.val()[i].ice+'</div><div class="style_feed">'+snapshot.val()[i].feed+'</div><div class="style_money">'+snapshot.val()[i].money+'</div><div class="style_remark">'+snapshot.val()[i].remark+'</div><div id="'+i+'" class="delete_item" title="刪除"></div></div>');
                }

                $('.delete_item').click(function(){
                        var _this = $(this);
                        
                        var catch_id = _this.attr('id');
                        
                        // console.log(catch_id);
                        if(confirm('請問確定要刪除品項嗎?')){
                                databaseItems.child(''+catch_id+'').remove();
                        }

                });
                $('.items_box_box').click(function(){
                        var _this = $(this);
                        var first = $(this).find('.class');
                        var catch_id = _this.attr('class');
                        
                        if(_this.hasClass('change_color')){
                                _this.removeClass('change_color');
                                first.removeClass('check_active');
                        
                        }
                        else{
                                _this.addClass('change_color');
                                first.addClass('check_active');
                        }
                        console.log(catch_id);
                });

                $('.delete_all').click(function(){
                        if(confirm('請問確定要全部刪除嗎?')){
                                database.ref('/items/').remove();
                                window.location.reload();
                        }
                });
        });

        databaseItems.on('value', function(snapshot) {
                // $showtext.html('<div class="morning_shift"><div id="api" class="work_box"><div class="buttonAreaApi"><div class="clearAllApi"><img src="images/trash.png" width="36px" height="36px" alt="" srcset=""></div></div><div class="mark">i<p class="allRemark">1. OPE<br>2. fastpb<br>3. acecric<br>4. 鬥牛直播<br>5. YOLO<br>6. Egame<br>7. BoTV <br>8. 印度彩票<br>9. RG棋牌<br>10. Grafana(HBO模板、SSC、HJ 、Mabu、YD)</p></div><h1>代理/包網&遊戲</h1></div><div id="all_work" class="work_box"><div class="buttonAreaAll"><div class="clearAllAll"><img src="images/trash.png" width="36px" height="36px" alt="" srcset=""></div></div><div class="mark">i<p class="allRemark">1. 全部產品<br>2. 平日中班 18:00後<br>3. 非平日早中班</p></div><h1>ALL</h1></div><div id="ope" class="work_box"><div class="buttonAreaOpe"><div class="clearAllOpe"><img src="images/trash.png" width="36px" height="36px" alt="" srcset=""></div></div><div class="mark">i<p class="allRemark">1. Fastapi<br>2. GSC<br>3. 舊API<br>4. Grafana(CY)</p></div><h1>API</h1></div></div>');
                $count_money_all.html('');
                $count_all_items.html('');
                var area_count=[];
                var count_i = 0;
                var total_money =0;

                var area_items = [];
                var total_items = [];
                // console.log(snapshot.val());
                for(var i in snapshot.val()){
                        area_count[count_i] = snapshot.val()[i].money;
                        area_items[count_i] = snapshot.val()[i].items+snapshot.val()[i].sugar+snapshot.val()[i].ice+snapshot.val()[i].feed;
                        count_i++;
                }
                console.log(area_items);
                for(var i=0; i < count_i ;i++){
                        total_money = parseInt(total_money) + parseInt(area_count[i]);
                }
                total_items = area_items.reduce((obj,item)=>{
                        if (item in obj) {
                                obj[item]++
                        }
                        else {
                                obj[item] = 1
                        }
                        return obj
                },{});
                
                for (const [key, val] of Object.entries(total_items)) {
                        $count_all_items.prepend('<div class="goods"><div class="item_name">'+key+'</div><div class="item_count">'+val+'</div></div>');
                }
                
                console.log(total_items);
                $count_items.html(count_i);
                $count_money_all.html(total_money);
        });

        $('.write_box_add').click(function(){
                var result = confirm('你確定要送出嗎?')
                if(result){
                        name = $('#name').val();
                        items = $('#items').val();
                        sugar = $('#sugar').val();
                        ice = $('#ice').val();
                        feed = $('#feed').val();
                        money = $('#money').val();
                        remark = $('#remark').val();
                
                        console.log(name + '|' + items + '|' + sugar + '|' + ice + '|' + feed + '|' + money + '|' + remark);
                        var postData = {
                                name: name,
                                items: items,
                                sugar: sugar,
                                ice: ice,
                                feed: feed,
                                money: money,
                                remark: remark
                        };
                        databaseItems.push(postData); //寫入資料
                }
                else{

                }
                
        });


});