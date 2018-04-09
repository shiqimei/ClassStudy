<?php
$stuId = $_POST['name'];//学号
$ri = $_POST['name'];//日子
$ljsj = $_POST['name'];//累计时间
/* 测试开关
$stuId = "45";//学号
$ri ="09";
$ljsj ="01:00";
*/
if($stuId=="")
 {echo "调用错误。";
  return 0;}



$con = mysqli_connect("loli.52mc.xin", "westery", "3.1415926lfx","ClassStudy");
if (!$con)
  {
  die('数据库连接失败，请联系管理员。 ' . mysqli_error());
  }
else
//mysqli_query("SET NAMES UTF8");
//mysqli_query("set character_set_client=utf8"); 
//mysqli_query("set character_set_results=utf8");
$sql = "select * from a".date("Ym") ;
$result = mysqli_query($con,$sql);
if (!$result) {
 printf("Error: %s\n", mysqli_error($con));
 exit();
}


while($row=mysqli_fetch_row($result))  //row 0 学号；1 openid；2 姓名；3 QQ；
{ 
 if($row[0]==$stuId)
  {
    echo $row[2]. "同学:";
    $sql = "update a".date("Ym")." set d".$ri." ='".$row[4].$ljsj.";' where nameid='".$row[0]."'";
      echo $sql;
      if($con->query($sql))
{
  echo "成功!";
}
else{
  echo "失败！";
}


}
}
mysqli_close($con);
?>