import { useState } from 'react';
import axios from 'axios';
import {
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Flex,
  Box,
  Button,
  Input,
  useDisclosure,
  theme,
  IconButton,
  CloseButton
} from "@chakra-ui/react";
import { useContextProvider } from '../../ContextProvider';

function ForgotPasswordModal() {
  const [email, setEmail] = useState(''); // To capture the email input
  const [message, setMessage] = useState(''); // To display success/failure messages
  const { isForgotPasswordOpen, setIsForgotPasswordOpen } = useContextProvider();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      setMessage("Email is required.");
      return;
    }

    try {
        const response = await axios.post('https://localhost:7218/api/Users/ForgotPassword', email, {
            headers: {
              'Content-Type': 'application/json', 
            },
          });

      setMessage(response.data.message);
      setIsForgotPasswordOpen(false);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to send password reset link.");
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Modal isCentered isOpen={isForgotPasswordOpen} onClose={()=>setIsForgotPasswordOpen(false)} size="xl">
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent maxW="68vw" maxH="95%" padding={5}>
          <ModalBody style={{ overflowY: "auto" }} mt={-2}>
            <Flex justify="space-between" align="center" mb={4}>
              <h2 style={{ fontSize: "1.5rem" }}>Forgot Password</h2>
              <IconButton
                aria-label="Close modal"
                icon={<CloseButton />}
                onClick={()=>setIsForgotPasswordOpen(false)}
                variant="ghost"
              />
            </Flex>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
              <Box mb={4}>
                <label>Email:</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </Box>
              <Flex justify="flex-end">
                <Button colorScheme="blue" type="submit">Send Reset Link</Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default ForgotPasswordModal;