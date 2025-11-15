import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Play, Target, BarChart3, Users, CheckCircle2, ArrowRight, Zap, Brain, Trophy, Bot, Rocket, Star, Shield, Activity, TrendingUp, MessageCircle, Headphones, Award } from 'lucide-react';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mascota Robot Entrenador animada
  const RobotMascot = ({ size = 'large', className = '' }) => {
    return (
      <div className={`relative ${className}`}>
        <div className="relative animate-float">
          {/* Cuerpo del robot */}
          <div className={`${
            size === 'large' ? 'w-32 h-40' : 
            size === 'medium' ? 'w-24 h-30' : 'w-16 h-20'
          } relative`}>
            {/* Cabeza */}
            <div className={`${
              size === 'large' ? 'w-24 h-24' : 
              size === 'medium' ? 'w-18 h-18' : 'w-12 h-12'
            } bg-gradient-to-br from-blue-100 to-blue-200 rounded-full border-4 border-blue-600 mx-auto relative`}>
              {/* Auriculares */}
              <div className={`absolute -left-2 top-1/4 ${
                size === 'large' ? 'w-6 h-12' : 
                size === 'medium' ? 'w-4 h-8' : 'w-3 h-6'
              } bg-blue-700 rounded-full`}></div>
              <div className={`absolute -right-2 top-1/4 ${
                size === 'large' ? 'w-6 h-12' : 
                size === 'medium' ? 'w-4 h-8' : 'w-3 h-6'
              } bg-blue-700 rounded-full`}></div>
              
              {/* Ojos */}
              <div className={`absolute top-1/4 left-1/4 ${
                size === 'large' ? 'w-4 h-4' : 
                size === 'medium' ? 'w-3 h-3' : 'w-2 h-2'
              } bg-white rounded-full`}>
                <div className={`${
                  size === 'large' ? 'w-2 h-2' : 
                  size === 'medium' ? 'w-1.5 h-1.5' : 'w-1 h-1'
                } bg-blue-900 rounded-full mt-0.5 ml-0.5`}></div>
              </div>
              <div className={`absolute top-1/4 right-1/4 ${
                size === 'large' ? 'w-4 h-4' : 
                size === 'medium' ? 'w-3 h-3' : 'w-2 h-2'
              } bg-white rounded-full`}>
                <div className={`${
                  size === 'large' ? 'w-2 h-2' : 
                  size === 'medium' ? 'w-1.5 h-1.5' : 'w-1 h-1'
                } bg-blue-900 rounded-full mt-0.5 ml-0.5`}></div>
              </div>
              
              {/* Boca sonriente */}
              <div className={`absolute bottom-1/4 left-1/2 transform -translate-x-1/2 ${
                size === 'large' ? 'w-8 h-4' : 
                size === 'medium' ? 'w-6 h-3' : 'w-4 h-2'
              } bg-blue-600 rounded-full`}></div>
            </div>
            
            {/* Cuerpo */}
            <div className={`${
              size === 'large' ? 'w-20 h-16' : 
              size === 'medium' ? 'w-15 h-12' : 'w-10 h-8'
            } bg-gradient-to-br from-white to-blue-50 rounded-2xl border-4 border-blue-600 mx-auto mt-2 relative`}>
              {/* Medalla/Insignia */}
              <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 ${
                size === 'large' ? 'w-6 h-6' : 
                size === 'medium' ? 'w-4 h-4' : 'w-3 h-3'
              } bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center`}>
                <Star className={`${
                  size === 'large' ? 'h-3 w-3' : 
                  size === 'medium' ? 'h-2 w-2' : 'h-1.5 w-1.5'
                } text-white`} />
              </div>
              
              {/* Brazos */}
              <div className={`absolute -left-6 top-2 ${
                size === 'large' ? 'w-12 h-4' : 
                size === 'medium' ? 'w-9 h-3' : 'w-6 h-2'
              } bg-gradient-to-r from-blue-200 to-blue-300 rounded-full border-2 border-blue-600 flex items-center justify-end pr-1`}>
                <div className={`${
                  size === 'large' ? 'w-3 h-3' : 
                  size === 'medium' ? 'w-2 h-2' : 'w-1.5 h-1.5'
                } bg-blue-600 rounded-full`}></div>
              </div>
              <div className={`absolute -right-6 top-2 ${
                size === 'large' ? 'w-12 h-4' : 
                size === 'medium' ? 'w-9 h-3' : 'w-6 h-2'
              } bg-gradient-to-l from-blue-200 to-blue-300 rounded-full border-2 border-blue-600 flex items-center justify-start pl-1`}>
                <div className={`${
                  size === 'large' ? 'w-3 h-3' : 
                  size === 'medium' ? 'w-2 h-2' : 'w-1.5 h-1.5'
                } bg-blue-600 rounded-full`}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Efectos de partículas */}
        {size === 'large' && (
          <>
            <div className="absolute -top-4 -right-4 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute top-8 -left-6 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen simulator-bg overflow-hidden">
      {/* Navigation */}
      <nav className="glass fixed top-0 w-full z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <RobotMascot size="small" />
              <div className="brand-logo text-2xl">
                SalesCoach AI
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost" className="font-medium text-slate-700 hover:text-blue-600">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="btn-primary">
                  <Rocket className="mr-2 h-4 w-4" />
                  Empezar Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Elementos decorativos animados */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-yellow-200 rounded-full opacity-40 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`text-left space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <Badge variant="secondary" className="px-6 py-3 text-sm font-semibold bg-blue-50 text-blue-700 border-blue-200 animate-pulse">
                <Bot className="mr-2 h-4 w-4" />
                Potenciado por IA Avanzada
              </Badge>
              
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-800">
                Entrena tus ventas como un
                <span className="gradient-text block mt-2">
                  piloto practica en simulador
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed font-medium">
                Simulador de ventas con avatares realistas y feedback instantáneo con IA. 
                Mejora tus habilidades comerciales antes de enfrentarte a clientes reales.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="btn-primary px-10 py-5 text-xl font-bold shadow-2xl"
                    data-testid="get-started-btn"
                  >
                    <Play className="mr-3 h-6 w-6" />
                    Empezar Simulación Gratis
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="btn-secondary px-10 py-5 text-xl font-semibold border-2"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Ver Demo en Vivo
                </Button>
              </div>
            </div>
            
            {/* Mascota principal animada con burbujas de conversación */}
            <div className="flex justify-center lg:justify-end relative min-h-[400px]">
              <div className="relative w-full max-w-md flex items-center justify-center">
                <RobotMascot size="large" className="transform scale-125 relative z-10" />
                
                {/* Burbujas de conversación realistas - Diálogo Vendedor/Cliente */}
                <div className="absolute top-4 left-0 animate-float-slow">
                  <div className="bg-white rounded-2xl rounded-tl-none shadow-xl p-3 border-2 border-blue-200 max-w-[180px]">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 rounded-full p-1.5">
                        <MessageCircle className="h-3 w-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-blue-600 mb-0.5">Cliente</p>
                        <p className="text-xs text-slate-700">"Es muy caro..."</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-12 right-0 animate-float-delay">
                  <div className="bg-blue-600 rounded-2xl rounded-tr-none shadow-xl p-3 max-w-[200px]">
                    <div className="flex items-start gap-2">
                      <div className="bg-white/20 rounded-full p-1.5">
                        <Headphones className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/80 mb-0.5">Vendedor</p>
                        <p className="text-xs text-white">"¿Caro comparado con qué?"</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-12 left-4 animate-bounce-slow">
                  <div className="bg-green-600 rounded-2xl shadow-lg p-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                    <span className="text-xs font-bold text-white">¡Técnica SPIN!</span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-8 animate-pulse">
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <BarChart3 className="h-4 w-4 text-white" />
                      <span className="text-xs font-bold text-white">Score: 8.5/10</span>
                    </div>
                    <p className="text-xs text-white/80">¡Excelente!</p>
                  </div>
                </div>
                
                <div className="absolute bottom-24 right-0 animate-float">
                  <div className="bg-white rounded-full shadow-lg p-1.5 border-2 border-yellow-400">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section - Más ambiguo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 font-medium mb-8">Metodología utilizada por profesionales en empresas líderes del sector:</p>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-2xl font-bold text-slate-400">Tech Giants</div>
            <div className="text-2xl font-bold text-slate-400">Fortune 500</div>
            <div className="text-2xl font-bold text-slate-400">Startups</div>
            <div className="text-2xl font-bold text-slate-400">Scale-ups</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-8">
              El 90% de profesionales 
              <span className="gradient-text">no practican su habilidad más valiosa</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Mientras los deportistas entrenan diariamente, los vendedores practican solo cuando está en juego el negocio
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Miedo a vender",
                description: "Sin práctica segura, cada conversación genera ansiedad y pérdida de oportunidades valiosas.",
                color: "red",
                delay: "0ms"
              },
              {
                icon: Brain,
                title: "Falta de estructura",
                description: "Sin metodología clara, las conversaciones comerciales se vuelven impredecibles y poco efectivas.",
                color: "yellow",
                delay: "200ms"
              },
              {
                icon: BarChart3,
                title: "Cero feedback real",
                description: "Sin retroalimentación objetiva e inmediata, es imposible identificar y corregir errores.",
                color: "blue",
                delay: "400ms"
              }
            ].map((item, index) => (
              <Card 
                key={index}
                className="feature-card text-center p-8 border-2 hover:scale-105 transition-all duration-500"
                style={{animationDelay: item.delay}}
              >
                <CardHeader>
                  <div className={`w-20 h-20 bg-${item.color}-50 rounded-2xl flex items-center justify-center mx-auto mb-6 relative`}>
                    <item.icon className={`h-10 w-10 text-${item.color}-500`} />
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent animate-pulse"></div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 mb-4">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section - Dos secciones visuales diferentes */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-8">
              <span className="gradient-text">Entrena como un atleta</span> de élite
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Simulaciones hiperrealistas con IA que se adapta a tu estilo, avatares que desafían como clientes reales, 
              y feedback instantáneo para perfeccionar cada movimiento.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-12">
              {[
                {
                  icon: Target,
                  title: "Simulaciones Inteligentes",
                  description: "IA que se adapta a tu industria, tipo de cliente y objetivos específicos. Cada simulación es única y desafiante."
                },
                {
                  icon: Bot,
                  title: "Avatares Hiperrealistas",
                  description: "Clientes virtuales con personalidades reales, objeciones auténticas y comportamientos impredecibles como en la vida real."
                },
                {
                  icon: BarChart3,
                  title: "Feedback Instantáneo",
                  description: "Análisis en tiempo real de tu performance con métricas precisas y recomendaciones para mejorar inmediatamente."
                }
              ].map((feature, index) => (
                <div key={index} className={`flex items-start space-x-6 ${activeFeature === index ? 'scale-105' : ''} transition-all duration-500`}>
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 relative">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                    {activeFeature === index && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-pulse"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Simulador en Acción - Aquí irá tu grabación */}
            <div className="relative">
              <div className="card p-8 bg-gradient-to-br from-white/95 to-blue-50/90">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20"></div>
                  <div className="text-center z-10">
                    <div className="animate-pulse mb-6">
                      <Play className="h-24 w-24 text-blue-600 mx-auto" />
                    </div>
                    <p className="text-blue-700 font-bold text-xl">Simulador IA en Acción</p>
                    <p className="text-blue-600 mt-3">Aquí irá tu grabación de interacción</p>
                  </div>
                  <div className="absolute top-6 right-6">
                    <div className="animate-pulse">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
          
          {/* Segunda sección - Tu Gimnasio Personal */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Dashboard Visual / Conversación simulada */}
            <div className="relative order-2 lg:order-1">
              <div className="card p-8 bg-gradient-to-br from-white/95 to-purple-50/90">
                <div className="space-y-6">
                  {/* Simulación de dashboard de feedback */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <RobotMascot size="small" />
                      <div>
                        <p className="font-semibold text-slate-800">Análisis Completado</p>
                        <p className="text-sm text-slate-600">Simulación: Venta B2B - Objeciones</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">8.5/10</Badge>
                  </div>
                  
                  {/* Métricas visuales */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Escucha Activa", value: 85, color: "bg-blue-500" },
                      { label: "Manejo Objeciones", value: 72, color: "bg-green-500" },
                      { label: "Técnicas Cierre", value: 90, color: "bg-purple-500" },
                      { label: "Storytelling", value: 68, color: "bg-yellow-500" }
                    ].map((metric, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-slate-200">
                        <p className="text-xs font-medium text-slate-600 mb-1">{metric.label}</p>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`${metric.color} h-2 rounded-full transition-all duration-1000`}
                            style={{ width: `${metric.value}%` }}
                          ></div>
                        </div>
                        <p className="text-sm font-bold text-slate-800 mt-1">{metric.value}%</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mensaje de feedback */}
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Recomendación IA:</p>
                        <p className="text-sm text-blue-700">Excelente manejo de la objeción de precio. Considera añadir más historias de éxito para generar confianza.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <div className="flex items-center space-x-4">
                <RobotMascot size="medium" />
                <div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">Tu Gimnasio Personal</h3>
                  <p className="text-xl text-slate-600">Entrena 24/7 sin presión, recibe feedback detallado y ve tu progreso en tiempo real</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Activity, label: "Progreso", value: "Real Time" },
                  { icon: Headphones, label: "Avatares", value: "24/7" },
                  { icon: TrendingUp, label: "Mejora", value: "Constante" },
                  { icon: Shield, label: "Seguro", value: "100%" }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-xl border border-blue-200 hover:scale-105 transition-all">
                    <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-bold text-lg gradient-text">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Más dinámico */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-8">
              Resultados que <span className="gradient-text">transforman carreras</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Profesionales de ventas mejoran sus habilidades comerciales en un entorno seguro y efectivo
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Práctica Sin Riesgo",
                description: "Entrena en un entorno seguro donde los errores se convierten en aprendizaje sin consecuencias.",
                metric: "∞",
                metricLabel: "Intentos ilimitados"
              },
              {
                icon: Brain,
                title: "IA Personalizada",
                description: "Feedback adaptado a tu industria, estilo y objetivos específicos para maximizar tu crecimiento.",
                metric: "95%",
                metricLabel: "Precisión en análisis"
              },
              {
                icon: BarChart3,
                title: "Progreso Medible",
                description: "Dashboard detallado que muestra tu evolución en tiempo real con métricas específicas.",
                metric: "+40%",
                metricLabel: "Mejora promedio reportada"
              }
            ].map((benefit, index) => (
              <Card key={index} className="feature-card p-8 text-center group hover:scale-105 transition-all duration-500">
                <CardHeader>
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                    <benefit.icon className="h-10 w-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 mb-4">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    {benefit.description}
                  </p>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">{benefit.metric}</div>
                    <p className="text-sm text-slate-500 mt-1">{benefit.metricLabel}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90"></div>
        
        {/* Elementos flotantes decorativos */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-1/4">
            <RobotMascot size="medium" className="opacity-20" />
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-8">
            No esperes más. Cada día sin entrenar es una oportunidad perdida.
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Únete a profesionales que ya transforman su forma de vender con SalesCoach AI
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-6 text-xl font-bold shadow-2xl hover:scale-105 transition-all"
              >
                <Rocket className="mr-3 h-6 w-6" />
                Comenzar Entrenamiento Gratis
              </Button>
            </Link>
            <div className="text-blue-100 text-sm">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span>Acceso inmediato</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <RobotMascot size="small" className="brightness-200" />
                <div className="brand-logo text-white text-2xl">
                  SalesCoach AI
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                La plataforma de entrenamiento en ventas más avanzada, diseñada por expertos para profesionales ambiciosos.
              </p>
              <Badge className="bg-blue-600 text-white px-3 py-1">
                <Bot className="mr-2 h-4 w-4" />
                Potenciado por IA
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-6">Producto</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">Simulaciones</li>
                <li className="hover:text-white transition-colors cursor-pointer">Feedback IA</li>
                <li className="hover:text-white transition-colors cursor-pointer">Dashboard</li>
                <li className="hover:text-white transition-colors cursor-pointer">Análisis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-6">Soporte</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">Centro de Ayuda</li>
                <li className="hover:text-white transition-colors cursor-pointer">Tutoriales</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contacto</li>
                <li className="hover:text-white transition-colors cursor-pointer">Status</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-6">Empresa</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">Acerca de</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacidad</li>
                <li className="hover:text-white transition-colors cursor-pointer">Términos</li>
              </ul>
            </div>
          </div>
          <Separator className="my-12 bg-slate-700" />
          <div className="text-center">
            <p className="text-slate-400 text-lg">
              © 2024 SalesCoach AI. Transformando profesionales de ventas con IA avanzada.
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Hecho con ❤️ para vendedores ambiciosos
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;