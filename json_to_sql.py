import json
import sys
from datetime import datetime

if len(sys.argv) < 2:
    raise ValueError("No filename was provided.")

arguments = sys.argv
file_path = arguments[1]

def escape_sql_string(s):
    """Escape single quotes in a string for SQL insertion."""
    return s.replace("'", "''") if s else s

def json_to_sql(json_obj):
    def get_value(key):
        value = json_obj.get(key, '')
        if value == "?" or value == "":
            return ""
        return escape_sql_string(value) if isinstance(value, str) else value

    def get_id():
        event = json_obj.get('Site')
        return event.split('/')[-1]

    try:
        date = datetime.strptime(get_value('Date'), '%Y.%m.%d').strftime('%Y-%m-%d')
    except ValueError:
        date = '1970-01-01'  # Default date if parsing fails

    try:
        utc_date = datetime.strptime(get_value('UTCDate'), '%Y.%m.%d').strftime('%Y-%m-%d')
    except ValueError:
        utc_date = '1970-01-01'  # Default date if parsing fails

    # Generate the SQL INSERT statement
    sql = "INSERT INTO chess_games (ID, Event, Site, Date, White, Black, Result, UTCDate, UTCTime, WhiteElo, BlackElo, WhiteRatingDiff, BlackRatingDiff, WhiteTitle, BlackTitle, Variant, TimeControl, ECO, Opening, Termination, moves) VALUES ("

    # Add values to the SQL statement
    sql += f"'{get_id()}', "
    sql += f"'{get_value('Event')}', "
    sql += f"'{get_value('Site')}', "
    sql += f"'{date}', "
    sql += f"'{get_value('White')}', "
    sql += f"'{get_value('Black')}', "
    sql += f"'{get_value('Result')}', "
    sql += f"'{utc_date}', "
    sql += f"'{get_value('UTCTime')}', "
    sql += f"{get_value('WhiteElo') or 0}, "
    sql += f"{get_value('BlackElo') or 0}, "
    sql += f"'{get_value('WhiteRatingDiff')}', "
    sql += f"'{get_value('BlackRatingDiff')}', "
    sql += f"'{get_value('WhiteTitle')}', "
    sql += f"'{get_value('BlackTitle')}', "
    sql += f"'{get_value('Variant')}', "
    sql += f"'{get_value('TimeControl')}', "
    sql += f"'{get_value('ECO')}', "
    sql += f"'{get_value('Opening')}', "
    sql += f"'{get_value('Termination')}', "

    moves_json = json.dumps(get_value('moves') or [])
    sql += f"'{escape_sql_string(moves_json)}');"

    return sql

def process_json_file(file_path):
    # Read the JSON file
    with open(file_path, 'r') as file:
        json_data = json.load(file)

    # Check if the loaded data is a list
    if not isinstance(json_data, list):
        json_data = [json_data]  # Convert to list if it's a single object

    # Generate SQL statements for each JSON object
    sql_statements = []
    for json_obj in json_data:
        sql_statements.append(json_to_sql(json_obj))

    return sql_statements

# Process the file and get SQL statements
sql_statements = process_json_file(file_path)

# Optionally, save to a file
with open('output.sql', 'w') as f:
    for statement in sql_statements:
        f.write(statement + '\n\n')

print(f"Generated {len(sql_statements)} SQL INSERT statements.")
print("SQL statements have been saved to 'output.sql'")
