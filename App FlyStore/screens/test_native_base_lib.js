import React, {useState} from 'react';
import {View, Text, StatusBar, Pressable} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NativeBaseProvider, Box, Slider, Stack, Input, Icon} from 'native-base';
export default function App() {
  const [show, setShow] = React.useState(false);
  const [user_login, set_user_login] = useState({
    username: '',
    password: '',
  });
  const [username, set_username] = useState('');
  const [password, set_password] = useState('');
  const [a, set_a] = useState('10');
  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
      <View style={{marginTop: 20}}>
        <Stack space={4} w="100%" alignItems="center">
          <Input
            value={user_login.username}
            onChangeText={text => {
              set_user_login({...user_login, username: text});
              console.log({...user_login, username: text});
            }}
            size="md"
            w={{
              base: '90%',
              md: '25%',
            }}
            InputRightElement={
              <Icon
                as={<MaterialIcons name="person" />}
                size={5}
                mr="3"
                color="muted.400"
              />
            }
            placeholder="Username"
          />
          <Input
            value={user_login.password}
            onChangeText={text => {
              set_user_login({...user_login, password: text});
              console.log({...user_login, password: text});
            }}
            w={{
              base: '90%',
              md: '25%',
            }}
            type={show ? 'text' : 'password'}
            InputRightElement={
              <Pressable onPress={() => setShow(!show)}>
                <Icon
                  as={
                    <MaterialIcons
                      name={show ? 'visibility' : 'visibility-off'}
                    />
                  }
                  size={5}
                  mr="3"
                  color="muted.400"
                />
              </Pressable>
            }
            placeholder="Password"
          />
        </Stack>
      </View>
      <Text style={{marginTop: 0}}>XIn chào</Text>
      <Stack space={4} w="100%" maxW="300px" mx="auto">
        <Input
          size="xs"
          placeholder="xs Input"
          value={a}
          style={{color: 'blue', textAlign: 'right'}}
          onChangeText={text => {
            console.log(text);
            set_a(text);
          }}
        />
        <Input size="sm" placeholder="sm Input" />
        <Input size="md" placeholder="md Input" />
        <Input size="lg" placeholder="lg Input" />
        <Input size="xl" placeholder="xl Input" />
        <Input size="2xl" placeholder="2xl Input" />
      </Stack>
    </NativeBaseProvider>
  );
}
