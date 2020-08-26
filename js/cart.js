/**********购物车***************/
class Cart {
    constructor() {
        this.list()
        //全选添加点击事件
        all('.check-all')[0].addEventListener('click', this.checkAll) //上面的复选框
        all('.check-all')[1].addEventListener('click', this.checkAll) //下面的复选框
    }
    //购物车列表
    list() {
        //获取登录信息
        var userId = localStorage.getItem('userId');
        // console.log(userId);
        var cartGoodsId = '';
        if (userId) { //判断是否登录过
            // console.log('123');
            //如果是登录状态获取数据库中商品的id
            ajax.get('./server/cart.php', {
                fn: 'getGoodsId',
                userId: userId
            }).then(res => {
                console.log(res);
                let {
                    data,
                    stateCode
                } = JSON.parse(res); //转化为对象
                console.log(data);
                //判断状态为200
                if (stateCode == 200) {
                    //当数据库为空时停止
                    if (!data) return;
                    // 将商品id数量保存起来  对象方式
                    var cartIdNum = {};
                    data.forEach(elem => {
                        cartGoodsId += elem.productId + ','
                        console.log(cartGoodsId);
                        cartIdNum[elem.productId] = elem.num;

                    });
                    //根据id获取内容
                    console.log(cartGoodsId, cartIdNum);
                    Cart.getCartGoods(cartGoodsId, cartIdNum);
                }
            });
        } else { //如果不是登录状态上浏览器中获取数据
            //当未登录时候去浏览器获取信息
            var cartGoods = localStorage.getItem('carts');
            //当为空时停止
            if (!cartGoods) return;
            cartGoods = JSON.parse(cartGoods);
            //把数据便利出来
            for (var gId in cartGoods) {
                cartGoodsId += gId + ','
            }
            Cart.getCartGoods(cartGoodsId);
        }

    }

    //根据获取到商品id,去获取商品数据  商品id  商品数量
    static getCartGoods(gId, cartIds = '') {
        console.log(gId);
        //当登录时去数据库获取   未登录时去浏览器获取
        cartIds = cartIds || JSON.parse(localStorage.getItem('carts'))
        console.log(cartIds);
        // 发送ajax请求去获取数据
        ajax.post('./server/cart.php?fn=lst', {
            goodsId: gId
        }).then(res => {
            console.log(res);
            var {
                data,
                stateCode
            } = JSON.parse(res);
            if (stateCode == 200) {
                var str = '';
                data.forEach(ele => {

                    str += `<tr>
          <td class="checkbox"><input class="check-one check" type="checkbox"/ onclick="Cart.goodsCheck(this)"></td>
          <td class="goods"><img src="${ele.goodsImg}" alt=""/><span>${ele.goodsName}</span></td>
          <td class="price">${ele.price}</td>
          <td class="count">
              <span class="reduce">-</span>
              <input class="count-input" type="text" value="${cartIds[ele.id]}"/>
              <span class="add" onclick="Cart.addGoodsNum(this,${ele.id})">+</span></td>
          <td class="subtotal">${(ele.price * cartIds[ele.id]).toFixed(2)}</td>
          <td class="operation"><span class="delete" onclick='Cart.delGoods(this,${ele.id})'>删除</span></td>
      </tr>`
                })
                $('tbody').innerHTML = str;
            }


        })
    }
    /***************全选的方法*********************/
    checkAll() {
        console.log(this);
        //取两个全选框的公告属性给他设置点击事件  checked:复选框
        //[this.getAttribute('all-key')]:设置的0和1
        var state = this.checked;
        console.log(state); //返回布尔值  点击为tuen
        all('.check-all')[this.getAttribute('all-key')].checked = state;
        //给所有的商品复选框设置点击事件  
        var checkgoods = all('.check-one') //单选框节点
        //遍历所有的单选框
        checkgoods.forEach(ele => {
            console.log(ele);
            ele.checked = state
        })
        //计算价格数量的方法引入
        Cart.cpCOunt()
    }
    /*******************单选的实现*********************************/
    static goodsCheck(eleobj) {
        // console.log(this);
        var state = eleobj.checked //选中状态
        console.log(state); //true
        //当有一个turn时  全选框不能选中
        if (!state) {
            all('.check-all')[0].checked = false;
            all('.check-all')[1].checked = false;
        } else { //当单选全选上  那么全选也选上
            //获取所有的单选框  和长度
            var checkone = all('.check-one');
            var len = checkone.length
            //计算选中的单选框
            var checkcount = 0; //储存选中的单选
            checkone.forEach(ele => { //遍历所有的单选框
                ele.checked && checkcount++ //当有单选框选中时候那么checkount就加一
            })
            //如果单个商品的个数等于len那么就全都选中
            if (len == checkcount) {
                all('.check-all')[0].checked = true;
                all('.check-all')[1].checked = true;
            }

        }
        //计算价格和数量
        Cart.cpCOunt();
    }

    /******************计算价格数量方法*************************/
    static cpCOunt() {
        //获取页面上的所有单选节点
        var checkone = all('.check-one');
        //定义变量储存商品数量与价格
        var count = 0; //数量
        var jg = 0; //价格

        //将所有单选节点遍历出来  如果是选中的状态那就取出他的tr
        checkone.forEach(ele => {
            if (ele.checked) {
                //找到tr
                var trobj = ele.parentNode.parentNode;
                console.log(trobj);
                //获取数量和小计的value
                var tmpcount = trobj.getElementsByClassName('count-input')[0].value;
                var tmpjg = trobj.getElementsByClassName('subtotal')[0].innerHTML;
                // 将获取的放进定义的数量与价格中
                count = tmpcount - 0 + count;
                jg = tmpjg - 0 + jg;

            }
        })
        //追加进界面
        console.log(count);
        $('#selectedTotal').innerHTML = count; //多少件
        $('#priceTotal').innerHTML = parseInt(jg * 100) / 100;
    }



    /*****************购物车数量得增加*********************************/

    static addGoodsNum(eleobj, gId) {
        console.log(eleobj);
        var inputnumobj = eleobj.previousElementSibling; //获取节点
        inputnumobj.value = inputnumobj.value - 0 + 1; //进行增加
        //判断状态  等登录时去数据库更新数量
        if (localStorage.getItem('user')) {
            Cart.updatecart(gId, inputnumobj.value)
        } else { //未登录去浏览器修改数量
            Cart.updateLocal(gId, inputnumobj.value)
        }
        //实现小计的计算
        //var priceobj=eleobj.parentNode.parviousElementSibling;
        let priceObj = eleobj.parentNode.previousElementSibling;
        console.log(priceObj);
        // var priceObj=$('.price')
        // eleobj.parentNode.nextElementSibling.innerHTML= (priceobj.innerHTML * inputNumObj.value).toFixed(2);
        eleobj.parentNode.nextElementSibling.innerHTML = (priceObj.innerHTML * inputnumobj.value).toFixed(2);
        //调用商品价格数量
        Cart.cpCOunt()
    }
    //去数据库修改数量  参数为商品id与数量
    static updatecart(gId, gNum) {
        var id = localStorage.getItem('user');
        ajax.get('./server/cart.php', {
            fn: 'update',
            goodsId: gId,
            goodsNum: gNum,
            userId: id
        }).then(res => {
            console.log(res);
        })
    }
    //去浏览器修改数量
    static updateLocal(gId, gNum) {
        //取出浏览器数据并将他转化为对象
        var cartsgoods = JSON.parse(localStorage.getItem('carts'))
        // 把数量进行更改
        cartsgoods[gId] = gNum;
        //更改完成重新存入浏览器
        localStorage.setItem('carts', JSON.stringify(cartsgoods))
    }

    /*******************删除的实现******************************/
    static delGoods(eleobj, gId) {
        var userId = localStorage.getItem('userId') //浏览器中商品id
        if (userId) { //删除数据库
            ajax.get('./server/cart.php', {
                fn: 'delete',
                goodsId: gId,
                userId: userId,
            }).then(res => {
                console.log(res);
            })
        } else { //删除浏览器
            var cartsobj = JSON.parse(localStorage.getItem('carts'))
            //删除商品指定的id
            delete cartsobj[gId];
            localStorage.setItem('carts', JSON.stringify(cartsobj))

        }
        eleobj.parentNode.parentNode.remove();
        Cart.cpCOunt()
    }






}

new Cart; //实例化