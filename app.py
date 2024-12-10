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

# Hugging Face API Key and URL
hugging_face_api_key = os.getenv('HUGGING_FACE_API_KEY')
api_url = os.getenv('API_URL')
# Summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Function to clean and format text
def clean_text(text):
    """
    Remove unwanted symbols and format the text for better readability.
    """
    cleaned_text = text.replace("•", "").replace("*", "").replace("-", "")
    return " ".join(cleaned_text.split())  # Remove excessive whitespace

# Function to get model response
def getModelResponse(input_text_field, no_words, blog_style):
    headers = {"Authorization": f"Bearer {hugging_face_api_key}"}
    max_tokens = 2048  # Maximum tokens per request
    tokens_per_word = 1.33  # Approximation of token-to-word ratio

    if no_words <= 1200:
        # Single prompt for word counts <= 1200
        prompt = f"""
        Write a detailed and comprehensive blog on the topic '{input_text_field}' for a {blog_style} audience.
        The blog should be approximately {no_words} words long, well-written, and informative. Avoid redundancy, bullet points, or symbols.
        """
        tokens_required = int(no_words * tokens_per_word)

        try:
            response = requests.post(
                api_url,
                headers=headers,
                json={
                    "inputs": prompt,
                    "parameters": {
                        "max_new_tokens": min(tokens_required, max_tokens),
                        "temperature": 0.7,
                        "top_p": 0.9
                    }
                },
                timeout=120
            )
            response.raise_for_status()
            response_data = response.json()
            return clean_text(response_data[0]["generated_text"])
        except requests.exceptions.RequestException as e:
            print(f"RequestException: {e}")
            raise Exception(f"Error from API: {str(e)}")
        except Exception as e:
            print(f"General Error: {e}")
            raise
    else:
        # Divide into sections for word counts > 1200
        sections = [
            "Introduction: Provide an introduction to the topic and explain its importance.",
            "Key Features: Discuss the key features of the topic in detail.",
            "Examples: Provide real-world examples or case studies.",
            "Challenges and Limitations: Explain the challenges and limitations associated with the topic.",
            "Conclusion: Summarize the key takeaways."
        ]

        generated_blog = ""
        words_per_section = no_words // len(sections)
        tokens_per_section = int(words_per_section * tokens_per_word)

        previous_responses = set()  # Track unique responses for deduplication

        for section in sections:
            prompt = f"""
            Write a detailed and comprehensive blog section for a {blog_style} audience topic '{input_text_field}'. 
            {section}
            The section must be approximately {words_per_section} words long. 
            Ensure the content is well-written, informative, and avoids redundancy, bullet points, or symbols.
            """
            for _ in range(3):  # Retry logic to handle duplicates
                try:
                    response = requests.post(
                        api_url,
                        headers=headers,
                        json={
                            "inputs": prompt,
                            "parameters": {
                                "max_new_tokens": min(tokens_per_section, max_tokens),
                                "temperature": 0.7,
                                "top_p": 0.9
                            }
                        },
                        timeout=120
                    )
                    response.raise_for_status()
                    response_data = response.json()
                    response_text = clean_text(response_data[0]["generated_text"])

                    if response_text not in previous_responses:
                        previous_responses.add(response_text)
                        generated_blog += response_text + "\n\n"
                        break  # Exit retry loop after successful response

                except requests.exceptions.RequestException as e:
                    print(f"RequestException: {e}")
                    raise Exception(f"Error from API: {str(e)}")
                except Exception as e:
                    print(f"General Error: {e}")
                    raise

        return generated_blog

# Route to handle blog generation requests
@app.route('/generate_blog', methods=['POST'])
def generate_blog():
    try:
        data = request.get_json()

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

        # Cap word count at 1500
        if no_words > 1500:
            no_words = 1500

        generated_blog = getModelResponse(input_text_field, no_words, blog_style)

        return jsonify({'generated_text': generated_blog})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 400

# Route to handle blog summarization requests
@app.route('/summarize', methods=['POST'])
def summarize_blog():
    try:
        data = request.get_json()
        content = data.get('content')
        max_length = data.get('max_length', 250)
        min_length = data.get('min_length', 100)

        if not content:
            return jsonify({'error': 'Content is required'}), 400

        summary = summarizer(content, max_length=max_length, min_length=min_length, do_sample=False)
        return jsonify({'summary': summary[0]['summary_text']})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8501, threaded=True)
