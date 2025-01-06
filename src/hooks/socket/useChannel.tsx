import React, {useState, useEffect, useRef} from 'react';
import {Cable, Channel} from '@kesha-antonov/react-native-action-cable';

interface SubscriptionData {
  channel: string;
  channel_key?: string;
  [key: string]: any; // Additional properties for dynamic data
}

interface Callbacks {
  received?: (data: any) => void;
  connected?: (data: any) => void;
  disconnected?: () => void;
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
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);

  const subscribe = (data: SubscriptionData, callbacks?: Callbacks) => {
    const cable = new Cable({});
    const channel = cable.setChannel(
      data.channel,
      actionCable.subscriptions.create(data),
    );

    channel
      .on('received', (x: any) => {
        console.log('Received from ' + data?.channel);
        if (callbacks?.received) callbacks.received(x);
      })
      .on('connected', (x: any) => {
        console.log('Connected to ' + data?.channel);
        setConnected(true);
        setSubscribed(true);
        if (callbacks?.connected) callbacks.connected(x);
      })
      .on('rejected', () => {
        console.log('Rejected');
        setConnected(false);
        if (callbacks?.disconnected) callbacks.disconnected();
      })
      .on('disconnected', () => {
        console.log('Disconnected');
        setConnected(false);
        if (callbacks?.disconnected) callbacks.disconnected();
      });

    channelRef.current = channel;
  };

  const send = (type: string, payload: any) => {
    if (subscribed && !connected) {
      throw new Error('useChannel - ERROR: not connected');
    }
    if (!subscribed) {
      throw new Error('useChannel - ERROR: not subscribed');
    }
    try {
      channelRef.current?.perform('send_message', {text: 'Hey'});
      // channelRef?.current?.send(type, payload);
    } catch (e) {
      throw new Error('useChannel - ERROR: ' + e);
    }
  };

  const unsubscribe = () => {
    setSubscribed(false);
    if (channelRef.current) {
      console.log(
        'useChannel - INFO: Unsubscribing from ' +
          channelRef.current.identifier,
      );
      actionCable.subscriptions.remove(channelRef.current);
      channelRef.current = null;
    }
  };

  return {subscribe, unsubscribe, send, connected};
};
