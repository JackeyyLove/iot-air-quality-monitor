#include <Arduino.h>
#include <SoftwareSerial.h>
#include "DHT.h"
#include "mq135.h"
#include "mq7.h"
#include <string.h>
#include <math.h>

#define DEVICE_ID "1"

#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define MQ135_CO2_PIN A0
#define MQ135_NH3_PIN A1
#define MQ7_CO_PIN A2
MQ135 mq135_co2(MQ135_CO2_PIN, "CO2");
MQ135 mq135_nh3(MQ135_NH3_PIN, "NH3");
MQ7 mq7_co(MQ7_CO_PIN);

#define PM25_PIN A5
#define PM25_LEDPOWER 12
const uint16_t pm25_samplingTime = 280;
const uint16_t pm25_deltaTime = 40;
const uint16_t pm25_sleepTime = 9680;

float temperature, humidity;
float co2_ppm, co_ppm, nh3_ppm, pm25;

char temperature_c[8] = "";
char humidity_c[8] = "";
char co2_ppm_c[8] = "";
char co_ppm_c[8] = "";
char nh3_ppm_c[8] = "";
char pm25_c[8] = "";

SoftwareSerial ESP(10,11);

char payload_format[] = "{\"device_id\":\"%s\",\"temperature\":\"%s\",\"humidity\":\"%s\",\"ppm\":{\"co2\":\"%s\", \"co\":\"%s\",\"nh3\":\"%s\",\"pm25\":\"%s\"}}";
char payload[256] = "";

void calculateTemperatureHumidity();
void mqCalibrate();
void calculateMQSensorValue();
void calculatePM25();
char* floatToStr(float a, char* buffer, int precision = 2);
void sendToEsp(const char* payload);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(PM25_LEDPOWER,OUTPUT);
  ESP.begin(9600);
  dht.begin();
}

void loop() {
  Serial.println("Start calculating...");

  calculateTemperatureHumidity();

  mqCalibrate();

  calculateMQSensorValue();

  calculatePM25();

  floatToStr(temperature, temperature_c, 2);
  floatToStr(humidity, humidity_c, 2);
  floatToStr(co2_ppm, co2_ppm_c, 2);
  floatToStr(co_ppm, co_ppm_c, 3);
  floatToStr(nh3_ppm, nh3_ppm_c, 3);
  floatToStr(pm25, pm25_c, 2);
  sprintf(payload, payload_format, DEVICE_ID, temperature_c, humidity_c, co2_ppm_c, co_ppm_c, nh3_ppm_c, pm25_c);

  Serial.println(payload);
  sendToEsp(payload);
}

void calculateTemperatureHumidity() {
  Serial.println("Calculate current temperature and humidity...");
  delay(2000);
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  Serial.println("Done");
  return;
}

void mqCalibrate() {
  Serial.print("Calibrating for CO2, CO, NH3 sensor...");
  uint32_t t_start = millis();
  uint32_t calibration_duration = 10000;
  uint32_t t_end = t_start + calibration_duration;
  float average_co2_r0 = 0, average_nh3_r0 = 0, average_co_r0 = 0;
  float co2_r0, nh3_r0, co_r0;
  uint32_t i = 1;

  if (t_end > t_start) {
    while (millis() >= t_start && millis() <= t_end) {
      co2_r0 = mq135_co2.getCorrectedRZero(temperature, humidity);
      average_co2_r0 = (average_co2_r0 * (i - 1) + co2_r0) / i;
      nh3_r0 = mq135_nh3.getCorrectedRZero(temperature, humidity);
      average_nh3_r0 = (average_nh3_r0 * (i - 1) + nh3_r0) / i;
      co_r0 = mq7_co.getCorrectedRZero(temperature, humidity);
      average_co_r0 = (average_co_r0 * (i - 1) + co_r0) / i;

      if (i < 50000) ++i;
      delay(50);
    }
  }
  else {
    while (millis() >= t_start || millis() <= t_end) {
      co2_r0 = mq135_co2.getCorrectedRZero(temperature, humidity);
      average_co2_r0 = (average_co2_r0 * (i - 1) + co2_r0) / i;
      nh3_r0 = mq135_nh3.getCorrectedRZero(temperature, humidity);
      average_nh3_r0 = (average_nh3_r0 * (i - 1) + nh3_r0) / i;
      co_r0 = mq7_co.getCorrectedRZero(temperature, humidity);
      average_co_r0 = (average_co_r0 * (i - 1) + co_r0) / i;

      if (i < 50000) ++i;
      delay(50);
    }
  }
  mq135_co2.setRZero(average_co2_r0);
  mq135_nh3.setRZero(average_nh3_r0);
  mq7_co.setRZero(average_co_r0);
  Serial.println("Done");
}

void calculateMQSensorValue() {
  float tmp;
  co2_ppm = 0; co_ppm = 0; nh3_ppm = 0;
  for(int i=1;i<=10;i++) {
    tmp = mq135_co2.getCorrectedPPM(temperature, humidity);
    co2_ppm = (co2_ppm * (i - 1) + tmp) / i;
    tmp = mq7_co.getCorrectedPPM(temperature, humidity);
    co_ppm = (co_ppm * (i - 1) + tmp) / i;
    tmp = mq135_nh3.getCorrectedPPM(temperature, humidity) / 1000;
    nh3_ppm = (nh3_ppm * (i - 1) + tmp) / i;
    delay(50);
  }
}

void calculatePM25() {
  pm25 = 0;
  for(int i=1;i<=10;i++) {
    digitalWrite(PM25_LEDPOWER, LOW);
    delayMicroseconds(pm25_samplingTime);

    float v_out = analogRead(PM25_PIN); // analog value

    delayMicroseconds(pm25_deltaTime);
    digitalWrite(PM25_LEDPOWER, HIGH);
    delayMicroseconds(pm25_sleepTime);

    v_out = v_out * (5.0 / 1023.0); // convert to V
    /*
      dust_density = 0.1711 * v_out - 0.1036
  , 0 <= v_out <= 3.5 (mg / m3);
      dust_density > 0.5 <=> v_out ~ 3.657
    */
    float tmp = (0.1711 * v_out - 0.1036) * 1000; // µg / m3
    if (tmp < 0) tmp = 0;
    if(tmp > 500) {
      pm25 = 500;
      break;
    }
    pm25 = (pm25 * (i - 1) + tmp) / i;
  }
}

char* floatToStr(float a, char* buffer, int precision) {
  if(precision > 5) precision = 5;
  dtostrf(a, 2, precision, buffer);
  return buffer;
}

void sendToEsp(const char* payload) {
  ESP.println(payload);
}