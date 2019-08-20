// 视图宽高
var viewWidth : number, viewHeight : number;
var middleVW : number, middleVH : number;

// 当前鼠标所在区域
var pointerLocal : number;

// 开始时间
var startTime : number;

const result : number[] = new Array(0, 0, 0, 0);

// 改变浏览器视图大小
function changeViewSize (width : number, height : number) : void {
    viewWidth = window.innerWidth - 18;
    viewHeight = window.innerHeight - 4;
    middleVW = viewWidth / 2;
    middleVH = viewHeight / 2;
    createCover();
}


// 为四块区域创建透明div
function createCover() : void {
    // 删除原有的cover
    var covers = document.getElementsByClassName('coverpart');
    for(let j = 0; j < covers.length; j++){
        document.body.removeChild(covers[j]);
    }

    var divNode: HTMLDivElement[] = new Array(4);
    for (let i = 0; i < 4; i++){
        divNode[i] = document.createElement('div');
        divNode[i].setAttribute('class', 'coverpart');
        divNode[i].style.cssText = `width: ${middleVW}px;height: ${middleVH}px;
             position: fixed ; 
             z-index: 100;
             pointer-events: auto; 
             opacity: 0.3;`

        // 给每个cover注册鼠标事件
        divNode[i].addEventListener('mouseover', function(event){
            if (pointerLocal) {
                // 鼠标移动到新的区域
                if(pointerLocal != event.target.id.slice(5)){
                    // 将原在区域 设置为禁止事件穿透
                    document.getElementsByClassName('coverpart')[pointerLocal].style.pointerEvents = 'all'
                    var breakTime = new Date().getTime();
                    result[pointerLocal] += breakTime - startTime;
                    startTime = breakTime;
                    console.log(result);
                    
                    // 更新鼠标所在区域
                    pointerLocal = event.target.id.slice(5);
                    document.getElementsByClassName('coverpart')[pointerLocal].style.pointerEvents = 'none'
                    console.log(`当前区域： ${pointerLocal}`)
                }
            } else {
                // 鼠标初次移动 将所在区域的cover设置 point-events: none; 允许事件穿透
                pointerLocal = event.target.id.slice(5);
                console.log(`当前区域： ${pointerLocal}`)
                document.getElementsByClassName('coverpart')[pointerLocal].style.pointerEvents = 'none'
                // 初始计时
                startTime = new Date().getTime();
            }
        })

        // 记录本次在某块区域的时间
        divNode[i].addEventListener('mouseleave', function(event) {
            var breakTime = new Date().getTime();console.log("leave: " + breakTime);
            result[pointerLocal] += breakTime - startTime;console.log(breakTime - startTime);
            console.log(result);
        })

        // 鼠标移除浏览区区域
        document.body.addEventListener('mouseleave', function(){
            var breakTime = new Date().getTime();
            result[pointerLocal] += breakTime - startTime;
        })

        document.body.appendChild(divNode[i]);
    }
}    

export {changeViewSize, createCover}