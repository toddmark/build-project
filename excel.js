const start = new Date();
const origin = require("./data.json");
const sheet = origin.Sheet1;
const fs = require('fs');

let result = [];

// 获取省会
sheet.map(item => {
  item["value"] = item.name;
  item["label"] = item.name;
  if (item.type === '2') {
    result.push(item);
  }
});

// 获取城市
sheet.map(item => {
  if (item.type === '3') {
    result.map((province, index) => {
      if (item.parent_id === province.id) {
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

fs.writeFile("link.js", JSON.stringify(result), function (err) {
  console.log("The file was saved! Time:", new Date() - start);
}); 
