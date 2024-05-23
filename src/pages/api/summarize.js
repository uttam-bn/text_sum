import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);

const hybridSummarization = (text, numSentences) => {
  // Placeholder function for hybrid summarization logic
  // Replace with actual logic as needed
  const sentences = text.split('.').filter(Boolean);
  return sentences.slice(0, numSentences).join('. ') + '.';
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, num_sentences = 3 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing required field "text"' });
    }

    const summary = hybridSummarization(text, num_sentences);

    const staticDir = path.join(process.cwd(), 'public', 'static');
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }

    const audioPath = path.join(staticDir, 'summary.mp3');

    try {
      // Replace this with a real text-to-speech implementation
      const gttsCommand = `gtts-cli "${summary}" --output ${audioPath}`;
      await execAsync(gttsCommand);

      res.status(200).json({ summary, audio_url: '/static/summary.mp3' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate audio' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
