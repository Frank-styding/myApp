import { Box, Button, Text } from "@gluestack-ui/themed";

export default function HomeScreen() {
  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="center"
      bg="$backgroundLight100"
    >
      <Text fontSize="$xl" fontWeight="$bold">
        🚀 Hola Gluestack
      </Text>
      <Button mt="$4">
        <Text color="$textLight50">Click Me</Text>
      </Button>
    </Box>
  );
}
