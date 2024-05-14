import { Button } from "react-bootstrap";
import { useState } from "react";
import "./parentLogin.css";
import Form from "react-bootstrap/Form";
export const ParentLogin = () => {
  const [validated, setValidated] = useState(false);

  return (
    <Form noValidate validated={validated}>
      <Form.Group>
        <Form.Control
          className="user-login-input"
          type="email"
          placeholder="Email"
          required
          name="email"
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid email.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group style={{ position: "relative" }}>
        <div
          style={{
            display: "inline-block",
            cursor: "pointer",
            position: "absolute",
            top: "7px",
            right: "75px",
          }}
        ></div>
        <Form.Control
          required
          className="user-login-input password-input-eye-btn-hide"
          type="text"
          minLength={8}
          placeholder="Password"
          name="password"
        />
        <Form.Control.Feedback type="invalid">
          Please Enter atleast 8 characters.
        </Form.Control.Feedback>
      </Form.Group>
      <div className="user-login-btn-container-2">
        <p>
          Don’t have an account?{" "}
          <span className="user-forgot-password"> Sign Up </span>
        </p>
        <br />

        <Button className="user-login-btn" type="submit">
          Login
        </Button>
      </div>
    </Form>
  );
};
