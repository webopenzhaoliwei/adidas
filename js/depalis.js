class delpalis {
    constructor() {
        this.list();
        this.dzid = location.search.split('=')[1] //获取地址栏id
        console.log(this.dzid);
        this.del()
    }

    /**********获取数据渲染列表*****************/
    list() {
        // 通过ajax获取数据库数据 取出图片并渲染列表
        ajax.get('./server/goods.php', {
            fn: "lst"
        }).then(res => {
            var {
                stateCode,
                data
            } = JSON.parse(res);
            if (stateCode == 200) {
                console.log(data[this.dzid]);
                var str = "";
                var str1 = "";
                var str2 = "";
                str += `<div><img src="${data[this.dzid].goodsImg}" width="350"></div>`
                str1 += `<div><img src="${data[this.dzid].goodsImg}" width="800" class="imgs"></div>`
                str2 += `<div><img src="${data[this.dzid].goodsImg}"  width="60" height="60" ></div>`
                $('.t1').innerHTML = str;
                $('.lbig').innerHTML = str1;
                all('.dqtp').forEach(ele=>{
                    ele.innerHTML = str2;
                })
                

            }
        })
    }
    /******************放大镜方法************************/
    del() {
        // 鼠标移入到小模块时图片的显示与隐藏
        $('.lsmall').onmouseenter = function () {
            delpalis.yr()
            $('.gwcz').style.display='none'
        }
        $('.lsmall').onmouseleave = function () {
            delpalis.yc()
            $('.gwcz').style.display='block'
        }
        // 添加小图div移动事件  计算鼠标位置
        $('.lsmall').onmousemove = function (eve) {

            delpalis.yd()
        }

    }
    // 鼠标移入显示
    static yr() {
        $('.mask').style.display = 'block'
        $('.lbig').style.display = 'block'
    }
    //鼠标移入隐藏
    static yc() {
        $('.mask').style.display = 'none'
        $('.lbig').style.display = 'none'
    }
    // 控制鼠标位置
    static yd(eve) {
        var e = eve || window.event;
        //获取鼠标相对于文档的位置
        var pagex = e.pageX;
        var pagey = e.pageY;
        var lsmallx = $('.loupe').offsetLeft; //小图div到左边的距离
        var lsmally = $('.loupe').offsetTop;
        console.log(lsmallx);
        //获取鼠标位置=鼠标对于文档的位置-小图div的offsetleft-移动模块的半径
        var maskw = ($('.mask').offsetWidth) / 2
        var maskh = ($('.mask').offsetHeight) / 2
        console.log(maskw);
        // 让昂运动模块不能出去父元素的边框
        var targetx = pagex - lsmallx - maskw;
        var targety = pagey - lsmally - maskh;

        //让模块不出左上边框
        if (targetx < 0) {
            targetx = 0
        }
        if (targety < 0) {
            targety = 0
        }
        //让模块不出右下边框 获取右下边框的距离
        var tmpx = $('.lsmall').offsetWidth - $('.mask').offsetWidth;
        var tmpy = $('.lsmall').offsetHeight -$('.mask').offsetHeight;
        if (targetx > tmpx) targetx = tmpx;
        if (targety > tmpy) targety = tmpy;
     
        // 加载进页面
        $('.mask').style.left = targetx + 'px';
        $('.mask').style.top = targety + 'px';
         //img移动的距离 = mask移动的距离 / mask移动的最大距离 * img移动的最大距离

        var tarbetdx=$('.imgs').offsetWidth-$('.lbig').offsetWidth;//大图减去大图div的宽度
        var tarbetdy=$('.imgs').offsetHeight-$('.lbig').offsetHeight;
        console.log(tarbetdx);
        var tmpbx=targetx/tmpx*tarbetdx;
        var tmpby=targety/tmpy*tarbetdy;

        $('.imgs').style.left=-tmpbx+'px';
       $('.imgs').style.top=-tmpby+'px';

    }
}
new delpalis;