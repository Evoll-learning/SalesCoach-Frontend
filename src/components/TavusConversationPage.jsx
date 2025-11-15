import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Loader2, 
  Phone, 
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';



const TavusConversationPage = ({ user }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [conversationData, setConversationData] = useState(null);
  const [tavusLoaded, setTavusLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const iframeRef = useRef(null);
  const endHandledRef = useRef(false);

  // tRPC hooks
  const generateFeedbackMutation = trpc.feedback.generate.useMutation();
  const endConversationMutation = trpc.conversations.end.useMutation();
  
  // Poll conversation status using tRPC
  const conversationId = searchParams.get('id');
  const { data: conversationStatus } = trpc.conversations.getById.useQuery(
    { conversationId: parseInt(conversationId) },
    {
      enabled: !!conversationId && !!conversationData && !conversationEnded && !endHandledRef.current,
      refetchInterval: 2000, // Poll every 2 seconds
    }
  );

  // Watch for conversation end
  useEffect(() => {
    if (conversationStatus?.status === 'ended' && !endHandledRef.current) {
      endHandledRef.current = true;
      handleConversationEnded();
    }
  }, [conversationStatus]);

  useEffect(() => {
    const conversationId = searchParams.get('id');
    const tavusUrl = searchParams.get('url');

    if (!conversationId || !tavusUrl) {
      setError('Missing conversation data');
      setLoading(false);
      return;
    }

    setConversationData({
      conversation_id: conversationId,
      conversation_url: tavusUrl
    });
    setLoading(false);
  }, [searchParams]);



  const handleConversationEnded = async () => {
    setConversationEnded(true);
    setGeneratingFeedback(true);
    
    toast.info('Conversación finalizada. Generando feedback...');
    
    try {
      // Force feedback generation with tRPC
      await generateFeedbackMutation.mutateAsync({
        conversationId: conversationData.conversation_id
      });
      
      // Wait a bit for feedback to be ready, then redirect to feedback page directly
      setTimeout(() => {
        toast.success('Redirigiendo a tu feedback...');
        navigate(`/feedback?id=${conversationData.conversation_id}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast.error('Error al generar feedback. Volviendo al dashboard...');
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 2000);
    }
  };

  const handleTavusLoad = () => {
    setTavusLoaded(true);
    toast.success('Avatar conectado y listo');
  };

  const handleTavusError = () => {
    setError('Error loading Tavus conversation');
    toast.error('Error al cargar el avatar');
  };

  const handleEndConversation = async () => {
    if (!conversationData || endHandledRef.current) return;
    endHandledRef.current = true;

    try {
      setLoading(true);
      await endConversationMutation.mutateAsync({
        conversationId: parseInt(conversationData.conversation_id)
      });
      
      handleConversationEnded();
      
    } catch (error) {
      console.error('Error ending conversation:', error);
      toast.error('Error al finalizar la simulación');
      endHandledRef.current = false;
      setLoading(false);
    }
  };

  if (loading || generatingFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            {generatingFeedback ? (
              <>
                <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Generando Feedback</h3>
                <p className="text-gray-600 mb-4">
                  Estamos analizando tu conversación con IA. Esto toma entre 10-30 segundos.
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                </div>
              </>
            ) : (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Cargando simulación...</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/simulator')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al simulador
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                En vivo
              </Badge>
              {tavusLoaded && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Avatar conectado
                </Badge>
              )}
            </div>
            
            <Button 
              onClick={handleEndConversation}
              disabled={loading}
              variant="destructive"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" />
                  Finalizar Simulación
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tavus Iframe - Full screen */}
      <div className="w-full h-[calc(100vh-72px)]">
        {conversationData?.conversation_url && (
          <iframe
            ref={iframeRef}
            src={conversationData.conversation_url}
            className="w-full h-full border-0"
            allow="camera; microphone; display-capture; clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
            onLoad={handleTavusLoad}
            onError={handleTavusError}
            title="Tavus Conversation"
          />
        )}
        
        {!tavusLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Conectando con el avatar...</p>
              <p className="text-gray-400 text-sm mt-2">Esto puede tomar unos segundos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TavusConversationPage;
