// theme.js or theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Modal: {
      baseStyle: {
        dialog: {
          bg: "rgba(254, 216, 65, 0.9)", // Set the desired background color
        },
      },
    },
  },
});

export default theme;
