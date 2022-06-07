import styles from "./Manual.module.css";
import video from "../../assets/images/sample-video.mp4";
import nav5 from "../../assets/images/Navigation5.png";
import nav6 from "../../assets/images/Navigation6.png";
import nav7 from "../../assets/images/Navigation7.png";
import nav8 from "../../assets/images/Navigation8.png";
import nav9 from "../../assets/images/Navigation9.png";
import nav10 from "../../assets/images/Navigation10.png";
import docs1 from "../../assets/images/Upload_Documents1.png";
import docs2 from "../../assets/images/Upload_Documents2.png";
import docs3 from "../../assets/images/Upload_Documents3.png";
import docs4 from "../../assets/images/Upload_Documents4.png";
import docs5 from "../../assets/images/Upload_Documents5.png";
import docs6 from "../../assets/images/Upload_Documents6.png";
import docs7 from "../../assets/images/Upload_Documents7.png";
import docs8 from "../../assets/images/Upload_Documents8.png";
import docs9 from "../../assets/images/Upload_Documents9.png";
import docs10 from "../../assets/images/Upload_Documents10.png";
import view1 from "../../assets/images/View1.png";
import view2 from "../../assets/images/View2.png";
import view3 from "../../assets/images/View3.png";
import view4 from "../../assets/images/View4.png";
import view5 from "../../assets/images/View5.png";
import view6 from "../../assets/images/View6.png";
import view7 from "../../assets/images/View7.png";
import view8 from "../../assets/images/View8.png";
import view9 from "../../assets/images/View9.png";
import view10 from "../../assets/images/View10.png";
import view11 from "../../assets/images/View11.png";
import view12 from "../../assets/images/View12.png";
import view13 from "../../assets/images/View13.png";
import create1 from "../../assets/images/Create1.png";
import create2 from "../../assets/images/Create2.png";
import create3 from "../../assets/images/Create3.png";
import create4 from "../../assets/images/Create4.png";
import create5 from "../../assets/images/Create5.png";
import create6 from "../../assets/images/Create6.png";
import create7 from "../../assets/images/Create7.png";
import create8 from "../../assets/images/Create8.png";
import create9 from "../../assets/images/Create9.png";
import create10 from "../../assets/images/Create10.png";
import create11 from "../../assets/images/Create11.png";
import create12 from "../../assets/images/Create12.png";
import { useState, useRef, useEffect } from "react";

export const Manual = () => {
  const [currentScroll, setCurrentScroll] = useState(0);
  const [activeNavLink, setActiveNavLink] = useState(false);
  const [activeUploadLink, setActiveUploadLink] = useState(false);
  const [activeCreateLink, setActiveCreateLink] = useState(false);
  const [activeViewLink, setActiveViewLink] = useState(false);
  const [activeAboutLink, setActiveAboutLink] = useState(false);

  const navRef = useRef();
  const uploadRef = useRef();
  const createRef = useRef();
  const viewRef = useRef();
  const aboutRef = useRef();
  const [navY, setNavY] = useState();
  const [uploadY, setUploadY] = useState();
  const [createY, setCreateY] = useState();
  const [viewY, setViewY] = useState();
  const [aboutY, setAboutY] = useState();

  useEffect(() => {
    getNavPosition();
  });

  useEffect(() => {
    window.addEventListener("scroll", getCurrentScroll);

    return () => {
      window.removeEventListener("scroll", getCurrentScroll);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("resize", getNavPosition);
  }, []);

  const getCurrentScroll = () => {
    const position = window.pageYOffset + 800;
    setCurrentScroll(position);
  };

  const getNavPosition = () => {
    const y1 = navRef.current.offsetTop;
    const y2 = uploadRef.current.offsetTop;
    const y3 = viewRef.current.offsetTop;
    const y4 = aboutRef.current.offsetTop;
    const y5 = createRef.current.offsetTop;
    setNavY(y1);
    setUploadY(y2);
    setViewY(y3);
    setAboutY(y4);
    setCreateY(y5);
    updateNavLink();
  };

  const updateNavLink = () => {
    if (currentScroll >= navY && currentScroll < uploadY) {
      setActiveNavLink(true);
      setActiveUploadLink(false);
      setActiveCreateLink(false);
      setActiveViewLink(false);
      setActiveAboutLink(false);
    } else if (currentScroll >= uploadY && currentScroll < createY) {
      setActiveNavLink(false);
      setActiveUploadLink(true);
      setActiveCreateLink(false);
      setActiveViewLink(false);
      setActiveAboutLink(false);
    } else if (currentScroll >= createY && currentScroll < viewY) {
      setActiveNavLink(false);
      setActiveUploadLink(false);
      setActiveCreateLink(true);
      setActiveViewLink(false);
      setActiveAboutLink(false);
    } else if (currentScroll >= viewY && currentScroll < aboutY) {
      setActiveNavLink(false);
      setActiveUploadLink(false);
      setActiveCreateLink(false);
      setActiveViewLink(true);
      setActiveAboutLink(false);
    } else if (currentScroll >= aboutY) {
      setActiveNavLink(false);
      setActiveUploadLink(false);
      setActiveCreateLink(false);
      setActiveViewLink(false);
      setActiveAboutLink(true);
    }
  };

  return (
    <div>
      <div className={styles.all}>
        <div className={styles.sidebar}>
          <a
            className={activeNavLink ? styles.active : styles.sidebarA}
            href="#navigation"
          >
            Navigation
          </a>
          <a
            className={activeUploadLink ? styles.active : styles.sidebarA}
            href="#upload"
          >
            Uploading documents
          </a>
          <a
            className={activeCreateLink ? styles.active : styles.sidebarA}
            href="#create"
          >
            Creating student record
          </a>
          <a
            className={activeViewLink ? styles.active : styles.sidebarA}
            href="#view"
          >
            Viewing records
          </a>
          <a
            className={activeAboutLink ? styles.active : styles.sidebarA}
            href="#about"
          >
            About the app
          </a>
        </div>
        <div className={styles.main}>
          {/* Navigation block */}
          <div id="navigation" ref={navRef}>
            <h3 className="pt-3">Navigation</h3>
            <div className={styles.content}>
              Welcome to the navigation page! Here you will learn how to
              navigate the whole application with ease, and know where to find
              what you&apos;re looking for.
            </div>
            <div className={styles.content}>
              Once you have successfully created an account or have logged in,
              the dashboard page is the page you&apos;ll be seeing. This is
              treated as the homepage, where you will see all the
              functionalities offered or what is it you can do in the
              application. When you click the button of the respective page you
              want to go to, you will be redirected to that page.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={docs1} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>Dashboard page.</div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={docs2} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Click upload button to go Upload Documents page.
              </div>
            </div>
            <div className={"float-middle " + styles.pictureContainer}>
              <img src={docs3} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                You have redirected to Upload Documents page.
              </div>
            </div>
            <div className={styles.content}>
              Each functionality has a short description provided, letting you
              know what you can do in the respective pages. These pages in the
              dashboard, when redirected to (e.g., you have chosen to go to edit
              history), has a navigation bar on top, which consists of clickable
              icons of the pages seen in the dashboard earlier (upload, records,
              history, and manual). The current directory will be highlighted
              (e.g. the history icon is highlighted when you are at the edit
              history page). You will be able to click the other icons to go to
              those pages.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={docs1} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>Dashboard page.</div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={nav5} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Click browse to go to View All Records page.
              </div>
            </div>
            <div className={"float-middle " + styles.pictureContainer}>
              <img src={nav6} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                You have redirected to the View All Records page.
              </div>
            </div>
            <div className={styles.content}>
              Each page in the application except the login and create account
              page will have a user icon in the top right of the page. When this
              is clicked, a drop down menu will appear which will show your name
              and email, a dashboard link, an edit profile link, and a logout
              button. Clicking on the dashboard link will redirect you to the
              Dashboard page, clicking on the edit profile link will redirect
              you to the edit profile page, and clicking on the logout button
              will log you out of the application and redirect you back to the
              login page.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={nav7} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                User icon at the top right of the page.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={nav8} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Dropdown menu upon clicking the user icon.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={nav10} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                You are redirected to the Edit Profile page.
              </div>
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={nav9} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Click edit profile to go to edit profile page.
              </div>
            </div>
            <div className={styles.content}>
              In the edit profile page, you will be able to do two things:
              change your personal information and change your password. Simply
              the information that you want to change, and then click the
              respective button (save changes button for changing personal
              information and change password button for changing your password)
              to save what you have edited.
            </div>
            <div className={styles.content}>
              That is all for the tutorial on how to navigate the application.
            </div>
          </div>

          {/* Upload documents block */}
          <div id="upload" ref={uploadRef}>
            <h3 className="pt-3">Uploading documents</h3>
            <div className={styles.content}>
              Here you will learn the process of uploading documents. This
              includes choosing the appropriate files to upload, knowing what to
              expect after uploading, and knowing what to do after an
              unsuccessful or successful uploaded file.
            </div>
            <div className={styles.content}>
              Upon clicking the upload button, either from the dashboard page or
              the navigation bar at the top of the application, you will be
              redirected to the Upload Documents page. Here, you will see that
              there are two steps in order to upload a file: uploading a file or
              files, and verifying the file or files that you have uploaded.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={docs1} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>Dashboard page.</div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={docs2} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Click upload button to go Upload Documents page.
              </div>
            </div>
            <div className={"float-middle " + styles.pictureContainer}>
              <img src={docs3} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                You have redirected to Upload Documents page.
              </div>
            </div>
            <div className={"pb-4 " + styles.content}>
              For the first step, which is uploading files, you have two
              options: dragging and dropping the file or clicking the browse
              files button. Kindly note that only .csv files are accepted. For
              dragging and dropping the file, simply open your files folder or
              the folder in your device where the file you will upload is
              located. Click on this file and drag the file to the rectangle
              with the dashed border in the application, and your file will then
              be uploaded. For the browse files button, click on this button and
              your file explorer application will pop up. Go to the directory
              where your file is located, select this file, and click the open
              button. Your file will then be uploaded. You may select up to 50
              files to upload. The files uploaded will also be displayed on the
              screen, and you may also delete the files uploaded. Afterwards,
              click the upload button and you will be directed to step 2.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={docs4} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Selected files. Click upload to proceed.
              </div>
            </div>
            <div className={styles.content}>
              For the second step, which is the verification of the file or
              files you have uploaded, each file uploaded will be verified one
              at a time. If there are no inconsistencies with all of the files
              that are uploaded, you will simply skip the verification step and
              you will automatically be redirected to the page where a message
              &quot;Uploaded Files Successfully!&quot; is shown.
            </div>
            <div className={styles.content}>
              If there is a file or files with inconsistencies detected, the
              number of files with inconsistencies will be displayed. Here, you
              will be going through each file with inconsistencies in order to
              correct them. For each file with inconsistencies, the whole record
              of the student will be shown on the screen, and the data of the
              student record is editable. The data fields with inconsistencies
              detected will be marked with a red border and a red exclamation
              mark. You should edit these fields in order to correct the
              inconsistency detected since you cannot click the &quot;Next&quot;
              button at the bottom of the page until you have corrected what is
              needed. Afterwards, click on the next button in order to proceed
              editing the next file with inconsistencies as well. Repeat the
              same procedure until you have finished editing all the files with
              inconsistencies. Once you have reached the last file, a
              &quot;Finish&quot; button will appear instead of a
              &quot;Next&quot; button. Click the &quot;Finish&quot; button once
              you have corrected the data.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={docs5} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                File with inconsistencies detected.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={docs6} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Example of inconsistency detected.
              </div>
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={docs7} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                After editing, click the next button.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={docs8} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                You will be directed to the next file to edit, if there is.
              </div>
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={docs9} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                When all files are finished, click finish to proceed.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={docs10} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Display after files have been uploaded successfully.
              </div>
            </div>
            <div className={styles.content}>
              Once the two steps have been completed, you will be prompted with
              a message saying &quot;Uploaded Documents Successfully!&quot; Here
              you can choose whether to view all records uploaded in the
              application, view the newly uploaded records only, or you may
              upload files again. For the first two options, you will be
              redirected to the view records page, and for the third option, you
              will be redirected to the first step of the uploading documents
              page.
            </div>
            <div className={styles.content}>
              That is all for the tutorial on how to upload documents.
            </div>
          </div>

          {/* Create student record block */}
          <div id="create" ref={createRef}>
            <h3 className="pt-3">Creating student record</h3>
            <div className={styles.content}>
              Welcome to the create student section! Here you will learn how to
              create a student record as an alternative to uploading a .csv
              student record.
            </div>
            <div className={styles.content}>
              When you opt to create student record file instead of uploading
              one, click the create file button in the upload documents page.
              You will be redirected to the create student page.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={create1} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Upload documents page. Click create file.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={create2} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                You have redirected to the create student page.
              </div>
            </div>
            <div className={styles.content}>
              The topmost table is for adding a course. You are to fill in a
              course code, the number of units, the grade, the computed weight
              (units*grade) and the term or sem when the course was taken. The
              add button will become enabled (a dark green color) when all
              inputs in the fields are valid. The course is then added to the
              student record table, which is the second table in the page. You
              are to also fill in the student&apos;s last name, first name,
              degree program, and student number in the second table.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={create3} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Fill out the fields in the first table. Click the add button.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={create4} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                The course is added to the second table.
              </div>
            </div>
            <div className={"float-middle " + styles.pictureContainer}>
              <img src={create5} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Fill out the student information in the second table.
              </div>
            </div>
            <div className={styles.content}>
              After adding a course, the term previously inputted will remain.
              Adding another course with the same term will result in that
              course belonging to the same term in the second table. When a user
              adds a course with a different term, the course is added to a
              separate term in the second table. The user is also able to delete
              the courses added. When all courses in a term are deleted, the
              term is deleted as well.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={create6} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Added a course in the same term.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={create7} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Added a course in a different term.
              </div>
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={create8} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>Deleted the first term.</div>
            </div>
            <div className={styles.content}>
              The third row represents the summary table, where the total
              running sum, total number of units, and the GWA is automatically
              computed based on the inputted grade and number of units per
              course. The user is also required to fill out the required units
              field.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={create9} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Computed values automatically update. Required units field is
                filled.
              </div>
            </div>
            <div className={styles.content}>
              Error checking is also present. When invalid values are inputted
              in the second table, the border of the input field becomes red and
              the save button is disabled. The user can also cancel creating a
              student record, a cancel modal will appear confirming the
              user&apos;s choice to do so.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={create10} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>Error checking.</div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={create11} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>Cancel confirmation.</div>
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={create12} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>Save confirmation.</div>
            </div>
            <div className={styles.content}>
              When you are done, simply click on the save button and a
              confirmation will appear. Simply click save and you will be
              redirected back to the upload documents page for double checking
              of the file uploaded (e.g., if there are missing required
              courses). Refer to the upload documents section if needed.
            </div>
            <div className={styles.content}>
              That is all for the tutorial on how to create a student record.
            </div>
          </div>

          {/* Viewing records block */}
          <div id="view" ref={viewRef}>
            <h3 className="pt-3">Viewing records</h3>
            <div className={styles.content}>
              Here you will learn the process of viewing an uploaded record, as
              well as change the fields and update the details of a student
              record.
            </div>
            <div className={styles.content}>
              The user can view, search, filter, sort, and delete student
              records that have been uploaded. Each row of a student record has
              a view button that will redirect the user to view that specific
              record. Upon searching a record, the user can filter through or
              sort by using the following details: upload ID, Last Name, First
              Name, Degree, and GWA.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={view1} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>View All Records page.</div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={view2} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Sort records according to first name.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={view5} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Click view to view the record of the student.
              </div>
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={view3} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>Sorted records.</div>
            </div>
            <div className={styles.content}>
              The information included in the records are the student&apos;s
              full name, degree program, student number and the list of courses
              they have taken. Details regarding the courses include its
              corresponding course code, number of units, and the numerical
              grade the student has achieved. These courses are grouped based on
              the term it was taken, and included in this column is the date of
              the term, the total number of units of the said courses, and the
              total running sum for the said term.
            </div>
            <div className={styles.content}>
              A table containing the computed GWA, total number of units and
              running sum for all of the terms the student has already taken,
              and the student&apos;s required number of units are all provided
              below the student record table.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={view5} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                View student record page.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={view6} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                View student record page continuation.
              </div>
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={view7} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                View student record page continuation.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={view8} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>Student record summary.</div>
            </div>
            <div className={styles.content}>
              Users can print and/or edit the student record. Upon clicking the
              edit button, the table will be editable and the user can now
              change the student details, the grades column, and the number of
              units column. Upon changing the grades or number of units, the
              application will automatically calculate the changes and this will
              reflect on the total number of units per sem, running sum per sem,
              and the summary table. When an invalid value is placed in the
              grades or number of units column, the input field will become red,
              indicating an error, and the save button will be disabled, not
              allowing the user to save until the error is corrected.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={view9} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                View student record page.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={view10} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Edited grade automatically reflects in running sum of sem.
              </div>
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={view11} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Invalid input results in error and save button is disabled.
              </div>
            </div>
            <div className={"float-end " + styles.pictureContainer}>
              <img src={view12} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Remarks for the edited data.
              </div>
            </div>
            <div className={styles.content}>
              Once done editing, clicking save will result in a remarks modal
              that will require the user to put in their notes for the changes
              made. Clicking the save button within the modal will update the
              student record. The changes made is seen in the edit history page.
            </div>
            <div className={"float-start " + styles.pictureContainer}>
              <img src={view13} className="img-fluid" alt="" />
              <div className={styles.imageCaption}>
                Edit history page. All edits made can be viewed here.
              </div>
            </div>
            <div className={styles.content}>
              In the edit history page, the user can see the date and time the
              document was edited, its editor, and the description according to
              the edit made. The user can also sort, filter, and search records.
              There is also a print button present.
            </div>
            <div className={styles.content}>
              That is all for the tutorial on how to view or edit records.
            </div>
          </div>

          {/* About the app block */}
          <div id="about" ref={aboutRef}>
            <br />
            <h3 id="about" className="pt-3">
              About the application
            </h3>
            <div className={"pb-4 " + styles.content}>
              Jiwa (Just Input, Wait and Authenticate) is a General Weighted
              Average (GWA) Verifier system that was developed for the CAS
              Scholarships, Honors, and Awards Committee (SHAC). It helps the
              SHAC in the process of evaluating and recommending recipients of
              Latin honors by providing an easy-to-use system that manages and
              verifies students&apos; grade records. Aside from being
              functional, Jiwa is also a well-designed and optimized system that
              values data integrity, data privacy, consistency, and security at
              all times.
            </div>
            <div className={styles.content}>
              Major Features:
              <br />- Accepts grade record/s (solo or bulk) in csv format.
              <br />- Performs the computation of General Weighted Average
              (GWA).
              <br />- Detects inconsistencies in grade record formatting.
              <br />- Provides a means to edit the grades, the weights, and
              details should there be inconsistencies of formatting or if the
              encoded data is incorrect.
              <br />- Produces a summary of the students sorted by lastname, by
              degree program, or by GWA (from highest to lowest).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
