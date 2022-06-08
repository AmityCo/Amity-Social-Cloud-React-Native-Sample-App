import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
  subtitle: { flexDirection: 'row', width: '100%' },
  subtitleRow: { flexDirection: 'row', marginEnd: 10, justifyContent: 'center' },
  text: { marginBottom: 10 },
  footer: { justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row' },
  footerRight: { flexDirection: 'row', paddingEnd: 10 },
});

export const messageStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 8,
    marginRight: 0,
  },
  containerRight: {
    alignItems: 'flex-end',
  },
  avatar: {
    marginEnd: 10,
  },
  bubbleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  bubbleWrapper: {
    padding: 10,
    marginEnd: '45%',
    marginTop: 5,
    marginStart: '5%',
    // maxWidth: '50%',
    alignSelf: 'flex-end',
    borderRadius: 20,
  },
  bubbleWrapperRight: {
    marginEnd: '5%',
    marginStart: '45%',
  },
  leftArrow: {
    position: 'absolute',
    backgroundColor: '#dedede',
    width: 20,
    height: 25,
    top: 0,
    borderTopRightRadius: 25,
    left: -10,
  },

  leftArrowOverlap: {
    position: 'absolute',
    backgroundColor: '#eeeeee',
    width: 20,
    height: 35,
    top: -6,
    borderTopRightRadius: 18,
    left: -19,
  },

  rightArrow: {
    borderTopLeftRadius: 25,
    right: -10,
    left: 'auto',
    borderTopRightRadius: 0,
  },

  rightArrowOverlap: {
    borderTopLeftRadius: 18,
    right: -20,
    borderTopRightRadius: 0,
    left: 'auto',
  },
  headerView: {
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  standardFont: {
    fontSize: 15,
  },
  headerItem: {
    marginEnd: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  time: {
    textAlign: 'left',
    fontSize: 12,
  },
  slackImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
  slackMessageText: {
    marginLeft: 0,
    marginRight: 0,
  },
  timeContainerStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  timeTextStyle: {
    padding: 5,
    fontSize: 10,
    opacity: 0.7,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageHeaderRight: {
    flexDirection: 'row-reverse',
  },
});

export const messageImageStyles = StyleSheet.create({
  container: {},
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default styles;
