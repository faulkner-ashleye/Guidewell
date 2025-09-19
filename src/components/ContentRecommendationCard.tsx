import React from 'react';
import { ContentItem, ContentRecommendation } from '../data/contentLibrary';
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
        <div className="content-type">
          <span className="type-icon">{getTypeIcon(content.type)}</span>
          <span className="type-label">{content.type}</span>
        </div>
        <div className="content-actions">
          <button 
            className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={() => onBookmark(content.id)}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark content'}
          >
            {isBookmarked ? '🔖' : '📖'}
          </button>
          <button 
            className="dismiss-button"
            onClick={() => onDismiss(content.id)}
            aria-label="Dismiss recommendation"
          >
            ×
          </button>
        </div>
      </div>

      <div className="content-body">
        <h3 className="content-title">{content.title}</h3>
        
        <div className="content-meta">
          <div className="meta-item">
            <span className="meta-label">Difficulty</span>
            <span 
              className="meta-value difficulty"
              style={{ color: getDifficultyColor(content.difficulty) }}
            >
              {content.difficulty}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Time</span>
            <span className="meta-value">{formatTime(content.estimatedTime)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Category</span>
            <span className="meta-value">{content.category}</span>
          </div>
        </div>

        <div className="content-summary">
          <p>{content.summary}</p>
        </div>

        <div className="content-tags">
          {content.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          {content.tags.length > 3 && (
            <span className="tag more">+{content.tags.length - 3} more</span>
          )}
        </div>

        <div className="recommendation-reason">
          <div className="reason-header">
            <span 
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(recommendation.priority) }}
            >
              {recommendation.priority} priority
            </span>
            <span className="personalized-for">{recommendation.personalizedFor}</span>
          </div>
          <p className="reason-text">{recommendation.reason}</p>
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
        <button 
          className="read-button primary"
          onClick={() => onRead(content)}
        >
          {content.type === 'video' ? 'Watch' : 
           content.type === 'interactive' ? 'Try' :
           content.type === 'calculator' ? 'Calculate' :
           content.type === 'checklist' ? 'Start Checklist' :
           'Read'}
        </button>
        <button 
          className="read-button secondary"
          onClick={() => onDismiss(content.id)}
        >
          Not Now
        </button>
      </div>
    </div>
  );
}
