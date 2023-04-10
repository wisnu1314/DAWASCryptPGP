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
  Linking,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  GoogleSignin,
  GoogleSigninButton,
  User,
} from '@react-native-google-signin/google-signin';
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setCurrAcount(undefined); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };
  const [currAccount, setCurrAcount] = React.useState<User>();
  console.log('user', currAccount, currAccount?.user.id);
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
          {/* <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks /> */}
          {currAccount === undefined && (
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
                disabled={currAccount !== undefined}
                onPress={() => {
                  GoogleSignin.configure();
                  GoogleSignin.hasPlayServices()
                    .then(hasPlayService => {
                      if (hasPlayService) {
                        GoogleSignin.signIn()
                          .then(userInfo => {
                            console.log(JSON.stringify(userInfo));
                            setCurrAcount(userInfo);
                          })
                          .catch(e => {
                            console.log('ERROR IS: ' + JSON.stringify(e));
                          });
                      }
                    })
                    .catch(e => {
                      console.log('ERROR IS: ' + JSON.stringify(e));
                    });
                }}
              />
              <Text>Sign In to Use The App</Text>
            </View>
          )}
          {currAccount !== undefined && (
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
              <Text>{`Welcome ${currAccount.user?.name} !`}</Text>
            </View>
          )}
        </View>
        <View style={styles.container}>
          <Button
            title="Send Email"
            // onPress={() => {}}
          />
        </View>
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
  },
});

export default App;
