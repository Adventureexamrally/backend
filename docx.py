from docx import Document
import json

# Load the uploaded .docx file
file_path = '/mnt/data/AUG 3rd Week CA (1).docx'
doc = Document(file_path)

# Initialize variables
questions_data = []
current_category = None

# Process document line by line
for paragraph in doc.paragraphs:
    text = paragraph.text.strip()
    if not text:
        continue  # Skip empty lines

    # Detect category headers (e.g., "National/State News")
    if text.isupper():
        current_category = text
        continue

    # Parse questions, options, answers, and explanations
    if text.startswith("Answer:"):
        # Extract the answer and explanation
        answer, explanation = text.split("Explanation:", 1) if "Explanation:" in text else (text, None)
        if questions_data:
            questions_data[-1]["answer"] = answer.replace("Answer:", "").strip()
            questions_data[-1]["explanation"] = explanation.strip() if explanation else None
    elif text.endswith("?"):
        # Add a new question
        questions_data.append({
            "category": current_category,
            "question": text,
            "options": [],
            "answer": None,
            "explanation": None
        })
    elif text.startswith(("a)", "b)", "c)", "d)", "e)")):
        # Add options to the most recent question
        if questions_data:
            questions_data[-1]["options"].append(text)

# Convert to JSON format
output_json = json.dumps(questions_data, indent=4)

# Save the JSON to a file
output_file = "/mnt/data/questions_data.json"
with open(output_file, "w") as f:
    f.write(output_json)

output_file
