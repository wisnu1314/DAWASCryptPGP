/* eslint-disable dot-notation */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  ToastAndroid,
  Switch,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  GoogleSignin,
  GoogleSigninButton,
  User,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
// const client_ID =
//   '225110788241-6nqfn98dfcgmfj88nmp0japeimn0qqcg.apps.googleusercontent.com';
const client_ID =
  '437098112626-egf6t7r8s3cnubilo3dib0firighrp5s.apps.googleusercontent.com';
const api_Key = 'AIzaSyB6CmbWMau8t77lAAK7X2VFI7DZSulyzoU';
const testmail = '';
function App(): JSX.Element {
  const [user, setUser] = React.useState<User>();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState('');
  const [messageDetailList, setMessageDetailList] = React.useState([]);
  const [encrypt, setEncrypt] = React.useState(false);
  const [signature, setSignature] = React.useState(false);
  const [mode, setMode] = React.useState(1); //1: kirim pesan, 2:inbox, 3:pesan terkirim
  const [to, setTo] = React.useState('');
  const [subjects, setSubjects] = React.useState('');
  const [rawEmail, setRawEmail] = React.useState('');

  const emailSentToast = () => {
    ToastAndroid.showWithGravity(
      'Email Sent!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };
  const encryptEmail = () => {}; //TO DO
  const signEmail = () => {}; //TO DO

  const getMessagePayload = React.useCallback(
    (messageID: string) => {
      fetch(
        `https://gmail.googleapis.com/gmail/v1/users/${user?.user.email}/messages/${messageID}`,
        {
          method: 'GET',
          headers: new Headers({Authorization: `Bearer ${accessToken}`}),
        },
      )
        .then(data => data.json())
        .then(jsondata => {
          // console.log(jsondata);
          return jsondata;
        });
    },
    [accessToken, user?.user.email],
  );
  const sendMessage = React.useCallback(
    (
      address: string | any,
      sender: string | any,
      subject: string | any,
      content: string,
      signed: boolean,
    ) => {
      let messageHeaders: any = {
        To: `${address}`,
        From: `${sender}`,
        Subject: `${subject}`,
      };
      let email = '';
      for (let header in messageHeaders) {
        email += header += ': ' + messageHeaders[header] + '\r\n';
      }
      email += '\r\n' + content;
      // if(signed === true){
      //   //kalau signed jalanin signEmail()
      // }
      try {
        fetch(
          `https://gmail.googleapis.com/upload/gmail/v1/users/${user?.user.email}/messages/send`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'message/rfc822',
              Authorization: `Bearer ${accessToken}`,
            },
            body: email,
          },
        )
          .then(response => response.json())
          .then(responsedata => {
            console.log('Send', responsedata);
          });
      } catch (error) {
        console.log('Send', error);
      }
    },
    [accessToken, user?.user.email],
  );
  React.useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://mail.google.com/'],
      webClientId: client_ID,
      offlineAccess: true,
    });
    const getMessageList = function () {
      fetch(
        `https://gmail.googleapis.com/gmail/v1/users/${user?.user.email}/messages?maxResults=10`,
        {
          method: 'GET',
          headers: new Headers({Authorization: `Bearer ${accessToken}`}),
        },
      )
        .then(data => data.json())
        .then(jsondata => {
          // console.log(jsondata);
          setMessageDetailList(jsondata.messages);
        });
    };
    if (loggedIn) {
      getMessageList();
    }
  }, [accessToken, getMessagePayload, loggedIn, messageDetailList, user]);
  const messageIDList = React.useMemo(() => {
    var idList: any[] = [];
    if (loggedIn && messageDetailList) {
      messageDetailList.forEach((key, value) => {
        idList.push(key['id']);
      });
    }
    return idList;
  }, [messageDetailList, loggedIn]);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setLoggedIn(true);
      setUser(userInfo);
      const tokens = await GoogleSignin.getTokens();
      console.log(tokens);
      const credential = auth.GoogleAuthProvider.credential(
        tokens.idToken,
        tokens.accessToken,
      );
      setAccessToken(tokens.accessToken);
      await auth().signInWithCredential(credential);
    } catch (error) {
      console.log(error);
    }
  };
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(undefined); // Remember to remove the user from your app's state as well
      setLoggedIn(false);
      setMessageDetailList([]);
      setAccessToken('');
      setEncrypt(false);
      setSignature(false);
      setMode(1);
      setRawEmail('');
      setSubjects('');
      setTo('');
    } catch (error) {
      console.error(error);
    }
  };
  // if (loggedIn && messageDetailList) {
  //   console.log('messages', messageIDList, getMessagePayload(messageIDList[5]));
  // }
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Text style={styles.sectionTitle}>DAWASCrypt</Text>
          {user === undefined && (
            <View
              style={[
                styles.container,
                {
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  margin: 5,
                },
              ]}>
              <Button
                title="Sign In"
                disabled={user !== undefined}
                onPress={signIn}
              />
              <Text>Sign In to Use The App</Text>
            </View>
          )}
          {user !== undefined && (
            <View
              style={[
                styles.container,
                {
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  margin: 5,
                },
              ]}>
              <Button title="Sign Out" onPress={signOut} />
              <Text>{`Welcome ${user.user?.name} !`}</Text>
            </View>
          )}
        </View>
        {loggedIn && (
          <View style={styles.modeContainer}>
            <View style={styles.switchContainer}>
              <Button
                title="Compose"
                onPress={() => {
                  setMode(1);
                }}
                disabled={mode === 1}
              />
              <Button
                title="Inbox"
                onPress={() => {
                  setMode(2);
                }}
                disabled={mode === 2}
              />
              <Button
                title="Email Sent"
                onPress={() => {
                  setMode(3);
                }}
                disabled={mode === 3}
              />
            </View>
          </View>
        )}
        {/* compose */}
        {loggedIn && mode === 1 && (
          <View>
            <View style={styles.switchContainer}>
              <View>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  value={encrypt}
                  onChange={() => {
                    console.log('Encrypt? ', !encrypt);
                    setEncrypt(!encrypt);
                  }}
                />
                <Text>Encrypt</Text>
              </View>
              <View>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  value={signature}
                  onChange={() => {
                    console.log('Digital Sign? ', !signature);
                    setSignature(!signature);
                  }}
                />
                <Text>Digital Sign</Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.contentInput}
                onChangeText={setTo}
                value={to}
                placeholder="To"
                textAlignVertical="center"
                multiline={true}
                textBreakStrategy="highQuality"
                textContentType="emailAddress"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.contentInput}
                onChangeText={setSubjects}
                value={subjects}
                placeholder="Subject"
                textAlignVertical="center"
                multiline={true}
                textBreakStrategy="highQuality"
              />
            </View>
            <View style={styles.emailInputContainer}>
              <TextInput
                style={styles.emailContentInput}
                onChangeText={setRawEmail}
                value={rawEmail}
                placeholder="Insert Messages"
                numberOfLines={4}
                textAlignVertical="top"
                multiline={true}
                textBreakStrategy="highQuality"
              />
            </View>
            <View style={styles.container}>
              <Button
                title="Send Email"
                onPress={() => {
                  const email = user?.user.email;
                  if (to !== '' && rawEmail !== '') {
                    sendMessage(to, email, subjects, rawEmail, signature);
                    emailSentToast();
                    setRawEmail('');
                    setSubjects('');
                    setTo('');
                  } else if (rawEmail === '' && to === '') {
                    ToastAndroid.showWithGravity(
                      'Invalid Messages and Email Address',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                  } else if (to === '') {
                    ToastAndroid.showWithGravity(
                      'Invalid Email Address',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                  } else if (rawEmail === '') {
                    ToastAndroid.showWithGravity(
                      'Insert Your Messages',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                  }
                }}
              />
            </View>
          </View>
        )}
        {/* inbox */}
        {/* email sent */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    margin: 12,
  },
  emailInputContainer: {
    flex: 1,
    height: '100%',
    margin: 12,
  },
  emailContentInput: {
    height: '100%',
    marginHorizontal: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputContainer: {
    flex: 1,
    height: '100%',
    marginHorizontal: 12,
  },
  contentInput: {
    height: '60%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  switchContainer: {
    flex: 1,
    height: '100%',
    marginHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modeContainer: {
    flex: 1,
    margin: 15,
  },
});

export default App;
