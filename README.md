###### tags: `ithome` `ironman`
# Day 23 - Direction (2)：適合懶人的插件

如果你覺得接 Direction API 實在是很麻煩，要寫一大堆東西、只想用現成的話，
那麼～這篇非常適合你！

其實我是在找 Demo 主題的時候，意外找到這個東西的啦 XD
發現蠻好用的，所以在進入實作前，我們先來看看這個「懶人福音」要怎麼用吧！

## HTML Page
首先，我們要在 `public/index.html` 引入這串程式碼：

```htmlmixed=
<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.css" type="text/css">
<script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.js"></script>
```

原先我們設定的不用動喔！只要再加上去就行～

## Plugin
接下來打開你的主程式，透過 `addControl` 加上插件：
```jsx=
map.addControl(
  new MapboxDirections({
      accessToken: mapboxgl.accessToken
  }),
  'top-left'
);
```

歐虧完成，沒錯就是這麼簡單～
看一下地圖輸出畫面：

![](https://i.imgur.com/xRr9DCH.png)

隨意點擊地圖上 2 個點，它就會自動幫你畫好路段，而且還有附上花費時間～

那如果是想透過輸入來製造起點跟終點的話，也可以在左上角輸入經緯度、地名或地址，就能幫你加入地點，而且還可以自由選擇交通工具方式！

![](https://i.imgur.com/EJqIw8H.png)

如果沒有特別需求的話，其實這個插件就頗好用了吧～ ~~(就不用寫一堆 code ㄌ)~~

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Direction_plugin)


今天這篇算是小插曲啦 (*°ω°*ฅ)*
看到這麼好用的東西感覺要分享一下，順便記錄下來 XD

明天真的要來做個小實作ㄌ！


## Reference
- [Display navigation directions](https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-directions/)
- [Mapbox GL Directions](https://github.com/mapbox/mapbox-gl-directions)
