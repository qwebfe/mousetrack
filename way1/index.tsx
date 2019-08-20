import { addEventListener } from "./utils/event";
import { getDocumentInnerHeight, getDocumentInnerWidth } from "./utils/size";
import throttle from "lodash/throttle";
import forEach from "lodash/forEach";

interface TrackRecord {
  duration: number; //停留时间累计毫秒数
}

//视口划分区域
const areaNumber: number = 4;
// 分界线
const boundary = {
  middleX: 0,
  middleY: 0,
  update() {
    const width = getDocumentInnerWidth();
    const height = getDocumentInnerHeight();
    this.middleX = width / 2;
    this.middleY = height / 2;
  }
};

//结果集
const record: Array<TrackRecord> = new Array(areaNumber);
/* 初始化结果集 */
forEach(record, (item, index) => (record[index] = { duration: 0 }));

const areaInfo = {
  lastEnter: 0,
  lastMove: 0,
  lastIndex: -1,
  update(newIndex: number) {
    if (newIndex >= 0) {
      this.lastMove = new Date().getTime();
    }
    if (this.lastIndex >= 0) {
      const diff = this.lastMove - this.lastEnter;
      record[this.lastIndex].duration += diff;
    }
    this.lastEnter = this.lastMove;
    this.lastIndex = newIndex;
  }
};

function moveHandler(ev: MouseEvent) {
  const { clientX, clientY } = ev;
  const { middleX, middleY } = boundary;
  const x = clientX <= middleX ? 0 : 1;
  const y = clientY <= middleY ? 0 : 1;
  const index = y * 2 + x;
  areaInfo.update(index);
  console.log(JSON.stringify(record));
}

const throttledMoveHandler = throttle(moveHandler, 100);

const mouseTrack = () => {
  boundary.update();
  addEventListener(window, "resize", ev => boundary.update(), true);
  addEventListener(window, "mousemove", throttledMoveHandler, true);

  /* 我们无法精确地知道什么时候mouseleave，
   * 但是我们可以通过last mousemove和mouseenter反推。
   * 这样我们就可以把鼠标移出窗口的那段时间忽略不计。
   */
  addEventListener(document, "mouseenter", ev => areaInfo.update(-1));
};

export default mouseTrack;