'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import axios from 'axios';

interface SubscriptionButtonProps {
  isPro: boolean;
}

const SubscriptionButton = ({ isPro = false }: SubscriptionButtonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/api/stripe`);

      window.location.href = response.data.url;
    } catch (e) {
      toast({
        variant: 'destructive',
        description: 'Something went wrong.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      size={'sm'}
      variant={isPro ? 'default' : 'premium'}
    >
      {isPro ? 'Manage Subscription' : 'Upgrade'}
      {!isPro && <Sparkles className={'h-4 w-4 ml-2 fill-white'} />}
    </Button>
  );
};

export default SubscriptionButton;
