import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    // marginTop: 8,
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 1,
  },
  description: {
    fontSize: 12,
    color: 'white',
  },
});
