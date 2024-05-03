import { Flex, Button, Box } from '@chakra-ui/react';

function UserForm() {
  return (
    // Assuming this Flex is the overall form container
    <Flex
      direction="column"
      justify="center" // This vertically centers content
      p="4" // Padding around the form for aesthetics
      justifyContent="flex-end"
    >
      <Box flex="1" display="flex" flexDirection="column" mt="300px"  pb="8">
      <Button
          fontSize="24px"
          borderRadius="5px"
          bg="rgba(254, 216, 65, 0.8)"
          color="black"
          border="none"
          cursor="pointer"
          mb="10"
        >
          Settings
        </Button>
        <Button
          fontSize="24px"
          borderRadius="5px"
          bg="rgba(254, 216, 65, 0.8)"
          color="black"
          border="none"
          cursor="pointer"
        >
          Logout!
        </Button>
      </Box>
    </Flex>
  );
}

export default UserForm;
