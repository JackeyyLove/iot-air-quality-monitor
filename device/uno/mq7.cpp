#include "mq7.h"
#include <math.h>
#include <string.h>
#include <Arduino.h>

MQ7::MQ7(uint8_t pin) {
  _pin = pin;
  _a0 = _COEF_A0;
  _a1 = _COEF_A1;
}

void MQ7::setRZero(float r0) {
  this->_r0 = r0;
}


// To get more precise value, increase the calibration duration
void MQ7::calibrate() {
  uint32_t t_start = millis();
  uint32_t calibraion_duration = 180000;
  float average_r0 = 0;
  uint32_t i = 1;
  while(millis() - t_start < calibraion_duration) {
    float r0 = this->getRZero();
    average_r0 = (average_r0 * (i - 1) + r0) / i;
    if(i < 50000)  ++i;
    delay(50);
  }
  this->_r0 = average_r0;
}

float MQ7::getCorrectionFactor(float t, float h) {
  float correctionFactor = (-0.0032 * h + 1.4697) * pow(t, -0.0002 * h - 0.1049);
  if(correctionFactor <= 0) return 1;
  return (-0.0032 * h + 1.4697) * pow(t, -0.0002 * h - 0.1049);
}

float MQ7::getResistance() {
  int val = analogRead(_pin);
  return (1023.0 / val - 1.0) * RLOAD;
}

float MQ7::getCorrectedResistance(float t, float h) {
  return getResistance()/getCorrectionFactor(t, h);
}

float MQ7::getPPM() {
  return _a0 * pow((getResistance() / _r0), _a1);
}

float MQ7::getCorrectedPPM(float t, float h) {
  return _a0 * pow((getCorrectedResistance(t, h) / _r0), _a1);
}

float MQ7::getRZero() {
  return getResistance() / _CALIBRATION_CONSTANT;
}

float MQ7::getCorrectedRZero(float t, float h) {
  return getCorrectedResistance(t, h) / _CALIBRATION_CONSTANT;
}