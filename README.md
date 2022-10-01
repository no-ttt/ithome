###### tags: `ithome` `ironman`
# Day 15 - Layers (1)：Line

上一篇介紹 Layer 的架構時，我們有說過，「 除了 `background` 和 `sky` 以外，每個圖層都需要從 `source` 引用數據 」，那我們要怎麼引用這些數據？在資料格式上有沒有限制？

所以！在進入介紹 Layer 的這些應用之前，我們先來看看關於資料來源要怎麼做處理以及使用～

## Source
- `addSource(id, source)`：將數據資料加到地圖
    - `id`：source 的 id，必須是唯一的；當 Layer 要使用 source 時，會呼叫指定 `id`
    - `source`：資料來源
    - `type`：資料格式，ex. geojson, image

> ex. 使用現有資料：
```jsx=
map.addSource('my-data', {
  "type": "geojson",
  "data": {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-77.0323, 38.9131]
    },
    "properties": {
      "title": "Mapbox DC",
      "marker-symbol": "monument"
    }
  }
});
```

> ex. 資料來源是連結：

```jsx=
map.addSource('earthquakes', {
  type: 'geojson',
  data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
});
```

- `removeSource(id)`：刪除資料來源

> 移除指定的資料來源：

```jsx=
map.removeSource('my-data');
```

### GeoJSON
GeoJSON 是一種基於 JSON 的地理空間數據格式，用來表示地理要素、屬性、和它們的空間範圍數據。那會特別拿來講是因為 Layer 的經緯度資料格式是以 GeoJSON 為主，而一般來說我們的資料格式大多是用 JSON，在使用 Layer 的時候就需要注意一下轉檔問題。


## Line Layer
官網對於 Layer 好像都沒有做特別的使用介紹 (至少我是沒找到啦 QQ)，看起來是放上範例直接實戰了，阿不過倒是放了很多 `paint` 或 `layout` 可以使用的樣式，真的太多～太多～太多了，所以這部分我就放上連結，可以等需要的時候再來看一下！ ([傳送門](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line))

因為沒有介紹可以做整理參考了 (~~不能水文章了~~) ...
所以我決定接下來關於 Layer 的部分都來寫一個範例！實戰使人成長嘛～

今天的主題是 Line Layer，那我們就來繪製台灣縣市地圖好了！
說到 Line ，大家第一個想到的應該都是畫直線這件事吧，但其實也可以透過不斷標點畫線做出不一樣的操作喔！就像你拿著筆在紙上畫畫一樣～

### 資料處理
縣市界線我是去政府資料開放平台下載的：

![](https://i.imgur.com/YnaNcYe.png)

那眼尖的你一定發現了，資料格式沒有 GeoJSON 檔？
沒綽我們要先來做資料處理的部分了 ...
這邊推薦一個 [mapshaper](https://mapshaper.org/) 的網站，來繼續看下去你就知道它多麼神奇了 (⁎⁍̴̛ᴗ⁍̴̛⁎)

資料我們先下載 `SHP` 格式，然後開啟 mapshaper，直接把檔案拖進去做處理：

![](https://i.imgur.com/yWnJCHt.png)

點擊 import 匯入：

![](https://i.imgur.com/xGNdCSn.png)

然後你就會獲得一張台灣地圖：

![](https://i.imgur.com/6G25M2k.png)

輸出前可以選擇把地圖做簡化，接下來只要把檔案匯出成 GeoJSON 檔就好：

![](https://i.imgur.com/YaRtcNj.png)

那你就會拿到台灣的邊界經緯度資料了，到這邊差不多完成 80% 了吧！(不誇張)

### 繪製台灣地圖
```jsx=
import geoData from "./Taiwan.json"
...
map.on('load', () => {
  map.addSource('taiwan', {
    'type': 'geojson',
    'data': geoData
  });
    
  map.addLayer({
    'id': 'taiwanLayer',
    'type': 'line',
    'source': 'taiwan',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round',
    },
    'paint': {
      'line-color': '#888',
      'line-width': 2,
    }
  });
});
```
稍微來解釋一下程式碼，不過其實一看就懂了吧 XDD

`Taiwan.json` 這個檔案是我們剛剛處理完的匯出檔，`addSource` 將資料加入地圖，`type` 記得要選 `geojson`，`taiwan` 是這個資料在地圖的名稱；
在 `addLayer` 的這個 `id` 則是 Layer 的名稱 (`taiwanLayer`)，那資料來源 `source` 這邊我們填上 `taiwan`，`type` 記得選 `line`，其餘的設定隨意～

最後，你就會獲得一張台灣地圖：

![](https://i.imgur.com/roVQWhn.png)

因為在處理資料的時候我有簡化地圖 (怕檔案太大)，所以看起來比較粗糙一點～
蠻簡單的吧！

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Line_layer)

既然今天我們都畫出台灣地圖了，那明天來幫他上個色好了～


## Reference
- [addSource｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addsource)
- [GeoJSONSource](https://docs.mapbox.com/mapbox-gl-js/api/sources/#geojsonsource)
- [Line Layer (style-spec)](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line)
- [Line Example｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/example/?topic=Layers&search=line)
- [D3.js 繪製臺灣地圖](https://ithelp.ithome.com.tw/articles/10223786)
- [直轄市、縣市界線(TWD97經緯度)｜政府資料開放平臺](https://data.gov.tw/dataset/7442)
- [mapshaper](https://mapshaper.org/)
- [Load data from an external GeoJSON file](https://docs.mapbox.com/mapbox-gl-js/example/external-geojson/)
