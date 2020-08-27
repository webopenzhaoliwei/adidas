class delpalis {
    constructor() {
        this.list();
        this.dzid = location.search.split('=')[1] //获取地址栏id
        // console.log(this.dzid);
        this.del()
    }

    /**********获取数据渲染列表*****************/
    list() {
        // 通过ajax获取数据库数据 取出图片并渲染列表
        ajax.get('./server/goods.php', {
            fn: "lstr"
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
                str2 += `<div><img src="./img/ljz.jpg" data-src="${data[this.dzid].goodsImg}"  width="60" height="60" class="icon"></div>`
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
        // console.log(lsmallx);
        //获取鼠标位置=鼠标对于文档的位置-小图div的offsetleft-移动模块的半径
        var maskw = ($('.mask').offsetWidth) / 2
        var maskh = ($('.mask').offsetHeight) / 2
        console.log(maskw);
        // console.log('111');
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
        // console.log(tarbetdx);
        var tmpbx=targetx/tmpx*tarbetdx;
        var tmpby=targety/tmpy*tarbetdy;

        $('.imgs').style.left=-tmpbx+'px';
       $('.imgs').style.top=-tmpby+'px';

    }
}
new delpalis;


// 懒加载
// onload是等所有的资源文件加载完毕以后再绑定事件
window.onload = function(){
	// 获取图片列表，即img标签列表
	var imgs =  document.getElementsByClassName('icon')
    // console.log(imgs);
	// 获取到浏览器顶部的距离
	function getTop(e){
		return e.offsetTop;
	}

	// 懒加载实现
	function lazyload(imgs){
		// 可视区域高度
		var h = window.innerHeight;
		//滚动区域高度
		var s = document.documentElement.scrollTop || document.body.scrollTop;
		for(var i=0;i<imgs.length;i++){
			//图片距离顶部的距离大于可视区域和滚动区域之和时懒加载
			if ((h+s)>getTop(imgs[i])) {
                console.log('11');
				// 真实情况是页面开始有2秒空白，所以使用setTimeout定时2s
				(function(i){
					setTimeout(function(){
						// 不加立即执行函数i会等于9
						// 隐形加载图片或其他资源，
						//创建一个临时图片，这个图片在内存中不会到页面上去。实现隐形加载
						var temp = new Image();
						temp.src = imgs[i].getAttribute('data-src');//只会请求一次
						// onload判断图片加载完毕，真是图片加载完毕，再赋值给dom节点
						temp.onload = function(){
							// 获取自定义属性data-src，用真图片替换假图片
                            imgs[i].src = imgs[i].getAttribute('data-src')
                            // console.log(imgs[i].getAttribute('data-src'));
                            // console.log(imgs[i].src);
						}
					},1000)
				})(i)
			}
		}
	}
	lazyload(imgs);

	// 滚屏函数
	window.onscroll =function(){
		lazyload(imgs);
	}
}