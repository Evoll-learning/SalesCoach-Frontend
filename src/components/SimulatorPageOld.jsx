import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft, 
  Play, 
  Target, 
  Thermometer, 
  Phone, 
  Video, 
  Users,
  Loader2,
  Camera,
  Mic,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SimulatorPage = ({ user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup'); // setup, permissions, active, feedback
  const [loading, setLoading] = useState(false);
  const [conversationData, setConversationData] = useState(null);
  const [mediaPermissions, setMediaPermissions] = useState({ camera: false, microphone: false });
  const [permissionError, setPermissionError] = useState('');
  const [tavusLoaded, setTavusLoaded] = useState(false);
  const iframeRef = useRef(null);
  const [formData, setFormData] = useState({
    simulation_type: '',
    objective: '',
    lead_temperature: '',
    conversation_name: '',
    custom_scenario: ''
  });

  const simulationTypes = [
    {
      id: 'llamada',
      name: 'Llamada Telefónica',
      description: 'Simulación de venta por teléfono',
      icon: Phone
    },
    {
      id: 'zoom',
      name: 'Videoconferencia',
      description: 'Reunión virtual de ventas',
      icon: Video
    },
    {
      id: 'presencial',
      name: 'Encuentro Presencial',
      description: 'Reunión cara a cara',
      icon: Users
    }
  ];

  const objectives = [
    {
      id: 'identificar_necesidades',
      name: 'Identificar Necesidades',
      description: 'Practica el descubrimiento de pain points'
    },
    {
      id: 'manejar_objecciones',
      name: 'Manejar Objecciones',
      description: 'Aprende a responder objeciones comunes'
    },
    {
      id: 'cierre_consultivo',
      name: 'Cierre Consultivo',
      description: 'Domina técnicas de cierre efectivas'
    },
    {
      id: 'venta_completa',
      name: 'Venta Completa',
      description: 'Proceso de venta de principio a fin'
    }
  ];

  const leadTemperatures = [
    {
      id: 'frio',
      name: 'Lead Frío',
      description: 'Cliente sin interés previo',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'tibio',
      name: 'Lead Tibio',
      description: 'Cliente con interés moderado',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'caliente',
      name: 'Lead Caliente',
      description: 'Cliente muy interesado',
      color: 'bg-red-100 text-red-800'
    }
  ];

  // Solicitar permisos de cámara y micrófono
  const requestMediaPermissions = async () => {
    setLoading(true);
    setPermissionError('');
    
    try {
      // Solicitar permisos de cámara y micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Si llegamos aquí, los permisos fueron otorgados
      setMediaPermissions({ camera: true, microphone: true });
      
      // Detener el stream ya que solo queríamos los permisos
      stream.getTracks().forEach(track => track.stop());
      
      toast.success('Permisos de cámara y micrófono concedidos');
      
      // Proceder con la simulación
      await startSimulation();
      
    } catch (error) {
      console.error('Error requesting media permissions:', error);
      
      let errorMessage = 'Error al acceder a cámara y micrófono. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Permisos denegados. Por favor, permite el acceso a tu cámara y micrófono.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No se encontró cámara o micrófono.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Dispositivos en uso por otra aplicación.';
      } else {
        errorMessage += 'Verifica que tu navegador tenga permisos.';
      }
      
      setPermissionError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startSimulation = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/simulations/conversations`, formData, {
        withCredentials: true
      });
      
      setConversationData(response.data);
      
      // Si Tavus está disponible, usar la URL real, si no, mostrar demo
      if (response.data.conversation_url && !response.data.conversation_url.includes('demo.tavus.io')) {
        setStep('active');
        toast.success('¡Simulación iniciada! Conectando con el avatar...');
      } else {
        // Fallback: abrir Tavus en nueva pestaña o mostrar demo
        setStep('active');
        toast.warning('Abriendo simulador en nueva ventana...');
      }
      
    } catch (error) {
      toast.error('Error al iniciar la simulación');
      console.error('Simulation error:', error);
      setStep('setup');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSimulation = async () => {
    if (!conversationData) return;
    
    setLoading(true);
    try {
      await axios.post(`${API}/simulations/conversations/${conversationData.conversation_id}/end`, {}, {
        withCredentials: true
      });
      
      setStep('feedback');
      toast.success('Simulación finalizada. Generando feedback...');
      
    } catch (error) {
      toast.error('Error al finalizar la simulación');
      console.error('End simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canStart = () => {
    return formData.simulation_type && formData.objective && formData.lead_temperature;
  };

  // Componente para solicitar permisos
  const PermissionsStep = () => (
    <div className="min-h-screen simulator-bg">
      <nav className=\"glass border-b border-white/20\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"flex justify-between items-center py-4\">
            <Link to=\"/dashboard\" className=\"inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors\">
              <ArrowLeft className=\"h-4 w-4 mr-2\" />
              <span className=\"brand-logo\">SalesCoach AI</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className=\"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">
        <Card className=\"card\">
          <CardHeader className=\"text-center\">
            <div className=\"w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6\">
              <Bot className=\"h-10 w-10 text-blue-600\" />
            </div>
            <CardTitle className=\"text-2xl mb-2\">Configurar Permisos de Dispositivos</CardTitle>
            <CardDescription>
              Para una experiencia óptima, necesitamos acceso a tu cámara y micrófono
            </CardDescription>
          </CardHeader>
          
          <CardContent className=\"space-y-6\">
            {permissionError && (
              <Alert className=\"border-red-200 bg-red-50\">
                <AlertTriangle className=\"h-4 w-4\" />
                <AlertDescription className=\"text-red-800\">
                  {permissionError}
                </AlertDescription>
              </Alert>
            )}

            <div className=\"grid md:grid-cols-2 gap-6\">
              <div className=\"text-center p-6 bg-blue-50 rounded-xl border border-blue-200\">
                <Camera className=\"h-12 w-12 text-blue-600 mx-auto mb-4\" />
                <h3 className=\"font-semibold text-lg mb-2\">Cámara</h3>
                <p className=\"text-sm text-slate-600 mb-4\">
                  Para que el avatar pueda verte y responder a tu lenguaje corporal
                </p>
                <div className=\"flex items-center justify-center\">
                  {mediaPermissions.camera ? (
                    <div className=\"flex items-center text-green-600\">
                      <CheckCircle2 className=\"h-5 w-5 mr-2\" />
                      <span>Permitido</span>
                    </div>
                  ) : (
                    <div className=\"flex items-center text-slate-500\">
                      <Shield className=\"h-5 w-5 mr-2\" />
                      <span>Pendiente</span>
                    </div>
                  )}
                </div>
              </div>

              <div className=\"text-center p-6 bg-blue-50 rounded-xl border border-blue-200\">
                <Mic className=\"h-12 w-12 text-blue-600 mx-auto mb-4\" />
                <h3 className=\"font-semibold text-lg mb-2\">Micrófono</h3>
                <p className=\"text-sm text-slate-600 mb-4\">
                  Para mantener una conversación natural con el avatar
                </p>
                <div className=\"flex items-center justify-center\">
                  {mediaPermissions.microphone ? (
                    <div className=\"flex items-center text-green-600\">
                      <CheckCircle2 className=\"h-5 w-5 mr-2\" />
                      <span>Permitido</span>
                    </div>
                  ) : (
                    <div className=\"flex items-center text-slate-500\">
                      <Shield className=\"h-5 w-5 mr-2\" />
                      <span>Pendiente</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className=\"text-center space-y-4\">
              <Button 
                onClick={requestMediaPermissions}
                disabled={loading}
                className=\"btn-primary px-8 py-4 text-lg\"
              >
                {loading ? (
                  <Loader2 className=\"h-5 w-5 animate-spin mr-2\" />
                ) : (
                  <Shield className=\"mr-2 h-5 w-5\" />
                )}
                {loading ? 'Solicitando permisos...' : 'Permitir Acceso a Dispositivos'}
              </Button>
              
              <p className=\"text-sm text-slate-500\">
                Al hacer clic, tu navegador solicitará permisos. Asegúrate de hacer clic en \"Permitir\"
              </p>
            </div>

            <div className=\"bg-slate-50 rounded-xl p-4 border border-slate-200\">
              <h4 className=\"font-semibold text-slate-800 mb-2\">¿Problemas con los permisos?</h4>
              <ul className=\"text-sm text-slate-600 space-y-1\">
                <li>• Verifica que tu cámara y micrófono no estén en uso</li>
                <li>• Revisa la configuración de privacidad de tu navegador</li>
                <li>• Haz clic en el ícono de cámara en la barra de direcciones</li>
                <li>• Recarga la página e intenta de nuevo</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Mostrar paso de permisos si es necesario
  if (step === 'permissions') {
    return <PermissionsStep />;
  }

  if (step === 'active') {
    return (
      <div className="min-h-screen simulator-bg">
        {/* Navigation */}
        <nav className="glass border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="brand-logo">
                SalesCoach AI
              </div>
              <Badge className="bg-green-100 text-green-800 animate-pulse">
                🔴 Simulación Activa
              </Badge>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2 flex items-center justify-center">
                <Bot className="mr-3 h-6 w-6 text-blue-600" />
                Simulación en Progreso
              </CardTitle>
              <CardDescription>
                {formData.simulation_type} • {formData.objective} • Lead {formData.lead_temperature}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Tavus Video Container Mejorado */}
              <div className="aspect-video bg-slate-900 rounded-lg mb-6 relative overflow-hidden">
                {conversationData?.conversation_url && !conversationData.conversation_url.includes('demo.tavus.io') ? (
                  <>
                    <iframe
                      ref={iframeRef}
                      src={conversationData.conversation_url}
                      className="w-full h-full rounded-lg"
                      allow="camera *; microphone *; autoplay *; encrypted-media *; fullscreen *"
                      allowFullScreen
                      title="Sales Simulation"
                      onLoad={() => setTavusLoaded(true)}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-camera allow-microphone"
                    />
                    {!tavusLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                        <div className="text-center text-white">
                          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                          <p>Cargando simulador...</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : conversationData?.conversation_url?.includes('demo.tavus.io') ? (
                  // Demo fallback
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <Bot className="h-16 w-16 mx-auto mb-4 text-blue-300" />
                      <h3 className="text-xl font-bold mb-4">Modo Demo</h3>
                      <p className="mb-6">La simulación está en modo de demostración.</p>
                      <div className="space-y-3">
                        <Button 
                          onClick={() => window.open('https://tavus.io', '_blank')}
                          className="btn-primary mr-4"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Abrir Tavus
                        </Button>
                        <Button 
                          variant="outline"
                          className="text-white border-white hover:bg-white hover:text-slate-900"
                          onClick={handleEndSimulation}
                        >
                          Continuar Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <div className="text-center text-white">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                      <p>Conectando con el avatar...</p>
                      <p className="text-sm text-slate-400 mt-2">Esto puede tomar unos segundos</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Control Panel */}
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="destructive" 
                  onClick={handleEndSimulation}
                  disabled={loading}
                  className="btn-transition"
                  data-testid="end-simulation-btn"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Finalizar Simulación
                </Button>
              </div>

              {/* Tips Panel Mejorado */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Consejos para la simulación:
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" /> Escucha activamente las respuestas del cliente</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" /> Haz preguntas abiertas para descubrir necesidades</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" /> Mantén un tono natural y profesional</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" /> Responde a las objeciones con empatía</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Estado de la sesión:
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Cámara:</span>
                      <Badge className="bg-green-100 text-green-800">Activa</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Micrófono:</span>
                      <Badge className="bg-green-100 text-green-800">Activo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Conexión:</span>
                      <Badge className="bg-green-100 text-green-800">Estable</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'feedback') {
    return (
      <div className="min-h-screen simulator-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="card">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl mb-2">🎉 ¡Simulación Completada!</CardTitle>
              <CardDescription>
                El feedback detallado estará disponible en unos minutos
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <div className="mb-6">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-600" />
                <p className="text-slate-600">Analizando tu performance con IA...</p>
              </div>
              
              <div className="space-y-4">
                <Link to="/dashboard">
                  <Button className="btn-primary mr-4">
                    Volver al Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="btn-transition"
                >
                  Nueva Simulación
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen simulator-bg">
      {/* Navigation */}
      <nav className="glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/dashboard" className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="brand-logo">
                SalesCoach AI
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurar Simulación</h1>
          <p className="text-slate-600">Personaliza tu práctica de ventas para obtener el máximo beneficio</p>
        </div>

        <div className="space-y-8">
          {/* Simulation Type */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Tipo de Simulación
              </CardTitle>
              <CardDescription>
                Elige el formato de tu práctica de ventas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {simulationTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div 
                      key={type.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.simulation_type === type.id 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-slate-200 hover:border-emerald-300'
                      }`}
                      onClick={() => setFormData({...formData, simulation_type: type.id})}
                    >
                      <div className="text-center">
                        <IconComponent className="h-8 w-8 mx-auto mb-3 text-emerald-600" />
                        <h3 className="font-semibold mb-1">{type.name}</h3>
                        <p className="text-sm text-slate-600">{type.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Objective */}
          <Card className="card">
            <CardHeader>
              <CardTitle>Objetivo de la Práctica</CardTitle>
              <CardDescription>
                ¿En qué aspecto de la venta quieres enfocarte?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.objective} 
                onValueChange={(value) => setFormData({...formData, objective: value})}
                className="space-y-3"
              >
                {objectives.map((obj) => (
                  <div key={obj.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value={obj.id} id={obj.id} />
                    <Label htmlFor={obj.id} className="cursor-pointer flex-1">
                      <div className="font-semibold">{obj.name}</div>
                      <div className="text-sm text-slate-600">{obj.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Lead Temperature */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Thermometer className="mr-2 h-5 w-5" />
                Temperatura del Lead
              </CardTitle>
              <CardDescription>
                Nivel de interés inicial del cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {leadTemperatures.map((temp) => (
                  <div 
                    key={temp.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.lead_temperature === temp.id 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                    onClick={() => setFormData({...formData, lead_temperature: temp.id})}
                  >
                    <div className="text-center">
                      <Badge className={`mb-3 ${temp.color}`}>{temp.name}</Badge>
                      <p className="text-sm text-slate-600">{temp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optional Settings */}
          <Card className="card">
            <CardHeader>
              <CardTitle>Configuración Adicional (Opcional)</CardTitle>
              <CardDescription>
                Personaliza tu simulación con detalles específicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="conversation_name">Nombre de la simulación</Label>
                <Input
                  id="conversation_name"
                  placeholder="Ej: Práctica de cierre con objeciones de precio"
                  value={formData.conversation_name}
                  onChange={(e) => setFormData({...formData, conversation_name: e.target.value})}
                  data-testid="conversation-name-input"
                />
              </div>
              
              <div>
                <Label htmlFor="custom_scenario">Escenario personalizado</Label>
                <Textarea
                  id="custom_scenario"
                  placeholder="Describe el contexto específico, tipo de cliente, situación especial..."
                  value={formData.custom_scenario}
                  onChange={(e) => setFormData({...formData, custom_scenario: e.target.value})}
                  rows={3}
                  data-testid="custom-scenario-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="text-center">
            <Button 
              size="lg"
              onClick={requestMediaPermissions}
              disabled={!canStart() || loading}
              className="btn-primary px-8 py-4 text-lg shadow-2xl"
              data-testid="start-simulation-btn"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Play className="mr-2 h-5 w-5" />
              )}
              {loading ? 'Iniciando...' : 'Comenzar Simulación'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;