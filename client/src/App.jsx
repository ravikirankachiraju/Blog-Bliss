import { Route, Routes, BrowserRouter as Router, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import MyPosts from './components/MyPosts';
import Editor from './components/Editor';
import Home from "./components/Home";
import PostDetails from "./components/PostDetails";
import EditPost from "./components/EditPost";
import ProfilePage from './components/ProfilePage';
import ScrollToTop from "./components/ScrollTop";
import AIEditor from "./components/AIEditor";
import About from "./components/About";
import Feedback from "./components/Feedback";
import Dashboard from "./components/Dashboard";
import Faqs from "./components/Faqs";

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

const AppContent = () => {
    const location = useLocation(); // Get the current route's location

    return (
        <>
            <ScrollToTop />
            {/* Conditionally render Navbar based on the current route */}
          
           <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="signup" element={<AuthForm mode="signup" />} />
                <Route path="signin" element={<AuthForm />} />
                <Route path="Editor" element={<Editor />} />
                <Route path="MyPosts" element={<MyPosts />} />
                <Route path="/posts/:postId" element={<PostDetails />} />
                <Route path="/posts/edit/:postId" element={<EditPost />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/generate-ai" element={<AIEditor />} />
                <Route path="/about" element={<About />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Faqs" element={<Faqs />} />


            </Routes>

            <Footer />
        </>
    );
}

export default App;