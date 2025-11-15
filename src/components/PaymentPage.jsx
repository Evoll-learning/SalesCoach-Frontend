import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Crown, 
  Zap, 
  BarChart3, 
  Users, 
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PaymentPage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Check for payment callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      checkPaymentStatus(sessionId);
    }
  }, []);

  const checkPaymentStatus = async (sessionId) => {
    setCheckingPayment(true);
    let attempts = 0;
    const maxAttempts = 5;
    
    const pollPaymentStatus = async () => {
      try {
        const response = await axios.get(`${API}/payments/checkout/${sessionId}/status`, {
          
        });
        
        if (response.data.payment_status === 'paid') {
          toast.success('¡Pago procesado exitosamente! Bienvenido al plan premium.');
          // Redirect to dashboard after success
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
          return;
        } else if (response.data.status === 'expired') {
          toast.error('La sesión de pago ha expirado. Por favor, intenta de nuevo.');
          return;
        }
        
        // Continue polling if payment is pending
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollPaymentStatus, 2000);
        } else {
          toast.warning('Verificando el estado del pago. Revisa tu email para confirmación.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        toast.error('Error al verificar el estado del pago.');
      } finally {
        if (attempts >= maxAttempts) {
          setCheckingPayment(false);
        }
      }
    };
    
    pollPaymentStatus();
  };

  const handlePayment = async (planType) => {
    setLoading(true);
    setSelectedPlan(planType);
    
    try {
      const currentUrl = window.location.origin + window.location.pathname;
      const successUrl = `${currentUrl}?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = currentUrl;
      
      const response = await axios.post(`${API}/payments/create-checkout`, {
        plan_type: planType,
        success_url: successUrl,
        cancel_url: cancelUrl
      }, {
        
      });
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.checkout_url;
      
    } catch (error) {
      toast.error('Error al procesar el pago');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  if (checkingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <Card className="card max-w-md w-full mx-4">
          <CardContent className="text-center p-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-600" />
            <h3 className="text-lg font-semibold mb-2">Verificando el pago...</h3>
            <p className="text-slate-600">Por favor, espera mientras confirmamos tu transacción.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Navigation */}
      <nav className="glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/dashboard" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="font-heading font-bold text-2xl gradient-text">
                SalesCoach AI
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Actualiza a <span className="gradient-text">SalesCoach AI Premium</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Desbloquea todo el potencial de tu entrenamiento en ventas
          </p>
        </div>

        {/* Current Status */}
        <div className="mb-12">
          <Card className="card max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Plan Actual: {user.subscription_status === 'trial' ? 'Prueba Gratuita' : 'Premium'}</CardTitle>
              <CardDescription>
                {user.subscription_status === 'trial' 
                  ? 'Acceso limitado a funciones básicas'
                  : 'Acceso completo a todas las funciones'
                }
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Monthly Plan */}
          <Card className="card border-2 border-slate-200 hover:border-emerald-300 transition-all">
            <CardHeader className="text-center">
              <Badge variant="outline" className="mb-4 mx-auto">Mensual</Badge>
              <CardTitle className="text-3xl font-bold mb-2">
                49€<span className="text-lg font-normal text-slate-600">/mes</span>
              </CardTitle>
              <CardDescription>Perfecto para empezar</CardDescription>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Simulaciones ilimitadas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Feedback detallado con IA</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Dashboard personal</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Análisis de progreso</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Soporte por email</span>
                </li>
              </ul>
              
              <Button 
                className="w-full btn-transition bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                onClick={() => handlePayment('monthly')}
                disabled={loading && selectedPlan === 'monthly'}
                data-testid="monthly-plan-btn"
              >
                {loading && selectedPlan === 'monthly' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Comenzar Plan Mensual
              </Button>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="card border-2 border-emerald-400 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600">
              ⭐ Más Popular
            </Badge>
            
            <CardHeader className="text-center">
              <Badge variant="outline" className="mb-4 mx-auto border-emerald-200 text-emerald-700">Anual</Badge>
              <CardTitle className="text-3xl font-bold mb-2">
                29€<span className="text-lg font-normal text-slate-600">/mes</span>
              </CardTitle>
              <p className="text-emerald-600 font-medium mb-2">Facturado anualmente (348€/año)</p>
              <CardDescription>
                <span className="line-through text-slate-400">588€</span> 
                <span className="text-emerald-600 font-semibold ml-2">Ahorra 240€ al año</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="font-medium">Todo del plan mensual +</span>
                </li>
                <li className="flex items-center">
                  <Crown className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Escenarios premium exclusivos</span>
                </li>
                <li className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Análisis avanzado de performance</span>
                </li>
                <li className="flex items-center">
                  <Zap className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Acceso prioritario a nuevas funciones</span>
                </li>
                <li className="flex items-center">
                  <Users className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Soporte prioritario 24/7</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3" />
                  <span>Informes detallados exportables</span>
                </li>
              </ul>
              
              <Button 
                className="w-full btn-transition bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                onClick={() => handlePayment('annual')}
                disabled={loading && selectedPlan === 'annual'}
                data-testid="annual-plan-btn"
              >
                {loading && selectedPlan === 'annual' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Comenzar Plan Anual
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="card">
            <CardHeader className="text-center">
              <CardTitle>¿Por qué elegir SalesCoach AI Premium?</CardTitle>
              <CardDescription>
                Transforma tu forma de vender con tecnología de vanguardia
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Feedback Instantáneo</h3>
                  <p className="text-slate-600 text-sm">
                    Recibe análisis detallado en tiempo real de tu performance de ventas
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Métricas Avanzadas</h3>
                  <p className="text-slate-600 text-sm">
                    Sigue tu progreso con métricas detalladas y reportes exportables
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Avatares Realistas</h3>
                  <p className="text-slate-600 text-sm">
                    Practica con clientes virtuales que simulan situaciones reales
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guarantee */}
        <div className="text-center">
          <Card className="card max-w-2xl mx-auto">
            <CardContent className="p-6">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Garantía de Satisfacción 30 Días</h3>
              <p className="text-slate-600">
                Si no estás completamente satisfecho con SalesCoach AI Premium, 
                te devolvemos tu dinero sin preguntas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;