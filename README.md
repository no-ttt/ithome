###### tags: `ithome` `ironman`
# Day 07 - 來做一個美食地圖吧！

來到第七天，我們利用這禮拜所學做一個台南美食地圖！
美食之都說是台南應該不為過吧 (⁎⁍̴̛ᴗ⁍̴̛⁎)

那我是拿 TDX (Transport Data eXchange) 提供的 API 來做資料使用，它是交通部提供的免費 API 平台，大家有興趣可以去看看。但要注意的是，如果沒有註冊會員的話，一天呼叫上限是 50 次喔～

## 需求目標
我們先來制定一下這張地圖要有哪些需求：
- 使用者定位
- 可以切換全螢幕
- 地圖上標記餐廳位置
- 提供餐廳詳細資訊

一張基本的美食地圖該有的功能大概就這些了吧！那就可以開始動手做啦～

## 標記餐廳位置
首先，我們先把底層地圖設定好：

```jsx=
constructor(props) {
  super(props);
  this.state = {
    lng: 120,
    lat: 23.5,
    zoom: 7,
  };
  this.mapContainer = React.createRef();
}

componentDidMount() {
  const { lng, lat, zoom } = this.state;
  const map = new mapboxgl.Map ({
    container: this.mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: zoom
  });
}

render() {
  return (
    <div>
      <div ref={this.mapContainer} className="map-container" />
    </div>
  );
}
```

再透過 `Marker` 將餐廳位置都標出來：(利用 `map` 輸出所有點)
```jsx=
data.map((d) => (
  new mapboxgl.Marker({
    scale: 0.8,
    color: "red"
  })
  .setLngLat([d.Position.PositionLon, d.Position.PositionLat])
  .addTo(map)
))
```


> BTW，TDX 給的資料格式長這樣：
> 
> ![](https://i.imgur.com/jrL1MTv.png)


然後你就會獲得一張充滿紅色標點的地圖啦～

![](https://i.imgur.com/Cg34xzR.jpg)

因為我們還沒學到 Layer，所以 Marker 就先全部標出來了，之後會教大家怎麼使用 Layer 做群集 (就是會長的比較漂亮啦，不會有密集恐懼症)


## 提供餐廳資訊
我們不可能就這樣丟給使用者吧，一堆紅點誰知道哪家是哪家 ಠ▃ಠ
這個時候 `Popup` 就派上用場了！
我們只要把餐廳的詳細資訊丟給它就好了，耶～：

```jsx=
data.map((d) => (
  new mapboxgl.Marker({
    scale: 0.8,
    color: "red"
  })
  .setLngLat([d.Position.PositionLon, d.Position.PositionLat])
  .setPopup(new mapboxgl.Popup({  // add restaurant detail
    maxWidth: "500px"
  }).setHTML(`
    <div class="res-detail-intro">
      <img class="res-pic" src=${d.Picture.PictureUrl1 || "https://www.bomb01.com/upload/news/original/c95e0d21eda50ebc16d5f8ef568f60a7.png"}
      <div>
        <div class="res-title-txt">${d.RestaurantName}</div>
        <div class="res-detail-txt">營業時間：${d.OpenTime}</div>
        <div class="res-detail-txt">地址：${d.Address}</div>
        <div class="res-detail-txt">電話：${d.Phone}</div>
    </div>
    <div>
  `)) 
  .addTo(map)
))
```

因為有些餐廳沒有照片，所以我放了一張圖片替代這種狀況：

![](https://i.imgur.com/PeHiIyH.png)

圖片來源：https://www.bomb01.com/article/50295


點擊 Marker 你就會看到跳出餐廳資訊了，看起來有模有樣了吧！

![](https://i.imgur.com/uD1loAK.png)

## 加入小工具
最後，我想讓我的使用者可以依照現在所在位置去找最近的餐廳，加入定位的小工具就可以了：

```jsx=
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true,
  showUserHeading: true
}));
```

順便也加上切換全螢幕的按鈕給它了：

![](https://i.imgur.com/D3ueHdI.jpg)

你的美食地圖就完成啦！

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/foodMap)


過了一週不知道你有沒有跟我一樣愛上 Mapbox 的介面了 ><
明天開始會繼續介紹 API，希望我的學習速度能跟上發文 ...


## Reference
- [TDX｜觀光資訊](https://tdx.transportdata.tw/api-service/swagger#/)
