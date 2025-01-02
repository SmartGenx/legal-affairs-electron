import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import bgLogo from '../../../assets/images/bg-logo.png'
import LoginForm from '../../forms/auth/login'
import YemenLogo from '../../../assets/images/yemen-logo.png'

const Login = () => {
  // const year = new Date().getFullYear()
  return (
    <div className="flex min-h-screen flex-col bg-[#3734a9] overflow-auto md:flex-row relative">
      <div className="absolute w-full h-full top-0 right-0">
        <img src={bgLogo} className="w-full h-full" />
      </div>

      <div className="w-[100%] md:w-[90%] h-[80vh] m-auto flex">
        <div className="w-[70%] md:w-[50%] h-[100%]   relative z-50">
          {/*  */}
          <div className="md:translate-x-0 -translate-x-20">
            <img src={YemenLogo} alt="" />
          </div>
          <Card className="w-full md:w-[400px]  mt-20 -translate-x-20">
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
