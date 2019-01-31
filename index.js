
// объявляем переменные

let line = document.querySelector('.line');
let player = document.querySelector('#player');
let field = document.querySelector('.field-to-click');

let b = 20;
let a = 20;
let deg = 0;
let speed = 20;

let points = document.querySelector('.points');

let send = true;


field.style.bottom = window.innerHeight - player.offsetTop + 'px';
field.style.left = player.offsetWidth + player.offsetLeft + 'px';


// функция, устанавливающая угол для броска птицы по клику пользователя
function SetTraectory(x,y){
//  line.style.height = '1px';
//  line.style.borderBottom = '10px dotted white';
  a = x - (player.offsetLeft + player.offsetWidth);
  b =  player.offsetTop - y;
  let c = (a**2 + b**2)**0.5;

  deg = Math.acos((a**2 + c**2 - b**2)/(2*a*c));

  SetPoints();

  //line.style.transform = 'rotate(-' + deg  * 50 + 'deg)';
  //line.style.width = c + 'px';
  //line.style.right = window.innerWidth - x - b*0.3 + 'px';
  //line.style.bottom = window.innerHeight - player.offsetTop + b/2  + 'px';
}

// ставим эвент листенер на клик пользователя для установления угла для броска
field.onclick = (e) => {
  SetTraectory(e.clientX,e.clientY);
}

let inp = document.querySelectorAll('input');


function SetPoints(){
  let flg = true;
  let pointy = player.offsetTop;
  let pointx = player.offsetLeft + player.offsetWidth;
  let xsp = Math.cos(deg) * speed;
  let ysp = Math.sin(deg) * speed;

  points.innerHTML = '';

  let count = 0;

  while(flg){

      newy = window.innerHeight - pointy - 10 + ysp;
      xsp += windspeed/50;
      newx = pointx + xsp;
      pointx += xsp;
      pointy -= ysp;
      ysp -= 2;
      let point = document.createElement('div');
      if(newy < 40 || newx > window.innerWidth){
        flg = false;
        point.style.left = newx + 'px';
        point.style.bottom = '40px';
      }else{
        if(count == 0){
          point.style.left = newx + 'px';
          point.style.bottom = newy + 'px';
        }
      }
      points.appendChild(point);
    count = (count + 1)%3;
  }
}



// функция, меняющая скорость броска при ее изменении в одном из двух инпутов
function ChangeSpeed(x){
  speed = x;
  inp[0].value = speed;
  inp[1].value = speed;
  SetPoints();
};

let flag = false;
let xspeed = 0;
let yspeed = 0;
let redbird = null;


let box = document.querySelector('.boxes').children;


// функция, возвращающая dom-element (box) при столкновении (иначе вернет false)
function Collapse(x,y,w,h){
  for(let i = 0; i < box.length; i++){
    let q = box[i];
    let ok_x = false;
    let ok_y = false;
    if(y < q.parentNode.offsetTop + q.offsetTop && y + h > q.parentNode.offsetTop + q.offsetTop){
      ok_y = true;
    }
    if(y < q.parentNode.offsetTop + q.offsetTop + q.offsetHeight && y + h > q.parentNode.offsetTop + q.offsetTop){
      ok_y = true;
    }
    if(x < q.parentNode.offsetLeft +  q.offsetLeft && x + w > q.parentNode.offsetLeft + q.offsetLeft){
      ok_x = true;
    }
    if(x < q.parentNode.offsetLeft + q.offsetLeft + q.offsetWidth && x + w > q.parentNode.offsetLeft + q.offsetLeft){
      ok_x = true;
    }
    if(ok_x && ok_y){
      return q;
    }
  }
  return false;
}

let siblings = [];
let ruin = [];

let one = true;



// функция, разрушающая элемент при столкновении
function Remove(el){
if(el.src.split('.')[el.src.split('.').length-1] != 'gif'){
/*  if(el.previousElementSibling != undefined){
    siblings.push(el.previousElementSibling);
    //el.previousElementSibling.style.marginBottom = el.offsetHeight + 'px';

    setTimeout(()=>{
        siblings[siblings.length - 1].style.marginBottom = parseInt(siblings[siblings.length - 1].style.marginBottom) + el.offsetHeight + 'px';
        setTimeout(()=>{
          siblings[siblings.length - 1].style.transition = 'all 2s';
          siblings[siblings.length - 1].style.marginBottom = parseInt(siblings[siblings.length - 1].style.marginBottom) - el.offsetHeight + 'px';
        },50);

    },450);

      siblings[siblings.length - 1].style.transition = '';
  }*/
    el.src = './img/ruin_box.gif';
    ruin.push(el);
setTimeout(()=>{
  for(let i = 0; i < ruin.length; i++){
    if(ruin[i].parentNode != null){
      ruin[i].parentNode.removeChild(ruin[i]);
    }
  }
  if(ruin.length == 3){
    end.firstElementChild.innerText = 'Your are Winner';
    end.style.display = 'flex';
    end_ok = true;
    if(send){
      send = false;
      let formData = new FormData();
      formData.append('name',document.querySelector('#name').value);
      formData.append('time',30 - s);
      fetch('./server.php',{method: 'post', body: formData})
        .then(res => {return res.json()})
        .then(jsn => {
          document.querySelector('table').style.display = 'block';
          let table = document.querySelector('tbody');
          table.innerHTML = '';
          for(let i = 0; i < 5; i++){
            let tr = document.createElement('tr');
            tr.innerHTML = '<td>'+jsn[i]['id']+'</td><td>'+jsn[i]['name']+'</td><td>'+jsn[i]['time']+'</td>';
            table.appendChild(tr);
          }
        });
      }
  }
},500);

  if(one){
    xspeed = -xspeed;
    one = false;
  }
}
}


// функция движения птицы
function Shoot(){
  if(flag){
    newy = window.innerHeight - redbird.offsetTop - redbird.offsetHeight + yspeed;
    xspeed += windspeed/50;
    newx = redbird.offsetLeft + xspeed;
    let col = Collapse(redbird.offsetLeft,redbird.offsetTop,redbird.offsetWidth,redbird.offsetHeight);
    if(col != false){
      Remove(Collapse(redbird.offsetLeft,redbird.offsetTop,redbird.offsetWidth,redbird.offsetHeight));
    }
    if(newy < 40 || newx > window.innerWidth){
      flag = false;
      yspeed = 0;
      xspeed = 0;
      redbird.style.left = newx + 'px';
      redbird.style.bottom = '40px';
      one = true;
      document.querySelector('.controls').lastElementChild.addEventListener('click',Go);
    }else{
      yspeed -= 2;
      redbird.style.left = newx + 'px';
      redbird.style.bottom = newy + 'px';
      setTimeout(Shoot,40);
    }
  }

}

// функция выстрела, включается при клике на круглую центральную кнопку
function Go(){
  document.querySelector('.controls').lastElementChild.removeEventListener('click',Go);
  redbird = document.querySelectorAll('.bird');
  redbird = redbird[redbird.length - 1];
  xspeed = Math.cos(deg) * speed;
  yspeed = Math.sin(deg) * speed;
  redbird.style.zIndex = '10';
  flag = true;
  Shoot();
  let newbird = document.createElement('img');
  newbird.src = './img/redbird.png';
  newbird.className = 'bird';
  document.querySelector('.game').appendChild(newbird);
}


document.querySelector('.controls').lastElementChild.addEventListener('click',Go);


let s = 29;

let time = document.querySelector('.time');


let end_ok = false;

let end = document.querySelector('#end');


// функция таймера
function Timer(){
  if(end_ok != true){
  if(s >= 0){
    let t = '00:' + ('00' + s).slice(-2);
    time.innerHTML = t;
    s -= 1;
  }else{
    end.firstElementChild.innerText = 'Game Over';
    end.style.display = 'flex';
    end_ok = true;
  }
  }
}

let start = document.querySelector('#start');


// функция начала игры
function Start(){
  if(document.querySelector('#name').value.length < 1){
    return false;
  }
  start.style.display = 'none';
  setInterval(Timer,1000);
}


function ReStart(){
  document.querySelector('table').style.display = 'none';
  send = true;
  ruin = [];
  let brds = document.querySelectorAll('.bird');
  for(let h = 0; h < brds.length - 1; h++){
    brds[h].parentNode.removeChild(brds[h]);
  }

  document.querySelector('.boxes').innerHTML = `<img src="./img/box.png" alt="box" style='width: 45%;'>
  <img src="./img/box.png" alt="box" style='width: 70%;'>
  <img src="./img/box.png" alt="box" style='width: 100%;'>`;
  let box = document.querySelector('.boxes').children;
  s = 30;
  time.innerText = '00:30';
  end.style.display = 'none';
  end_ok = false;
}


start.lastElementChild.addEventListener('click',Start);
end.lastElementChild.addEventListener('click',ReStart);



let winddeg = 0;
let windspeed = 15;


// функция изменения желтого круга(частоты изменения направления ветра)
function ChangeWindSpeed(event){
  let sk = document.querySelectorAll('.sk');
  for(let i = 0; i < 4; i++){
    sk[i].style.display = 'none';
  }
  if(event.clientX > this.parentNode.offsetLeft + this.offsetLeft + this.offsetWidth/2){
    if(event.clientY < this.parentNode.offsetTop + this.offsetTop + this.offsetHeight/2){
      let winddegrs = Math.atan((-this.parentNode.offsetLeft - this.offsetLeft - this.offsetWidth/2 + event.clientX)/(this.parentNode.offsetTop + this.offsetTop + this.offsetHeight/2 - event.clientY)) * 57.2958 ;
      sk[0].style.display = 'block';
      sk[0].style.transform = 'rotate(0deg) skewY('+(90 + winddegrs)+'deg)';
      winddeg = winddegrs;
    }else{
      let winddegrs = Math.atan((-this.parentNode.offsetTop - this.offsetTop - this.offsetHeight/2 + event.clientY)/(-this.parentNode.offsetLeft - this.offsetLeft - this.offsetWidth/2 + event.clientX)) * 57.2958 ;
      sk[1].style.display = 'block';
      sk[1].style.transform = 'rotate(90deg) skewY('+(90 + winddegrs)+'deg)';
      sk[0].style.display = 'block';
      sk[0].style.transform = 'rotate(0deg) skewY(0deg)';
      winddeg = 90 + winddegrs;
    }
  }else{
    if(event.clientY < this.parentNode.offsetTop + this.offsetTop + this.offsetHeight/2){
      let winddegrs = Math.atan((this.parentNode.offsetTop + this.offsetTop + this.offsetHeight/2 - event.clientY)/(this.parentNode.offsetLeft + this.offsetLeft + this.offsetWidth/2 - event.clientX)) * 57.2958 ;
      sk[3].style.display = 'block';
      sk[3].style.transform = 'rotate(270deg) skewY('+(90 + winddegrs)+'deg)';
      sk[0].style.display = 'block';
      sk[0].style.transform = 'rotate(0deg) skewY(0deg)';
      sk[1].style.display = 'block';
      sk[1].style.transform = 'rotate(90deg) skewY(0deg)';
      sk[2].style.display = 'block';
      sk[2].style.transform = 'rotate(180deg) skewY(0deg)';
      winddeg = 270 + winddegrs;
    }else{
      let winddegrs = Math.atan((this.parentNode.offsetLeft + this.offsetLeft + this.offsetWidth/2 - event.clientX)/(-this.parentNode.offsetTop - this.offsetTop - this.offsetHeight/2 + event.clientY)) * 57.2958 ;
      sk[2].style.display = 'block';
      sk[2].style.transform = 'rotate(180deg) skewY('+(90 + winddegrs)+'deg)';
      sk[0].style.display = 'block';
      sk[0].style.transform = 'rotate(0deg) skewY(0deg)';
      sk[1].style.display = 'block';
      sk[1].style.transform = 'rotate(90deg) skewY(0deg)';
      winddeg = 180 + winddegrs;
    }
  }
  clearInterval(windinterval);
  windinterval = setInterval(ChangeTraectoryOfWind,30000 - (30000/360*winddeg));
}


function Cloud(){
  cloud.style.left = cloud.offsetLeft + windspeed + 'px';
  if(cloud.offsetLeft > window.innerWidth){
    cloud.style.left = - 2 * cloud.offsetWidth + 'px';
  }
  if(cloud.offsetLeft < -800){
    cloud.style.left = window.innerWidth + 'px';
  }
}

setInterval(Cloud,100);


function ChangeTraectoryOfWind(){
  windspeed *= (Math.round(Math.random()) * 2 - 1)  ;
}



let windinterval = setInterval(ChangeTraectoryOfWind,30000 - (30000/360*winddeg));



setInterval(SetPoints,2000);


let wind = document.querySelector('.wind');
wind.lastElementChild.addEventListener('click',ChangeWindSpeed);
