const start = new Date();
const origin = require("./data.json");
const sheet = origin.Sheet1;
const fs = require('fs');

let result = [];
let level1 = 0, level2 = 0, level3 = 0;

// 获取省会
sheet.map(item => {
  item["value"] = item.name;
  item["label"] = item.name;
  if (item.type === '2') {
    level1++;
    result.push(item);
  }
});

// 获取城市
sheet.map(item => {
  if (item.type === '3') {
    result.map((province, index) => {
      if (item.parent_id === province.id) {
        level2++;
        if (result[index]['children']) {
          result[index]['children'].push(item);
        } else {
          result[index]['children'] = [item];
        }
      }
    })
  }
})

// 获取县
sheet.map(item => {
  if (item.type === "4") {
    result.map((province, provinceIdx) => {
      province.children.map((city, cityIdx) => {
        if (item.parent_id === city.id) {
          level3++;
          // console.log(item)
          let temp = city['children'];
          if (temp) {
            temp.push(item);
          } else {
            city['children'] = [item];
          }
        }
      })
    })
  }
})

// console.log(result);
console.log(`省${level1} 市${level2} 县${level3}`)

fs.writeFile("link.json", JSON.stringify(result), function (err) {
  console.log("The file was saved! Time:", new Date() - start);
}); 
