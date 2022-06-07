import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RenderBG } from "./components/RenderBG";
import { SignInForm } from "./components/SignInForm";
import { SignUpForm } from "./components/SignUpForm";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { RenderNav } from "./components/RenderNav";
import { Dashboard } from "./pages/Dashboard";
import { UploadDocs } from "./pages/UploadDocs";
import { ViewRecords } from "./pages/ViewRecords";
import { StudentRecord } from "./pages/StudentRecord";
import { EditHistory } from "./pages/EditHistory";
import { Manual } from "./pages/Manual";
import { EditProfile } from "./pages/EditProfile";
import { CreateStudent } from "./pages/CreateStudent";
import { UserManagement } from "./pages/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<RenderBG />}>
            <Route index element={<SignInForm />}></Route>
            <Route exact path="/sign-up" element={<SignUpForm />}></Route>
            <Route
              exact
              path="/forgot-password"
              element={<ForgotPasswordForm />}
            ></Route>
          </Route>

          <Route element={<RenderNav />}>
            <Route exact path="/dashboard" element={<Dashboard />}></Route>
          </Route>

          <Route element={<RenderNav />}>
            <Route exact path="/upload-docs" element={<UploadDocs />}></Route>
            <Route exact path="/view-records" element={<ViewRecords />}></Route>
            <Route exact path="/edit-history" element={<EditHistory />}></Route>
            <Route
              exact
              path="/student-record"
              element={<StudentRecord />}
            ></Route>
            <Route exact path="/manual" element={<Manual />}></Route>
            <Route exact path="/edit-profile" element={<EditProfile />}></Route>
            <Route
              exact
              path="/create-student"
              element={<CreateStudent />}
            ></Route>
            <Route path="/user-management" element={<UserManagement />}></Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
