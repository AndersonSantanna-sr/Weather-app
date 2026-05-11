import Reactotron from 'reactotron-react-native';
import { QueryClientManager, reactotronReactQuery } from 'reactotron-react-query';
import { Platform } from 'react-native';
import { queryClient } from '../query/queryClient';

const queryClientManager = new QueryClientManager({
  queryClient,
});

// Android emulator routes host traffic through 10.0.2.2; iOS simulator uses localhost
const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

Reactotron.configure({
  host,
  onDisconnect: () => {
    queryClientManager.unsubscribe();
  },
})
  .use(reactotronReactQuery(queryClientManager))
  .useReactNative()
  .connect();
