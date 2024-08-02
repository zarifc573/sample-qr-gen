import { Link } from "react-router-dom";



export default function Verification() {
    return (
    
      <div>
       <h1>Please verify your email then login!!!</h1>
       <Link href='/sign-in'>Go Back to sign in page</Link>
      </div>
    );
  }
  