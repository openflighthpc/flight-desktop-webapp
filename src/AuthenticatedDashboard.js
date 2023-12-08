import { Footer } from 'flight-webapp-components';
import Blurb from './Blurb';
import SessionsPage from "./SessionsPage";

function AuthenticatedDashboard() {
  return (
    <>
      <div
        className="centernav col-8"
      >
        <div className="narrow-container">
          <Blurb/>
        </div>
        <SessionsPage/>
      </div>
      <Footer/>
    </>
  );
}


export default AuthenticatedDashboard;
