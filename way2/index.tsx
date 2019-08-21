import * as util from  './utils/index';

interface TrackRecord{
  duration: number//停留时间累计毫秒数
}

//视口划分区域
const areaNumber : number = 4

//结果集
const record : Array<TrackRecord> = new Array(areaNumber)

// 初始化视图宽高
util.changeViewSize(window.innerWidth, window.innerHeight);

// 当窗口视图大小变化， 更改保存的数据
window.onresize = function () {
  console.log(`Current size x: ${window.innerWidth}, y: ${window.innerHeight}`)
  util.changeViewSize(window.innerWidth, window.innerHeight);
}

const mouseTrack = () => {
  console.info('record')
}

export default mouseTrack