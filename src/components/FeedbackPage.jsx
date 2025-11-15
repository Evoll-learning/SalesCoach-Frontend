import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Star,
  MessageSquare,
  BarChart3,
  Clock,
  Target,
  Lightbulb,
  Activity,
  Users,
  Shield,
  Share2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';



const FeedbackPage = () => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get('id');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 10;

  // tRPC hooks
  const { data: feedback, isLoading, error, refetch } = trpc.feedback.getByConversationId.useQuery(
    { conversationId: parseInt(conversationId) },
    { 
      enabled: !!conversationId,
      retry: false,
      refetchInterval: (data) => {
        // Si no hay feedback aún, reintentar cada 2 segundos hasta 10 veces
        if (!data && retryCount < maxRetries) {
          return 2000;
        }
        return false;
      },
      onError: (err) => {
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          toast.info(`Generando feedback... Intento ${retryCount + 1}/${maxRetries}`);
        } else {
          toast.error('El feedback está tardando más de lo esperado. Por favor recarga la página.');
        }
      }
    }
  );

  const loading = isLoading;

  if (loading) {
    return (
      <div className="min-h-screen simulator-bg flex items-center justify-center">
        <Card className="card max-w-md w-full mx-4">
          <CardContent className="text-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium mb-2">Generando tu análisis con IA...</p>
            <p className="text-slate-500 text-sm">Esto puede tomar entre 10-30 segundos</p>
            {retryCount > 0 && (
              <p className="text-blue-600 text-sm mt-2">Intento {retryCount}/{maxRetries}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen simulator-bg flex items-center justify-center">
        <Card className="card max-w-md w-full mx-4">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Feedback aún no disponible</h3>
            <p className="text-slate-600 mb-6">
              El análisis se está procesando. Esto suele tomar entre 10-30 segundos.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchFeedback} className="btn-primary">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Recargar
              </Button>
              <Link to="/dashboard">
                <Button variant="outline">Volver al Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Preparar datos para gráficos
  const radarData = Object.entries(feedback.scores_by_category || {}).map(([key, value]) => ({
    subject: key.replace(/_/g, ' ').toUpperCase(),
    score: value,
    fullMark: 10
  }));

  const pieData = [
    { name: 'Vendedor', value: feedback.talk_ratio?.seller || 50, color: '#3b82f6' },
    { name: 'Cliente', value: feedback.talk_ratio?.client || 50, color: '#10b981' }
  ];

  const timelineData = (feedback.timeline_events || []).map(event => ({
    time: event.timestamp,
    score: event.score,
    emotion: event.emotion,
    type: event.type
  }));

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'brilliant': return '⭐';
      case 'error': return '🔴';
      case 'good': return '✅';
      case 'signal': return '🚨';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen simulator-bg">
      {/* Navigation */}
      <nav className="glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver al Dashboard</span>
            </Link>
            <Button onClick={fetchFeedback} variant="outline" size="sm">
              Recargar Análisis
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Score General */}
        <Card className="card mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Tu Puntuación</h1>
              <div className={`text-7xl font-bold mb-4 ${getScoreColor(feedback.overall_score)}`}>
                {feedback.overall_score}/10
              </div>
              <p className="text-lg text-slate-600">
                {feedback.overall_score >= 8 ? '¡Excelente desempeño!' : 
                 feedback.overall_score >= 6 ? 'Buen trabajo con margen de mejora' :
                 'Necesitas practicar más estas técnicas'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos Principales */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Spider Chart - Scores por Categoría */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Análisis por Habilidad
              </CardTitle>
              <CardDescription>Identifica tus áreas fuertes y débiles</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar name="Tu Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - Ratio de Habla */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                Ratio de Conversación
              </CardTitle>
              <CardDescription>
                Ideal: 40% Vendedor / 60% Cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                {feedback.talk_ratio?.seller > 50 ? (
                  <p className="text-sm text-red-600">⚠️ Hablas demasiado - Escucha más al cliente</p>
                ) : feedback.talk_ratio?.seller >= 38 && feedback.talk_ratio?.seller <= 42 ? (
                  <p className="text-sm text-green-600">✅ Ratio ideal - Excelente equilibrio</p>
                ) : (
                  <p className="text-sm text-yellow-600">⚠️ Mejorable - Apunta al 40/60</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Interactivo */}
        {timelineData.length > 0 && (
          <Card className="card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Línea de Tiempo de la Conversación
              </CardTitle>
              <CardDescription>
                Cómo tu desempeño afectó la dificultad del cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" name="Tu Score" strokeWidth={2} />
                  <Line type="monotone" dataKey="emotion" stroke="#ef4444" name="Dificultad Cliente" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>

              {/* Eventos del Timeline */}
              <div className="mt-6 space-y-3">
                {(feedback.timeline_events || []).map((event, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 p-3 rounded-lg border-2 hover:border-blue-300 cursor-pointer transition-all"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <span className="text-2xl">{getEventIcon(event.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono text-xs">
                          {event.timestamp}
                        </Badge>
                        <span className="text-sm font-semibold capitalize">{event.type}</span>
                      </div>
                      <p className="text-sm text-slate-600">{event.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">Score: {event.score}/10</div>
                      <div className="text-xs text-slate-500">Dificultad: {event.emotion}/10</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* NUEVO: Cronómetro de Estructura (Farmacia/Telcos) */}
        {feedback.conversation?.sector_code && ['farmacia', 'telco'].includes(feedback.conversation?.sector_code) && feedback.structure_analysis && (
          <Card className="card mb-8 border-purple-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Clock className="h-5 w-5" />
                Análisis de Estructura Temporal
              </CardTitle>
              <CardDescription>
                {feedback.conversation?.sector_code === 'farmacia' ? 
                  'Visita Médica de 7 Pasos - Objetivo: 2-5 minutos' :
                  'Llamada Comercial Estructurada - Objetivo: 3-8 minutos'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(feedback.structure_analysis.phases || []).map((phase, idx) => {
                  const isOvertime = phase.actual_time > phase.target_time;
                  const isSkipped = phase.actual_time === 0;
                  const percentage = (phase.actual_time / phase.target_time) * 100;
                  
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={isSkipped ? 'destructive' : isOvertime ? 'warning' : 'default'}>
                            {idx + 1}
                          </Badge>
                          <span className="font-semibold text-sm">{phase.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-mono ${isOvertime ? 'text-red-600' : isSkipped ? 'text-orange-600' : 'text-green-600'}`}>
                            {isSkipped ? 'OMITIDO' : `${phase.actual_time}s / ${phase.target_time}s`}
                          </span>
                          {isOvertime && <span className="text-red-600">🔴</span>}
                          {isSkipped && <span className="text-orange-600">⚠️</span>}
                          {!isOvertime && !isSkipped && <span className="text-green-600">✓</span>}
                        </div>
                      </div>
                      
                      {/* Barra de progreso */}
                      <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`absolute left-0 top-0 h-full transition-all ${
                            isSkipped ? 'bg-orange-500' :
                            isOvertime ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                        {/* Línea objetivo */}
                        {percentage > 100 && (
                          <div className="absolute left-full top-0 h-full w-0.5 bg-red-700" style={{ left: '100%' }} />
                        )}
                      </div>
                      
                      {phase.notes && (
                        <p className="text-xs text-slate-600 italic">{phase.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Resumen de tiempo total */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Tiempo Total:</span>
                  <span className="text-lg font-bold">{feedback.structure_analysis.total_time}s</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600 mt-1">
                  <span>Objetivo:</span>
                  <span>{feedback.structure_analysis.target_total_time}s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* NUEVO: Índice de Confianza Post-Venta y Referidos */}
        {feedback.relationship_metrics && (
          <Card className="card mb-8 border-blue-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Users className="h-5 w-5" />
                Métricas de Relación a Largo Plazo
              </CardTitle>
              <CardDescription>
                Confianza post-venta y potencial de referidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Índice de Confianza Post-Venta */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    Índice de Confianza Post-Venta
                  </h4>
                  <div className="relative">
                    <div className="text-4xl font-bold text-center mb-2">
                      {feedback.relationship_metrics.trust_index}/10
                    </div>
                    <ResponsiveContainer width="100%" height={100}>
                      <PieChart>
                        <Pie
                          data={[
                            { value: feedback.relationship_metrics.trust_index, fill: '#10b981' },
                            { value: 10 - feedback.relationship_metrics.trust_index, fill: '#e5e7eb' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={40}
                          startAngle={180}
                          endAngle={0}
                          dataKey="value"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Factores de confianza */}
                  <div className="space-y-2 text-sm">
                    {feedback.relationship_metrics.trust_factors?.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={factor.present ? 'text-green-600' : 'text-red-600'}>
                          {factor.present ? '✓' : '✗'}
                        </span>
                        <span>{factor.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Potencial de Referidos */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-purple-600" />
                    Potencial de Referidos
                  </h4>
                  <div className="relative">
                    <div className="text-4xl font-bold text-center mb-2">
                      {feedback.relationship_metrics.referral_potential}/10
                    </div>
                    <ResponsiveContainer width="100%" height={100}>
                      <PieChart>
                        <Pie
                          data={[
                            { value: feedback.relationship_metrics.referral_potential, fill: '#8b5cf6' },
                            { value: 10 - feedback.relationship_metrics.referral_potential, fill: '#e5e7eb' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={40}
                          startAngle={180}
                          endAngle={0}
                          dataKey="value"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Acciones de referido */}
                  <div className="space-y-2 text-sm">
                    {feedback.relationship_metrics.referral_actions?.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={action.done ? 'text-green-600' : 'text-orange-600'}>
                          {action.done ? '✓' : '○'}
                        </span>
                        <span>{action.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fortalezas */}
        <Card className="card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Tus Fortalezas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(feedback.strengths || []).map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-slate-700">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Áreas de Mejora */}
        <Card className="card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Áreas de Mejora Críticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(feedback.areas_for_improvement || []).map((area, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-red-600 mt-1 font-bold">⚠</span>
                  <span className="text-slate-700">{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Sugerencias */}
        <Card className="card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Lightbulb className="h-5 w-5" />
              Sugerencias para Tu Próxima Simulación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(feedback.suggestions || []).map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mt-1">💡</span>
                  <span className="text-slate-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* NUEVO: Frameworks Visuales - Analogías y Storytelling */}
        {(feedback.analogies || feedback.storytelling) && (
          <Card className="card mb-6 border-indigo-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600">
                <Sparkles className="h-5 w-5" />
                Frameworks de Persuasión Detectados
              </CardTitle>
              <CardDescription>
                Técnicas avanzadas que simplificaron conceptos complejos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Analogías Detectadas */}
                {feedback.analogies && feedback.analogies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-blue-600">
                      <BookOpen className="h-4 w-4" />
                      Analogías Usadas ({feedback.analogies.length})
                    </h4>
                    {feedback.analogies.map((analogy, idx) => (
                      <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{analogy.icon || '💡'}</div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">{analogy.concept}</p>
                            <p className="text-sm text-slate-700 italic">"{analogy.analogy_used}"</p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge className="bg-green-600 text-xs">
                                Impacto: +{analogy.impact_score}/10
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Storytelling Clínico */}
                {feedback.storytelling && feedback.storytelling.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-purple-600">
                      <MessageSquare className="h-4 w-4" />
                      Storytelling Detectado ({feedback.storytelling.length})
                    </h4>
                    {feedback.storytelling.map((story, idx) => (
                      <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="space-y-2">
                          <p className="font-semibold text-sm">{story.story_title}</p>
                          <p className="text-xs text-slate-600">{story.summary}</p>
                          {story.human_impact && (
                            <div className="mt-2 p-2 bg-white rounded border border-purple-300">
                              <p className="text-xs font-semibold text-purple-900">
                                💜 Impacto Humano
                              </p>
                              <p className="text-xs text-slate-700">{story.human_impact}</p>
                            </div>
                          )}
                          {story.structure_score && (
                            <Badge className="bg-purple-600 text-xs mt-2">
                              Estructura: {story.structure_score}/10
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Score de Persuasión General */}
              {feedback.persuasion_score && (
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-900">
                      Índice de Persuasión Aplicada:
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {feedback.persuasion_score}/10
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Combina el uso efectivo de analogías, storytelling y sesgos psicológicos
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Momento Brillante */}
        {feedback.moment_brillant && (
          <Card className="card mb-6 border-yellow-400 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <Star className="h-5 w-5" />
                ⭐ Momento Brillante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {feedback.moment_brillant.timestamp}
                  </Badge>
                </div>
                <p className="text-lg font-semibold">{feedback.moment_brillant.description}</p>
                <p className="text-slate-600"><strong>Impacto:</strong> {feedback.moment_brillant.impact}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sistema Adaptativo */}
        {feedback.adaptive_analysis && (
          <Card className="card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Análisis del Sistema Adaptativo
              </CardTitle>
              <CardDescription>
                Cómo tus técnicas afectaron al cliente en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Dificultad Inicial:</span>
                  <Badge className="bg-red-600">{feedback.adaptive_analysis.initial_difficulty}/10</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Dificultad Final:</span>
                  <Badge className={feedback.adaptive_analysis.final_difficulty < feedback.adaptive_analysis.initial_difficulty ? 'bg-green-600' : 'bg-orange-600'}>
                    {feedback.adaptive_analysis.final_difficulty}/10
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {(feedback.adaptive_analysis.reactions || []).map((reaction, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="font-mono">{reaction.timestamp}</Badge>
                      <Badge className={reaction.difficulty_change > 0 ? 'bg-red-600' : 'bg-green-600'}>
                        {reaction.difficulty_change > 0 ? '+' : ''}{reaction.difficulty_change}
                      </Badge>
                    </div>
                    <p className="text-sm mb-1"><strong>Tu acción:</strong> {reaction.action}</p>
                    <p className="text-sm text-slate-600"><strong>Reacción del cliente:</strong> {reaction.reaction}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones de Acción */}
        <div className="flex gap-4 justify-center">
          <Link to="/simulator">
            <Button className="btn-primary">
              <TrendingUp className="h-4 w-4 mr-2" />
              Nueva Simulación
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Ver Todas mis Simulaciones</Button>
          </Link>
        </div>
      </div>

      {/* Modal para Evento Seleccionado */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <Card className="card max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{getEventIcon(selectedEvent.type)}</span>
                {selectedEvent.type.toUpperCase()} - Minuto {selectedEvent.timestamp}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-sm text-slate-600">Tu Score</span>
                  <div className="text-2xl font-bold">{selectedEvent.score}/10</div>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Dificultad Cliente</span>
                  <div className="text-2xl font-bold">{selectedEvent.emotion}/10</div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setSelectedEvent(null)}>Cerrar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
