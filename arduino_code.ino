#include <Adafruit_SSD1306.h>
#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

const char* ssid = "SSN";
const char* password = "#####";
const char* serverName = "http://api.thingspeak.com/update";
String apiKey = "DDTR3XMOYVONB5JY";

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

int emgPin = 32; // EMG sensor connected to pin 32
int tempPin = 25;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Use the correct I2C address for your OLED display
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  display.display();
  delay(2000);
  display.clearDisplay();
}

// Function to convert analog reading to degrees Celsius
float convertToCelsius(int analogValue) {
  // Convert analog reading to voltage
  float voltage = (analogValue / 4095.0) * 3.3; 
  // Convert voltage to degrees Celsius
  float temperatureCelsius = (voltage - 0.5) * 100.0;

  return temperatureCelsius;
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    int emg = readEMGValue();

    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    String httpRequestData = "api_key=" + apiKey + "&field1=" + String(emg);
    int httpResponseCode = http.POST(httpRequestData);
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }

  int tempAnalogValue = analogRead(tempPin);
  float temperatureCelsius = convertToCelsius(tempAnalogValue);

  int emgg = analogRead(emgPin);

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);  // Position for EMG value
  display.print("EMG Value: ");
  display.print(emgg);
  
  display.setCursor(0, 20); // Position for Temperature value
  display.print("Temp Value: ");
  display.print(temperatureCelsius); // Display temperature in degrees Celsius
  display.display();
  
  delay(1000);
}

int readEMGValue() {
  int emgValue = analogRead(emgPin);
  Serial.println("EMG Value: " + String(emgValue));
  return emgValue;
}
