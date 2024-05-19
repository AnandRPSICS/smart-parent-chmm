import { Container, Form } from "react-bootstrap";
import { useState } from "react";
import { ParentSignupForm } from "./parentSignupForm";
import { CommonFooter } from "../../../components/common/footer/footer";
import "./parentSignup.css";
import { ParentNavbar } from "../../../components/parent/parentNavbar/parentNavbar";
import { useNavigate } from "react-router-dom";
export const ParentSignupPage = () => {
  const navigate = useNavigate();
  const navigateParentLogin = () => {
    navigate("/parent/login");
  };
  return (
    <>
      <ParentNavbar />
      <div className="mt-5" id="user-signup-page">
        <Container className="user-signup-container">
          <div className="user-signup-form">
            <div className="user-signup-form-heading">
              {" "}
              <h6>Register as Parent</h6>{" "}
            </div>

            <div className="user-signup-input-container">
              <div className="users-signup-form-components">
                <ParentSignupForm />
              </div>
            </div>
          </div>
          <p>
            Already have an account?{" "}
            <span
              className="font-weight-bold text-primary"
              onClick={navigateParentLogin}
              style={{ cursor: "pointer" }}
            >
              {" "}
              Sign In{" "}
            </span>
          </p>
        </Container>

        <div className="mt-5">
          <CommonFooter />
        </div>
      </div>
    </>
  );
};
