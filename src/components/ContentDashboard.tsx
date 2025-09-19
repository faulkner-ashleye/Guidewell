import React, { useState, useEffect } from 'react';
import { ContentItem, ContentRecommendation, ContentRecommendationEngine } from '../data/contentLibrary';
import { ContentRecommendationCard } from './ContentRecommendationCard';
import { EnhancedUserProfile } from '../data/enhancedUserProfile';
import { Account, Goal } from '../data/types';
import './ContentDashboard.css';

interface ContentDashboardProps {
  userProfile: EnhancedUserProfile;
  accounts: Account[];
  goals: Goal[];
  onContentRead: (content: ContentItem) => void;
}

export function ContentDashboard({ 
  userProfile, 
  accounts, 
  goals, 
  onContentRead 
}: ContentDashboardProps) {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dismissedContent, setDismissedContent] = useState<Set<string>>(new Set());
  const [bookmarkedContent, setBookmarkedContent] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadRecommendations();
  }, [userProfile, accounts, goals]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Identify current challenges
      const challenges = identifyCurrentChallenges(accounts, goals);
      
      // Get content recommendations
      const contentRecs = ContentRecommendationEngine.getRecommendations(
        userProfile,
        userProfile.mainGoals,
        challenges
      );
      
      setRecommendations(contentRecs);
    } catch (err) {
      setError('Failed to load content recommendations. Please try again.');
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const identifyCurrentChallenges = (accounts: Account[], goals: Goal[]): string[] => {
    const challenges: string[] = [];
    
    const totalDebt = accounts
      .filter(a => ['loan', 'credit_card'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const totalAssets = accounts
      .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const highInterestDebt = accounts
      .filter(a => a.type === 'credit_card' && (a.interestRate || 0) > 15)
      .reduce((sum, a) => sum + a.balance, 0);
    
    const emergencyFund = accounts
      .filter(a => a.type === 'savings')
      .reduce((sum, a) => sum + a.balance, 0);

    if (highInterestDebt > 0) {
      challenges.push('high_interest_debt');
    }
    
    if (totalDebt > totalAssets * 0.5) {
      challenges.push('high_debt_ratio');
    }
    
    if (emergencyFund < 1000) {
      challenges.push('low_emergency_fund');
    }
    
    if (accounts.filter(a => a.type === 'investment').length === 0) {
      challenges.push('no_investments');
    }
    
    if (goals.filter(g => g.priority === 'high').length > 3) {
      challenges.push('too_many_priorities');
    }

    return challenges;
  };

  const handleContentRead = (content: ContentItem) => {
    onContentRead(content);
  };

  const handleBookmark = (contentId: string) => {
    setBookmarkedContent(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contentId)) {
        newSet.delete(contentId);
      } else {
        newSet.add(contentId);
      }
      return newSet;
    });
  };

  const handleDismiss = (contentId: string) => {
    setDismissedContent(prev => {
      const newSet = new Set(prev);
      newSet.add(contentId);
      return newSet;
    });
  };

  const getFilteredRecommendations = (): ContentRecommendation[] => {
    let filtered = recommendations.filter(
      rec => !dismissedContent.has(rec.contentId)
    );

    // Filter by priority
    if (filter !== 'all') {
      filtered = filtered.filter(rec => rec.priority === filter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(rec => {
        const content = getContentById(rec.contentId);
        return content && content.category === categoryFilter;
      });
    }

    return filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const getContentById = (contentId: string): ContentItem | null => {
    // This would typically come from a content service
    // For now, we'll return null and handle it gracefully
    return null;
  };

  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};
    recommendations.forEach(rec => {
      const content = getContentById(rec.contentId);
      if (content) {
        counts[content.category] = (counts[content.category] || 0) + 1;
      }
    });
    return counts;
  };

  const getPriorityCounts = () => {
    const counts = { high: 0, medium: 0, low: 0 };
    recommendations.forEach(rec => {
      counts[rec.priority]++;
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="content-dashboard">
        <div className="dashboard-header">
          <h2>Personalized Learning</h2>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Finding personalized content for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-dashboard">
        <div className="dashboard-header">
          <h2>Personalized Learning</h2>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="retry-button" onClick={loadRecommendations}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredRecommendations = getFilteredRecommendations();
  const priorityCounts = getPriorityCounts();
  const categoryCounts = getCategoryCounts();

  return (
    <div className="content-dashboard">
      <div className="dashboard-header">
        <h2>Personalized Learning</h2>
        <div className="dashboard-subtitle">
          Content tailored to your financial goals and situation
        </div>
      </div>

      <div className="dashboard-summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-value">{recommendations.length}</span>
            <span className="stat-label">Recommended</span>
          </div>
          <div className="stat">
            <span className="stat-value">{priorityCounts.high}</span>
            <span className="stat-label">High Priority</span>
          </div>
          <div className="stat">
            <span className="stat-value">{bookmarkedContent.size}</span>
            <span className="stat-label">Bookmarked</span>
          </div>
          <div className="stat">
            <span className="stat-value">{Object.keys(categoryCounts).length}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </div>

      <div className="filter-controls">
        <div className="priority-filters">
          <span className="filter-label">Priority:</span>
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({recommendations.length})
          </button>
          <button 
            className={`filter-button ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High ({priorityCounts.high})
          </button>
          <button 
            className={`filter-button ${filter === 'medium' ? 'active' : ''}`}
            onClick={() => setFilter('medium')}
          >
            Medium ({priorityCounts.medium})
          </button>
          <button 
            className={`filter-button ${filter === 'low' ? 'active' : ''}`}
            onClick={() => setFilter('low')}
          >
            Low ({priorityCounts.low})
          </button>
        </div>

        <div className="category-filters">
          <span className="filter-label">Category:</span>
          <button 
            className={`filter-button ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            All
          </button>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <button 
              key={category}
              className={`filter-button ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => setCategoryFilter(category)}
            >
              {category} ({count})
            </button>
          ))}
        </div>
      </div>

      <div className="content-list">
        {filteredRecommendations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No content found</h3>
            <p>
              {filter === 'all' && categoryFilter === 'all'
                ? "Great job! You've seen all our recommended content."
                : `No ${filter !== 'all' ? filter : ''} ${categoryFilter !== 'all' ? categoryFilter : ''} content found. Try a different filter.`
              }
            </p>
            {(filter !== 'all' || categoryFilter !== 'all') && (
              <button 
                className="clear-filter-button"
                onClick={() => {
                  setFilter('all');
                  setCategoryFilter('all');
                }}
              >
                Show All Content
              </button>
            )}
          </div>
        ) : (
          filteredRecommendations.map(recommendation => {
            const content = getContentById(recommendation.contentId);
            if (!content) return null;
            
            return (
              <ContentRecommendationCard
                key={recommendation.contentId}
                recommendation={recommendation}
                content={content}
                onRead={handleContentRead}
                onBookmark={handleBookmark}
                onDismiss={handleDismiss}
                isBookmarked={bookmarkedContent.has(recommendation.contentId)}
              />
            );
          })
        )}
      </div>

      {dismissedContent.size > 0 && (
        <div className="dismissed-info">
          <p>
            {dismissedContent.size} content item{dismissedContent.size !== 1 ? 's' : ''} dismissed
          </p>
          <button 
            className="reset-button"
            onClick={() => setDismissedContent(new Set<string>())}
          >
            Reset Dismissed
          </button>
        </div>
      )}
    </div>
  );
}
