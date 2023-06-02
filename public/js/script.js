const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const chance = document.getElementById("chance");
const prizes = [
  "/images/keychain.png",
  "/images/teddy.png",
  "/images/mask.png",
  "/images/keychain.png",
  "/images/teddy.png",
  "/images/mask.png",
];
//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
];
const data = {
  labels: [
    "Teddy bear",
    "Pink mask",
    "Key chain",
    "Teddy bear",
    "Pink mask",
    "Key chain",
  ],
  datasets: [
    {
      label: "Weekly Sales",
      data: [2, 2, 2, 2, 2, 2],
      backgroundColor: [
        "rgba(255, 26, 104, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 26, 104, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// config
const config = {
  type: "pie",
  data,
  options: {
    //Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      //hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      labels: {
        render: "image",
        images: [
          {
            src: "/images/teddy.png",
            width: 60,
            height: 60,
          },
          {
            src: "/images/mask.png",
            width: 60,
            height: 60,
          },
          {
            src: "/images/keychain.png",
            width: 60,
            height: 60,
          },
          {
            src: "/images/teddy.png",
            width: 60,
            height: 60,
          },
          {
            src: "/images/mask.png",
            width: 60,
            height: 60,
          },
          {
            src: "/images/keychain.png",
            width: 60,
            height: 60,
          },
        ],
      },
    },
  },
};
let myChart = new Chart(wheel, config);
//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      const imagePath = prizes[i.value % 6];
      finalValue.innerHTML = `Current prize: <img src="${imagePath}"/>`;
      const data = { myString: imagePath };
      fetch("/prize/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to indicate JSON data
        },
        body: JSON.stringify(data), // Convert the data object to a JSON string
      })
        .then((response) => {
          // Handle the response
        })
        .catch((error) => {
          // Handle the error
        });
      spinBtn.disabled = false;
      break;
    }
  }
};
//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
spinBtn.addEventListener("click", () => {
  fetch("/state/change")
    .then((res) => res.text())
    .then((data) => {
      if (data > 0) {
        spinBtn.disabled = true;
        //Empty final value
        finalValue.innerHTML = `<p>Good Luck!</p>`;
        //Generate random degrees to stop at
        let randomDegree = Math.floor(Math.random() * 6);
        randomDegree *= 60;
        console.log(randomDegree);
        //Interval for rotation animation
        let rotationInterval = window.setInterval(() => {
          //Set rotation for piechart
          /*
  Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
  */
          myChart.options.rotation = myChart.options.rotation + resultValue;
          //Update chart with new value;
          myChart.update();
          //If rotation>360 reset it back to 0
          if (myChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            myChart.options.rotation = 0;
          } else if (count > 15 && myChart.options.rotation == randomDegree) {
            valueGenerator(randomDegree);
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
          }
        }, 10);
        chance.innerHTML = "Chance left: " + (data - 1);
      } else {
        chance.innerHTML = "You don't have any turn left";
      }
    });
});

const updateChance = (chanceNumber) => {
  fetch("/chance/update/" + chanceNumber).then((res, err) => {
    if (res.status == 200) {
      window.location.reload();
    } else {
      console.log(res.statusText);
    }
  });
};

const updatePrize = (prize) => {
  console.log(123);
  fetch("/prize/update/" + prize).then((res, err) => {
    if (res.status == 200) {
      window.location.reload();
    } else {
      console.log(res.statusText);
    }
  });
};
