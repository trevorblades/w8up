import React, {useState} from 'react';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/core';
import {generate} from 'generate-password';

export default function PasswordInput() {
  const [passwordShown, setPasswordShown] = useState(true);

  return (
    <FormControl>
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <Input
          required
          defaultValue={generate({
            length: 10,
            numbers: true
          })}
          name="password"
          type={passwordShown ? 'text' : 'password'}
        />
        <InputRightElement>
          <IconButton
            size="sm"
            variant="ghost"
            fontSize="lg"
            onClick={() =>
              setPasswordShown(prevPasswordShown => !prevPasswordShown)
            }
            icon={passwordShown ? <FaEyeSlash /> : <FaEye />}
          />
        </InputRightElement>
      </InputGroup>
      <FormHelperText>Copy this down somewhere</FormHelperText>
    </FormControl>
  );
}
