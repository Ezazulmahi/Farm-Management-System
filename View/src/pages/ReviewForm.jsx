// ReviewForm.jsx
import React, { useState, useEffect } from 'react';
import './ReviewForm.css';

const ReviewForm = () => {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, rating }),
    });

    const newReview = await res.json();
    setReviews([newReview, ...reviews]);
    setText('');
    setRating(0);
  };

  return (
    <div className="review-container">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <div className="stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={i <= rating ? 'filled' : ''}
              onClick={() => setRating(i)}
            >
              ★
            </span>
          ))}
        </div>
        <button type="submit">Submit Review</button>
      </form>

      <div className="review-list">
        {reviews.map((review) => (
          <div key={review._id} className="review-item">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= review.rating ? 'filled' : ''}>
                  ★
                </span>
              ))}
            </div>
            <p>{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewForm;
