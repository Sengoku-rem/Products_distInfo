const express = require('express');
const app = express();
const PORT = 8080;

class Product {
    constructor(id, name, price) {
      this.id = id;
      this.name = name;
      this.price = price;
    }
}

class ProductDB {
    constructor() {
        this.productNum = 0;
        this.products = [];
    }
    
    add(name, price) {
        this.products.push(new Product(this.productNum, name, price));
        this.productNum++;
    }
}

let foods = new ProductDB();
foods.add("ポッキー", 280);
foods.add("きのこの山", 190);
foods.add("たけのこの里", 190);

//

app.get('/request', (req, res) => {
  let result = { err: "", result: 0, data: [] };
  res.contentType('json');
  res.header('Access-Control-Allow-Origin', '*');

  if(req.query.cmd == "search"){
    foods.products.forEach(e => {
        if (~ e.name.indexOf(req.query.name)) {
            //e.nameの中にクエリーの文字列を含むならのニョロ
            result.result++;
            result.data.push(e);
        }
    });
    if(result.result == 0){
        result.err = "そんな商品ないよ";
    }

    if(!req.query.name){
        result.err = "nameがないよ";
    }
  }else if(req.query.cmd == "all"){
    //全部出力
    res.send({ result: foods.length, data: foods });
  }else{
    result.err = "そんなコマンドないよ";
  }

  res.send(result);
});

app.get('/add', (req, res) => {
    let result = { err: "" };

    res.contentType('json');
    res.header('Access-Control-Allow-Origin', '*');

    if(!req.query.name || !req.query.price){
        result.err = "名前、または商品名がない。もしくは、コマンドが違います";
    }else{
        if(foods.products.some(e => e.name == req.query.name)){
            result.err = "もうあるよ";
        }else{
            foods.add(req.query.name, Number(req.query.price));
            res.send({ result: foods.length, data: foods });
        }
    }
    

    res.send(result);
});



app.listen(process.env.PORT || PORT);