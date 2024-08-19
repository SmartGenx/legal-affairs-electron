import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import VectorTop from '../../icons/vector-top'
import VectorBottom from '../../icons/vector-bottom'
import LoginForm from '../../forms/auth/login'
import LogoIcon from '../../icons/logo-icon'
import { Link } from 'react-router-dom'
import { Separator } from '../../ui/separator'
import YemenLogo from '../../legal-affairs-logo'

const Login = () => {
  const year = new Date().getFullYear()
  return (
    <div className="flex min-h-screen flex-col bg-[#3734a9] overflow-auto md:flex-row relative">
      <div className="absolute top-0 right-0">
        <VectorTop />
      </div>
      <div className="absolute bottom-0 left-0">
        <VectorBottom />
      </div>
      <div className="w-[80%] h-[80vh] m-auto flex">
        {/*  */}
        <div className="w-[50%] h-[100%] flex justify-center items-center">
          <Link to={'https://mosal-ye-homepage-web.vercel.app/'} target="_blank">
            <YemenLogo />
          </Link>
        </div>
        {/*  */}
        <div className="w-[50%] h-[100%] flex justify-center items-center">
          <Card className="w-full md:w-[400px]">
            <CardHeader>
              <CardTitle className="text-start text-[25px] font-bold">تسجيل الدخول</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
