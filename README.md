###### tags: `ithome` `ironman`
# Day 20 - Layers (6)：Heatmap

耶～終於到我們介紹的最後一篇 Layer 啦～
你一定看過這種類型的地圖：

![](https://i0.wp.com/www.soft4fun.net/wp-content/uploads/2016/12/image-8.png?resize=590%2C392&quality=100&strip=all&ssl=1)

> 圖片來源：https://www.soft4fun.net/tech/news/e-invoice-heatmap.htm

這張是根據電子發票來推斷台灣消費熱區的地圖，我們可以用顏色來區分密集度，進而能從視覺化上快速找到消費高的地區是哪裡，這就是 Heatmap 的用途！

知道用途後，我們先看一些創建 Heatmap 的重要屬性，最後來做一張台灣車禍地圖吧～
範例我參考官網給的程式碼，因為主要是要介紹 Heatmap 所以有做一點簡化，想看更詳細的使用可以看一下[官網範例](https://docs.mapbox.com/help/tutorials/make-a-heatmap-with-mapbox-gl-js/)！


## Heatmap paint properties
- `heatmap-weight`：每個點對 Heatmap 的權重，默認值為 1
- `heatmap-intensity`：Heatmap 的強度
- `heatmap-color`：Heatmap 的顏色漸變，從最小值到最大值
- `heatmap-radius`：每個點的半徑 (pixel 為單位)
- `heatmap-opacity`：Heatmap 圖層的不透明度

## 台灣車禍地圖
### 1. 數據處理
資料來源我是從[政府開放平台](https://data.gov.tw/)拿的，怕資料太龐大不好實作所以只有拿 A1 部分的資料 (提供造成人員當場或24小時內死亡之交通事故資料)。開放平台所提供的資料檔案格式是 Json，所以我們要先來進行轉檔，我們之前有寫過轉檔的程式碼，不知道的可以看一下[這裡](https://ithelp.ithome.com.tw/articles/10303518)～

轉成 GeoJSON 檔後，我們就可以把資料加到地圖了：

```jsx=
import traffic from './traffic.json'

...

map.addSource('traffic', {
  'type': 'geojson',
  'data': traffic
});
```

資料名稱為 `traffic`～

### 2. 添加 Heatmap 圖層
接下來利用 `addLayer` 創建 Heapmap 圖層，並且透過我們剛剛介紹的屬性做外觀上的微調：

```jsx=
map.addLayer({
  'id': 'traffic-heat',
  'type': 'heatmap',
  'source': 'traffic',
  'maxzoom': 15,
  'paint': {
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(236,222,239,0)',
      0.2,
      'rgb(208,209,230)',
      0.4,
      'rgb(166,189,219)',
      0.6,
      'rgb(103,169,207)',
      0.8,
      'rgb(28,144,153)'
    ],
    'heatmap-radius': {
      'stops': [
        [11, 15],
        [15, 20]
      ]
    },
    'heatmap-opacity': {
      'default': 1,
      'stops': [
        [14, 1],
        [15, 0]
      ]
    }
  }
});
```

- `heatmap-color`：各階段輸出所規定的對應顏色
    - `interpolate`：制定不同階段下的不同輸出結果，產生連續、平滑的效果
    - `['linear']`：在剛好小於和剛好大於輸入的停止點之間進行線性插值 
    - `['heatmap-density']`：回傳 Heatmap 中像素的密度估計
- `heatmap-radius`：隨著縮放級別增加，半徑增加
    - `stops`：
        - 縮放級別 11 -> 半徑 15 px
        - 縮放級別 15 -> 半徑 20 px
- `heatmap-opacity`：縮放級別在 14 到 15 的過渡期間，透明度提升 (`1` -> `0`)

> 地圖輸出：

![](https://i.imgur.com/eFJr17M.png)

太密集了所以我有先放大再截圖～ (台灣真的太小ㄌ)

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/HeatMap_Layer)


Layer 的部分就先告一段落了～(撒花)
希望這一系列的文章到目前有幫助到你！(⁎⁍̴̛ᴗ⁍̴̛⁎)

突然發現 Layer 我竟然寫了快一個禮拜，難怪覺得這禮拜怎麼過得那麼久 ...


## Reference
- [Heatmap properties](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#heatmap)
- [Make a heatmap with Mapbox GL JS](https://docs.mapbox.com/help/tutorials/make-a-heatmap-with-mapbox-gl-js/)
- [即時交通事故資料 (A1類)(json格式)](https://data.gov.tw/dataset/57023)
- [stops｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/style-spec/other/#function-stops)
- [Expression documentation](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/)
