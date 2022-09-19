###### tags: `ithome` `ironman`
# Day 03 - 環境安裝 & init Map

耶～終於來到我們的寫 code 環節了～

## 基本裝備
- Mapbox access token
- Mapbox GL JS
- VSCode (主要以自己熟悉為主)
- Node.js / npm (Node >= 14.0.0 and npm >= 5.6)
- 熟悉 React 

## 建立環境
我們使用官網推薦的 `Create React App` 開始我們的專案，它會幫我們設定好開發環境：
```
npx create-react-app my-app
```

那建立好後就要來安裝我們所需要的東西啦～
打開 `package.json`，在 `dependencies` 內加上 `mapbox-gl` 的安裝資訊：

![](https://i.imgur.com/LFcnBJC.png)

再來就是安裝執行：

```
npm install
npm start
```

在瀏覽器打上 `http://localhost:3000/` 就會有官方的初始畫面了～

## init Map
既然都安裝好 Mapbox 了，今天還是要看到地圖的吧！

### HTML Page
除了安裝包以外，我們還要在 HTML 內引用它的相關文件
打開 `public/index.html` 並加入以下代碼：

```htmlmixed=
<script src='https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js'></script>
<link href='https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css' rel='stylesheet' />
```

### Add Mapbox GL JS
在 `src` 資料夾內我們新增一個 `Main.jsx` 檔案，並加入以下的 import statement：
```jsx=
import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
```

接下來就可以開始創建你要的地圖功能了，那我們今天就先簡單呈現基礎地圖！

### Render Map
#### 1. 設定地圖的默認值 (經緯度、縮放大小)

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
```

#### 2. 初始化地圖

```jsx=
componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
}
```

#### 3. 地圖渲染

```jsx=
render() {
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    );
}
```

#### 4. 調整地圖 css 設置
打開 `App.css`，加入你的地圖大小設定 (需要加上樣式設定，地圖才能成功渲染喔)

```css=
.map-container {
  height: 100vh;
}
```

完成以上步驟後，你就會得到一張台灣地圖啦～

![](https://i.imgur.com/HNpJ5Ea.png)

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/initMap)


我是用官網預設樣式的，如果想做更不一樣的地圖，可以再自己做設置！
Mapbox 介面真的好看對吧 (⁎⁍̴̛ᴗ⁍̴̛⁎)

明天開始介紹 API，明天見 ><


## Reference
- [Create React App](https://zh-hant.reactjs.org/docs/create-a-new-react-app.html#create-react-app)
- [Use Mapbox GL JS in a React app](https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/)
