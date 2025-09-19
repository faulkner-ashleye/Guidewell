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
      variant={ButtonVariants.outline}
      color={ButtonColors.secondary}
      size="large"
      onClick={handleClick}
      aria-label="Quick actions"
    >
      <Icon name={IconNames.add} size="xl" />
    </Button>
  );
}
