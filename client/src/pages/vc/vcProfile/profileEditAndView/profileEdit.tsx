import { Button, Col, Row } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { VCData } from "../profileSection/profileSection";
import { useEffect, useState } from "react";
import { isOnlyAlphabets, isOnlyNumbers } from "../../../../utils/validation";
import axiosMultipartInstance from "../../../../apis/axiosMultipartInstance";
import axios from "axios";
import { RootState } from "../../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { updateUserData } from "../../../../redux/reducers/userSlilce";
import { useNavigate } from "react-router-dom";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
interface ProfileViewProps {
  vcData: VCData | null;
  profilePicture: string;
  handleCancelEditProfile: () => void;
}

export interface NewVCData {
  name?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string | File | null;
}

export const ProfileEdit: React.FC<ProfileViewProps> = ({
  vcData,
  profilePicture,
  handleCancelEditProfile,
}) => {
  const [newVCData, setNewVCData] = useState<NewVCData>({
    name: "",
    phoneNumber: "",
    address: "",
    profilePicture: profilePicture ? profilePicture : null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [vcId, setVcId] = useState<string | null>("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { isAuthenticated, userType, userId } = useSelector(
    (state: RootState) => state.user
  );  

  useEffect(() => {
    if (!isAuthenticated) {
      alert("Please login again.");
      navigate("/vc/login");
      return;
    }
    if (userType === "vaccineCenter") {
      setVcId(userId);
    }
  }, []);

  useEffect(() => {
    if (vcData) {
      setNewVCData({
        address: vcData.address,
        name: vcData.name,
        phoneNumber: String(vcData.phoneNumber),
        profilePicture: null,
      });
    }
  }, []);

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (!isOnlyAlphabets(value)) {
        return;
      }
    }
    if (name === "phoneNumber" && value.length !== 0) {
      if (!isOnlyNumbers(value)) {
        return;
      }
    }

    setNewVCData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePictureUpload = (e: any) => {
    const pic = e.target.files[0];
    setNewVCData((prevData) => ({
      ...prevData,
      profilePicture: pic,
    }));
  };

  const saveNewChanges = (e: any) => {
    e.preventDefault();
    const { name, address, phoneNumber, profilePicture } = newVCData;
    if (!name || !address || !phoneNumber) {
      alert("Fields can't be empty");
      return;
    }
    if (phoneNumber.length !== 10) {
      alert("Invalid phone number");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phoneNumber", phoneNumber);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    if (vcId) {
      sendDataToServer(formData);
    } else {
      alert("Something went wrong. Please login again.");
    }
  };

  const sendDataToServer = async (formData: any) => {
    try {
      setIsLoading(true);
      const res = await axiosMultipartInstance.patch(
        `/updateVCById/${userId}`,
        formData
      );
      if (res.status === 200) {
        const data = res.data?.data;
        console.log(" data, d", data);
        dispatch(updateUserData(data));
        handleCancelEditProfile();
        alert("Profile updated successfully");
      } else {
        throw new Error(`Unexpected error occurred, status: ${res.status}`);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400 || status === 500) {
          const errorMsg =
            error.response?.data?.message ||
            "Some error occurred. Please try again later.";
          setError(errorMsg);
        } else {
          setError("Please check your network.");
        }
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setTimeout(() => {
        console.log("load", isLoading);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div>
      <div className="profile-header">
        <img src={profilePicture} alt="Profile" className="profile-image" />
        <div>
          <h3>{vcData?.name ? capitalizeFirstLetter(vcData.name) : ""}</h3>

          <p>{vcData?.address}</p>
        </div>
      </div>
      <Form onSubmit={saveNewChanges}>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={newVCData?.name}
                onChange={handleChanges}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label className="fw-bold">Phone Number</Form.Label>

              <Form.Control
                type="text"
                placeholder="New Phone Number"
                name="phoneNumber"
                value={newVCData?.phoneNumber}
                onChange={handleChanges}
                maxLength={10}
                minLength={10}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formLocation">
              <Form.Label className="fw-bold">Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="New address"
                name="address"
                value={newVCData?.address}
                onChange={handleChanges}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formPostalCode">
              <Form.Group className="position-relative mt-3">
                <Form.Label>Upload new photo </Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                />
              </Form.Group>
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex w-75  justify-content-between ">
          <Button variant="success" type="submit" className="save-button">
            Save Changes
          </Button>
          <Button
            variant="danger"
            className="save-button"
            onClick={handleCancelEditProfile}
          >
            Cancel
          </Button>
        </div>
      </Form>

      <h3>{error}</h3>
    </div>
  );
};
