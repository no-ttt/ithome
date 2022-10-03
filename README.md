###### tags: `ithome` `ironman`
# Day 19 - Layers (5)：Cluster

不知道大家還記不記得我們在[Day 07 - 來做一個美食地圖吧！](https://ithelp.ithome.com.tw/articles/10296538)的時候做了一張美食地圖？
當初許的承諾今天就來實現吧！
我們來把那張密集的很可怕的地圖做視覺上的修改～

(這篇會以前一天的實作做延續，不懂的可以看一下[這裡](https://ithelp.ithome.com.tw/articles/10303518))

## Cluster
Cluster 就是原本密集的很多點會透過使用者所設定的半徑集合成一個大圓點，並以數字代表這個範圍的點數量，在點擊或縮放的使用下去呈現相應的畫面，使用出來的效果會像這樣：

![](https://i.imgur.com/ogoLSIJ.png)

使用上應該是蠻常見的吧～

### 1. Cluster Setting
在 `addSource` 添加 Cluster 的設定：

```jsx=
import output from './output.json'

...

map.addSource('restaurant', {
  type: 'geojson',
  data: output,
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 80
});
```

- `cluster`：數據資料是否為一個集合；若設置為 `true`，資料會附加上 Point 這個新屬性
- `clusterMaxZoom`：Cluster 的最大縮放量
- `clusterRadius`：Cluster 指定半徑內所涵蓋的資料數量

### 2. Cluster Layer
#### 群集樣式設定
Circle Layer 做群集效果 (利用 `filter` 抓出 Cluster 的子集)：

```jsx=
map.addLayer({
  id: 'clusters',
  type: 'circle',
  source: 'restaurant',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1f075',
      250,
      '#f28cb1'
    ],
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      20,
      100,
      30,
      750,
      40
    ]
  }
});
```

- `point_count`：分到這個 cluster 的 point 數量
- `step`：制定不同階段下的不同輸出結果，分三個階段實現 3 種類型的 Circle：
    - 當點數量小於 100 時，為 20px、顏色為 `#51bbd6` 的 Circle
    - 當點數量小於 750 時，為 20px、顏色為 `#f1f075` 的 Circle
    - 當點數量大於 750 時，為 20px、顏色為 `#f28cb1` 的 Circle
- `["has", string]`：測試當前功能的屬性中是否存在屬性值
- `["get", string]`：從當前要素的屬性中檢索屬性值


#### 群集文字設定
Symbol Layer 來做 Cluster 上的數量文字顯示：
```jsx=
map.addLayer({
  id: 'cluster-count',
  type: 'symbol',
  source: 'restaurant',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
});
```

利用 `filter` 找出現在是 Cluster 有哪些 (`['has', 'point_count']`)，`type` 設置為 `symbol`，再依照自己的需求設定文字的樣式～

### 3. Unclustered point
最後來處理一下非群集的部分：

```jsx=
map.addLayer({
  id: 'unclustered-point',
  type: 'circle',
  source: 'restaurant',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': 'red',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
});
```

一樣的，我們利用 `filter` 篩選出非群集的這些 point (`['!', ['has', 'point_count']]`)，`type` 設置為 `cirle`，再來設置點的樣式～

### 4. add Event
最後就是要來加上點擊 Cluster 縮放的事件啦！

```jsx=
map.on('click', 'clusters', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
  });
  const clusterId = features[0].properties.cluster_id;
  map.getSource('restaurant').getClusterExpansionZoom(
    clusterId,
    (err, zoom) => {
      if (err) return;
  
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
    }
  );
});
```

將 Event 設置監聽滑鼠點擊 Cluster 圖層 (`clusters`)：
- `queryRenderedFeatures`：回傳符合指定條件的所有 feature
- `getClusterExpansionZoom`：獲取給定 cluster 的縮放比例

讓我們來看一下地圖的最後輸出效果～

![](https://i.imgur.com/kjANQYM.png)

介面上看起來舒服很多吧！

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Cluster_Layer)


我們 Layer 部分也快告一段落了，明天來講最後一個要介紹的圖層～
Layer 的部分我也是因為寫鐵人賽才開始研究怎麼使用的，不然其實也只是寫過 Cluster Layer 而已，如果有錯誤的話麻煩再跟我說 :D



## Reference
- [Create and style clusters](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle)
- [Expression documentation](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/)
- [geojson-cluster](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#geojson-cluster)
- [queryRenderedFeatures](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#queryrenderedfeatures)
- [getClusterExpansionZoom](https://docs.mapbox.com/mapbox-gl-js/api/sources/#geojsonsource#getclusterexpansionzoom)
