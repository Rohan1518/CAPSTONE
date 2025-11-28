
import React from 'react';

const RecyclingTips = () => {
  const tips = [
    "Before recycling, check if your device can be repaired or upgraded.",
    "Wipe all personal data from your devices before recycling them.",
    "Remove batteries from your devices before recycling, as they may need to be recycled separately.",
    "Look for certified e-waste recyclers to ensure your devices are handled responsibly.",
    "Many electronics retailers offer take-back programs for old devices."
  ];

  return (
    <div>
      <ul>
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecyclingTips;
