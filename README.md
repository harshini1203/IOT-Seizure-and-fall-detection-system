# IOT-Seizure-and-fall-detection-system

## What is a seizure?
A seizure is a condition where there is sudden electric disturbances in the brain that causes involuntary changes in the body like body movements, behavior and loss of consciousness. 

## What our system does:
Our system provides a basic seizure detection mechanism that uses sensors for detecting physiological changes. These include:
1. LM35DZ for recording body temperature
2. Mpu6050 Accelerometer module for fall detection
3. EMG sensor for detecting change in electric activity of the muscles
4. Pulse sensor for detecting heart rate
5. Esp32 WiFi Module microcontroller 

The data is read and sent to Thingspeak cloud and also displayed using OLED.

## How the system works:
1. Sensors detect physiological changes and these analog signals are captured by our ESP32 Wifi microcontroller module.
2. The ESP32 has a built in Analog to Digital Converter and it processes these signals.
3. Using the Arduino IDE, a code is written that allows us to process this data. The following processes take place:
   - Setup phase:
        - Serial communication between the ESP32 module and computer.
        - Initiating Wifi connection using SSID and password.
        - Initialising OLED display
   - Loop function:
        - Initialising HTTP connection.
        - Setting up the HTTP request header: Setting up content type (url-form-encoded), method: POST
        - Sending the HTTP post request to the ThingSpeak Server through it's API using API Key.
        - Displaying in OLED
4. User interface:
   - Created a simple dashboard using HTML and CSS that displays the iframe fetched from the ThingSpeak cloud which displays the real time data from the sensors.

## OUTPUT:

### Dashboard: 
![image](https://github.com/user-attachments/assets/d02c53d3-29aa-485b-bf54-887068f49556)

### ThingSpeak iframe (with EMG sensor details):
![image](https://github.com/user-attachments/assets/dc06ce45-6ecd-4470-8770-8020df2f9106)

### Hardware:

<img src="https://github.com/user-attachments/assets/1419cee5-ffd7-431e-b136-21b30b95c6d8" width="400px" height="450px">
<img src="https://github.com/user-attachments/assets/3dc9e0d7-1920-4f4c-b4d8-0d45f748b54f" width="400px" height="450px">

## Future scope:
Using machine learning classification algorithms to classify a seizure based on the sensor data and using the provided user details like phone number to send them an alert. 

