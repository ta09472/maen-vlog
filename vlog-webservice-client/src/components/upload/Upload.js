import React, { useState } from "react";
import ButtonWrapper from "../styled/uploadStyled/ButtonWrapper";
import UploadButtonStyled from "../styled/uploadStyled/UploadButtonStyled";
import UploadWrapper from "../styled/uploadStyled/UploadWrapper";
import InputWrapper from "../styled/uploadStyled/InputWrapper";
import DescriptionInput from "../styled/uploadStyled/DescriptionInput";
import CaptionInput from "../styled/uploadStyled/CaptionInput";
import PostForm from "../upload/PostForm";
import UploaderStyled from "../styled/uploadStyled/UploaderStyled";
import PostFormStyled from "../styled/uploadStyled/PostFormStyled";
import FormStyled from "../styled/uploadStyled/FormStyled";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdPresentToAll } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "universal-cookie";
import { useSelector } from "react-redux";

toast.configure();

const UploadTest = () => {
  const cookies = new Cookies();
  /* tag 분리 하는 로직 */
  const [tagList, setTagList] = useState([]);
  const [isValid, setIsVaild] = useState("black");
  const [tag, setTag] = useState("");
  const navigate = useNavigate();
  const userData = cookies.get("user");

  const handleChange = (e) => {
    if (e.keyCode == 32) {
      setTag("");
    }
    setTag(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.keyCode == 32) {
      setTagList([...tagList, tag]);
    }
  };

  const [inputs, setInputs] = useState({
    userId: "",
    tags: "",
    description: "",
    video: "",
  });

  const onChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file !== null) {
      setIsVaild("#4cd137");
    }
    const video = file;

    setInputs({
      ...inputs,
      [e.target.name]: video,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", inputs.video);
    formData.append("userId", userData.userId);
    formData.append("tags", inputs.tags);
    formData.append("description", inputs.description);

    await axios
      .post("http://localhost:8080/api/v1/posts/", formData, {
        headers: {
          encType: "multipart/form-data",
        },
      })
      .then((res) => {
        //handle success
        navigate("/");
        toast.success("업로드 되었습니다. :)", {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((err) => {
        //handle error
        toast.error("업로드에 실패하였습니다. :(", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/");
      });
  };

  return (
    <>
      <UploadWrapper>
        <form onSubmit={handleSubmit}>
          <FormStyled>
            <PostFormStyled>
              <h3>Upload Your Days</h3>
              <UploaderStyled>
                <label htmlFor="inputFile">
                  <MdPresentToAll
                    size="50px"
                    color={isValid}
                    cursor="pointer"
                  />
                </label>
                <input
                  id="inputFile"
                  type="file"
                  name="video"
                  accept=".mp4"
                  onChange={handleFileChange}
                />
              </UploaderStyled>
            </PostFormStyled>
            <InputWrapper>
              <CaptionInput
                type="text"
                name="tags"
                placeholder="Input Tags"
                value={inputs.tags}
                onChange={onChange}
                onKeyDown={handleKeyDown}
              />
              <DescriptionInput
                type="text"
                name="description"
                placeholder="Description"
                value={inputs.description}
                onChange={onChange}
              />

              <ButtonWrapper>
                <UploadButtonStyled>upload</UploadButtonStyled>
              </ButtonWrapper>
            </InputWrapper>
          </FormStyled>
        </form>
      </UploadWrapper>
    </>
  );
};

export default UploadTest;
