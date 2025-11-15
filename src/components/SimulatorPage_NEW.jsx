import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Bot,
  UserCheck,
  Globe,
  Upload,
  FileText,
  X,
  Languages
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '../lib/trpc';

const SimulatorPage = ({ user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup'); // setup, permissions, active, feedback, waiting
  const [loading, setLoading] = useState(false);
  const [conversationData, setConversationData] = useState(null);
  const [mediaPermissions, setMediaPermissions] = useState({ camera: false, microphone: false });
  const [permissionError, setPermissionError] = useState('');
  const [tavusLoaded, setTavusLoaded] = useState(false);
  const iframeRef = useRef(null);
  const [formData, setFormData] = useState({
    conversationName: '',
    simulationType: '',
    objective: '',
    leadTemperature: '',
    avatarGender: '',
    language: '',
    salesType: '', // B2B or B2C
    productService: '', // product or service
    sectorCode: '', // Sector selection
    customSector: '', // Custom sector name when OTHER is selected
    customScenario: '',
    supportDocuments: []
  });

  // tRPC hooks
  const { data: sectorsData, isLoading: sectorsLoading } = trpc.sectors.list.useQuery();
  const createSimulationMutation = trpc.simulations.create.useMutation();
  const createConversationMutation = trpc.conversations.create.useMutation();
  const endConversationMutation = trpc.conversations.end.useMutation();

  const sectors = sectorsData || [];

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
      name: 'Manejar Objeciones',
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

  const avatarOptions = [
    {
      id: 'female',
      name: 'Avatar Femenino',
      description: 'Persona profesional femenina',
      icon: '👩‍💼'
    },
    {
      id: 'male', 
      name: 'Avatar Masculino',
      description: 'Persona profesional masculina',
      icon: '👨‍💼'
    }
  ];

  const languageOptions = [
    {
      id: 'es',
      name: 'Castellano',
      description: 'Simulación en español',
      flag: '🇪🇸'
    },
    {
      id: 'en',
      name: 'English',
      description: 'Simulation in English',
      flag: '🇺🇸'
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
      // 1. Crear simulación
      const simulation = await createSimulationMutation.mutateAsync(formData);
      
      // 2. Crear conversación con Tavus
      const conversation = await createConversationMutation.mutateAsync({
        simulationId: simulation.id
      });
      
      setConversationData(conversation);
      
      // Open Tavus in NEW WINDOW (not iframe or same window)
      if (conversation.conversation_url && !conversation.conversation_url.includes('demo.tavus.io')) {
        toast.success('¡Simulación creada! Abriendo en nueva ventana...');
        
        // Open Tavus URL in new tab/window - CRITICAL for camera/mic permissions
        window.open(conversation.conversation_url, '_blank', 'noopener,noreferrer');
        
        // Change to "waiting" state with clear instructions
        setStep('waiting');
      } else {
        // Fallback for demo mode
        toast.warning('Modo demo activado');
        setStep('active');
      }
      
    } catch (error) {
      toast.error('Error al iniciar la simulación: ' + (error.message || 'Error desconocido'));
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
      await endConversationMutation.mutateAsync({
        conversationId: conversationData.conversation_id
      });
      
      setStep('feedback');
      toast.success('Simulación finalizada. Generando feedback...');
      
      // Redirect to feedback page
      navigate(`/feedback?conversationId=${conversationData.conversation_id}`);
      
    } catch (error) {
      toast.error('Error al finalizar la simulación');
      console.error('End simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar carga de documentos
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    // Validar archivos antes de subirlos
    const validFiles = files.filter(file => {
      const isValidType = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      toast.error('No hay archivos válidos para subir');
      return;
    }

    if (validFiles.length !== files.length) {
      toast.warning('Algunos archivos no son válidos. Solo se permiten PDF, TXT, DOC, DOCX hasta 10MB.');
    }

    // TODO: Implementar subida de documentos con tRPC
    // Por ahora, solo guardamos los nombres de archivos
    const fileNames = validFiles.map(f => f.name);
    setFormData(prev => ({
      ...prev,
      supportDocuments: [...prev.supportDocuments, ...fileNames]
    }));

    toast.success(`${validFiles.length} archivo(s) añadido(s)`);
  };

  const removeDocument = (index) => {
    const newDocs = formData.supportDocuments.filter((_, i) => i !== index);
    setFormData({...formData, supportDocuments: newDocs});
    toast.success('Documento eliminado');
  };

  const canStart = () => {
    return formData.simulationType && 
           formData.objective && 
           formData.leadTemperature &&
           formData.salesType &&
           formData.productService &&
           formData.sectorCode &&
           formData.avatarGender && 
           formData.language;
  };

  // Render functions for each step...
  // (Continuará en la siguiente parte)
