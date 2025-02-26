import React, {useState, useEffect, useRef} from 'react';
import {Cable, Channel} from '@kesha-antonov/react-native-action-cable';

interface SubscriptionData {
  channel: string;
  channel_key?: string;
  [key: string]: any;
}

interface Callbacks {
  received?: (data: any) => void;
  connected?: () => void;
  disconnected?: () => void;
  rejected?: () => void;
}

interface UseChannelReturn {
  subscribe: (data: SubscriptionData, callbacks?: Callbacks) => void;
  unsubscribe: () => void;
  send: (type: string, payload: any) => void;
  connected: boolean;
}

export const useChannel = (actionCable: Cable): UseChannelReturn => {
  const channelRef = useRef<Channel | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    return () => {
      if (channelRef?.current) unsubscribe();
    };
  }, []);

  const subscribe = (data: SubscriptionData, callbacks?: Callbacks) => {
    // console.log('Subscribing to channel =>', data);

    const channel = actionCable.subscriptions.create({
      channel: data.channel,
      channel_key: data.channel_key,
    });

    channel
      .on('received', (message: any) => {
        // console.log('Received message from', data.channel, message);
        if (callbacks?.received) callbacks.received(message);
      })
      .on('connected', () => {
        // console.log('Connected to', data.channel);
        setConnected(true);
        if (callbacks?.connected) callbacks.connected();
      })
      .on('rejected', () => {
        // console.log('Subscription rejected for', data.channel);
        setConnected(false);
        if (callbacks?.rejected) callbacks.rejected();
      })
      .on('disconnected', () => {
        // console.log('Disconnected from', data.channel);
        setConnected(false);
        if (callbacks?.disconnected) callbacks.disconnected();
      });

    channelRef.current = channel;
  };

  const send = (type: string, payload: any) => {
    if (!connected) {
      // console.error('useChannel - ERROR: not connected');
      return;
    }

    if (!channelRef.current) {
      // console.error('useChannel - ERROR: no channel reference');
      return;
    }

    try {
      channelRef.current.perform(type, payload);
    } catch (e) {
      // console.error('useChannel - ERROR:', e);
    }
  };

  const unsubscribe = () => {
    if (channelRef.current) {
      // console.log('Unsubscribing from', channelRef.current.identifier);
      actionCable.subscriptions.remove(channelRef.current);
      channelRef.current = null;
    }
    setConnected(false);
  };

  return {subscribe, unsubscribe, send, connected};
};
