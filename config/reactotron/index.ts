import Reactotron from 'reactotron-react-native';
import { QueryClientManager, reactotronReactQuery } from 'reactotron-react-query';
import { queryClient } from '../query/queryClient';

const queryClientManager = new QueryClientManager({
  queryClient,
});

Reactotron.configure({
  host: '10.0.2.2',
  onDisconnect: () => {
    queryClientManager.unsubscribe();
  },
})
  .use(reactotronReactQuery(queryClientManager))
  .useReactNative()
  .connect();
