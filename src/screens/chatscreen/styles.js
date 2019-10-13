import { StyleSheet } from 'react-native';
import AppStyles from '../../themes/AppStyles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  chats: {
    padding: 10,
    flex: 1,
  },
  itemContent: {
    padding: 10,
    backgroundColor: AppStyles.colorSet.hairlineColor,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    maxWidth: '70%',
  },
  sendItemContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginBottom: 10,
  },
  userIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  sendItemContent: {
    marginRight: 10,
    backgroundColor: AppStyles.colorSet.mainThemeForegroundColor,
  },
  receiveItemContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginBottom: 10,
  },
  receiveItemContent: {
    marginLeft: 10,
  },
  sendPhotoMessage: {
    width: 200,
    height: 150,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  receivePhotoMessage: {
    width: 200,
    height: 150,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  linkTextMessage: {
    fontSize: 16,
    color: AppStyles.colorSet.greenBlue,
  },
  sendTextMessage: {
    fontSize: 16,
    color: AppStyles.colorSet.mainThemeBackgroundColor,
  },
  receiveTextMessage: {
    color: AppStyles.colorSet.mainTextColor,
    fontSize: 16,
  },
  inputBar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: AppStyles.colorSet.hairlineColor,
    flexDirection: 'row',
    marginBottom: 10,
  },
  icon: {
    tintColor: AppStyles.colorSet.mainThemeForegroundColor,
    width: 25,
    height: 25,
  },
  input: {
    margin: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    backgroundColor: AppStyles.colorSet.grayBgColor,
    fontSize: 16,
    borderRadius: 20,
  },
});

export default styles;
