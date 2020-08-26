class Goods {
    constructor() {
        //调用商品列表
        this.list()
        //给登录退出添加点击事件
       
    }
    /***********商品列表追加到html中**************/
    list() {
        //1发送ajax请求  获取goods.php中文件的lst
        ajax.get('./server/goods.php', {
            fn: 'lst'
        }).then(res => {
            console.log(res);
            //1.2将状态与数据装换为json格式
            var {
                stateCode,
                data
            } = JSON.parse(res);
            //3判断状态为200时拿到data
            if (stateCode == 200) {
                //4循环遍历  拼接追加
                var str = '';
                data.forEach(ele => {
                    str += `<div class="goodsCon"><a target = "_blank" >
                <img src="./img/ljz.jpg" data-src="${ele.goodsImg}"  class="icon"><h4 class="title">${ele.goodsName}</h4>
                <div class="info">限时抢购200条</div></a><div class="priceCon">
                <span class="price">￥${ele.price}</span>
                <span class="oldPrice">￥${(ele.price * 1.2).toFixed(2)}</span>
                 <div><span class="soldText">已售${ele.num}%</span>
                <span class="soldSpan"><span style="width: 87.12px;">
                </span></span></div>
               
                <a  href="./depalis.html?id=${ele.id}" class="button" target="_self" onclick="Goods.addCart(${ele.id},1)" >立即抢购</a></div></div >`;

                });
                $('.divs').innerHTML = str;
            }

        })

    }

    /**************将数据加入购物车********************/
    static addCart(goodsId,goodsNum) {
        //1判断当前用户是否登录过
        if(localStorage.getItem('user')){ //2登录则存入数据库
            // 调用静态放法将写好的setDateBase存进来
            Goods.setDateBase(goodsId,goodsNum)
        }else{
            //3没有登录则加入浏览器中
            Goods.setLocal(goodsId,goodsNum)
        }



    }

    /**********将商品存入数据库*****************/
    static setDateBase(goodsId,goodsNum){
        //获取当前用户id
        var userId=localStorage.getItem('userId')
        //发送ajax进行储存
        ajax.post('./server/goods.php?fn=add',{userId:userId,gId:goodsId,gNum:goodsNum}).then(res=>{
            console.log(res);
            console.log(userId);
        })

    }

    /***************将商品存入浏览器******************/
    static setLocal(goodsId,goodsNum){
        //1获取当前商品
        var carts=localStorage.getItem('carts')
        //判断是否有数据   如果有判断当前商品是否存在  
        if(carts){
            console.log(carts);
            //转化为对象
            carts=JSON.parse(carts)
            //判断当前商品是否存在  存在则增加
            for(var  gId in carts){
                if(gId==goodsId){
                    goodsNum=carts[gId] - 0 +goodsNum
                }
            }
            //不存在就新增  存在就重新给数量
            carts[goodsId]=goodsNum;
            // console.log(carts);
            // console.log(goodsNum);
            // console.log(  carts[goodsId]);
            //进行储存  储存在浏览器中
            localStorage.setItem('carts',JSON.stringify(carts));
        }else{//不存在则进行增加储存
            // 将商品id与数量储存
            var goodsCart={[goodsId]:[goodsNum]}
            //转化为json 格式在用localhost储存
            goodsCart=JSON.stringify(goodsCart);
            localStorage.setItem('carts',goodsCart)
        }
    }


    /*********登录的方法**********/
    login(){
     //1发送ajax请求进行账号密码验证
     //2验证成功则登录 将账号密码保存
     localStorage.setItem('user','zhaoyan')//用localstorsga储存
     localStorage.setItem('userId','1')
    }
    /************账号退出的方法*************/
    exit(){
        localStorage.removeItem('user')
        localStorage.removeItem('userId')
    }

}



new Goods;



// 懒加载
// onload是等所有的资源文件加载完毕以后再绑定事件
window.onload = function(){
	// 获取图片列表，即img标签列表
	var imgs = document.getElementsByClassName('icon')
    console.log(imgs);
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
						}
					},2000)
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
