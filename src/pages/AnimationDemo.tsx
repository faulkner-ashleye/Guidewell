import React, { useState, useEffect } from 'react';
import { 
  AnimatedLineChart, 
  AnimatedPieChart, 
  AnimatedProgressChart,
  AnimatedCard,
  LoadingSkeleton,
  SuccessCelebration
} from '../components/AnimatedCharts';
import { Card } from '../components/Card';
import { Button, ButtonVariants, ButtonColors } from '../components/Button';
import '../styles/card-animations.css';

export function AnimationDemo() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for charts
  const lineChartData = [12000, 15000, 18000, 22000, 19000, 25000, 28000];
  const lineChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  const pieChartData = [40, 25, 20, 15];
  const pieChartLabels = ['Savings', 'Investments', 'Debt', 'Emergency'];

  const handleCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1000);
  };

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '32px', textAlign: 'center' }}>
        🎨 Animation Demo
      </h1>

      {/* Chart Animations Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px' }}>Chart Growth Animations</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <AnimatedCard delay={0}>
            <AnimatedLineChart 
              title="Net Worth Growth"
              data={lineChartData}
              labels={lineChartLabels}
            />
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <AnimatedPieChart 
              title="Portfolio Allocation"
              data={pieChartData}
              labels={pieChartLabels}
            />
          </AnimatedCard>
        </div>
      </section>

      {/* Progress Animations Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px' }}>Progress Bar Animations</h2>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          <AnimatedCard delay={400}>
            <AnimatedProgressChart 
              value={7500}
              max={10000}
              label="Emergency Fund Goal"
              showCounter={true}
            />
          </AnimatedCard>

          <AnimatedCard delay={600}>
            <AnimatedProgressChart 
              value={45000}
              max={100000}
              label="Retirement Savings"
              showCounter={true}
            />
          </AnimatedCard>

          <AnimatedCard delay={800}>
            <AnimatedProgressChart 
              value={15000}
              max={25000}
              label="Debt Payoff Progress"
              showCounter={true}
            />
          </AnimatedCard>
        </div>
      </section>

      {/* Interactive Demos Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px' }}>Interactive Animations</h2>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button
            variant={ButtonVariants.contained}
            color={ButtonColors.secondary}
            onClick={handleCelebration}
          >
            🎉 Trigger Celebration
          </Button>

          <Button
            variant={ButtonVariants.outline}
            color={ButtonColors.secondary}
            onClick={handleLoadingDemo}
          >
            ⏳ Loading Demo
          </Button>
        </div>

        {/* Celebration Demo */}
        <div style={{ marginTop: '24px' }}>
          <SuccessCelebration trigger={showCelebration}>
            <div 
              className="card"
              style={{ 
                background: showCelebration ? 'linear-gradient(135deg, #10b981, #34d399)' : 'white',
                color: showCelebration ? 'white' : 'black',
                transition: 'all 0.6s ease',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3>Goal Achieved! 🎯</h3>
              <p>Congratulations! You've reached your savings target.</p>
            </div>
          </SuccessCelebration>
        </div>

        {/* Loading Demo */}
        {isLoading && (
          <div style={{ marginTop: '24px' }}>
            <Card>
              <h3>Loading Your Data...</h3>
              <div style={{ marginTop: '16px' }}>
                <LoadingSkeleton width="100%" height="20px" />
                <div style={{ marginTop: '8px' }}>
                  <LoadingSkeleton width="80%" height="20px" />
                </div>
                <div style={{ marginTop: '8px' }}>
                  <LoadingSkeleton width="60%" height="20px" />
                </div>
              </div>
            </Card>
          </div>
        )}
      </section>

      {/* Card Entrance Animations */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px' }}>Card Entrance Animations</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <AnimatedCard delay={0}>
            <Card>
              <h3>Account Balance</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                $12,450
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                +2.3% from last month
              </p>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={100}>
            <Card>
              <h3>Monthly Spending</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                $3,200
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                -5.1% from last month
              </p>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <Card>
              <h3>Investment Returns</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                $1,850
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                +8.7% this quarter
              </p>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={300}>
            <Card>
              <h3>Debt Reduction</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                $2,100
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                -12.3% this year
              </p>
            </Card>
          </AnimatedCard>
        </div>
      </section>

      {/* Micro-interactions Demo */}
      <section>
        <h2 style={{ marginBottom: '24px' }}>Micro-interactions</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <AnimatedCard delay={400}>
            <Card 
              onClick={() => console.log('Card clicked!')}
              className="card-hover-demo"
            >
              <h3>Hover Me</h3>
              <p>This card has enhanced hover effects</p>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={500}>
            <Card 
              onClick={() => console.log('Card clicked!')}
              className="card-hover-demo"
            >
              <h3>Click Me</h3>
              <p>This card responds to clicks</p>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={600}>
            <Card 
              onClick={() => console.log('Card clicked!')}
              className="card-hover-demo"
            >
              <h3>Focus Me</h3>
              <p>This card has focus states</p>
            </Card>
          </AnimatedCard>
        </div>
      </section>
    </div>
  );
}