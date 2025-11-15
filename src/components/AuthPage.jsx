import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Mail, Lock, User, Bot, Rocket, Shield, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');

  // Mascota Robot Entrenador simplificada para Auth
  const RobotMascot = () => {
    return (
      <div className="relative">
        <div className="relative animate-float">
          <div className="w-16 h-20 relative">
            {/* Cabeza */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full border-2 border-blue-600 mx-auto relative">
              {/* Auriculares */}
              <div className="absolute -left-1 top-1/4 w-2 h-6 bg-blue-700 rounded-full"></div>
              <div className="absolute -right-1 top-1/4 w-2 h-6 bg-blue-700 rounded-full"></div>
              
              {/* Ojos */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full">
                <div className="w-1 h-1 bg-blue-900 rounded-full mt-0.5 ml-0.5"></div>
              </div>
              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full">
                <div className="w-1 h-1 bg-blue-900 rounded-full mt-0.5 ml-0.5"></div>
              </div>
              
              {/* Boca sonriente */}
              <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-blue-600 rounded-full"></div>
            </div>
            
            {/* Cuerpo */}
            <div className="w-10 h-8 bg-gradient-to-br from-white to-blue-50 rounded-xl border-2 border-blue-600 mx-auto mt-1 relative">
              {/* Insignia */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Star className="h-1.5 w-1.5 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Efectos */}
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"></div>
      </div>
    );
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API}${endpoint}`, payload);
      
      toast.success(isLogin ? '¡Bienvenido de vuelta!' : '¡Cuenta creada exitosamente!');
      
      onLogin(response.data.user, response.data.access_token);
      navigate('/dashboard');
      
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Error en la autenticación';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const redirectUrl = encodeURIComponent(`${window.location.origin}/dashboard`);
    window.location.href = `https://auth.emergentagent.com/?redirect=${redirectUrl}`;
  };

  return (
    <div className="min-h-screen simulator-bg flex items-center justify-center p-4 relative">
      {/* Elementos decorativos animados */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-float"></div>
      <div className="absolute bottom-20 right-16 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-40 right-20 w-8 h-8 bg-yellow-200 rounded-full opacity-40 animate-pulse"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Back to home */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors font-medium group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
            <div className="flex items-center space-x-2">
              <RobotMascot />
              <span className="brand-logo text-lg">
                SalesCoach AI
              </span>
            </div>
          </Link>
        </div>

        <Card className="card border-2 border-blue-100 hover:border-blue-200 transition-all duration-500 hover:scale-105">
          <CardHeader className="text-center pb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative border-2 border-blue-200">
              <div className="relative">
                <Bot className="h-12 w-12 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-800 mb-3">
              {isLogin ? 'Bienvenido de vuelta' : 'Únete a SalesCoach AI'}
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              {isLogin 
                ? 'Continúa tu entrenamiento donde lo dejaste' 
                : 'Comienza tu transformación en ventas hoy'
              }
            </CardDescription>
            
            {!isLogin && (
              <div className="mt-4 flex justify-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-green-500" />
                  <span>Seguro</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>Gratis</span>
                </div>
                <div className="flex items-center">
                  <Rocket className="h-4 w-4 mr-1 text-blue-500" />
                  <span>Instant</span>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Google Auth Button */}
            <Button 
              type="button"
              variant="outline" 
              className="w-full mb-8 btn-secondary py-4 text-lg border-2 hover:scale-105 transition-all duration-300" 
              onClick={handleGoogleAuth}
              data-testid="google-auth-btn"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </Button>

            <div className="relative mb-8">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-slate-500 font-medium">
                o continúa with email
              </span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Nombre completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      className="pl-12 py-4 text-lg border-2 focus:border-blue-500 hover:border-blue-300 transition-all"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      data-testid="name-input"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-12 py-4 text-lg border-2 focus:border-blue-500 hover:border-blue-300 transition-all"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    data-testid="email-input"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-blue-600" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-12 py-4 text-lg border-2 focus:border-blue-500 hover:border-blue-300 transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    data-testid="password-input"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-primary py-4 text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300" 
                disabled={loading}
                data-testid="submit-btn"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  <>
                    {isLogin ? (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Iniciar Sesión
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-5 w-5" />
                        Crear Cuenta Gratis
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors text-lg hover:scale-105 transition-all"
                data-testid="toggle-auth-mode"
              >
                {isLogin 
                  ? '¿Nuevo en SalesCoach AI? Crear cuenta gratis' 
                  : '¿Ya tienes cuenta? Iniciar sesión'
                }
              </button>
            </div>

            {!isLogin && (
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-blue-700 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 mr-2 text-blue-600" />
                    <span className="font-semibold text-lg">100% Seguro y Privado</span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    Al crear tu cuenta, aceptas nuestros términos y condiciones. 
                    Tu información está protegida con encriptación de nivel bancario.
                  </p>
                  
                  <div className="flex justify-center space-x-6 mt-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Datos seguros</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span>Sin spam</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span>Acceso inmediato</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;