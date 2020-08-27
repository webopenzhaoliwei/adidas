<?php
// 导入php文件
include('./mysql.php');
// 获取ajax请求的方法
$fn = $_GET['fn'];  // lst
$fn();  // lst()
function lst(){
/*************分页设置********************/ 
  // 设置长度
  $lengths=2;
  //当前页数
  $page=$_GET['page'];
  // 计算起始位置 开始位置=(当前页数-1)*lengths
  $start=($page-1)*$lengths;
  //取出第几条数据
  $sql1='select count(id) cou from adidas';
  $cou=select($sql1)[0]['cou'];//全部的条数
  // 计算总的页数  全部的条数/每页的条数
  $pcount=round($cou/$lengths);
//取出第一页 第几条数据
  $sql = "select * from adidas order by id limit $start,$lengths";
  // echo $sql;
  // $sql = 'select * from adidas';
  $data = select($sql);

  //print_r($data);
  echo json_encode([
    'stateCode'=>200,
    'state'=>'success',
    'data'=>$data,
     'cout'=>$pcount
  ]);
}
function lstr(){
  $sql = 'select * from adidas';
  $data = select($sql);
  echo json_encode([
    'stateCode'=>200,
    'state'=>'success',
    'data'=>$data,
    
  ]);
}
//lst();
 // 添加数据的方法
function add()
{
 //echo '我是添加';
 $userId = $_POST['userId'];
 $gId = $_POST['gId'];
 $gNum = $_POST['gNum'];

 $sql = "insert into ad(userId,productId,num,size) values(' $userId','$gId','$gNum',40) on duplicate key update num=num+$gNum";
 //echo $sql;die;
  $res = query($sql);
  if($res==1){
    echo json_encode([
      'stateCode'=>200,
      'state'=>'success',
      'data'=>''
    ]);
  }else{
    echo json_encode([
      'stateCode'=>201,
      'state'=>'error',
      'data'=>''
    ]);
  }
}

// 删除数据的方法
function del(){
  $id = $_GET['id'];
  $sql = "delete from adidas where id=$id";
  $res = query($sql);
  if($res==1){
    echo json_encode([
      'stateCode'=>200,
      'state'=>'success',
      'data'=>''
    ]);
  }else{
    echo json_encode([
      'stateCode'=>201,
      'state'=>'error',
      'data'=>''
    ]);
  }
}

// 修改数据的方法
function update(){
  $id    = $_POST['id'];
  $title = $_POST['title'];
  $pos   = $_POST['pos'];
  $idea  = $_POST['idea'];

  $sql = "update adidas set title='$title',pos='$pos',idea='$idea' where id=$id";

  $res = query($sql);
  if($res==1){
    echo json_encode([
      'stateCode'=>200,
      'state'=>'success',
      'data'=>''
    ]);
  }else{
    echo json_encode([
      'stateCode'=>201,
      'state'=>'error',
      'data'=>''
    ]);
  }
}
?>