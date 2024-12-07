#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>

const char* ssid = "QuySy_Mesh";
const char* password = "inheritance";

const char* mqtt_broker_host = "broker.hivemq.com";
const int mqtt_broker_port = 1883;
const char* mqtt_topic_pub = "20215533/my_aqi_broker";
const char* mqtt_client_id = "20215533";

SoftwareSerial UNO(D6,D7);

WiFiClient espClient;
PubSubClient mqtt_client(espClient);  

void wifiConnect();
void mqttConnectAndPublish(const char* payload, int timeout = 10000);
void receiveSensorData();

void setup() {
  // Serial.begin(9600);
  UNO.begin(9600, SWSERIAL_8N1, D6, D7, false, 256);
  wifiConnect();
  while(!UNO);
  mqtt_client.setServer(mqtt_broker_host, mqtt_broker_port);
}

void loop() {
  if(UNO.available()) {
    String data = UNO.readStringUntil('\n');
    mqttConnectAndPublish(data.c_str());
  }
}

void wifiConnect() {
  WiFi.begin(ssid, password);
  // Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      // Serial.print(".");
  }
  // Serial.println("\nConnected to the WiFi network");
}

void mqttConnectAndPublish(const char* payload, int timeout) {
  unsigned long t_start = millis();
  unsigned long t_stop = t_start + timeout;
  while(!mqtt_client.connected()) {
    // Serial.println("Connecting to MQTT Broker...");
    if (mqtt_client.connect(mqtt_client_id)) {
        // Serial.println("Connected");
        mqtt_client.publish(mqtt_topic_pub, payload);
        mqtt_client.disconnect();
        break;
    }
    if(t_stop >= t_start) {
      if(t_stop < millis()) break;
    }
    else {
      if(t_start < millis() || millis() < t_stop) continue;
      else break;
    }
  }
}
