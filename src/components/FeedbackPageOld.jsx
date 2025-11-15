import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Trophy, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  BarChart3,
  Star,
  Bot,
  Download,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FeedbackPage = ({ user }) => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get('id');
  const [feedback, setFeedback] = useState(null);
  const [rubrics, setRubrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbackAndRubrics();
  }, [conversationId]);

  const fetchFeedbackAndRubrics = async () => {
    try {
      // Fetch feedback - this is the critical one
      const feedbackResponse = await axios.get(`${API}/simulations/conversations/${conversationId}/feedback`);
      setFeedback(feedbackResponse.data);
      
      // Try to fetch rubrics, but don't fail if unavailable
      try {
        const rubricsResponse = await axios.get(`${API}/feedback/rubrics`);
        setRubrics(rubricsResponse.data);
      } catch (rubricsError) {
        console.log('Rubrics not available, using default feedback display');
        setRubrics(null);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      if (error.response?.status === 404) {
        toast.error('El feedback aún no está disponible. Por favor espera unos segundos y recarga la página.');
      } else {
        toast.error('Error al cargar el feedback: ' + (error.response?.data?.detail || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-green-50 border-green-200';
    if (score >= 6) return 'bg-yellow-50 border-yellow-200';
    if (score >= 4) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreText = (score) => {
    if (score >= 9) return 'Excelente';
    if (score >= 7) return 'Bueno';
    if (score >= 5) return 'Competente';
    if (score >= 3) return 'En desarrollo';
    return 'Necesita mejora';
  };

  if (loading) {
    return (
      <div className="min-h-screen simulator-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando tu feedback...</p>
        </div>
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
              El análisis se está procesando. Esto suele tomar entre 10-30 segundos después de terminar la conversación.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchFeedbackAndRubrics} className="btn-primary">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Recargar
              </Button>
              <Link to="/dashboard">
                <Button variant="outline">
                  Volver al Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
              <span className="brand-logo">SalesCoach AI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="btn-secondary">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" className="btn-secondary">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${getScoreBgColor(feedback.overall_score)}`}>
              <Trophy className={`h-12 w-12 ${getScoreColor(feedback.overall_score)}`} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Análisis de Performance
          </h1>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`text-4xl font-bold ${getScoreColor(feedback.overall_score)}`}>
              {feedback.overall_score}/10
            </div>
            <Badge className={getScoreBgColor(feedback.overall_score).replace('bg-', '').replace('-50', '-100').replace('border-', 'text-').replace('-200', '-800')}>
              {getScoreText(feedback.overall_score)}
            </Badge>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Basado en el análisis de tu simulación usando rúbricas profesionales de ventas
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="card p-6 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {Object.keys(feedback.feedback_scores || {}).length}
            </div>
            <p className="text-sm text-slate-600">Criterios Evaluados</p>
          </Card>
          
          <Card className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {feedback.strengths?.length || 0}
            </div>
            <p className="text-sm text-slate-600">Fortalezas</p>
          </Card>
          
          <Card className="card p-6 text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {feedback.improvement_areas?.length || 0}
            </div>
            <p className="text-sm text-slate-600">Áreas de Mejora</p>
          </Card>
          
          <Card className="card p-6 text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {feedback.specific_suggestions?.length || 0}
            </div>
            <p className="text-sm text-slate-600">Sugerencias</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Detailed Scores */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Puntuación Detallada por Criterios
                </CardTitle>
                <CardDescription>
                  Evaluación basada en rúbricas profesionales de ventas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rubrics?.categories?.map((category) => {
                  const scoreKey = category.id;
                  const score = feedback.feedback_scores?.[scoreKey] || 0;
                  
                  return (
                    <div key={category.id} className="mb-6 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-800">{category.name}</h4>
                          <p className="text-sm text-slate-600">{category.description}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                            {score.toFixed(1)}
                          </div>
                          <div className="text-xs text-slate-500">
                            Peso: {category.weight}%
                          </div>
                        </div>
                      </div>
                      <Progress value={score * 10} className="h-3" />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>1 (Necesita mejora)</span>
                        <span>10 (Excelente)</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Feedback Text */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5" />
                  Análisis Detallado IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-slate-700 leading-relaxed">
                    {feedback.feedback_text}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Strengths */}
            {feedback.strengths && feedback.strengths.length > 0 && (
              <Card className="card">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Fortalezas Identificadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Star className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Improvement Areas */}
            {feedback.improvement_areas && feedback.improvement_areas.length > 0 && (
              <Card className="card">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-600">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Áreas de Mejora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feedback.improvement_areas.map((area, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Target className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Specific Suggestions */}
            {feedback.specific_suggestions && feedback.specific_suggestions.length > 0 && (
              <Card className="card">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-600">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Sugerencias Específicas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feedback.specific_suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                        </div>
                        <span className="text-sm text-slate-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Next Practice Focus */}
            {feedback.next_practice_focus && (
              <Card className="card border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-600">
                    <Target className="mr-2 h-5 w-5" />
                    Próxima Práctica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 mb-4">
                    {feedback.next_practice_focus}
                  </p>
                  <Link to="/simulator">
                    <Button className="w-full btn-primary">
                      <Play className="mr-2 h-4 w-4" />
                      Nueva Simulación
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;