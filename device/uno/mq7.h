#include <stdint.h>

/*
  ppm(Rs/R0) = A0 * Rs/R0 ^ (A1)
*/

#define RLOAD 1.0 // The load resistance on the board
#define _COEF_A0 100.0
#define _COEF_A1 -1.513
/*
  In clean air, approx 10ppm, ratio is Rs / R0 = 5.0
*/
#define _CALIBRATION_CONSTANT 5.0

/*
  Rs/R0 = a * t ^ b
  h = 33%, Rs/R0 = 1.3643 * t ^ (-0.11)
  h = 85%, Rs/R0 = 1.1982 * t ^ (-0.118)
  => a = -0.0032 * h + 1.4697
  b = -0.0002 * h - 0.1049
*/

class MQ7 {
 private:
  uint8_t _pin;
  float _a0;
  float _a1;
  float _r0;

 public:
  MQ7(uint8_t pin);
  void calibrate();
  void setRZero(float r0);
  float getCorrectionFactor(float t, float h);
  float getResistance();
  float getCorrectedResistance(float t, float h);
  float getPPM();
  float getCorrectedPPM(float t, float h);
  float getRZero();
  float getCorrectedRZero(float t, float h);
};
