

import { Link } from "react-router-dom";

export default function Demo() {
  return (
 
    <div>
      <h1>Welcome to My App</h1>
      <nav>
        <ul>
          <li>
            <Link to="/login">Sign In</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
