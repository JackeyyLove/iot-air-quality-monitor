#include "mq135.h"
#include <math.h>
#include <string.h>
#include <Arduino.h>

MQ135::MQ135(uint8_t pin, char* gas) {
  _pin = pin;
  if(strcmp(gas, "CO2") == 0) {
    _a = CO2_PARA;
    _b = CO2_PARB;
    _atm_level = ATMOCO2;
  }
  else if(strcmp(gas, "NH3") == 0) {
    _a = NH3_PARA;
    _b = NH3_PARB;
    _atm_level = ATMONH3;
  }
}

void MQ135::setRZero(float r0) {
  this->_r0 = r0;
}


// To get more precise value, increase the calibration duration
void MQ135::calibrate(float t = 25.0, float h = 50.0) {
  uint32_t t_start = millis();
  uint32_t calibraion_duration = 180000;
  float average_r0 = 0;
  uint32_t i = 1;
  while(millis() - t_start < calibraion_duration) {
    float r0 = this->getCorrectedRZero(t, h);
    average_r0 = (average_r0 * (i - 1) + r0) / i;
    if(i < 50000)  ++i;
    delay(50);
  }
  this->_r0 = average_r0;
}

float MQ135::getCorrectionFactor(float t, float h) {
  return CORA * t * t - CORB * t + CORC - (h-33.)*CORD;
}

/*
  V_out = RL / (Rs + RL) * V_in
  => Rs = (V_in / V_out - 1) * RL
  V_in = 5 (V)
  V_out = A0 / 1023 * 5 (V)
  => Rs = (1023 / A0 - 1) * RL
*/
float MQ135::getResistance() {
  int val = analogRead(_pin);
  return (1023.0 / val - 1.0) * RLOAD;
}

float MQ135::getCorrectedResistance(float t, float h) {
  return getResistance()/getCorrectionFactor(t, h);
}

/*
  c = A * (Rs/R0) ^ B (ppm)
  R0 = Rs * (A / c) ^ (1 / B)
*/
float MQ135::getPPM() {
  return _a * pow((getResistance() / _r0), _b);
}


float MQ135::getCorrectedPPM(float t, float h) {
  return _a * pow((getCorrectedResistance(t, h) / _r0), _b);
}


float MQ135::getRZero() {
  return getResistance() * pow((_a / _atm_level), (1.0 / _b));
}


float MQ135::getCorrectedRZero(float t, float h) {
  return getCorrectedResistance(t, h) * pow((_a / _atm_level), (1.0 / _b));
}
