import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [text, setText] = useState('');
  const [numSentences, setNumSentences] = useState(3);
  const [summary, setSummary] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/summarize', {
        text,
        num_sentences: numSentences,
      });
      setSummary(response.data.summary);
      setAudioUrl(response.data.audio_url);
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Text Summarization</title>
        <meta name="description" content="Summarize text with ease" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.wrapper}>
        <h1>Text Summarization</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here"
          />
          <label className={styles.label}>
            Number of Sentences:
            <input
              type="number"
              value={numSentences}
              onChange={(e) => setNumSentences(e.target.value)}
              min="1"
              className={styles.input}
            />
          </label>
          <button className={styles.button} type="submit">Summarize</button>
        </form>
        {summary && (
          <div className={styles.summary}>
            <h2>Summary</h2>
            <p>{summary}</p>
            {audioUrl && (
              <div>
                <h3>Audio</h3>
                <audio controls src={audioUrl} className={styles.audio}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
