import React, { Fragment, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userImage, setUserImage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showImageLoader, setShowImageLoader] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // ? ON CHANGE IMAGE CLICK HANDLER
  const postDetails = (pics) => {
    setShowImageLoader(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-application");
      data.append("cloud_name", "dbdbzoycn");
      fetch("https://api.cloudinary.com/v1_1/dbdbzoycn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUserImage(data.url.toString());
          setShowImageLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setShowImageLoader(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setShowImageLoader(false);
      return;
    }
  };

  // ? SUBMIT BUTTON HANDLER
  const submitHandler = async () => {
    setShowImageLoader(true);
    if (!userName || !userEmail || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Felids",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setShowImageLoader(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          userName,
          userEmail,
          password,
          userImage,
        },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setShowImageLoader(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setShowImageLoader(false);
    }
  };

  //? JSX START
  return (
    <Fragment>
      <VStack spacing="5px">
        {/* //? USER NAME */}
        <FormControl id="firstName" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Name"
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormControl>
        {/* //? USER EMAIL ADDRESS */}
        <FormControl id="emailAddress" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter Email Address"
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </FormControl>
        {/* //? USER PASSWORD */}
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        {/* //? CONFIRM PASSWORD */}
        <FormControl id="confirmPassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        {/* //? UPLOAD IMAGE*/}
        <FormControl id="userImage">
          <FormLabel>Upload Image</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>
        {/* //? SIGNUP BUTTON */}
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={showImageLoader}
        >
          Sign Up
        </Button>
      </VStack>
    </Fragment>
  );
};

export default Signup;
