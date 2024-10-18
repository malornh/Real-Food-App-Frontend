import { useState, useEffect } from 'react';
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

function ResetPasswordModal() {
  const [newPassword, setNewPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [message, setMessage] = useState(''); 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { resetToken, setResetToken } = useContextProvider();

  useEffect(() => {
    if (resetToken !== null) {
      onOpen();
    }
  }, [resetToken, onOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!resetToken) {
      setMessage("Invalid or missing token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resetToken', resetToken);
      formData.append('newPassword', newPassword);

      const response = await axios.post('https://localhost:7218/api/Users/resetPassword', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(response.data.message);
      closeModal(); 
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to reset password.");
    }
  };

  const closeModal = () => {
    onClose(); 
    setResetToken(null); 
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState({}, document.title, url.toString());
  };

  return (
    <ChakraProvider theme={theme}>
      <Modal isCentered isOpen={isOpen} onClose={closeModal} size="xl">
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent maxW="68vw" maxH="95%" padding={5}>
          <ModalBody style={{ overflowY: "auto" }} mt={-2}>
            <Flex justify="space-between" align="center" mb={4}>
              <h2 style={{ fontSize: "1.5rem" }}>Reset Password</h2>
              <IconButton
                aria-label="Close modal"
                icon={<CloseButton />}
                onClick={closeModal} 
                variant="ghost"
              />
            </Flex>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
              <Box mb={4}>
                <label>New Password:</label>
                <Input
                  type="password"
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required
                />
              </Box>
              <Box mb={4}>
                <label>Confirm Password:</label>
                <Input
                  type="password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Box>
              <Flex justify="flex-end">
                <Button colorScheme="blue" type="submit">Reset Password</Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default ResetPasswordModal;
