// UMD-friendly simulation helpers for simple circuits
(function(root, factory){
  if(typeof module === 'object' && module.exports){
    module.exports = factory();
  } else {
    root.NoteGateSim = factory();
  }
})(typeof window !== 'undefined' ? window : this, function(){
  'use strict';

  /**
   * Compute Vout of a simple voltage divider.
   * @param {number} Vin
   * @param {number} R1 ohms (top resistor)
   * @param {number} R2 ohms (bottom resistor)
   * @returns {number}
   */
  function computeVout(Vin, R1, R2){
    Vin = Number(Vin) || 0;
    R1 = Number(R1) || 0;
    R2 = Number(R2) || 0;
    if(R1 + R2 === 0) return 0;
    return Vin * (R2 / (R1 + R2));
  }

  return { computeVout };
});
