import csv
import json


field_names = ['Time', 'Instantaneous Volume', 'Setpoint', 'Gas Valve Percent Open', 'Hydrate']
data_dict = {}
with open('Bold_744H-10_31-11_07.csv', mode="r") as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        time_key = row["Time"]
        data_dict[time_key] = {
            "Inj Gas Meter Volume Instantaneous": float(row["Inj Gas Meter Volume Instantaneous"]) if row["Inj Gas Meter Volume Instantaneous"] else None,
            "Inj Gas Meter Volume Setpoint": float(row["Inj Gas Meter Volume Setpoint"]) if row["Inj Gas Meter Volume Setpoint"] else None,
            "Inj Gas Valve Percent Open": float(row["Inj Gas Valve Percent Open"]) if row["Inj Gas Valve Percent Open"] else None,
            "Hydrate": None
        }

def fill_none_with_previous_value(data_dict):
    previous_values = {
        "Inj Gas Meter Volume Instantaneous": None,
        "Inj Gas Meter Volume Setpoint": None,
        "Inj Gas Valve Percent Open": None
    }
    
    for time_key, values in data_dict.items():
        for key in previous_values:
            if values[key] is None:
                values[key] = previous_values[key]
            previous_values[key] = values[key]
    return data_dict

data_dict = fill_none_with_previous_value(data_dict)

with open('Bold.json', mode="w") as json_file:
    json.dump(data_dict, json_file, indent=4)

def detect_hydrate(time, instant_vol, set_point, valve_percent_open):
    if instant_vol is not None and set_point is not None:
        flow_rate = instant_vol / set_point 
        if flow_rate < (valve_percent_open / 100):
            if time in valve_data:
                valve_data[time]['Hydrate'] = True


with open('Bold.json', mode="r") as json_file:  
    valve_data = json.load(json_file)
    for time in valve_data:
        detect_hydrate(time, valve_data[time]['Inj Gas Meter Volume Instantaneous'], valve_data[time]['Inj Gas Meter Volume Setpoint'], valve_data[time]['Inj Gas Valve Percent Open'])

with open('Bold.json', mode="w") as json_file:
    json.dump(valve_data, json_file, indent=4)

print("JSON updated with Hydrate values.")
