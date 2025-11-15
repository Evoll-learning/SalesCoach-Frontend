import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ArrowRight, ArrowLeft, Target, Users, DollarSign, Briefcase, Building } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OnboardingPage = ({ user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sales_type: '',
    product_service: '',
    price_range: '',
    user_role: '',
    target_client: ''
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/user/onboarding`, formData, {
        
      });
      toast.success('¡Onboarding completado! Redirigiendo al dashboard...');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error al completar el onboarding');
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1: return formData.sales_type;
      case 2: return formData.product_service;
      case 3: return formData.price_range;
      case 4: return formData.user_role;
      case 5: return formData.target_client;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-heading font-bold text-2xl gradient-text mb-2">
            SalesCoach AI
          </div>
          <h1 className="text-3xl font-bold mb-2">Configuremos tu entrenamiento</h1>
          <p className="text-slate-600">Personaliza tu experiencia para obtener el máximo beneficio</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Paso {step} de {totalSteps}</span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="card">
          <CardContent className="p-8">
            {/* Step 1: Sales Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Target className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl mb-2">¿Qué tipo de venta realizas?</CardTitle>
                  <CardDescription>
                    Esto nos ayuda a personalizar los escenarios de práctica
                  </CardDescription>
                </div>
                
                <RadioGroup 
                  value={formData.sales_type} 
                  onValueChange={(value) => setFormData({...formData, sales_type: value})}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 border-2 border-slate-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer">
                    <RadioGroupItem value="B2B" id="b2b" />
                    <Label htmlFor="b2b" className="cursor-pointer flex-1">
                      <div className="font-semibold">B2B (Business to Business)</div>
                      <div className="text-sm text-slate-600">Vendes a empresas y organizaciones</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border-2 border-slate-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer">
                    <RadioGroupItem value="B2C" id="b2c" />
                    <Label htmlFor="b2c" className="cursor-pointer flex-1">
                      <div className="font-semibold">B2C (Business to Consumer)</div>
                      <div className="text-sm text-slate-600">Vendes directamente a consumidores finales</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Product/Service */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Briefcase className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl mb-2">¿Qué producto o servicio ofreces?</CardTitle>
                  <CardDescription>
                    Describe brevemente tu oferta principal
                  </CardDescription>
                </div>
                
                <Input
                  placeholder="Ej: Software de gestión, Consultoría, Productos digitales..."
                  value={formData.product_service}
                  onChange={(e) => setFormData({...formData, product_service: e.target.value})}
                  className="text-center"
                  data-testid="product-service-input"
                />
              </div>
            )}

            {/* Step 3: Price Range */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <DollarSign className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl mb-2">¿Cuál es el rango de precio?</CardTitle>
                  <CardDescription>
                    Esto nos ayuda a adaptar las objeciones y estrategias de cierre
                  </CardDescription>
                </div>
                
                <RadioGroup 
                  value={formData.price_range} 
                  onValueChange={(value) => setFormData({...formData, price_range: value})}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value="bajo" id="bajo" />
                    <Label htmlFor="bajo" className="cursor-pointer">Menos de 100€</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value="medio" id="medio" />
                    <Label htmlFor="medio" className="cursor-pointer">100€ - 1.000€</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value="alto" id="alto" />
                    <Label htmlFor="alto" className="cursor-pointer">1.000€ - 10.000€</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value="premium" id="premium" />
                    <Label htmlFor="premium" className="cursor-pointer">Más de 10.000€</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 4: User Role */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Users className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl mb-2">¿Cuál es tu rol?</CardTitle>
                  <CardDescription>
                    Esto personaliza el tipo de feedback que recibirás
                  </CardDescription>
                </div>
                
                <RadioGroup 
                  value={formData.user_role} 
                  onValueChange={(value) => setFormData({...formData, user_role: value})}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value="comercial" id="comercial" />
                    <Label htmlFor="comercial" className="cursor-pointer">Comercial / Vendedor</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value="jefe_ventas" id="jefe_ventas" />
                    <Label htmlFor="jefe_ventas" className="cursor-pointer">Jefe de Ventas</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value="emprendedor" id="emprendedor" />
                    <Label htmlFor="emprendedor" className="cursor-pointer">Emprendedor / Fundador</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value="consultor" id="consultor" />
                    <Label htmlFor="consultor" className="cursor-pointer">Consultor</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value="otro" id="otro" />
                    <Label htmlFor="otro" className="cursor-pointer">Otro</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 5: Target Client */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl mb-2">¿Cuál es tu cliente objetivo?</CardTitle>
                  <CardDescription>
                    Describe el perfil de tu cliente ideal
                  </CardDescription>
                </div>
                
                <Textarea
                  placeholder="Ej: Pequeñas empresas de 10-50 empleados, Gerentes de marketing, Personas entre 30-45 años..."
                  value={formData.target_client}
                  onChange={(e) => setFormData({...formData, target_client: e.target.value})}
                  rows={4}
                  data-testid="target-client-input"
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={step === 1}
                className="btn-transition"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!canContinue() || loading}
                className="btn-transition bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                data-testid="next-btn"
              >
                {loading ? 'Guardando...' : (step === totalSteps ? 'Finalizar' : 'Siguiente')}
                {step < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;