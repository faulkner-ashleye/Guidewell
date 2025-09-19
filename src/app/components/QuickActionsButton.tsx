'use client';
import { Button, ButtonVariants, ButtonColors } from '../../components/Button';
import '../../components/Button.css';
import { Icon, IconNames } from '../../components/Icon';

export default function QuickActionsButton({ onClick }:{ onClick:()=>void }) {
  const handleClick = () => {
    console.log('QuickActionsButton clicked');
    onClick();
  };

  return (
    <Button 
      variant={ButtonVariants.contained}
      color={ButtonColors.secondary}
      onClick={handleClick}
      aria-label="Quick actions"
    >
      <Icon name={IconNames.add} size="md" className="icon-white" />
      <span>Quick actions</span>
    </Button>
  );
}
