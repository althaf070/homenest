import { Button, Navbar, Avatar, Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import avatar from '../assets/avatar.png'
export function Nav() {
  const { user, logout } = useAuth();

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <h3>HomeNest</h3>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {user ? (
          <Dropdown
            label={<Avatar alt="Avatar" img={ avatar || user.photoURL} rounded />}
            arrowIcon={false}
            inline
            onError={(e) => {
              e.target.error = null
              e.target.src = avatar
            }}
          >
            <Dropdown.Header>
              <span className="block text-sm">{user?.displayName}</span>
              <span className="block truncate text-sm font-medium">
                {user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>My Propeties</Dropdown.Item>
            <Dropdown.Item>My Wishlist</Dropdown.Item>
            <Dropdown.Item>
              <Link to="/add-proprty">
              Add Property
              </Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Button color="failure" onClick={logout}>
                Logout
              </Button>
            </Dropdown.Item>
          </Dropdown>
        ) : (
        <Link to="/auth"><Button color="success">Login</Button></Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">Propeties</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Contact Us</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
