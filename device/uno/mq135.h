#include <stdint.h>
/*
  Rs / R0 = A * c ^ B
  V_out = RL / (Rs + RL) * V_in

  Exponential regression:
GAS      | A      | B
CO       | 605.18 | -3.937  
Alcohol  | 77.255 | -3.18 
CO2      | 110.47 | -2.862
Toluen   | 44.947 | -3.445
NH3      | 5.838  | -2.138
Aceton   | 34.668 | -3.369
*/

#define RLOAD 1.0 // The load resistance on the board
#define RZERO 43.61 // Calibration resistance at atmospheric CO2 level

  
/// Parameters for calculating ppm of CO2 and NH3 from sensor resistance
#define CO2_PARA 110.47
#define CO2_PARB -2.862
#define NH3_PARA 5.838
#define NH3_PARB -2.138

/// Parameters to model temperature and humidity dependence
#define CORA 0.00035
#define CORB 0.02718
#define CORC 1.39538
#define CORD 0.0018

/// Atmospheric CO2 and NH3 level for calibration purposes
#define ATMOCO2 422.17
#define ATMONH3 40 // ppb  

class MQ135 {
 private:
  uint8_t _pin;
  float _a;
  float _b;
  float _r0;
  float _atm_level; // atmospheric level of corresponding gas


 public:
  MQ135(uint8_t pin, char* gas);
  void calibrate(float t = 25.0, float h = 50.0);
  void setRZero(float r0);
  float getCorrectionFactor(float t, float h);
  float getResistance();
  float getCorrectedResistance(float t, float h);
  float getPPM();
  float getCorrectedPPM(float t, float h);
  float getRZero();
  float getCorrectedRZero(float t, float h);
};
