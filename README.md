###### tags: `ithome` `ironman`
# Day 18 - Layers (4)：Circle

第一次看到 Circle Layer 的時候，天真的我還以為就是在地圖上畫圓圈 ...
但原來是指在地圖上標圓點的意思 XD (一定也有人跟我一樣誤會的吧！)
那時候就在想為什麼不取個 Point Layer 比較好懂的名稱，後來才知道原來它除了簡單的標圓點以外還有進階功能的應用，所以這兩天我們就來看看 Circle Layer 可以怎麼使用吧！

(原本是打成一篇啦，但覺得篇幅太長還是分成 2 天好了～ (⁎⁍̴̛ᴗ⁍̴̛⁎))


## Circle Layer
為了幫後面的文章做鋪陳，我們的使用範例拿 [Day 07 - 來做一個美食地圖吧！](https://ithelp.ithome.com.tw/articles/10296538)的資料來改 ... 

欸等等，記得當初我們是 call TDX 的 API 做成的嗎？檔案格式是 JSON，依照 Layer 的同等套路 ... 對的沒綽，我們必須轉檔成 GeoJSON ...

在線轉換器我實在找不太到好用的，乾脆來自己寫一個吧！

### 資料處理
記得裝一下 [simplejson](https://pypi.org/project/simplejson/)，
```python=
from sys import argv
import simplejson as json 

script, in_file, out_file = argv

data = json.load(open(in_file))

geojson = {
  "type": "FeatureCollection",
  "features": [
  {
    "type": "Feature",
    "geometry" : {
      "type": "Point",
      "coordinates": [d["Position"]["PositionLon"], d["Position"]["PositionLat"]],
    },
    "properties" : d,
  } for d in data]
}

output = open(out_file, 'w')
json.dump(geojson, output, ensure_ascii = False)

print (geojson)


# execute: python3 transfer.py tainanRes.json output.json
```
Do～Re～Mi～So～你就會快樂的轉好檔案了～
(這段程式碼很簡單就不說明啦！)

### Basic Code
接下來也是同等套路：

```jsx=
import output from './output.json'

...

map.on('load', () => {
  map.addSource('restaurant', {
  type: 'geojson',
  data: output
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'restaurant',
    paint: {
      'circle-color': 'red',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });
});
```

- `circle-color`：圓的顏色
- `circle-radius`：圓的半徑長，，以 `px` 為單位
- `circle-stroke-width`：圓的外框寬度，以 `px` 為單位
- `circle-stroke-color`：圓的外框顏色

設定好樣式屬性後，你就會得到一張很多圓點的餐廳地圖：

![](https://i.imgur.com/iInT1it.jpg)

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Circle_Layer)

到這裡，大概就猜得到進階應用是什麼吧！
沒綽我們要來把這些點做群集，視覺效果上會舒服很 (超) 多～

那今天就先介紹到這邊，ㄅㄅ


## Reference
- [Circle Layer properties](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle)
- [TDX 運輸資料流通服務](https://tdx.transportdata.tw/api-service/swagger#/)
- [Is it possible to convert regular JSON to GeoJSON?](https://gis.stackexchange.com/questions/73756/is-it-possible-to-convert-regular-json-to-geojson)
