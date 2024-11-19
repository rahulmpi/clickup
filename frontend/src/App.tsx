import { ConfigProvider } from "antd"
import { RouterProvider } from "react-router-dom"
import router from "./routes"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Suspense } from "react"
import { Spin } from 'antd';

function App() {
  const customTheme ={
    token: {
      colorPrimary: '#5f55ee',
      colorLink: '#5f55ee',
      colorLinkHover: '#544dc9',
      fontFamily: 'Arial, sans-serif', 
      fontSize: 16, 
      colorText: '#292d34',
      colorBgBase: '#fff',
      colorBorder: '#d6d9de'
    },
  }

  return (
    <>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH}>
    <ConfigProvider theme={customTheme}>
      <Suspense fallback={<Spin/>}>
      <RouterProvider router={router}/>
      </Suspense>
    </ConfigProvider>
    </GoogleOAuthProvider>
    </>
  )
}

export default App
