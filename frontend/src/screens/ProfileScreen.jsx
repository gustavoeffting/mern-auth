import { useState, useEffect } from "react";
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useUpdateMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const ProfileScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth)

  const [update, { isLoading }] = useUpdateMutation()

  useEffect(() => {
    setName(userInfo.name)
    setEmail(userInfo.email)
  }, [userInfo.setName, userInfo.setEmail])

  const submitHandler = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords not matching!')
      return
    }

    try {
      const res = await update({
        _id: userInfo._id,
        name,
        email,
        password
      }).unwrap()

      dispatch(setCredentials({ ...res }))
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <FormContainer>
      <h1>Update Profile</h1>

      <Form.Group className="my-2" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" disabled={isLoading} variant="primary" className="mt-3">
          {isLoading ? 'Loading...' : 'Update'}
        </Button>

      </Form>
    </FormContainer>
  )
}

export default ProfileScreen