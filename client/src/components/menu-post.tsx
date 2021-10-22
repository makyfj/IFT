import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Center,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface Props {
  id: number;
}

const MenuPost = ({ id }: Props) => {
  return (
    <Center p={2}>
      <Menu>
        <MenuButton
          as={Button}
          size="sm"
          variant="secondary"
          rightIcon={<ChevronDownIcon />}
        >
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem>
            <Link href={`posts/post/${id}`}>Edit Post</Link>
          </MenuItem>
        </MenuList>
      </Menu>
    </Center>
  );
};

export default MenuPost;