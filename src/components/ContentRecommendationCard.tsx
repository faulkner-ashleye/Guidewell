import React from 'react';
import { ContentItem, ContentRecommendation } from '../data/contentLibrary';
import { Button, ButtonVariants } from './Button';
import './ContentRecommendationCard.css';

interface ContentRecommendationCardProps {
  recommendation: ContentRecommendation;
  content: ContentItem;
  onRead: (content: ContentItem) => void;
  onBookmark: (contentId: string) => void;
  onDismiss: (contentId: string) => void;
  isBookmarked?: boolean;
}

export function ContentRecommendationCard({ 
  recommendation, 
  content, 
  onRead, 
  onBookmark, 
  onDismiss,
  isBookmarked = false
}: ContentRecommendationCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄';
      case 'video': return '🎥';
      case 'interactive': return '🎮';
      case 'calculator': return '🧮';
      case 'checklist': return '✅';
      case 'guide': return '📚';
      default: return '📋';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10B981'; // green
      case 'intermediate': return '#F59E0B'; // yellow
      case 'advanced': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444'; // red
      case 'medium': return '#F59E0B'; // yellow
      case 'low': return '#10B981'; // green
      default: return '#6B7280'; // gray
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="content-recommendation-card">
      <div className="content-header">
        <h3 className="content-title">{content.title}</h3>
      </div>

      <div className="content-body">

        <div className="content-summary">
          <p>{content.summary}</p>
        </div>

        {content.keyPoints.length > 0 && (
          <div className="content-key-points">
            <h4>Key Points:</h4>
            <ul>
              {content.keyPoints.slice(0, 3).map((point, index) => (
                <li key={index}>{point}</li>
              ))}
              {content.keyPoints.length > 3 && (
                <li className="more-points">+{content.keyPoints.length - 3} more points</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="content-footer">
        <Button 
          variant={ButtonVariants.text}
          size="medium"
          fullWidth={true}
          onClick={() => {
            // Navigate to insights page
            window.location.href = '/opportunities';
          }}
        >
          Discover more insights
        </Button>
      </div>
    </div>
  );
}
