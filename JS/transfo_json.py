import json

# Path to the original JSON file
input_file_path = 'C:\\Users\\gabir\\OneDrive\\Documents\\PROJETS-DOC\\ELP\\JS\\liste_mot_no_accents_alternative.json'  # Adjust this path if necessary

# Path for the new JSON file
output_file_path = 'dictionnaire.json'

# Read the original JSON file
with open(input_file_path, 'r', encoding='utf-8') as file:
    words_list = json.load(file)

# Convert the list to a dictionary with words as keys and True as values
words_dict = {word: True for word in words_list}

# Write the new dictionary to the new JSON file
with open(output_file_path, 'w', encoding='utf-8') as file:
    json.dump(words_dict, file, ensure_ascii=False, indent=4)

print(f'Dictionary saved to {output_file_path}')
