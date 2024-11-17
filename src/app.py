from flask import Flask, request, jsonify

app = Flask(__name__)


# Function to fill None or empty values with previous ones in the JSON data
def fill_none_with_previous_value(data_dict):
    previous_values = {
        "Inj Gas Meter Volume Instantaneous": None,
        "Inj Gas Meter Volume Setpoint": None,
        "Inj Gas Valve Percent Open": None
    }
    
    # Iterating over each time entry in the data dictionary
    for time_key, values in data_dict.items():
        for key in previous_values:
            if values.get(key) is None or values.get(key) == "":
                values[key] = previous_values[key]  # Fill with previous value
            previous_values[key] = values[key]  # Update previous value for next iteration
    
    return data_dict

# Function to detect hydrate formation
def detect_hydrate(data_dict):
    hydrate_periods = []
    previous_values = None
    current_period = None

    for time_key, values in data_dict.items():
        # Retrieve values from the current time entry
        instant_vol = values.get("Inj Gas Meter Volume Instantaneous")
        set_point = values.get("Inj Gas Meter Volume Setpoint")
        valve_percent_open = values.get("Inj Gas Valve Percent Open")
        
        # Hydrate detection logic (assuming this is the condition)
        if instant_vol is not None and set_point is not None:
            flow_rate = instant_vol / set_point  # Calculate flow rate
            if flow_rate < (valve_percent_open / 100):
                if current_period is None:  # Start a new hydrate period
                    current_period = {'start': time_key, 'end': None}
            elif current_period is not None:  # End hydrate period
                current_period['end'] = time_key
                hydrate_periods.append(current_period)
                current_period = None  # Reset

        # If hydrate was ongoing and we reach the end of data
        if current_period is not None:
            current_period['end'] = time_key
            hydrate_periods.append(current_period)

    return hydrate_periods


@app.route('/api/predict', methods=['POST'])
def predict():
    if request.is_json:
        data = request.get_json()

        # Fill None values with the previous valid data
        data = fill_none_with_previous_value(data)

        # Detect hydrate periods
        hydrate_periods = detect_hydrate(data)

        # Append the hydrate data to each entry (for front-end usage)
        for time_key, values in data.items():
            # If hydrate period is detected, mark it as True
            values['hydrate'] = any(period['start'] <= time_key <= period['end'] for period in hydrate_periods)

        return jsonify({
            "logs": data,
            "hydrate_periods": hydrate_periods  # Return all hydrate periods
        })
    else:
        return jsonify({"error": "Invalid JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)


# field_names = ['Time', 'Instantaneous Volume', 'Setpoint', 'Gas Valve Percent Open', 'Hydrate']
# data_dict = {}
# with open('Bold_744H-10_31-11_07.csv', mode="r") as csv_file:
#     csv_reader = csv.DictReader(csv_file)
#     for row in csv_reader:
#         time_key = row["Time"]
#         data_dict[time_key] = {
#             "Inj Gas Meter Volume Instantaneous": float(row["Inj Gas Meter Volume Instantaneous"]) if row["Inj Gas Meter Volume Instantaneous"] else None,
#             "Inj Gas Meter Volume Setpoint": float(row["Inj Gas Meter Volume Setpoint"]) if row["Inj Gas Meter Volume Setpoint"] else None,
#             "Inj Gas Valve Percent Open": float(row["Inj Gas Valve Percent Open"]) if row["Inj Gas Valve Percent Open"] else None,
#             "Hydrate": None
#         }

# def fill_none_with_previous_value(data_dict):
#     previous_values = {
#         "Inj Gas Meter Volume Instantaneous": None,
#         "Inj Gas Meter Volume Setpoint": None,
#         "Inj Gas Valve Percent Open": None
#     }
    
#     for time_key, values in data_dict.items():
#         for key in previous_values:
#             if values[key] is None:
#                 values[key] = previous_values[key]
#             previous_values[key] = values[key]
#     return data_dict

# data_dict = fill_none_with_previous_value(data_dict)

# with open('Bold.json', mode="w") as json_file:
#     json.dump(data_dict, json_file, indent=4)

# def detect_hydrate(time, instant_vol, set_point, valve_percent_open):
#     if instant_vol is not None and set_point is not None:
#         flow_rate = instant_vol / set_point 
#         if flow_rate < (valve_percent_open / 100):
#             if time in valve_data:
#                 valve_data[time]['Hydrate'] = True


# with open('Bold.json', mode="r") as json_file:  
#     valve_data = json.load(json_file)
#     for time in valve_data:
#         detect_hydrate(time, valve_data[time]['Inj Gas Meter Volume Instantaneous'], valve_data[time]['Inj Gas Meter Volume Setpoint'], valve_data[time]['Inj Gas Valve Percent Open'])

# with open('Bold.json', mode="w") as json_file:
#     json.dump(valve_data, json_file, indent=4)

# print("JSON updated with Hydrate values.")
