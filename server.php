<?php
  $name = $_POST['name'];
  $time = $_POST['time'];

  $DBH = new PDO('mysql:host=localhost;dbname=web031;charset=utf8','Web03','jKg0ol04');
  
  $ins = $DBH->prepare("INSERT INTO angrybirds SET name=?,time=?");
  
  $ins->execute([$name,$time]);
  
  $sel = $DBH->query("SELECT * FROM angrybirds ORDER BY time")->fetchAll();

  $notintable = true;

    for($i = 0; $i < 5; $i++){
      $sel[$i]['id'] = $i + 1;
      if($sel[$i]['name'] == $name && $sel[$i]['time'] == $time){
        $notintable = false;
      }
    }

  if($notintable == true){
    for($i = 5; $i < count($sel); $i++){
      if($sel[$i]['time'] == $time and $sel[$i]['name'] == $name){
        $sel[4]['time'] = $time;
        $sel[4]['name'] = $name;
        $sel[4]['id'] = $i + 1;
      }
    }
  }

  echo json_encode(array_slice($sel,0,5));
