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
    [url, token], // Include dependencies
  );

  useEffect(() => {
    // ActionCable.startDebugging();
    return () => {
      console.log('Disconnect Action Cable');
      actionCable.disconnect();
    };
  }, [actionCable]); // Include actionCable in dependencies

  return {actionCable};
};
