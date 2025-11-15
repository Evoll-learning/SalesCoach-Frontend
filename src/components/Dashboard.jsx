import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  Play, 
  BarChart3, 
  LogOut, 
  Settings,
  Clock,
  Bot,
  Trophy,
  TrendingUp,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ user, onLogout }) => {
  const { data: stats, isLoading: loading } = trpc.dashboard.stats.useQuery();

  const getSubscriptionBadge = () => {
    return <Badge variant="secondary" className="font-semibold">Prueba Gratuita</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen simulator-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando tu entrenamiento...</p>
        </div>
      </div>
    );
  }

  // Datos para gráficos
  const overallScoreData = [
    { name: 'Score', value: stats.averageScore },
    { name: 'Remaining', value: 100 - stats.averageScore }
  ];

  const rubricData = [
    { name: 'SPIN', score: stats.scoresByRubric.spin, fullName: 'SPIN Selling' },
    { name: 'BANT', score: stats.scoresByRubric.bant, fullName: 'BANT' },
    { name: 'Challenger', score: stats.scoresByRubric.challenger, fullName: 'Challenger Sale' },
    { name: 'General', score: stats.scoresByRubric.general, fullName: 'Habilidades Generales' },
  ];

  const feedbackData = [
    { name: 'Fortalezas', value: stats.feedbackDistribution.strengths },
    { name: 'Promedio', value: stats.feedbackDistribution.average },
    { name: 'Mejora', value: stats.feedbackDistribution.weaknesses },
  ];

  const COLORS = {
    primary: '#3B82F6', // blue-500
    secondary: '#10B981', // green-500
    tertiary: '#F59E0B', // amber-500
    quaternary: '#8B5CF6', // violet-500
    light: '#E0F2FE', // sky-100
  };

  return (
    <div className="min-h-screen simulator-bg">
      {/* Navigation */}
      <nav className="glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="brand-logo">
              SalesCoach AI
            </div>
            
            <div className="flex items-center space-x-6">
              {getSubscriptionBadge()}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full border-2 border-blue-100 hover:border-blue-300">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-4">
                  <div className="px-2 py-3">
                    <p className="text-lg font-semibold text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="py-3 cursor-pointer">
                    <Settings className="mr-3 h-5 w-5" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout} className="py-3 cursor-pointer text-red-600">
                    <LogOut className="mr-3 h-5 w-5" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {user.name}
              </h1>
              <p className="text-lg text-slate-600">
                Sales Training Performance
              </p>
            </div>
            <Link to="/simulator">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all">
                <Play className="mr-2 h-5 w-5" />
                Nueva Simulación
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass border-white/20 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Conversaciones</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalConversations}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/20 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Mejor Puntuación</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.bestScore}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/20 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Mejora</p>
                  <p className="text-3xl font-bold text-slate-900">+{stats.improvementRate}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/20 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Racha</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.currentStreak} días</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Overall Score - Circular */}
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Puntuación General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={overallScoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill={COLORS.primary} />
                      <Cell fill="#E2E8F0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-slate-900">{stats.averageScore}%</div>
                    <div className="text-sm text-slate-600 mt-1">Promedio</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Distribution */}
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Distribución de Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={feedbackData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill={COLORS.secondary} />
                    <Cell fill={COLORS.primary} />
                    <Cell fill={COLORS.tertiary} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance by Rubric - Full Width */}
        <Card className="glass border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Rendimiento por Metodología</CardTitle>
            <CardDescription className="text-slate-600">
              Puntuación por cada metodología de ventas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={rubricData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" />
                <YAxis type="category" dataKey="fullName" stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="score" fill={COLORS.primary} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <Activity className="mr-3 h-6 w-6 text-blue-600" />
              Conversaciones Recientes
            </CardTitle>
            <CardDescription className="text-slate-600">
              Tus últimas prácticas de venta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentConversations && stats.recentConversations.length > 0 ? (
              <div className="space-y-4">
                {stats.recentConversations.map((conversation, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-50 rounded-full">
                        <Bot className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{conversation.conversationName}</h3>
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(conversation.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="font-semibold">
                        {conversation.simulationType}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bot className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-4">Aún no tienes conversaciones</p>
                <Link to="/simulator">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Play className="mr-2 h-5 w-5" />
                    Iniciar Primera Simulación
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
