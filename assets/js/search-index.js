/* ==========================================================================
   RSMK Blogs v2.0 — Global Documentation Search Index
   ========================================================================== */

const SEARCH_INDEX = [
    // --- Articles ---
    { title: "ESP8266 & ESP32 IoT Engineering", type: "Article", category: "Embedded Systems", url: "blogs/esp8266.html", tags: ["ESP32", "ESP8266", "IoT", "Wi-Fi", "Microcontrollers"] },
    { title: "Arduino Nano Architecture & Industrial Controls", type: "Article", category: "Embedded Systems", url: "blogs/arduino-nano.html", tags: ["Arduino", "ATmega328P", "PWM", "Sensors", "PLC"] },
    { title: "Arduino MEGA 2560 in Industrial Engineering", type: "Article", category: "Industrial Automation", url: "blogs/arduino-mega.html", tags: ["Arduino", "ATmega2560", "Modbus", "PLC", "SCADA"] },
    { title: "Arduino UNO R4 Hardware Deep-Dive", type: "Article", category: "Embedded Systems", url: "blogs/arduino-uno.html", tags: ["Arduino", "RA4M1", "ARM", "Renesas", "CAN Bus"] },
    { title: "Complete Arduino Hardware & Software Guide", type: "Article", category: "Embedded Systems", url: "blogs/arduino-guide.html", tags: ["Arduino", "Microcontrollers", "IDE", "C++"] },
    { title: "Quantum Computing Principles & Hardware", type: "Article", category: "Cutting-Edge Tech", url: "blogs/quantum-computing.html", tags: ["Quantum", "Qubits", "Physics", "Superconducting"] },
    { title: "Smart Home Automation Systems Architecture", type: "Article", category: "IoT & Smart Systems", url: "blogs/smart-home.html", tags: ["IoT", "ESP32", "Zigbee", "Home Assistant", "Automation"] },
    { title: "Semiconductors & Silicon Manufacturing Process", type: "Article", category: "Semiconductors", url: "blogs/semiconductors.html", tags: ["Silicon", "Fab", "Transistors", "TSMC", "Intel"] },
    { title: "5G & 6G Wireless Communication Engineering", type: "Article", category: "Networking", url: "blogs/5g-6g-tech.html", tags: ["5G", "6G", "Wireless", "mmWave", "Antennas"] },
    { title: "AI-Powered Autonomous Drones & Flight Controllers", type: "Article", category: "Robotics", url: "blogs/ai-drones.html", tags: ["Drones", "Robotics", "Flight Controller", "PX4", "Computer Vision"] },
    { title: "Electric Vehicle (EV) Charging Architecture", type: "Article", category: "Power Electronics", url: "blogs/ev-charging.html", tags: ["EV", "Power Electronics", "Inverters", "Battery", "OCPP"] },
    { title: "Renewable Energy & Microgrid Control Systems", type: "Article", category: "Smart Energy", url: "blogs/renewable-energy.html", tags: ["Solar", "Wind", "Inverters", "Grid", "Microgrid"] },
    { title: "Engineering Career & Technical Skills Roadmap", type: "Article", category: "Career", url: "blogs/careers.html", tags: ["Career", "Skills", "Engineering", "Embedded", "Automation"] },

    // --- Technologies & Terms ---
    { title: "ESP32 System-on-Chip", type: "Technology", category: "Microcontrollers", url: "technology.html?id=esp32", tags: ["Wi-Fi", "Bluetooth", "Espressif", "Dual-Core"] },
    { title: "ESP8266 Wi-Fi Module", type: "Technology", category: "Microcontrollers", url: "technology.html?id=esp8266", tags: ["Wi-Fi", "Espressif", "IoT"] },
    { title: "PLC (Programmable Logic Controller)", type: "Technology", category: "Industrial Automation", url: "technology.html?id=plc", tags: ["Rockwell", "Siemens", "Ladder Logic", "Automation"] },
    { title: "SCADA Systems", type: "Technology", category: "Industrial Automation", url: "technology.html?id=scada", tags: ["Ignition", "Supervisory", "Control", "Telemetry"] },
    { title: "Modbus Communication Protocol", type: "Technology", category: "Protocols", url: "technology.html?id=modbus", tags: ["RS-485", "Serial", "Master-Slave", "Registers"] },
    { title: "I2C Serial Bus Protocol", type: "Technology", category: "Protocols", url: "technology.html?id=i2c", tags: ["SDA", "SCL", "Sensors", "Microcontroller"] },
    { title: "PWM (Pulse Width Modulation)", type: "Technology", category: "Power Electronics", url: "technology.html?id=pwm", tags: ["Duty Cycle", "Motor", "Inverter", "Timers"] },
    { title: "FreeRTOS Real-Time OS", type: "Technology", category: "Operating Systems", url: "technology.html?id=freertos", tags: ["Tasks", "RTOS", "Kernel", "Preemptive"] },

    // --- Companies ---
    { title: "Espressif Systems", type: "Company", category: "Semiconductors", url: "company.html?id=espressif", tags: ["ESP32", "ESP8266", "SoC", "Shanghai"] },
    { title: "Arduino S.r.l.", type: "Company", category: "Hardware & Ecosystem", url: "company.html?id=arduino", tags: ["UNO", "Nano", "MEGA", "Portenta"] },
    { title: "Rockwell Automation (Allen-Bradley)", type: "Company", category: "Industrial Automation", url: "company.html?id=rockwell", tags: ["ControlLogix", "Micro850", "Studio 5000", "PLC"] },
    { title: "Siemens AG", type: "Company", category: "Industrial Automation", url: "company.html?id=siemens", tags: ["S7-1500", "S7-1200", "TIA Portal", "WinCC"] },
    { title: "MathWorks", type: "Company", category: "Software", url: "company.html?id=mathworks", tags: ["MATLAB", "Simulink", "Stateflow", "Simscape"] },

    // --- Roadmaps & Resources ---
    { title: "Industrial PLC Engineer Roadmap", type: "Roadmap", category: "Roadmaps", url: "roadmaps.html#plc-roadmap", tags: ["PLC", "SCADA", "Automation", "HMI"] },
    { title: "Embedded Systems & Firmware Roadmap", type: "Roadmap", category: "Roadmaps", url: "roadmaps.html#embedded-roadmap", tags: ["AVR", "ARM", "FreeRTOS", "Firmware"] },
    { title: "Wokwi Online Circuit Simulator", type: "Resource", category: "Simulation Tools", url: "resources.html", tags: ["Simulator", "Arduino", "ESP32", "Browser"] },
    { title: "LTspice SPICE Circuit Simulator", type: "Resource", category: "Software", url: "resources.html", tags: ["SPICE", "Circuit", "Simulation", "Analog"] }
];

window.SEARCH_INDEX = SEARCH_INDEX;
