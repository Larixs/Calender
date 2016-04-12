
(function() {

    function getAllDateInfo(Z)//输入一个日期，获得该日期的公历、农历、干支年、生肖等等信息
    {
        var lunarPara = [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42416, 83315, 21168, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46752, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19415, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448, 84835];//计算农历使用的参数
        var sTermPara = [0, 21208, 43467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];//计算二十四节气使用的参数

        var tGan = "甲乙丙丁戊己庚辛壬癸";//天干
        var dZhi = "子丑寅卯辰巳午未申酉戌亥";//地支
        var zodiac = "鼠牛虎兔龙蛇马羊猴鸡狗猪";//生肖
        var sTermName = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"];//节气
        var str1 = "日一二三四五六七八九十";
        var str2 = "初十廿卅";
        var lunarMon = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "腊"];//农历月份
        var sFestivalName = {"1.1": "元旦节", "2.14": "情人节", "3.5": "雷锋日", "3.8": "妇女节", "3.12": "植树节", "4.1": "愚人节", "5.1": "劳动节", "5.4": "青年节", "6.1": "儿童节","8.1": "建军节", "8.8": "父亲节", "9.10": "教师节", "10.1": "国庆节",  "12.24": "平安夜", "12.25": "圣诞节"};//阳历节日
        var lFestivalName = {"1.1": "春节", "1.15": "元宵节", "5.5": "端午节", "7.7": "七夕节", "7.15": "中元节", "8.15": "中秋节", "9.9": "重阳节", "12.8": "腊八节"};//阴历假日
        function getInfo(Z) //获得并计算出给定日期的所有信息
        {

            function leapMonth(year)//公历y年的农历时间闰哪个月 1-12 , 没闰传回 0
            {return (lunarPara[year - 1900] & 0xf)}
            function leapDays(year)//公历y年的农历闰月的天数
            {if (leapMonth(year))  return ((lunarPara[year - 1900] & 0x10000) ? 30 : 29);
                else return (0);
            }
            function lYearDays(year) //公历第y年农历总天数
            {
                var k, sum = 348;
                for (k = 0x8000; k > 0x8; k >>= 1) sum += (lunarPara[year - 1900] & k) ? 1 : 0;
                return (sum + leapDays(year));
            }

            function sTerm(year, month, day) //计算节气
            {
                this.sTerm="st";
                var n = (month - 1) * 2;//测试是否为当月第一个节气
                var offDate = new Date(( 31556925974.7 * (year - 1900) + sTermPara[n] * 60000 ) + Date.UTC(1900, 0, 6, 2, 5));
                if (offDate.getUTCDate() == day)
                    this.sTerm = sTermName[n];
                else {
                    n++;//测试是否为当月第二个节气
                    offDate = new Date(( 31556925974.7 * (year - 1900) + sTermPara[n] * 60000 ) + Date.UTC(1900, 0, 6, 2, 5));
                    if (offDate.getUTCDate() == day)
                        this.sTerm = sTermName[n];
                }
            }
            function monthDays(year, month) //农历y年第m月的当月总天数
            {
                return ( (lunarPara[year - 1900] & (0x10000 >> month)) ? 30 : 29 )
            }

            function getLunar(aDate)
            {
                var i,tmp =0;
                var baseDate=new Date(1900, 0, 31);
                var offsetdays=(aDate - baseDate) / 86400000;//偏移的天数
                this.dayCyl=Math.floor(offsetdays+40);
                for (i= 1900; i<2101;i++) {
                    tmp=lYearDays(i);
                    offsetdays-=tmp;
                    if (offsetdays<=0) {
                        offsetdays+=tmp;
                        break;
                    }
                }
                this.year = i;//i就是年份
                this.yearCyl = i - 1864;//甲子年轮回（60年一轮回，1864是一个甲子年）
                leapmonth = leapMonth(i);
                this.isLeapMonth = false;

                for (i = 1; i < 13 && offsetdays > 0; i++) {
                    tmp = monthDays(this.year, i);
                    offsetdays -= tmp;
                    this.isLeapMonth = false;
                    if (leapmonth > 0 && offsetdays > 0 && i == leapmonth) {//减去闰月天数
                        tmp = leapDays(this.year);
                        offsetdays -= tmp;
                        this.isLeapMonth = true;
                    }
                }
                if (offsetdays == 0) {//offsetdays==0表示是下月1号，这个要注意下
                    if (this.isLeapMonth) {
                        this.isLeapMonth = false;
                    }
                    else {
                        if (i == leapmonth + 1) {
                            this.isLeapMonth = true;
                            i--;
                        }
                        if (i == 13)
                            i = 1;
                    }
                }
                if (offsetdays < 0) {
                    offsetdays += tmp;
                    i--
                }
                this.month = i;
                this.day = offsetdays + 1;
            }

            function getGanZhiMonth(solarYear,lunarMonth)
            {
                var year=solarYear%10;//取尾数,方法来源自百度百科干支纪年法的方法三
                if(year<4)
                    year+=10;
                var yearGan=year-3;
                var monthGan=yearGan*2+lunarMonth;
                monthGan%=10;
                if(monthGan==0)
                    monthGan=10;
                monthGan--;
                this.ganzhiMonth=tGan[monthGan]+dZhi[(lunarMonth+1)%12];
            }
            function getGanZhi(i)//干支时间,年月日均可使用
            {
                return (tGan[i % 10] + dZhi[i % 12]);
            }

            function getSolar(aDate) //获得公历日期
            {
                this.solarYear = aDate.getFullYear();
                this.solarMonth = aDate.getMonth() + 1;
                this.solarDay = aDate.getDate();
                this.weekday = aDate.getDay();
            }

            function lunarFestival(year, month, day,isLeapMonth)//计算农历节日
            {
                this.lFestival="lf";
                if(!isLeapMonth) {//闰月的节日不能算
                    if (lFestivalName[month + "." + day] != undefined)
                        this.lFestival = lFestivalName[month + "." + day];
                    if (month == 12 && day == monthDays(year, 12))
                        this.lFestival = "除夕";//除夕比较特殊，是在十二月的最后一天，但十二月的总天数不是一个常数
                }
            }

            function solarFestival(month, day)//计算公历节日
            {
                this.sFestival="sf";
                if (sFestivalName[month + "." + day] != undefined)
                    this.sFestival = sFestivalName[month + "." + day];
            }

            function getCellLocation(day,weekday)//获得该日在日历中第row行第column列的位置
            {//星期按照一二三四五六日的顺序显示
                var tmpWeekday=(weekday==0)?7:weekday;
                var i=day%7;
                this.column=tmpWeekday-1;
                this.row=(tmpWeekday<i)?Math.ceil(day/7):Math.floor(day/7);
                if(i==0&&weekday==0)
                    this.row--;
            }

            function LunarInChinese(month,day) {

                var first = Math.floor(day / 10);
                var second = day % 10;
                this.lunarMonthInCh = lunarMon[month - 1];
                this.lunarDayInCh = ((day == 10)?"初十":(str2[first]+str1[second]));
            }

            var Y = new getLunar(Z);
            this.lunarYear = Y.year;
            this.lunarMonth = Y.month;
            this.lunarDay = Y.day;
            this.isLeapMonth = Y.isLeapMonth;
            this.animal = zodiac[(Y.year - 4) % 12];
            this.ganzhiYear = getGanZhi(Y.yearCyl);
            this.ganzhiDay = getGanZhi(Y.dayCyl);

            Y = new getSolar(Z);
            this.solarYear = Y.solarYear;
            this.solarMonth = Y.solarMonth;
            this.solarDay = Y.solarDay;
            this.weekday = Y.weekday;

            Y=new getGanZhiMonth(this.solarYear,this.lunarMonth);
            this.ganzhiMonth = Y.ganzhiMonth;

            Y = new sTerm(this.solarYear, this.solarMonth, this.solarDay);
            this.sTerm = Y.sTerm;

            Y = new lunarFestival(this.lunarYear, this.lunarMonth, this.lunarDay,this.isLeapMonth);
            this.lFestival = Y.lFestival;
            Y = new solarFestival(this.solarMonth, this.solarDay);
            this.sFestival = Y.sFestival;

            Y=new getCellLocation(this.solarDay,this.weekday);
            this.column= Y.column;
            this.row= Y.row;

            Y=new LunarInChinese(this.lunarMonth,this.lunarDay);
            this.lunarDayInCh= Y.lunarDayInCh;
            this.lunarMonthInCh= Y.lunarMonthInCh;
        }

        var ZZ = new getInfo(Z);
        return ZZ;

    }
    function init()//页面初始化，显示当天的内容，并为年月选项的onchange事件绑定函数
    {
        var aDate=new getAllDateInfo(new Date(now.getFullYear(),now.getMonth(),now.getDate()));
        showMonth = now.getMonth();
        showMonth++;
        showYear = now.getFullYear();
        showDay=now.getDate();
        var fragment = document.createDocumentFragment();
        for (var i = 1901; i < 2100; i++) {
            var option = document.createElement("option");
            option.value = i;
            option.innerHTML = i;
            if (i == showYear)
                option.selected = "selected";
            fragment.appendChild(option);
        }
        selectYM[0].appendChild(fragment);
        for (var i = 1; i < 13; i++) {
            var option = document.createElement("option");
            option.value = i;
            option.innerHTML = i;
            if (i == showMonth)
                option.selected = "selected";
            fragment.appendChild(option);
        }

        selectYM[1].appendChild(fragment);//创建年、月选项表里的选项
        selectYM[0].onchange = change;//绑定change
        selectYM[1].onchange = change;

        //展示今天的详情
        createDaySelect();
        details(aDate);
        show();//展示日历主体
    }
    function show()//展示日历主体部分
    {

        function showInCell(aDate)//在小格里显示，上半格显示公历日期，下半格显示公历节日、农历节日、节气、日期，优先级从左往右依次降低,并且为每个小格绑定点击事件和onmouseover事件
        {
            var cell=document.createElement("div");
            cell.className="cell";//cell的样式在html文件里有写，包括宽高，定位，文字等等
            cell.style.left=aDate.column*60+"px";
            cell.style.top=aDate.row*45+10+"px";
            function showDetails(){
                details(aDate);
            }
            cell.onclick=showDetails;
            cell.onmouseover=function(){
                cell.style.border="solid 2px #DD686B";
                cell.style.borderRadius="9px";
            };
            cell.onmouseout=function(){
                cell.style.border="";
                cell.style.borderRadius="";
            }

            var solarPart=document.createElement("div");
            var lunarPart=document.createElement("div");
            solarPart.className="solar";
            solarPart.innerHTML=aDate.solarDay;
            solarPart.style.color=(aDate.weekday==0||aDate.weekday==6)?"#FA5653":"#302C29";
            lunarPart.className="lunar";
            lunarPart.style.color="#AD6675";
            lunarPart.style.fontWeight="bold";
            if(aDate.sFestival!="sf")
            {lunarPart.innerHTML=aDate.sFestival;lunarPart.style.color="#FA5653";
            }
            else if(aDate.lFestival!="lf")
            {lunarPart.innerHTML=aDate.lFestival;lunarPart.style.color="#FA5653";}
            else if(aDate.sTerm!="st")
            {lunarPart.innerHTML=aDate.sTerm;lunarPart.style.color="#75C2FF";}
            else
            {lunarPart.innerHTML=aDate.lunarDayInCh;lunarPart.style.fontWeight="normal";}
            //判断是否是今天
            if(aDate.solarYear==now.getFullYear()&&aDate.solarMonth==(now.getMonth()+1)&&aDate.solarDay==now.getDate())
            {
                cell.style.backgroundColor="#C2E2FA";
                cell.style.borderRadius="9px";
            }
            cell.appendChild(solarPart);
            cell.appendChild(lunarPart);
            fragment.appendChild(cell);
        }


        var monthDays=[0,32,0,32,31,32,31,32,32,31,32,31,32];//方便for循环，每个月的天数都加了1
        var num=(showMonth==2)?(((showYear%400==0)||((showYear%100!=0)&&(showYear%4==0)))?30:29):monthDays[showMonth];
        var fragment=document.createDocumentFragment();
        for(var day=1;day<num;day++)
        {
            var showDay=new getAllDateInfo(new Date(showYear,showMonth-1,day));
            showInCell(showDay);//将每一格内的日期创建好,并绑定展示函数，单击即展示详细内容，鼠标划过的时候有方框移动
        }

        cbody=document.getElementById("calendarBody");
        cbody.innerHTML="";//先清空
        cbody.appendChild(fragment);//所有日期一次性加入
        cbody.style.height=(showDay.row+1)*45+20+"px";

    }
    function change()//当年月选项改变时，获得其改变后的值，并展示当月日历主体部分
    {
        function getSelect() {
            var indexOfYear = selectYM[0].selectedIndex;
            var indexOfMon = selectYM[1].selectedIndex;
            showYear = selectYM[0].options[indexOfYear].value;
            showMonth = selectYM[1].options[indexOfMon].value;
        }
        showDay=1;
        getSelect();
        show();
        createDaySelect();//改变日选项的总天数
        var aDate=getAllDateInfo(new Date(showYear,showMonth-1,1));//设置每月一号为默认展示内容
        details(aDate);
    }
    function details(aDate)//展示所点击日期的详细情况
    {
        var str1 = "日一二三四五六";
        document.getElementById("animal").innerHTML=aDate.animal;
        document.getElementById("solarStr").innerHTML=aDate.solarYear+"年"+aDate.solarMonth+"月"+aDate.solarDay+"日"+"  "+"星期"+str1[aDate.weekday];
        document.getElementById("solarDay").innerHTML=aDate.solarDay;
        document.getElementById("lunarStr").innerHTML=aDate.lunarMonthInCh+"月"+aDate.lunarDayInCh;
        document.getElementById("ganZhiYear").innerHTML=aDate.ganzhiYear+"年";
        document.getElementById("ganZhiStr").innerHTML=aDate.ganzhiMonth+"月"+"  "+aDate.ganzhiDay+"日";
        var festival=document.getElementById("festival");
        festival.innerHTML="";
        if(aDate.sFestival!="sf")
        {
            festival.innerHTML=aDate.sFestival;festival.style.color="#FA6857";
        }
        else if(aDate.lFestival!="lf")
        {
            festival.innerHTML=aDate.lFestival;festival.style.color="#FA6857";}
        else if(aDate.sTerm!="st")
        {
            festival.innerHTML=aDate.sTerm;festival.style.color="#BDD1FA";}

    }
    function createDaySelect()//为不同的月份创建不同的日选项
    {
        function dayChange(){
            var indexOfDay = selectYM[2].selectedIndex;
            showDay = selectYM[2].options[indexOfDay].value;
            var aDate=getAllDateInfo(new Date(showYear,showMonth-1,showDay));
            details(aDate);
        }
        var fragment = document.createDocumentFragment();
        var monthDays=[0,32,0,32,31,32,31,32,32,31,32,31,32];//方便for循环，每个月的天数都加了1
        var num=(showMonth==2)?(((showYear%400==0)||((showYear%100!=0)&&(showYear%4==0)))?30:29):monthDays[showMonth];
        selectYM[2].innerHTML="";
        for (var i = 1; i < num; i++) {
            var option = document.createElement("option");
            option.value = i;
            option.innerHTML = i;
            if (i == showDay)
                option.selected = "selected";
            fragment.appendChild(option);
        }

        selectYM[2].appendChild(fragment);//创建年、月选项表里的选项
        selectYM[2].onchange=dayChange;
    }
    function backToToday()//回到今天按钮
    {
        //修改日历主体
        showMonth = now.getMonth();
        showMonth++;
        showYear = now.getFullYear();
        show();
        //修改select框
        selectYM[0].selectedIndex=(showYear-1901);
        selectYM[1].selectedIndex=now.getMonth();
        selectYM[2].selectedIndex=now.getDate()-1;
        //展示今天的详细信息
        var aDate=new getAllDateInfo(new Date(now.getFullYear(),now.getMonth(),now.getDate()));
        details(aDate);


    }

        var now = new Date();
        var selectYM = document.getElementsByTagName("select");
        var showYear,showMonth,showDay;//需要展示的日期
        document.getElementById("backToToday").onclick=backToToday;
        init();
})();
