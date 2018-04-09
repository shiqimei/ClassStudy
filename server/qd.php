<?php
$stuId = $_POST['name'];//学号
$ri = $_POST['name'];//日子
$ljsj = $_POST['name'];//累计时间
/*
$stuId = "45";//学号
$ri ="09";
$ljsj ="01:00";
*/
if($stuId=="")
 {echo "调用错误。";
  return 0;}


//$con = mysqli_connect("localhost", "westery", "3.1415926lfx","ClassStudy");
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
    $sql2 = "SELECT d".$ri." FROM a".date("Ym") ." where nameid='".$row[0]."'";

    $result2 = mysqli_query($con,$sql2);
       $row2=mysqli_fetch_row($result2);
        
       //echo $row2[0];
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
       //echo "CC=".$timetemp.":".$timetemp2;

    echo $row[2]. "同学:";
    $sql = "update a".date("Ym")." set d".$ri." ='".$timetemp.":".$timetemp2."' where nameid='".$row[0]."'";
      //echo $sql;
      if($con->query($sql))
{
  echo "成功!\n";
}
else{
  echo "失败！\n";
}




}
}
mysqli_close($con);
?>