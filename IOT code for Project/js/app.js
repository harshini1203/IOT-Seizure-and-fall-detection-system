const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
    // Read the JSON data and send it to the client
    console.log("started");
    fs.readFile('dummyData.json', 'utf8', (error, data) => {
        if (error) {
            console.error('Error reading data.json:', error);
        } else {
            const jsonData = JSON.parse(data);
            sendUpdateToClient(ws, jsonData, 0);
        }
    });
});

function sendUpdateToClient(ws, data, currentIndex) {
    const currentData = data[currentIndex];
    const result=isSeizure(currentData);
    console.log(result)
    currentIndex = (currentIndex + 1) % data.length;
    const sendData = {
      data: currentData,
      result: result,
  };

    // Send the current data to the client
    ws.send(JSON.stringify(sendData));

    // Set a timeout to send the next update
    setTimeout(() => {
        sendUpdateToClient(ws, data, currentIndex);
    }, 3000);
}

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
// Define a function to check for seizures based on the provided conditions
function isSeizure(data) {
    const temperature = data.temperature;
    const pulse = data.pulse;
    const SpO2 = data.SpO2;
    const EMG = data.EMG;
  
    // Define fuzzy logic membership functions for each condition
    function highTemperature(value) {
      if (value >= 38) return 1;
      else if (value >= 36.5 && value < 38) return (value - 36.5) / (38 - 36.5);
      else return 0;
    }
  
    function highPulse(value) {
      if (value >= 120) return 1;
      else if (value >= 60 && value < 120) return (value - 60) / (120 - 60);
      else return 0;
    }
  
    function lowSpO2(value) {
      if (value <= 90) return 1;
      else if (value > 90 && value < 96) return (96 - value) / (96 - 90);
      else return 0;
    }
  
    function highEMG(value) {
      if (value >= 1000) return 1;
      else if (value >= 0 && value < 1000) return value / 1000;
      else return 0;
    }
  
    // Apply fuzzy logic rules
    const temperatureDegree = highTemperature(temperature);
    const pulseDegree = highPulse(pulse);
    const SpO2Degree = lowSpO2(SpO2);
    const EMGDegree = highEMG(EMG);
  
    // Define the rules for seizure detection using fuzzy logic
    // These are just example rules and can be adjusted based on your requirements
    //const rule1 = Math.min(temperatureDegree, pulseDegree, SpO2Degree, EMGDegree);
  
    // If the result is high enough, consider it a seizure
    if (pulseDegree==1 && EMGDegree==1 && SpO2Degree==1) {
      return "Seizure detected!";
    }
  }
  
