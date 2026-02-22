### 📘 REQUIRED EMISSION FORMULAS (INDIA-SPECIFIC)

#### 1️⃣ Transportation
* **Inputs Required:** `distance` (km), `vehicle type`
* **Formula:** $$\text{CO}_2 = \text{distance} \times \text{Emission Factor}$$
* **Emission Factor Values:**
    * Car (Petrol >1200 cc): $0.1730 \text{ kg CO}_2/\text{km}$
    * Car (Petrol <1200 cc): $0.1264 \text{ kg CO}_2/\text{km}$
    * Bike (Motorcycle): $0.0248 \text{ kg CO}_2/\text{km}$
    * Bike (Scooter): $0.0421 \text{ kg CO}_2/\text{km}$
    * Bus (Public): $0.0730 \text{ kg CO}_2/\text{passenger-km}$
    * Train (Rail): $0.0170 \text{ kg CO}_2/\text{passenger-km}$

#### 2️⃣ Electricity Usage
* **Inputs Required:** `units consumed` (kWh)
* **Formula:**
$$\text{CO}_2 = \text{units consumed} \times \text{Grid Emission Factor}$$
* **Emission Factor Value:**
    * Indian Grid Factor: $0.82 \text{ kg CO}_2/\text{kWh}$

#### 3️⃣ LPG / Cooking Gas
* **Inputs Required:** `LPG used` (kg)
* **Formula:**
$$\text{CO}_2 = \text{LPG used} \times \text{Emission Factor}$$
* **Emission Factor Value:**
    * LPG Factor: $3.13 \text{ kg CO}_2/\text{kg}$

#### 4️⃣ Water Usage
* **Inputs Required:** `water used` (liters), `water source`
* **Formula:**
$$\text{CO}_2 = \left( \frac{\text{water used}}{1000} \right) \times \text{Emission Factor}$$
* **Emission Factor Values:**
    * Municipal Supply: $1.69 \text{ kg CO}_2/\text{kL}$
    * Borewell Pump: $0.67 \text{ kg CO}_2/\text{kL}$

#### 5️⃣ Waste Generation
* **Inputs Required:** `waste weight` (kg), `waste type`, `disposal method`
* **Formula:**
$$\text{CO}_2 = \text{waste weight} \times \text{Emission Factor}$$
* **Emission Factor Values:**
    * Organic Waste (Landfill): $1.29 \text{ kg CO}_2\text{e}/\text{kg}$
    * Organic Waste (Composted): $0.32 \text{ kg CO}_2\text{e}/\text{kg}$
    * Paper Waste (General): $2.50 \text{ kg CO}_2/\text{kg}$
