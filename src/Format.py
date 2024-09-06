import ast  # Importing ast to use ast.literal_eval for safely parsing strings

# Define a template with placeholders
payload_template = "{{'text_input': '{text_input}', 'parameters': {gen_param}}}"

# Define a prompt with special characters, newline (\n), and tags (<SYS>, [INST])
prompt = """<SYS>Act as a financial statement analyst and provide useful information based on the context provided. Be precise.</SYS>[INST]\nAnswer the question based on the context provided below.\n\nQuestion: What is Wells Fargo's earnings per share?\n\nContext: Wells Fargo Financial[/INST]"""

# Define some additional parameter (example config)
config = {"model": "financial_analysis", "temperature": 0.7}

# Format the payload_template with the prompt and config
payload = payload_template.format(text_input=prompt, gen_param=config)

# Print the formatted payload
print("Formatted Payload:")
print(payload)

# Use ast.literal_eval to convert the payload into a Python dictionary (simulation)
try:
    payload_dict = ast.literal_eval(payload)
    print("\nParsed Payload as Dictionary:")
    print(payload_dict)
except Exception as e:
    print("\nError while parsing payload:", e)
