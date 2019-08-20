import { fromEvent }  from 'rxjs'
import $ from 'jquery'

interface TrackRecord{
  duration: number//停留时间累计毫秒数
}

//视口划分区域
const areaNumber : number = 4

//结果集
const record : Array<TrackRecord> = new Array(areaNumber)

// 开始计时时间
let startTime : number = new Date().getTime();
let curTime : number = startTime;
const mouseTrack = () => {
  for(let i = 0; i < areaNumber; i++) {
    record[i] = {
      duration : 0
    }
  }
  createCover();
  fromEvent(document.querySelectorAll('.svgForCover'), 'mouseenter') 
    .subscribe((e: MouseEvent) => {
      // @ts-ignore
      let index = e.target.id;
      curTime = new Date().getTime();
      record[index].duration += curTime - startTime;
      startTime = curTime; 
      console.log(record);
    });
  fromEvent(document.querySelectorAll('.svgForCover'), 'mouseleave')
    .subscribe((e: MouseEvent) => {
      console.log(`${e.target} leave`);
    })
}

// 创建遮盖元素
const createCover = () => {
  $("svg").remove(".svgForCover");
  let width : number = document.documentElement.clientWidth / 2,
      height : number = document.documentElement.clientHeight / 2;
  let x : number, y : number = 0;
  // 创建4个svg覆盖层
  for(let i = 0; i < 4; i++) {
    var result = i.toString(2).split("", 2).map((value) => parseInt(value));
    result.length > 1 ? ([y = 0, x = 0] = result) : ([x = 0] = result) ;
    drawsvg(width, height, x, y, i);
  }
}

// 绘制svg元素
function drawsvg(
        width : number, 
        height : number,
        pointX : number,
        pointY : number,
        index: number) : void {
    var svgns = "http://www.w3.org/2000/svg"; 
    var svg = document.createElementNS(svgns, 'svg'); 
    svg.setAttribute("style", `width: ${width}px; height: ${height}px; position: fixed; top: ${pointY * height}px; left: ${pointX * width}px; pointer-events: none; `);
    svg.setAttribute("viewBox", `${pointX} ${pointY} ${width} ${height}`);
    svg.setAttribute("class", "svgForCover");
    svg.setAttribute("id", index.toString());

    var polygon = document.createElementNS(svgns, 'polygon');
    polygon.setAttribute('points', `${pointX},${pointY} ${width},${pointY} ${width},${height} ${width},${pointY} ${pointX},${pointY}`)
    polygon.setAttribute('style', `pointer-events: stroke; fill: none; stroke: black; stroke-width: 10px; `);
    svg.appendChild(polygon);
    document.body.appendChild(svg);
}

$(window).on("resize", createCover)

export default mouseTrack
