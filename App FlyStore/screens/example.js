import React, {useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  Slider,
  HStack,
  Badge,
  VStack,
  Button,
} from 'native-base';
export default function Example() {
  return (
    <NativeBaseProvider>
      <Box alignItems="flex-end" width={'55%'}>
        <VStack>
          <Badge // bg="red.400"
            colorScheme="danger"
            rounded="full"
            mb={-4}
            mr={-4}
            zIndex={1}
            variant="solid"
            alignSelf="flex-end"
            _text={{
              fontSize: 12,
            }}>
            2
          </Badge>
          <Button
            mx={{
              base: 'auto',
              md: 0,
            }}
            p="2"
            bg="cyan.500"
            _text={{
              fontSize: 14,
            }}>
            Notifications
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}
