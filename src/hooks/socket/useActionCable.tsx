import React, {useEffect, useMemo} from 'react';
import {ActionCable, Cable} from '@kesha-antonov/react-native-action-cable';

interface UseActionCableReturn {
  actionCable: Cable;
}

export const useActionCable = (
  url: string,
  token: string,
): UseActionCableReturn => {
  const actionCable = useMemo(
    () => ActionCable.createConsumer(`${url}token=${token}`),
    [url, token],
  );

  useEffect(() => {
    // ActionCable.startDebugging();
    console.log('Action Cable Connected');

    return () => {
      console.log('Action Cable Disconnected');
      actionCable.disconnect();
    };
  }, [actionCable]);

  return {actionCable};
};
