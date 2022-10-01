###### tags: `ithome` `ironman`
# Day 16 - Layers (2)：Fill

昨天我們用 Line 畫了台灣地圖，那今天就來幫台灣地圖上個色吧 XD
資料來源我們一樣用政府資料開放平台所提供的縣市邊界檔案，如果沒看前一篇的介紹可以看一下資料處理部分喔！([傳送門](https://ithelp.ithome.com.tw/articles/10301879))


## Fill Layer
Fill Layer 的做法其實跟 Line Layer 很像，它是在地圖上標座標，被標示圈列起來的區塊就會被填上色塊，就是這麼簡單～

所以如果你有跟著昨天的範例做的話，只要把 `addLayer` 的 `type` 改成 `fill`，再把關於 `line` 樣式屬性修改成 `fill` 的，你就會得到一張有上色的台灣地圖：

```jsx=
map.addLayer({
  'id': 'fill-layer',
  'type': 'fill',
  'source': 'Taiwan',
  'paint': {
    'fill-color': 'red',
    'fill-opacity': 0.5
  }
});
```

> 地圖輸出結果：

![](https://i.imgur.com/9u9nxv4.png)

但我們今天主要目標要做得沒有這麼簡單啦！(我絕對不會說我原本就想這樣帶過 ...)
我們要做的，是根據區域來塗上不同的顏色，最後你就會得到一張彩色台灣～

### About Data
我們剛剛前面有提到，Fill Layer 的做法是利用標點匡出要塗色的區塊，那如果我們要針對地區分別塗色的話，就必須知道各自地區的邊界。根據上面的範例可以看到，目前的檔案是會把全台灣地區都一起上色，那我們要怎麼抓出各自區域？

這個時候我們就能打開昨天處理好的 GeoJSON 檔來看一下資訊！

為了能更好的觀察資料，我用了[JSON格式化在線工具](https://coding.tools/tw/json-formatter)，可以看到在我們昨天輸出的這個檔案裡，其實它已經幫我們標好各自區塊的邊界經緯度了：

![](https://i.imgur.com/xHHHUbK.png)

到這裡就可以開心一下，因為這會讓我們在實作上會輕鬆許多～
(昨天沒用線上工具看資料看到眼睛超酸 ...இɷஇ)

### Filter
那要特別抓出指定區域的邊界經緯度資料，我們就需要用到 `filter` 了！
它是 `addLayer` 的屬性之一，可以對 `source` 進行篩選，假設我們現在造針對南投縣進行塗色，我們可以這樣做：

```jsx=
map.addLayer({
  'id': '南投縣',
  'type': 'fill',
  'source': 'Taiwan',
  'paint': {
    'fill-color': 'red',
    'fill-opacity': 0.5
  },
  filter: ['==', 'COUNTYNAME', '南投縣']
});
```

`filter` 那行的意思是「篩選條件設為 `COUNTYNAME` == `南投縣`」，這樣我們就能抓到南投縣的邊界經緯度資料了，來看一下地圖輸出：

![](https://i.imgur.com/WJkEI3X.png)

到這邊其實完成的差不多了，最後來做個結尾吧！

### 台灣區域地圖
根據上面的例子，我們可以大概想像到，如果要每個區塊都個別上色會需要疊多層的 Layer，這樣會寫一堆程式碼，那我們簡化一下把 `addLayer` 的部分寫成 Function：

```jsx=
addBlock = (map, name, color) => {
  map.addLayer({
    'id': name,
    'type': 'fill',
    'source': 'Taiwan',
    'paint': {
      'fill-color': color,
      'fill-opacity': 0.5
    },
    filter: ['==', 'COUNTYNAME', name]
  });
}
```

有 3 個參數，我們來各自解釋一下用途：
- `map`：在 Function 內我們要使用 `addLayer` 的話，就需要帶上 `map` 這個 element，所以必須當成參數引入
- `name`：每個 Layer 都需要唯一的 id 名稱，否則會跑出錯誤訊息
- `color`：Fill Layer 的區塊顏色

接下來我把所有台灣本島的縣市以及他們所對應到的顏色寫成 Array，這樣就能直接用 `forEach` 跑迴圈了：

```jsx=
const city = ["宜蘭縣", "新北市", "臺北市", "基隆市", "桃園市", "新竹縣", "新竹市", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義縣", "嘉義市", "臺南市", "高雄市", "屏東縣", "臺東縣", "花蓮縣"]
const color = ["#FC6300", "#FC6300", "#FC6300", "#FC6300", "#FAC670", "#FAC670", "#FAC670", "#FAC670", "#008481", "#008481", "#008481", "#BEA8E6", "#BEA8E6" , "#BEA8E6", "#BEA8E6", "#FCA175", "#FCA175", "#91C3CE", "#91C3CE"]

...

city.forEach((c, i) => {
  this.addBlock (map, c, color[i])
})
```

> 地圖輸出結果：

![](https://i.imgur.com/qzFi521.png)

區域地圖就完成啦！

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Fill_Layer)


不知不覺鐵人賽已經到了 16 天了 (才沒有不知不覺 QQ) ...
寫到這邊不得感嘆一下我沒想到我可以堅持這麼多天哈哈，雖然可能是因為報了團體賽的連坐壓力 XD
但還有半個月要撐，一起加油吧夥伴們！

然後不得抱怨一下 Mapbox 官網的資料真的好亂吶 ...
雖然這也是我當初決定要拿來做主題的原因，因為我的筆記也好亂～


## Reference
- [直轄市、縣市界線(TWD97經緯度)｜政府資料開放平臺](https://data.gov.tw/dataset/7442)
- [mapshaper](https://mapshaper.org/)
- [JSON格式化在線工具](https://coding.tools/tw/json-formatter)
- [Filter](https://docs.mapbox.com/help/glossary/filter/)
- [Fill Layer properties](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#fill)
- [Fill Layer (style-spec)](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#fill)
