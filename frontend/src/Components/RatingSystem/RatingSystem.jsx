import React, { useState, useEffect, useCallback } from 'react';
import { FaThumbsUp, FaThumbsDown} from 'react-icons/fa';
import {  FaXTwitter } from 'react-icons/fa6';
import { createClient } from '@supabase/supabase-js';
import styles from './RatingSystem.module.css';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const RatingSystem = ({ boxName, twitterHandle }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userRating, setUserRating] = useState(null);

  const fetchRatings = useCallback(async () => {
    const { data, error } = await supabase
      .from('box_ratings')
      .select('likes, dislikes')
      .eq('box_name', boxName)
      .single();

    if (error) {
      console.error('Error fetching ratings:', error);
    } else if (data) {
      setLikes(data.likes);
      setDislikes(data.dislikes);
    }
  }, [boxName]);

  useEffect(() => {
    fetchRatings();
    const savedRating = localStorage.getItem(`rating_${boxName}`);
    if (savedRating) {
      setUserRating(savedRating);
    }
  }, [boxName, fetchRatings]);

  const handleRating = async (ratingType) => {
    if (userRating === ratingType) return;

    const newRating = {
      likes: likes + (ratingType === 'like' ? 1 : 0),
      dislikes: dislikes + (ratingType === 'dislike' ? 1 : 0),
    };

    if (userRating) {
      newRating[userRating + 's'] -= 1;
    }

    const { error } = await supabase
      .from('box_ratings')
      .upsert({ box_name: boxName, ...newRating });

    if (error) {
      console.error('Error updating rating:', error);
    } else {
      setLikes(newRating.likes);
      setDislikes(newRating.dislikes);
      setUserRating(ratingType);
      localStorage.setItem(`rating_${boxName}`, ratingType);
    }
  };

  return (
    <div className={styles.ratingSystem}>
      <button 
        onClick={() => handleRating('like')} 
        className={`${styles.ratingButton} ${userRating === 'like' ? styles.active : ''}`}
        disabled={userRating === 'like'}
      >
        <FaThumbsUp /> {likes}
      </button>
      <button 
        onClick={() => handleRating('dislike')} 
        className={`${styles.ratingButton} ${userRating === 'dislike' ? styles.active : ''}`}
        disabled={userRating === 'dislike'}
      >
        <FaThumbsDown /> {dislikes}
      </button>
      <a href={`https://twitter.com/${twitterHandle}`} target="_blank" rel="noopener noreferrer" className={styles.twitterButton}>
        <FaXTwitter />
      </a>
    </div>
  );
};

export default RatingSystem;