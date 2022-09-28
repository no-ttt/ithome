###### tags: `ithome` `ironman`
# 讓 Mapbox 帶你經歷一趟美食之旅！

上次做的 Demo 是台南美食之旅，今天就來用台中舉例好了！
台中也好多好吃的 ...

一樣的，我拿 TDX (Transport Data eXchange) 所提供的 API 來做資料來源，程式碼的部分則是以 [Day 07 - 來做一個美食地圖吧！](https://ithelp.ithome.com.tw/articles/10296538) 去做更改的，可以參考一下喔！

那今天的實作的靈感來源是官網的一個範例 (想了半天想不到做啥 ...)
所以有用到它的一些做法，底下我有附上連結來源，有興趣可以去看一下他的前身 XDD


## 需求目標
第一步我們都先來定一下需求：
- 地圖上標記餐廳位置
- 提供餐廳詳細資訊
- 滑鼠滾動資訊頁面，切換到所對應的餐廳位置

可能稍微抽象附上說明，我們這次不把詳細資訊放到彈跳窗上了，而是在畫面右半部再切出一個區塊做詳細資訊的介紹，透過滾動的方式，地圖自動飛到對應的餐廳位置！

前面 2 個功能我們在第七天都做過了，就不會特別進行說明 (可以偷看一下之前的文章)
那我們針對第 3 個功能開始進行實作吧～

## 滾動頁面切換 Marker 位置
### 1. 地圖初始化
```jsx=
// init map
const map = new mapboxgl.Map ({
  container: this.mapContainer.current,
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [data[0].Position.PositionLon, data[0].Position.PositionLat],
  zoom: 15,
  bearing: 27,
  pitch: 45
})

data.map((d) => (
  new mapboxgl.Marker({
    scale: 0.8,
    color: "red"
  })
  .setLngLat([d.Position.PositionLon, d.Position.PositionLat])
  .addTo(map)
))
```

我是先抓取 TDX 的前 20 筆資料做 Demo，一開始初始化的位置設置在所取得的資料中的第一間餐廳，地圖有做旋轉 (`bearing`) 和傾斜 (`pitch`) 的設定，所取得的餐廳點我也先把它全部標在地圖上了，所以你會看到這樣的畫面：

![](https://i.imgur.com/zG4xH0p.png)

這是地圖做過縮放的結果，如果再縮小一點應該可以看到地圖是歪的 XD

### 2. 資訊頁面
```jsx=
 <div id="features">
  {
    data.map((d, i) => (
      <section key={i} id={d.RestaurantID} className={ i === 0 ? "active": "" }>
        <h3>{d.RestaurantName}</h3>
        <div class="res-detail-intro">
          <div>
            <div class="res-detail-txt">營業時間：{d.OpenTime}</div>
            <div class="res-detail-txt">地址：{d.Address}</div>
            <div class="res-detail-txt">電話：{d.Phone}</div>
          </div>
        </div>
      </section>
    ))
  }
</div>
```

每間餐廳以 `<section>` 做匡列，餐廳詳細資訊的部分沒有做到更動，為了可以和不是目前所聚焦的餐廳做區隔，有特別做透明度的處理，出來的結果長這樣：

![](https://i.imgur.com/2yr94bX.png)



### 3. 目前的餐廳資訊所在位置與切換
基本的畫面都設置好後，終於進入我們的正題了！
官網範例的做法是用迴圈和畫面可視範圍去找目前要做聚焦的 element，找到以後再做更新，那我們先來分別看一下這兩個 function。

> 找出目前所聚焦的 element：

```jsx=
isElementOnScreen = (id) => {
  const element = document.getElementById(id);
  const bounds = element.getBoundingClientRect();
    
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}
```

參數 `id` 指的是目前要判斷的 element 的 id，利用 `getBoundingClientRect` 來看指定的 element 有沒有超出可視範圍，若超過了就回傳 `true`，則代表現在所聚焦的餐廳，否則為 `false`。

> 更新所聚焦的 element：

```jsx=
setActiveChapter = (chapterID, map, Lon, Lat) => {
  const { activeChapter } = this.state

  if (chapterID === activeChapter) return;

  map.flyTo({
      center: [Lon, Lat],
      zoom: 18
  })

  document.getElementById(chapterID).classList.add('active');
  document.getElementById(activeChapter).classList.remove('active');

  this.setState({
      activeChapter: chapterID
  })
}
```

先判斷目前要設置的餐廳 id (`chapterID`) 跟現在所聚焦的 id (`activeChapter`) 是否相同，如果不一樣了再做更新。
做更新的方法只要更改目前 `state` 所存的變數就好，css 部分把 `active` 重新設置，那地圖過渡就用 `flyTo` 做轉換！簡簡單單～


### 4. 滑動頁面觸發 Event
最後來設定觸發 Event 的條件，利用 `onscroll` 來監測滾動視窗的狀況，如同上面所說的，每當觸發 Event 時，就利用迴圈檢查現在的聚焦狀況。

```jsx=
window.onscroll = () => {
  for (let i = 0; i < data.length; i++) {
    if (this.isElementOnScreen(data[i].RestaurantID)) {
      this.setActiveChapter(data[i].RestaurantID, map, data[i].Position.PositionLon, data[i].Position.PositionLat);
      break;
    }
  }
};
```

> 地圖最後輸出：

![](https://i.imgur.com/hbB7sJf.png)

滾動右邊的餐廳資訊，地圖就會跑到對應的位置嘍！
來試試吧～ 

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/MoveMap)


沒想到我的發文進度快跟不上學習 ... 看來要趁六日囤一點進度了 ...
希望到目前所分享的文章有幫到你 ก็ʕ•͡ᴥ•ʔ ก้

明天開始介紹 Layer 的部分，先預告一下會是很長的一段路～
一起加油吧 (´･ω･`)


## Reference
- [TDX 運輸資料流通服務](https://tdx.transportdata.tw/api-service/swagger#/)
- [Fly to a location based on scroll position
](https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/)
- [那些被忽略但很好用的 Web API / GetBoundingClientRect](https://maxleebk.com/2021/10/04/webApi/webApi-21/)
