const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

const prizeUrl = {
  teddy: "https://i.imgur.com/KVLJTNC.png",
  keychain: "https://i.imgur.com/pgqjQmV.png",
  mask: "https://i.imgur.com/B8dBy4U.png",
};

//view engine set up
https: app.set("view engine", "ejs");

//app configuration
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON data
app.use(bodyParser.json());

function turnOff() {
  fs.writeFile("state.txt", "off", (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Data written to state.txt`);
    }
  });
}

function decrease() {
  fs.readFile("state.txt", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
    } else {
      const newData = String(Number(data) - 1);
      fs.writeFile("state.txt", newData, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Data written to state.txt`);
        }
      });
    }
  });
}

function getPrize() {
  return new Promise((resolve, reject) => {
    fs.readFile("prize.txt", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Error reading file");
      } else {
        //   res.set("Content-Type", "text/plain");
        resolve(data);
      }
    });
  });
}

function savePrize(prize) {
  fs.writeFile("prize.txt", prize, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Data written to state.txt`);
    }
  });
}

app.get("/", async (req, res) => {
  let prize = await getPrize();
  fs.readFile("state.txt", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
    } else {
      //   res.set("Content-Type", "text/plain");
      res.render("index", { data: data, prize });
    }
  });
});

app.post("/prize/save", (req, res) => {
  const receivedData = req.body;
  savePrize(receivedData.myString);
  res.sendStatus(200);
});

app.get("/state/change", (req, res) => {
  fs.readFile("state.txt", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
    } else {
      if (data > 0) {
        decrease();
      }
      res.send(data);
    }
  });
});

app.get("/chance/update/:chanceNumber", (req, res) => {
  const chanceNumber = req.params.chanceNumber;
  fs.writeFile("state.txt", chanceNumber, (err) => {
    if (err) {
      res.status(500).send("Error writting file");
    } else {
      res.status(200).send("Writting success");
    }
  });
});

app.get("/prize/update/:prize", (req, res) => {
  const prize = req.params.prize;
  fs.writeFile("prize.txt", prizeUrl.prize, (err) => {
    if (err) {
      res.status(500).send("Error writting file");
    } else {
      res.status(200).send("Writting success");
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
