<?php
//$stuId = $_POST['s'];//学号
$ri = date("d");
$ljsj = $_GET['ljsj'];//累计时间
$name = $_GET['name'];//累计时间
$flag=0;
/*
$stuId = "45";//学号
$ri ="09";
$ljsj ="01:00";
*/

$code = $_GET['code'];//小程序传来的code值   累计时间
//$nick = $_GET['nick'];//小程序传来的用户昵称  
//$imgUrl = $_GET['avaurl'];//小程序传来的用户头像地址  
//$sex = $_GET['sex'];//小程序传来的用户性别  
$url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx0ba5298ddba9abfe&secret=470b6d2ba2196279397cf28d6e9a3522&js_code=' . $code . '&grant_type=authorization_code';  
//yourAppid为开发者appid.appSecret为开发者的appsecret,都可以从微信公众平台获取；  
$info = file_get_contents($url);//发送HTTPs请求并获取返回的数据，推荐使用curl  
$json = json_decode($info);//对json数据解码  
$arr3 = get_object_vars($json);  
$openid = $arr3['openid'];  
//$openid =  $_GET['openid'];

echo $name."openid:".$openid;
$con = mysqli_connect("localhost", "westery", "3.1415926lfx","ClassStudy");
//$con = mysqli_connect("loli.52mc.xin", "westery", "3.1415926lfx","ClassStudy");
//$con = mysqli_connect("localhost", "root", "wx0ba5298ddba9abfe","cAuth");
if (!$con)
  {
  die('数据库连接失败，请联系管理员。 ' . mysqli_error());
  }

//mysqli_query("SET NAMES UTF8");
//mysqli_query("set character_set_client=utf8"); 
//mysqli_query("set character_set_results=utf8");

$sql = "select * from a".date("Ym") ;
$result = mysqli_query($con,$sql);
if (!$result) {
 printf("Error: %s\n", mysqli_error($con));
 exit();
}

echo "连接服务器成功";

while($row=mysqli_fetch_row($result))  //row 0 openid 1 姓名；2 QQ；
{ 
 if($row[0]==$openid)
  { $flag=1;
    $sql2 = "SELECT d".$ri." FROM a".date("Ym") ." where openid='".$openid."'";

    $result2 = mysqli_query($con,$sql2);
       $row2=mysqli_fetch_row($result2);
        
      // echo $row2[0];
       $aa=$row2[0];
       $bb=$ljsj;
       if($aa=="")
       {      
       $timem = explode(":",$bb);
       $timetemp=$timem[0];
       $timetemp2=$timem[1];
       }
       else{
       $timeh = explode(":",$aa);
       $timem = explode(":",$bb);
       $timetemp=$timeh[0]+$timem[0];
       $timetemp2=$timeh[1]+$timem[1];
       }
       if ($timetemp2>=60)
       {
         $timetemp2-=60;
         $timetemp++;
       }

    echo $row[1]. "同学:";
    $sql = "update a".date("Ym")." set d".$ri." ='".$timetemp.":".$timetemp2."' where openid='".$row[0]."'";
     // echo $sql;
      if($con->query($sql))
{
  echo "成功!\n";
}
else{
  echo "失败！\n";
}






}

}
if($flag==0)
{
  echo "检测到无注册，下面进行注册.";
  if($name !="" && $openid !=""){
    $insertdata="insert into a".date("Ym")."(openid,name) values('".$openid."','".$name."')";  
  if($con->query($insertdata)==true){  
      echo $name."注册成功";  
      exit();
  }
  else{  
      echo "插入错误 " . $connent->error;  
      exit();
  }  
  }
  else{echo "openid不得为空。";}
}
mysqli_close($con);
?>