import json
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
    streak = []
    for time_key, values in data_dict.items():
        instant_vol = values.get("Inj Gas Meter Volume Instantaneous", 0)
        set_point = values.get("Inj Gas Meter Volume Setpoint", 1)  
        valve_percent_open = values.get("Inj Gas Valve Percent Open", 0)

        try:
            # Calculate flow rate and detect hydrate
            flow_rate = instant_vol / set_point
            if flow_rate < (valve_percent_open / 100):
                streak.append(time_key)  # Add to streak
            else:
                if len(streak) >= 3:  # Streak ends, check length
                    hydrate_periods.append({"start": streak[0], "end": streak[-1]})
                streak = []
        except ZeroDivisionError:
            continue

    # Add remaining streak if valid
    if len(streak) >= 3:
        hydrate_periods.append({"start": streak[0], "end": streak[-1]})

    return hydrate_periods


@app.route('/api/logs', methods=['POST'])
def process_logs():
    # Logs are sent from the frontend
    logs = request.json
    data_dict = {}

    # Convert the logs to a dictionary keyed by timestamp
    for entry in logs:
        timestamp = entry['timestamp']
        data_dict[timestamp] = {
            "Inj Gas Meter Volume Instantaneous": entry.get('gasVolume'),
            "Inj Gas Meter Volume Setpoint": entry.get('setpoint'),
            "Inj Gas Valve Percent Open": entry.get('valvePercent'),
            "Hydrate": None
        }

    # Fill missing values with previous ones
    data_dict = fill_none_with_previous_value(data_dict)

    processed_logs = []
    # Now process the filled data and detect hydrate
    for timestamp, values in data_dict.items():
        gas_volume = values.get("Inj Gas Meter Volume Instantaneous")
        setpoint = values.get("Inj Gas Meter Volume Setpoint")
        valve_percent = values.get("Inj Gas Valve Percent Open")

        if gas_volume and setpoint and valve_percent:
            try:
                gas_volume = float(gas_volume)
                setpoint = float(setpoint)
                valve_percent = float(valve_percent)
                flow_rate = gas_volume / setpoint
                hydrate = flow_rate < valve_percent / 100
                processed_logs.append({
                    "timestamp": timestamp,
                    "gasVolume": gas_volume,
                    "setpoint": setpoint,
                    "valvePercent": valve_percent,
                    "hydrate": hydrate,
                })
            except ValueError:
                continue  # Skip invalid data

    # Save processed logs to a JSON file
    with open('processed_logs.json', 'w') as f:
        json.dump(processed_logs, f, indent=4)

    # Return the processed logs as the response
    return jsonify(processed_logs)  # Sending the processed logs instead of a message


@app.route('/api/hydrate_periods', methods=['GET'])
def get_hydrate_periods():
    try:
        # Load processed logs from the file
        with open('processed_logs.json', 'r') as f:
            logs = json.load(f)
    except FileNotFoundError:
        return jsonify({"error": "Processed logs not found"}), 404

    # Detect hydrate periods
    hydrate_periods = detect_hydrate(logs)

    # Save hydrate periods to a JSON file
    with open('hydrate_periods.json', 'w') as f:
        json.dump(hydrate_periods, f, indent=4)

    return jsonify({"hydrate_periods": hydrate_periods})


if __name__ == '__main__':
    app.run(debug=True)
