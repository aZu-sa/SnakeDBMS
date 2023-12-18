import { ref } from 'vue'

/**
 * 用于计算I/O速率的SpeedRatio类
 *
 * Attributes:
 *    ratio    :  Ref<number>  : 前一时刻速率
 *    per      :  Ref<number>  : 用于统计当前时刻内的I/O次数
 *    duration :    number     : 单次统计时长(单位: ms, 默认值: 1000)
 *    _ratio   :    number[]   :以duration为单位, 统计整个I/O操作内每单位时间内的速率
 *    _start   :    boolean    : 判断是否开始计算速率的标志位
 *
 * Functions:
 *    start()  :  开始计算速率
 *    end()    :  结束计算速率
 *    add()    :  计数器加一(每单次I/O操作都需要调用)
 *    clear()  :  清除已统计的数据
 */
export class SpeedRatio {
  private ratio
  private per
  private duration

  private _ratio: number[]
  private _start
  constructor (duration = 1000) {
    this.ratio = ref<number>(0)
    this._ratio = []
    this.per = ref<number>(0)
    this.duration = duration
    this._start = false
  }

  public getRatio () {
    return this.ratio
  }

  public getRatioCounts () {
    return this._ratio
  }

  public getPer () {
    return this.per
  }

  public setDuration (dur: number) {
    this.duration = dur
  }

  public start () {
    if (!this._start) {
      this._start = true
      this.count()
    }
  }

  public end () {
    this._start = false
    this.ratio.value = this.per.value / (this.duration / 1000)
    this._ratio.push(this.ratio.value)
  }

  private count () {
    if (this._start) {
      this.ratio.value = this.per.value / (this.duration / 1000)
      this._ratio.push(this.ratio.value)
      this.per.value = 0
      setTimeout(() => this.count(), this.duration)
    }
  }

  public add () {
    this.per.value++
  }

  public clear () {
    this.ratio = ref<number>(0)
    this.per = ref<number>(0)
    this._ratio = []
    this._start = false
  }
}
