// import React, { useState } from 'react';
// import { View, Button, TextInput } from 'react-native';
// import TwilioSMS from ' ';

// const Test = () => {
//     const [phoneNumber, setPhoneNumber] = useState('');

//     const sendSMS = async () => {
//         const accountSid = 'AC9271f02b85eafc5cc9b6116dffe097bf';
//         const authToken = 'dd60b58f9248f68694ada7b94c473b74';
//         const twilioPhoneNumber = '+13613094189';
//         const message = 'Xác nhận đăng ký';

//         try {
//             await TwilioSMS.initWithToken(accountSid, authToken);

//             await TwilioSMS.sendMessage({
//                 body: message,
//                 to: phoneNumber,
//                 from: twilioPhoneNumber,
//             });

//             console.log('SMS sent successfully!');
//         } catch (error) {
//             console.log('Error sending SMS:', error);
//         }
//     };

//     return (
//         <View>
//             <TextInput
//                 placeholder="Nhập số điện thoại"
//                 value={phoneNumber}
//                 onChangeText={setPhoneNumber}
//             />
//             <Button title="Gửi tin nhắn" onPress={sendSMS} />
//         </View>
//     );
// };

// export default Test;
import React, {useState} from 'react';
import {View, Button, TextInput} from 'react-native';
import SendSMS from 'react-native-sms';

const Test = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const sendSMS = () => {
    const message = 'Xác nhận đăng ký';

    SendSMS.send(
      {
        body: 'The default body of the SMS!',
        recipients: ['0356337493', '0356337494'],
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true,
      },
      (completed, cancelled, error) => {
        console.log(
          'SMS Callback: completed: ' +
            completed +
            ' cancelled: ' +
            cancelled +
            'error: ' +
            error,
        );
      },
    );
  };

  return (
    <View>
      <TextInput
        style={{color: 'black'}}
        placeholder="Nhập số điện thoại"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Button title="Gửi tin nhắn" onPress={sendSMS} />
    </View>
  );
};

export default Test;
