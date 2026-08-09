export const SEARCH_INDEX = [
  { title: "Industrial PLC Systems & Ladder Logic Architecture", type: "Article", category: "Industrial Automation", url: "/blogs/plc-guide", tags: ["PLC", "Automation", "Ladder Logic", "SCADA", "IEC 61131-3", "Modbus", "Siemens", "Allen-Bradley"] },
  { title: "Mastering MATLAB: Numerical Computing & Simulink", type: "Article", category: "Engineering Software", url: "/blogs/matlab-guide", tags: ["MATLAB", "Simulink", "Signal Processing", "MathWorks", "Matrix", "Robotics"] },
  { title: "ESP8266 & ESP32 IoT Engineering", type: "Article", category: "Embedded Systems", url: "/blogs/esp8266", tags: ["ESP32", "ESP8266", "IoT", "Wi-Fi", "Microcontrollers"] },
  { title: "Arduino Nano Architecture & Industrial Controls", type: "Article", category: "Embedded Systems", url: "/blogs/arduino-nano", tags: ["Arduino", "ATmega328P", "PWM", "Sensors", "PLC"] },
  { title: "Arduino MEGA 2560 in Industrial Engineering", type: "Article", category: "Industrial Automation", url: "/blogs/arduino-mega", tags: ["Arduino", "ATmega2560", "Modbus", "PLC", "SCADA"] },
  { title: "Arduino UNO R4 Hardware Deep-Dive", type: "Article", category: "Embedded Systems", url: "/blogs/arduino-uno", tags: ["Arduino", "RA4M1", "ARM", "Renesas", "CAN Bus"] },
  { title: "Complete Arduino Hardware & Software Guide", type: "Article", category: "Embedded Systems", url: "/blogs/arduino-guide", tags: ["Arduino", "Microcontrollers", "IDE", "C++"] },
  { title: "Quantum Computing Principles & Hardware", type: "Article", category: "Cutting-Edge Tech", url: "/blogs/quantum-computing", tags: ["Quantum", "Qubits", "Physics", "Superconducting"] },
  { title: "Smart Home Automation Systems Architecture", type: "Article", category: "IoT & Smart Systems", url: "/blogs/smart-home", tags: ["IoT", "ESP32", "Zigbee", "Home Assistant", "Automation"] },
  { title: "Semiconductors & Silicon Manufacturing Process", type: "Article", category: "Semiconductors", url: "/blogs/semiconductors", tags: ["Silicon", "Fab", "Transistors", "TSMC", "Intel"] },
  { title: "5G & 6G Wireless Communication Engineering", type: "Article", category: "Networking", url: "/blogs/5g-6g-tech", tags: ["5G", "6G", "Wireless", "mmWave", "Antennas"] },
  { title: "AI-Powered Autonomous Drones & Flight Controllers", type: "Article", category: "Robotics", url: "/blogs/ai-drones", tags: ["Drones", "Robotics", "Flight Controller", "PX4", "Computer Vision"] },
  { title: "Electric Vehicle (EV) Charging Architecture", type: "Article", category: "Power Electronics", url: "/blogs/ev-charging", tags: ["EV", "Power Electronics", "Inverters", "Battery", "OCPP"] },
  { title: "Renewable Energy & Microgrid Control Systems", type: "Article", category: "Smart Energy", url: "/blogs/renewable-energy", tags: ["Solar", "Wind", "Inverters", "Grid", "Microgrid"] },
  { title: "Engineering Career & Technical Skills Roadmap", type: "Article", category: "Career", url: "/blogs/careers", tags: ["Career", "Skills", "Engineering", "Embedded", "Automation"] }
];

export const filterSearchResults = (query, index) => {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return index.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
  );
};
