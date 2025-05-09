import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for redirection
import '../styles/ReviewForm.css';

const questions = [
  "How was our service?",
  "How was the product?",
  "Was the delivery on time?",
  "Would you recommend us to others?"
];

const ReviewForm = () => {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [ratings, setRatings] = useState(Array(questions.length).fill(0));
  const navigate = useNavigate(); // for navigation after submit

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  const handleStarClick = (questionIndex, starValue) => {
    const newRatings = [...ratings];
    newRatings[questionIndex] = starValue;
    setRatings(newRatings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      text,
      ratings
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(`Server error: ${errMsg}`);
      }

      // Redirect to thank you page on success
      navigate('/thank-you');
    } catch (error) {
      console.error('Failed to submit review:', error.message);
      alert('Failed to submit review. Please try again later.');
    }
  };

  return (
    <div className="review-container">
      <form onSubmit={handleSubmit}>
        {questions.map((question, qIdx) => (
          <div key={qIdx} className="question-block">
            <label>{question}</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={i <= ratings[qIdx] ? 'filled' : ''}
                  onClick={() => handleStarClick(qIdx, i)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}

        <textarea
          placeholder="Write your review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Submit Review</button>
      </form>

      <div className="review-list">
        {reviews.map((review, index) => (
          <div key={review._id || index} className="review-item">
            {review.ratings?.map((rate, i) => (
              <div key={i} className="question-block">
                <strong>{questions[i]}</strong>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <span key={j} className={j <= rate ? 'filled' : ''}>★</span>
                  ))}
                </div>
              </div>
            ))}
            <p>{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewForm;
