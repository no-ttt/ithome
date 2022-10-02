###### tags: `ithome` `ironman`
# Day 17 - Layers (3)：Symbol

之前我們學到了怎麼用 Marker 在地圖上標點，其實利用 Layer 也可以做到一樣的效果喔！
那就是 Symbol Layer～

雖然效果一樣，但在過來人的使用心得還是建議如果不是有特別需求還是用 Marker 吧，Symbol Layer 所呈現的效果沒有 Marker 來的好看 (因為它就是一個圖層，不會有立體的港覺 (ง๑ •̀_•́)ง)。

## Symbol Layer
Symbol Layer 是將圖標 (圖片、icon) 或文本添加到地圖的圖層，透過經緯度決定它的擺放位置，跟 Marker 的應用情境很像，就是使用上比較多元。

先看一下基本的使用操作，最後來做一個小 Demo～

### Add a photo to the map
Symbol Layer 有 2 種應用情境，我就介紹我們平常會比較常使用的圖標部分，關於文本的範例我有找到官網給的，可以參考[這邊](https://docs.mapbox.com/mapbox-gl-js/example/change-case-of-labels/)；但其實用法上差不多啦，樣式需要套用文本的而已。

這個範例也是官網提供的，但我們改一下，把官網給的貓咪圖片放到台灣地圖上～

#### 1. 載入圖片
首先，我們先把圖片加入地圖：

```jsx=
map.on('load', () => {
  map.loadImage(
    'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',  // your image
    (error, image) => {
      if (error) throw error;

      map.addImage('cat', image);
    }
  )
})
```

- `loadImage(url, callback)`：加載外部圖片
    - `url`：外部圖片
    - `callback`：當圖片已加載或是帶有錯誤參數時調用
- `addImage(id, image, options)`：地圖加入圖片，`id` 須為唯一值

#### 2. 圖標資訊
這邊應該很熟悉吧 XD，將經緯度資訊加入 `source`：

```jsx=
map.addSource('point', {
  'type': 'geojson',
  'data': {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [121, 23.5]
        }
      }
    ]
  }
});
```
#### 3. 加入圖層
引用圖片資訊和 `source`：

```jsx=
map.addLayer({
  'id': 'point',
  'type': 'symbol',
  'source': 'point',
  'layout': {
    'icon-image': 'cat',
    'icon-size': 0.25
  }
});
```

- `icon-image`：`addImage` 的 id 名稱
- `icon-size`：圖片大小 (原圖大小倍率為 1，與原圖做相比)


最後，你就會得到一張有貓貓圖片的台灣地圖：

![](https://i.imgur.com/zJzpNzJ.png)


### 旅遊足跡地圖
既然 Symbol Layer 跟 Marker 很像，我們的實作就不要做跟 Marker 一樣的應用了，來做一張紀錄旅遊足跡的地圖吧！雖然說是旅遊足跡但照片我是網路上抓下來的啦，自己實作的時候可以改放自己的照片試試～

那這張地圖其實也就是把很多張圖片放到地圖上而已，我們拿上面的範例程式碼來做修改！
要加入多張圖片勢必會加入很多層 Symbol Layer，所以我們把它簡化寫成 Function：

```jsx=
addImage = (map, img, name, center, size) => {
  map.loadImage(
    img,
    (error, image) => {
    if (error) throw error;
      
    map.addImage(name, image);

    map.addSource(name, {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': center
            }
          }
        ]
      }
    });

    map.addLayer({
      'id': name,
      'type': 'symbol',
      'source': name, // reference the data source
      'layout': {
        'icon-image': name, // reference the image
        'icon-size': size
      }
    });
  })
}
```

解釋一下參數用途：
- `img`：圖片資料來源
- `name`：image, source, layer 的名稱
- `center`：圖片所在座標
- `size`：圖片大小

上面列的這些，根據不同圖片會有不同的設定，所以我們把它寫做參數。
再來只要載入這些資源就好了：

```jsx=
import taipei from './img/Taipei.jpeg'
import kaohsiung from './img/Kaohsiung.jpeg'
import taitung from './img/Taitung.jpeg'
import taichung from './img/Taichung.jpeg'
import hualien from './img/Hualien.jpeg'

...

map.on('load', () => {
  this.addImage(map, taipei, "taipei", [121.5616, 25.0335], 0.1)
  this.addImage(map, kaohsiung, "kaohsiung", [120.2710, 22.6499], 0.1)
  this.addImage(map, taitung, "taitung", [121.1129, 22.9202], 0.08)
  this.addImage(map, taichung, "taichung", [120.7266, 24.3351], 0.06)
  this.addImage(map, hualien, "hualien", [121.4520, 24.2008], 0.08)
})
```

然後你就會獲得你的足跡地圖：

![](https://i.imgur.com/Ybpzlv9.png)

其實黑色地圖也蠻好看的對吧 (⁎⁍̴̛ᴗ⁍̴̛⁎)

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Symbol_Layer)


又過完一個假日了，這幾天真的好忙啊 ...
開始敬佩完成鐵人賽的前輩們，之後我會心懷感恩的吸取文章知識的！
現在每天都在倒數完賽的那天呢 ... QUQ



## Reference
- [Symbol Layer properties](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol)
- [Symbol Layer｜Mapbox](https://docs.mapbox.com/help/glossary/symbol-layer/)
- [Add an icon to the map](https://docs.mapbox.com/mapbox-gl-js/example/add-image/)
- [Change the case of labels](https://docs.mapbox.com/mapbox-gl-js/example/change-case-of-labels/)
- [loadImage｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#loadimage)
- [addImage｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addimage)
