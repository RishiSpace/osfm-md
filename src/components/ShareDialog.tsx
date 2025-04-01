import React, { useState, useEffect, useRef } from 'react';
import { Share2, X, Check, AlertCircle } from 'lucide-react';
import { findUserByEmail } from '../utils/users';

interface ShareDialogProps {
  noteId: string;
  onShare: (email: string) => Promise<void>;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ noteId, onShare }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!email) {
      setUserExists(null);
      return;
    }

    setIsChecking(true);
    timeoutRef.current = setTimeout(async () => {
      const userId = await findUserByEmail(email);
      setUserExists(!!userId);
      setIsChecking(false);
    }, 500);
  }, [email]);

  const handleShare = async () => {
    if (!userExists || !email) return;
    await onShare(email);
    setEmail('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Share2 className="w-5 h-5 text-gray-300" />
      </button>
    );
  }

  return (
    <div className="absolute right-0 top-16 w-80 bg-gray-800 rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Share Note</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-2 top-2">
          {isChecking ? (
            <div className="animate-spin text-gray-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          ) : email && userExists !== null ? (
            userExists ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <span className="text-red-400 text-sm">User not available</span>
            )
          ) : null}
        </div>
      </div>
      <button
        onClick={handleShare}
        disabled={!userExists}
        className="mt-4 w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        Share
      </button>
    </div>
  );
}

export default ShareDialog;