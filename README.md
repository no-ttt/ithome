###### tags: `ithome` `ironman`
# Day 06 - 給地圖加上彈跳窗

彈跳窗也是個常用的功能，所以我們今天來看看如何在地圖上產生彈跳窗！
剛好前幾天學了如何在地圖上標記 Marker，結合一下來做一個小功能～ GoGo


## Popup
> Popup：

```
new Popup(options: Object?)
```

簡單產生一個彈跳窗的寫法很簡單，跟 Marker 的寫法有點相像：

```jsx=
const popup = new mapboxgl.Popup()
  .setLngLat([121, 23.5])
  .setHTML('<h1>Hello World!</h1>')
  .addTo(map);
```

`setLngLat` 是設置彈跳窗的位置 (經緯度)，`setHTML` 內放你要的文字訊息，記得要是 HTML 格式的喔！加上這段程式碼後你就會得到一張有彈跳窗的地圖：

![](https://i.imgur.com/tPf7HJb.png)

是不是很簡單！
那 Mapbox 也有對彈跳窗的功能設定，我把一些常用的列出來：

### Parameters

| Name | Default | Description |
| -------- | -------- | -------- |
| anchor     | bottom    | 彈跳窗顯示位置 (`center` / `top` / `bottom` / `left` / `right` / `top-left` / `top-right` / `bottom-left` / `bottom-right`)     |
| closeButton     | true     | 是否顯示關閉按鈕     |
| closeOnClick     | true     | 點擊地圖時彈跳窗是否關閉     |
| closeOnMove     | false     | 移動地圖時彈跳窗是否關閉     |
| maxWidth     | 240px     | 彈跳窗最大寬度     |
| offset     | 0px     | 彈跳窗和所設定的經緯度的偏移大小     |

這邊帶一個使用範例：
> ex. 彈跳窗不顯示關閉按鈕

```jsx
const popup = new mapboxgl.Popup({
  closeButton: false
})
  .setLngLat([121, 23.5])
  .setHTML('<h1>Hello World!</h1>')
  .addTo(map);
```

## 點擊 Marker 出現彈跳窗
接下來就來介紹組合技了˛˛ꉂ ◞•̀д•́)◞⚔◟(•̀д•́◟ )

我們常在地圖上使用彈跳窗的情況還是點擊 Marker 的時候對吧！寫法只要再加上 `setPopup` 就好，其他詳細用法跟上面的介紹一樣：

```jsx=
const marker = new mapboxgl.Marker()
  .setLngLat([121, 23.5])
  .setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>"))
  .addTo(map);
```

點擊 Marker，就會跑出彈跳窗：

![](https://i.imgur.com/wwxFdHD.png)

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Popup)


今天的東西比較輕鬆，那明天會利用這幾天學到的東西來做一個小 Demo，期待一下～
阿對了，如果對 React 不熟悉或是對資安有興趣的人可以來看這兩個系列的文章喔！

- [新手進化日記，從React至Redux Saga](https://ithelp.ithome.com.tw/users/20152673/ironman/5863)
- [資安新人30](https://ithelp.ithome.com.tw/users/20152636/ironman/5865)


(這算置入性行銷ㄇ..？)


## Reference
- [Popup｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup)
- [setPopup](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#setpopup)
