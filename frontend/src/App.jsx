import FloatingShape from "./components/FloatingShape"
import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage";
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">      
    <FloatingShape
      size="w-64 h-64"
      color="bg-green-500"
      top="-5%"
      left="10%"
      delay={0}
    />
    <FloatingShape
      size="w-48 h-48"
      color="bg-green-500"
      top="70%"
      left="80%"
      delay={5}
    />
    <FloatingShape
      size="w-32 h-32"
      color="bg-green-500"
      top="40%"
      left="-10%"
      delay={2}
    />

    <Routes>
      <Route path='/' element={"Home"} />
      <Route path='/signup' element={<SignUpPage/>} />
      <Route path='/login' element={<LoginPage/>} />
    </Routes>
    </div>
  )
}

export default App
