###### tags: `ithome` `ironman`
# Day 08 - Events (1)：Interaction

讓我們來跟地圖做一些互動吧！
其實前幾天的文章我們就有跟地圖做到互動了，像是點擊 Marker 或是使用者定位等等，那我們這幾天會特別專注於 Event 的部分～

Event 我分為 3 篇來做介紹，分別是 Interaction、Lifecycle、Movement，一樣我們所介紹的使用是我個人覺得比較常會用到的部分 (不然太...太多了...)，如果想知道更多應用可以到官網看一下～

## Working with Events
首先，先來說一下地圖是如何觸發 Event 的！
我們需要在地圖上增設 listener 為 Event 做監聽，可以指定樣式圖層 (style layer)，負責這個工作的有 `on`、`once`、`off`，這裡稍微說一下使用的情況，各自包含的事件類型可以到官網看一下，就不特別附上了(參數真 D 多，用這個水會有罪惡感...) --> [官網參考](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#on)

### on
> on：為指定類型的事件添加 listener，不限次數

```
on(type, layerIds, listener)
```

### once
> once：為指定類型的事件添加 listener，但只會監聽一次

```
once(type, layerIds, listener)
```

### off
> off：刪除之前所添加的 listener

```
off(type, layerIds, listener)
```

## Interaction
知道如何觸發 Event 後，我們就能來介紹一些常見的應用了～

- `mousedown`：地圖上按下鼠標
- `mouseup`：地圖上按下鼠標後放開
- `mouseover`：鼠標移到地圖上
- `mousemove`：鼠標在地圖上移動
- `click`：鼠標在地圖上同個點進行點擊和放開
- `dblclick`：鼠標在地圖上進行連續點擊
- `mouseenter`：當鼠標進入指定圖層時觸發 (需要指定 layer)
- `mouseleave`：當鼠標離開指定圖層時觸發 (需要指定 layer)
- `mouseout`：當鼠標離開地圖

忘記說了！這邊介紹的應用都是以電腦操作為前提，如果你是想做基於觸碰的使用者介面的，可以參考官網關於 `touch` 的應用介紹！
(不過上面這些就頗夠用了啦，除非一些觸碰的特殊狀況)

那講了這麼多個指令，來帶一個使用範例好了：
> ex. 對地圖做雙點擊

```jsx=
map.on('dblclick', () => {
  alert('你點擊了我好幾次！');
});
```

只要對地圖點擊一次以上，就會跳出小視窗：

![](https://i.imgur.com/YnQeAGk.png)

(點擊一次是沒有用的！)

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Interaction)


明天繼續來介紹其他 Event ～ 今天是快樂星期五 (*´∀`)~♥ 

## Reference
- [Working with Events｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#on)
- [Event｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#map-events)
- [觸控事件 (touch)](https://developer.mozilla.org/zh-TW/docs/Web/API/Touch_events)
