// Role/Owner: Member 2 (ML & Data Engineering Lead)
// Core Responsibility: Claim text input form with character counter, validation guards, and author metadata controls
// Key Interface/Contract: Accepts `{ onSubmit, loading }` props; dispatches `{ text, user_followers, user_verified }` payload

import React, { useState } from 'react';

export default function InputForm({ onSubmit, loading }) {
  const [text, setText] = useState('');
  const [followers, setFollowers] = useState(1000);
  const [verified, setVerified] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSubmit?.({
      text: text.trim(),
      user_followers: Number(followers),
      user_verified: Boolean(verified),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Political Claim or Breaking News Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a political claim, headline, or tweet to verify..."
          rows={4}
          maxLength={5000}
          className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>Min 5 characters</span>
          <span>{text.length}/5000 characters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
            Author Followers Count
          </label>
          <input
            type="number"
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            min={0}
            className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div className="flex items-center space-x-2 pt-5">
          <input
            type="checkbox"
            id="verified-checkbox"
            checked={verified}
            onChange={(e) => setVerified(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="verified-checkbox" className="text-sm text-slate-700 dark:text-slate-300">
            Verified Account Badge
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing Claim...' : 'Verify Claim Veracity & Spread Risk'}
      </button>
    </form>
  );
}
