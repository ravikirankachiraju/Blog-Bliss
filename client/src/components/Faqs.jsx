import React from 'react'

const Faqs = () => {
  return (
    <div className="about-container offset-1 mt-5">
    <h3>FAQs</h3>
    <p>Here are some frequently asked questions to help you better understand our platform:</p>

    <h5>1. Is the AI-based content generation and summarization feature free to use?</h5>
    <p>
        Yes, the content generation and summarization features are free for all users within the basic usage limits. 
        If you require extended usage, premium plans may be introduced in the future.
    </p>

    <h5>2. What kind of topics can I generate blogs about?</h5>
    <p>
        You can generate blogs on a wide variety of topics, ranging from technology, health, and lifestyle to business, 
        education, and more. Simply provide the topic, desired word count, and blog style to get started.
    </p>

    <h5>3. How does the platform ensure the quality of the AI-generated content?</h5>
    <p>
        Our platform integrates LLaMA 3, a state-of-the-art NLP model, which is fine-tuned to generate coherent, 
        engaging, and high-quality content based on your inputs.
    </p>

    <h5>4. Can I edit the AI-generated content?</h5>
    <p>
        Absolutely! After generating a blog, you can edit, update, and customize the content directly through 
        the platform’s intuitive editor before publishing.
    </p>

    <h5>5. Is my data secure on this platform?</h5>
    <p>
        Yes, your data is stored securely in our database. We follow industry-standard practices for data protection 
        and do not share your personal information or blog content with third parties.
    </p>

    <h5>6. How long does it take to generate a blog post or summary?</h5>
    <p>
        Blog generation and summarization typically take a few seconds to a minute, depending on the length and complexity 
        of the input and speed of your internet connection.
    </p>

    <h5>7. Can I use the platform for commercial purposes?</h5>
    <p>
        Yes, you can use the content generated for personal or commercial purposes, as long as it complies with our terms of service.
    </p>
</div>
  )
}

export default Faqs
