<?php
  // получаем пост-запросы от фетча с именем и временем
  $name = $_POST['name'];
  $time = $_POST['time'];
  // подключаемся к бд
  $DBH = new PDO('mysql:host=localhost;dbname=web031;charset=utf8','Web03','jKg0ol04');
  // подготавливаем запрос
  $ins = $DBH->prepare("INSERT INTO angrybirds SET name=?,time=?");
  // делаем запрос на добавление
  $ins->execute([$name,$time]);
  // делаем запрос на селект по времени
  $sel = $DBH->query("SELECT * FROM angrybirds ORDER BY time")->fetchAll();

  $notintable = true;
// сортируем id
    for($i = 0; $i < 5; $i++){
      $sel[$i]['id'] = $i + 1;
      if($sel[$i]['name'] == $name && $sel[$i]['time'] == $time){
        $notintable = false;
      }
    }
// если игрок не вошел в топ-5 добавляем его 5-тым с указанием реального места
  if($notintable == true){
    for($i = 5; $i < count($sel); $i++){
      if($sel[$i]['time'] == $time and $sel[$i]['name'] == $name){
        $sel[4]['time'] = $time;
        $sel[4]['name'] = $name;
        $sel[4]['id'] = $i + 1;
      }
    }
  }
// отправляем json джаваскрипту
  echo json_encode(array_slice($sel,0,5));
