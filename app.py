from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os
from transformers import pipeline

# Load the .env file from the server folder
load_dotenv(dotenv_path='server/.env')  # Adjust the path as needed

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Hugging Face API Key and URL
hugging_face_api_key= os.getenv('HUGGING_FACE_API_KEY')
api_url =os.getenv('API_URL')

# Function to get model response
def getModelResponse(input_text_field, no_words, blog_style):
    headers = {
        "Authorization": f"Bearer {hugging_face_api_key}"

    }
    # Adjusted prompt to encourage more detailed responses and formatting
    prompt = f"""
    Write a detailed and comprehensive blog for a {blog_style} job profile on the topic '{input_text_field}'. 
    The blog should be structured with the following sections:
    1. Introduction: Introduce the topic and explain its importance.
    2. Key Features: List the key features of the topic in a clear, flowing manner.
    3. Examples: Provide real-world examples or case studies.
    4. Challenges and Limitations: Discuss the challenges and limitations.
    5. Conclusion: Summarize the key takeaways.
    Ensure the blog is informative, free from bullet points and heading symbols, and no more than {no_words} words.
    """
    try:
        # Requesting the blog content
        response = requests.post(
            api_url, 
            headers=headers, 
            json={
                "inputs": prompt, 
                "parameters": {
                    "max_new_tokens": no_words * 5  # Set to a large enough multiplier to get a 1500-word response
                }
            },
            timeout=180 # Increased timeout to 180 seconds
        )
        response.raise_for_status()  # Raises exception for non-2xx responses
        response_data = response.json()

        if 'error' in response_data:
            raise Exception(f"Error from API: {response_data['error']}")
        
        # Grab the generated text
        generated_text = response_data[0]['generated_text']

        # Ensure the response doesn't exceed the word limit
        words = generated_text.split()
        if len(words) > no_words:
            generated_text = ' '.join(words[:no_words])  # Trim if the response exceeds the word count
        
        # Format the response text to ensure readability in paragraph format (no bullet points or headings)
        formatted_text = f"""
        {generated_text.replace('Key Features', '').replace('Examples', '').replace('Challenges and Limitations', '').replace('Conclusion', '')}
        """

        return formatted_text

    except requests.exceptions.RequestException as e:
        print(f"Error from API: {e}")
        raise Exception(f"Error from API: {str(e)}")

# Route to handle blog generation requests
@app.route('/generate_blog', methods=['POST'])
def generate_blog():
    try:
        data = request.get_json()  # Get the JSON data from the request
        
        # Validate input
        if 'input_text_field' not in data or 'no_words' not in data or 'blog_style' not in data:
            return jsonify({'error': "Missing required fields: 'input_text_field', 'no_words', 'blog_style'"}), 400
        
        input_text_field = data['input_text_field']
        no_words = data['no_words']
        blog_style = data['blog_style']

        # Validate the data types
        if not isinstance(input_text_field, str):
            return jsonify({'error': "'input_text_field' must be a string"}), 400
        if not isinstance(no_words, int):
            return jsonify({'error': "'no_words' must be an integer"}), 400
        if not isinstance(blog_style, str):
            return jsonify({'error': "'blog_style' must be a string"}), 400

        # Ensure no_words is capped at 1500 words
        if no_words > 1500:
            no_words = 1500  # Cap the word count at 1500
        
        # Debugging: print received data
        print(f"Received request to generate a {blog_style} blog on '{input_text_field}' with {no_words} words.")

        # Generate blog using Hugging Face API
        generated_blog = getModelResponse(input_text_field, no_words, blog_style)
        
        # Return the formatted generated blog as a JSON response
        return jsonify({'generated_text': generated_blog})

    except Exception as e:
        # Log the error for debugging
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 400  # Return error if something goes wrong
# Route to handle blog summarization requests
@app.route('/summarize', methods=['POST'])
def summarize_blog():
    try:
        # Get the content from the request body
        data = request.get_json()
        content = data.get('content')
        max_length = data.get('max_length', 250)  # Default to 150 words
        min_length = data.get('min_length', 100)   # Default to 30 words
        
        if not content:
            return jsonify({'error': 'Content is required'}), 400
        
        # Use the Hugging Face summarization pipeline
        summary = summarizer(content, max_length=max_length, min_length=min_length, do_sample=False)
        
        # Return the summary
        return jsonify({'summary': summary[0]['summary_text']})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 400
if __name__ == "__main__":
    # Enable debug mode for better error visibility
    app.run(debug=True, host="0.0.0.0", port=8501, threaded=True)
