/* ==========================================================================
   RSMK Blogs v2.0 — Relational Knowledge Base Data Store
   ========================================================================== */

const KNOWLEDGE_BASE = {
    // --- Wiki Terms & Technologies ---
    terms: {
        "esp32": {
            id: "esp32",
            name: "ESP32",
            category: "Microcontrollers",
            shortDesc: "A low-cost, low-power system-on-chip series with integrated Wi-Fi and dual-mode Bluetooth created by Espressif Systems.",
            company: "Espressif Systems",
            keyFeatures: ["Dual-core Tensilica Xtensa 32-bit LX6", "Wi-Fi 802.11 b/g/n & Bluetooth 4.2 / BLE", "Capacitive touch, ADCs, DACs, UART, SPI, I2C, PWM, CAN", "Ultra-low-power co-processor"],
            applications: ["Smart Home Automation", "Industrial IoT Gateways", "Wireless Sensors", "Wearable Electronics"],
            relatedArticles: [
                { title: "ESP8266 & ESP32 IoT Engineering", url: "blogs/esp8266.html" },
                { title: "Smart Home Automation Systems", url: "blogs/smart-home.html" }
            ]
        },
        "esp8266": {
            id: "esp8266",
            name: "ESP8266",
            category: "Microcontrollers",
            shortDesc: "A revolutionary low-cost Wi-Fi microchip with full TCP/IP stack and microcontroller capability produced by Espressif Systems.",
            company: "Espressif Systems",
            keyFeatures: ["32-bit RISC L106 processor", "Integrated Wi-Fi 802.11 b/g/n", "GPIO, SPI, I2C, ADC", "Super affordable Wi-Fi connectivity"],
            applications: ["IoT Prototyping", "Wireless Relays", "Telemetry Nodes"],
            relatedArticles: [
                { title: "ESP8266 & ESP32 IoT Engineering", url: "blogs/esp8266.html" }
            ]
        },
        "plc": {
            id: "plc",
            name: "PLC (Programmable Logic Controller)",
            category: "Industrial Automation",
            shortDesc: "An industrial digital computer designed for the control of manufacturing processes or robotic devices.",
            company: "Rockwell Automation / Siemens / Schneider Electric",
            keyFeatures: ["IEC 61131-3 Languages (Ladder Logic, FBD, ST)", "High immunity to electrical noise & extreme temps", "Modular I/O expansion", "Real-time deterministic execution"],
            applications: ["Automated Assembly Lines", "SCADA Integration", "Pump Stations", "Packaging Equipment"],
            relatedArticles: [
                { title: "Arduino Nano vs Industrial PLCs", url: "blogs/arduino-nano.html" },
                { title: "Arduino MEGA in Industrial Engineering", url: "blogs/arduino-mega.html" }
            ]
        },
        "scada": {
            id: "scada",
            name: "SCADA (Supervisory Control and Data Acquisition)",
            category: "Industrial Automation",
            shortDesc: "A control system architecture comprising computers, networked data communications, and graphical user interfaces for high-level process supervisory management.",
            company: "Inductive Automation (Ignition) / Siemens / Schneider Electric",
            keyFeatures: ["Real-time process monitoring", "Historical data logging & trending", "Alarm management & safety stops", "Distributed remote terminal unit (RTU) control"],
            applications: ["Power Grid Control", "Water & Wastewater Management", "Oil & Gas Refineries", "Factory Supervision"],
            relatedArticles: [
                { title: "Arduino MEGA in Industrial Engineering", url: "blogs/arduino-mega.html" }
            ]
        },
        "arduino": {
            id: "arduino",
            name: "Arduino Ecosystem",
            category: "Embedded Systems",
            shortDesc: "An open-source electronics platform based on easy-to-use hardware and software, designed for engineers, prototypers, and industrial makers.",
            company: "Arduino",
            keyFeatures: ["ATmega & ARM Cortex microcontrollers", "Arduino IDE & CLI tooling", "Standardized shield headers", "Massive open-source library ecosystem"],
            applications: ["Rapid Hardware Prototyping", "Sensor Node Development", "Educational Robotics", "Custom Automation"],
            relatedArticles: [
                { title: "Arduino Nano Engineering Guide", url: "blogs/arduino-nano.html" },
                { title: "Arduino MEGA 2560 Architecture", url: "blogs/arduino-mega.html" },
                { title: "Arduino UNO R4 Hardware Deep-Dive", url: "blogs/arduino-uno.html" },
                { title: "Arduino Complete Hardware Guide", url: "blogs/arduino-guide.html" }
            ]
        },
        "modbus": {
            id: "modbus",
            name: "Modbus Protocol",
            category: "Communication Protocols",
            shortDesc: "A master-slave serial communications protocol widely used to connect industrial electronic devices over RS-485, RS-232, or Ethernet (Modbus TCP).",
            company: "Schneider Electric (Originally Modicon)",
            keyFeatures: ["Simple & robust frame structure", "RS-485 differential signaling", "Coils & Holding Registers architecture", "Zero royalty fees"],
            applications: ["PLC to HMI Communication", "Energy Metering", "Sensor Networks"],
            relatedArticles: [
                { title: "Arduino MEGA in Industrial Engineering", url: "blogs/arduino-mega.html" }
            ]
        },
        "i2c": {
            id: "i2c",
            name: "I2C (Inter-Integrated Circuit)",
            category: "Communication Protocols",
            shortDesc: "A synchronous, multi-controller/multi-target, packet-switched, single-ended, serial communication bus designed by Philips Semiconductor (NXP).",
            company: "NXP Semiconductors",
            keyFeatures: ["Two-wire interface: SDA (Data) & SCL (Clock)", "7-bit or 10-bit device addressing", "Multi-master arbitration", "Standard (100 kbps), Fast (400 kbps), and High-Speed modes"],
            applications: ["Sensor Interfaces (BME280, MPU6050)", "OLED Displays", "EEPROM Memories"],
            relatedArticles: [
                { title: "Arduino Nano Engineering Guide", url: "blogs/arduino-nano.html" }
            ]
        },
        "pwm": {
            id: "pwm",
            name: "PWM (Pulse Width Modulation)",
            category: "Power Electronics",
            shortDesc: "A technique for getting analog results with digital means by varying the duty cycle of a rectangular pulse wave.",
            company: "Texas Instruments / STMicroelectronics",
            keyFeatures: ["Frequency & Duty Cycle control", "High efficiency power delivery", "Hardware timer generation"],
            applications: ["DC Motor Speed Control", "LED Dimming", "Inverters & Switching Regulators"],
            relatedArticles: [
                { title: "Arduino Nano Engineering Guide", url: "blogs/arduino-nano.html" }
            ]
        },
        "freertos": {
            id: "freertos",
            name: "FreeRTOS",
            category: "Operating Systems",
            shortDesc: "A market-leading real-time operating system (RTOS) for microcontrollers and small microprocessors.",
            company: "Amazon Web Services (AWS)",
            keyFeatures: ["Preemptive & Co-operative scheduling", "Small footprint (< 10 KB)", "Tasks, Queues, Mutexes, Semaphores", "Deterministic response times"],
            applications: ["Mission-critical IoT Devices", "Drone Flight Controllers", "Medical Electronics"],
            relatedArticles: [
                { title: "ESP8266 & ESP32 IoT Engineering", url: "blogs/esp8266.html" }
            ]
        },
        "matlab": {
            id: "matlab",
            name: "MATLAB & Simulink",
            category: "Mathematical Software",
            shortDesc: "A proprietary multi-paradigm programming language and numerical computing environment developed by MathWorks.",
            company: "MathWorks",
            keyFeatures: ["Native matrix manipulation & vectorized operations", "Simulink model-based block diagram simulation", "Signal processing & 3D graphics rendering", "Automatic C/C++ & HDL code generation"],
            applications: ["Control Systems Engineering", "Signal Processing & DSP", "Robotics & Autonomous Systems", "Deep Learning & AI"],
            relatedArticles: [
                { title: "Mastering MATLAB: Numerical Computing & Simulink", url: "blogs/matlab-guide.html" }
            ]
        }
    },

    // --- Companies Directory ---
    companies: {
        "espressif": {
            id: "espressif",
            name: "Espressif Systems",
            headquarters: "Shanghai, China",
            founded: 2008,
            category: "Semiconductors & IoT",
            overview: "Espressif Systems is a public multinational semiconductor company focused on developing cutting-edge Wi-Fi, Bluetooth, and AI SoC microcontrollers.",
            products: ["ESP8266", "ESP32", "ESP32-S3", "ESP32-C3", "ESP-IDF Framework"],
            industries: ["Smart Home", "Industrial Automation", "Consumer Electronics", "AIoT"],
            website: "https://www.espressif.com"
        },
        "arduino": {
            id: "arduino",
            name: "Arduino",
            headquarters: "Monza, Italy",
            founded: 2005,
            category: "Hardware & Software Ecosystem",
            overview: "Arduino manufactures open-source microcontroller boards, single-board computers, and software tools for educational, Maker, and enterprise IoT applications.",
            products: ["Arduino UNO R4", "Arduino Nano Every", "Arduino MEGA 2560", "Arduino Portenta H7", "Arduino Cloud"],
            industries: ["Education", "Embedded Engineering", "Prototyping", "Industrial IoT"],
            website: "https://www.arduino.cc"
        },
        "rockwell": {
            id: "rockwell",
            name: "Rockwell Automation",
            headquarters: "Milwaukee, Wisconsin, USA",
            founded: 1903,
            category: "Industrial Automation",
            overview: "A global leader in industrial automation and digital transformation solutions, famous for the Allen-Bradley brand of PLCs and FactoryTalk software.",
            products: ["ControlLogix PLCs", "CompactLogix", "Micro850 PLCs", "Studio 5000 Logix Designer", "FactoryTalk View"],
            industries: ["Manufacturing", "Automotive", "Pharmaceuticals", "Oil & Gas"],
            website: "https://www.rockwellautomation.com"
        },
        "siemens": {
            id: "siemens",
            name: "Siemens AG",
            headquarters: "Munich, Germany",
            founded: 1847,
            category: "Industrial Automation & Power",
            overview: "German industrial manufacturing giant leading digital industry, smart infrastructure, electrification, and automation.",
            products: ["SIMATIC S7-1500 PLC", "SIMATIC S7-1200", "TIA Portal Software", "SINAMICS Drives", "WinCC SCADA"],
            industries: ["Manufacturing", "Energy", "Healthcare", "Smart Infrastructure"],
            website: "https://www.siemens.com"
        },
        "mathworks": {
            id: "mathworks",
            name: "MathWorks",
            headquarters: "Natick, Massachusetts, USA",
            founded: 1984,
            category: "Mathematical Software",
            overview: "Developer of mathematical computing software including MATLAB and Simulink, essential for systems engineering and control design.",
            products: ["MATLAB", "Simulink", "Stateflow", "Simscape", "Embedded Coder"],
            industries: ["Aerospace", "Automotive", "Control Systems", "Signal Processing"],
            website: "https://www.mathworks.com",
            relatedArticles: [
                { title: "Mastering MATLAB: Numerical Computing & Simulink", url: "blogs/matlab-guide.html" }
            ]
        },
        "stmicroelectronics": {
            id: "stmicroelectronics",
            name: "STMicroelectronics",
            headquarters: "Geneva, Switzerland",
            founded: 1987,
            category: "Semiconductors",
            overview: "A global semiconductor leader serving customers across the spectrum of electronics applications with advanced ARM Cortex-M microcontrollers.",
            products: ["STM32 Microcontrollers", "STM32CubeIDE", "MEMS Sensors", "Power MOSFETs"],
            industries: ["Automotive", "Industrial", "IoT", "Personal Electronics"],
            website: "https://www.st.com"
        }
    },

    // --- Visual Learning Roadmaps ---
    roadmaps: [
        {
            id: "plc-roadmap",
            title: "Industrial PLC & Automation Engineer Roadmap",
            desc: "Master industrial control, ladder logic, Modbus communication, HMI integration, and SCADA architectures.",
            levels: [
                {
                    level: "Level 1: Fundamentals & Basic Logic",
                    nodes: [
                        { name: "Digital Logic & Relays", status: "Core" },
                        { name: "IEC 61131-3 Languages", status: "Core" },
                        { name: "Ladder Logic Wiring", status: "Hands-on" },
                        { name: "Micro850 / CCW Basics", status: "Software" }
                    ]
                },
                {
                    level: "Level 2: Industrial Communications & HMIs",
                    nodes: [
                        { name: "RS-485 & Modbus RTU/TCP", status: "Protocol" },
                        { name: "EtherNet/IP Industrial Network", status: "Protocol" },
                        { name: "HMI Panel Design & Alarm Logs", status: "UI/UX" },
                        { name: "VFD & Motor Speed Control", status: "Hardware" }
                    ]
                },
                {
                    level: "Level 3: SCADA & Industry 4.0 Integration",
                    nodes: [
                        { name: "Ignition SCADA Tag System", status: "SCADA" },
                        { name: "MQTT & Industrial IoT Gateways", status: "Cloud" },
                        { name: "Safety PLCs & Emergency Circuits", status: "Safety" },
                        { name: "FactoryTalk Studio 5000 Logix", status: "Enterprise" }
                    ]
                }
            ]
        },
        {
            id: "embedded-roadmap",
            title: "Embedded Systems & Firmware Engineering",
            desc: "Step-by-step path from 8-bit AVR microcontrollers to 32-bit ARM Cortex-M architecture and FreeRTOS.",
            levels: [
                {
                    level: "Level 1: Hardware & C Fundamentals",
                    nodes: [
                        { name: "C Memory & Pointer Hygiene", status: "Language" },
                        { name: "ATmega328P Register Bit Manipulation", status: "AVR" },
                        { name: "GPIO, Timers, Interrupts", status: "Peripherals" },
                        { name: "Oscilloscopes & Logic Analyzers", status: "Lab Tools" }
                    ]
                },
                {
                    level: "Level 2: 32-Bit Microcontrollers & Protocols",
                    nodes: [
                        { name: "ARM Cortex-M Architecture", status: "ARM" },
                        { name: "I2C, SPI, UART Drivers from Scratch", status: "Protocols" },
                        { name: "ESP32 Wi-Fi & Bluetooth Stack", status: "Wireless" },
                        { name: "DMA (Direct Memory Access)", status: "Performance" }
                    ]
                },
                {
                    level: "Level 3: Real-Time Operating Systems (RTOS)",
                    nodes: [
                        { name: "FreeRTOS Tasks & Schedulers", status: "RTOS" },
                        { name: "Mutexes, Semaphores & Queues", status: "Concurrency" },
                        { name: "Low Power Modes & Power Management", status: "Optimization" },
                        { name: "Firmware OTA Updates & Security", status: "Production" }
                    ]
                }
            ]
        }
    ],

    // --- Engineering Resource Center ---
    resources: [
        { title: "ATmega328P Complete Datasheet", category: "Datasheets", format: "PDF", link: "https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega48A-PA-88A-PA-168A-PA-328-P-DS-DS40002061B.pdf", desc: "Official Microchip 660-page datasheet covering memory maps, pinouts, and hardware register specifications." },
        { title: "ESP32 Technical Reference Manual", category: "Datasheets", format: "PDF", link: "https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf", desc: "In-depth guide to internal registers, peripherals, interrupt routing, and dual-core architecture." },
        { title: "RS-485 & Modbus Protocol Pinout & Wiring Cheat Sheet", category: "Cheat Sheets", format: "Guide", link: "#", desc: "Quick reference card for differential termination resistors, master-slave addressing, and register maps." },
        { title: "Wokwi Interactive Circuit Simulator", category: "Simulation Tools", format: "Web Tool", link: "https://wokwi.com", desc: "Browser-based simulator for Arduino, ESP32, STM32, and Raspberry Pi Pico with full GDB debugging." },
        { title: "LTspice SPICE Circuit Simulation Software", category: "Software", format: "Tool", link: "https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html", desc: "Industry standard high-performance SPICE simulator for power electronics, amplifiers, and transient analysis." }
    ],

    // --- Projects Directory ---
    projects: [
        {
            id: "smart-home-hub",
            title: "ESP32 Industrial IoT Gateway & Smart Home Hub",
            category: "Embedded & IoT",
            difficulty: "Intermediate",
            desc: "A custom DIN-rail mountable ESP32 gateway with isolated RS-485 Modbus interface, MQTT telemetry, and local web dashboard.",
            hardware: ["ESP32-WROOM-32", "MAX485 Transceiver", "Optocoupler Isolation", "OLED Display 128x64"],
            software: ["ESP-IDF", "FreeRTOS", "MQTT client", "WebSockets"],
            articleLink: "blogs/esp8266.html"
        },
        {
            id: "micro850-plc-panel",
            title: "Micro850 PLC Motor Control & Industrial Safety Panel",
            category: "Industrial Automation",
            difficulty: "Advanced",
            desc: "Fully wired industrial control panel integrating Allen-Bradley Micro850 PLC, PanelView HMI, VFD motor control, and emergency stop relays.",
            hardware: ["Micro850 PLC", "PowerFlex VFD", "PanelView 800 HMI", "24V Industrial Power Supply"],
            software: ["Connected Components Workbench (CCW)", "Modbus TCP"],
            articleLink: "blogs/arduino-mega.html"
        }
    ]
};

// Export to window object for global availability
window.KNOWLEDGE_BASE = KNOWLEDGE_BASE;
