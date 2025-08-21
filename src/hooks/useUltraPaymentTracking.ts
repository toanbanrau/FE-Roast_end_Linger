import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getPaymentStatus,
  type PaymentStatusResponse
} from '../services/paymentService';

interface PhaseInfo {
  name: string;
  interval: number;
  duration: number;
  icon: string;
  description: string;
}



interface UseUltraPaymentTrackingOptions {
  onPaymentCompleted?: (data: PaymentStatusResponse) => void;
  onPaymentFailed?: (data: PaymentStatusResponse) => void;
  onStatusUpdate?: (data: PaymentStatusResponse) => void;
  maxTotalTime?: number; // 5 minutes default
}

interface UseUltraPaymentTrackingReturn {
  status: 'pending' | 'completed' | 'failed';
  loading: boolean;
  error: string | null;
  phase: number;
  phaseInfo: PhaseInfo;
  timeElapsed: number;
  checkCount: number;
  manualCheck: () => Promise<void>;
}

/**
 * Ultra-Fast Payment Tracking Hook
 * 4-Phase Lightning Detection System theo SEPAY Integration Guide
 */
export const useUltraPaymentTracking = (
  paymentId: number | null,
  options: UseUltraPaymentTrackingOptions = {}
): UseUltraPaymentTrackingReturn => {
  const {
    onPaymentCompleted,
    onPaymentFailed,
    onStatusUpdate,
    maxTotalTime = 300000, // 5 minutes
  } = options;

  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [checkCount, setCheckCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  // Đơn giản hóa: chỉ 1 phase với interval 5 giây
  const phases: PhaseInfo[] = [
    {
      name: 'Standard',
      interval: 5000,
      duration: 0,
      icon: '🔄',
      description: 'Kiểm tra mỗi 5 giây'
    },
  ];

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isActiveRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);



  const checkPaymentStatus = useCallback(async () => {
    console.log('🔄 checkPaymentStatus called:', {
      paymentId,
      status,
      isActive: isActiveRef.current,
      shouldSkip: !paymentId || status === 'completed' || status === 'failed' || !isActiveRef.current
    });

    if (!paymentId || status === 'completed' || status === 'failed' || !isActiveRef.current) {
      console.log('⏹️ Skipping payment check - conditions not met');
      return;
    }

    // Chỉ show loading cho lần đầu tiên, sau đó ẩn để tránh giật
    if (isInitialLoad) {
      setLoading(true);
      setIsInitialLoad(false);
    }
    setError(null);
    setCheckCount(prev => prev + 1);

    try {
      // Tạo AbortController mới cho mỗi request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const result = await getPaymentStatus(paymentId, true, controller.signal);

      // Kiểm tra xem component còn active và request không bị abort
      if (isActiveRef.current && !controller.signal.aborted) {
        const newStatus = result.status;

        // Debug log để kiểm tra status change
        console.log('💰 Payment Status Update:', {
          old_status: status,
          new_status: newStatus,
          payment_id: result.payment_id,
          check_count: checkCount + 1,
          time_elapsed: Date.now() - (startTimeRef.current || 0)
        });

        setStatus(newStatus);
        onStatusUpdate?.(result);

        if (newStatus === 'completed') {
          console.log('🎉 Payment COMPLETED - Stopping all tracking!');
          setPhase(5);
          setLoading(false);

          // Dừng interval NGAY LẬP TỨC
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log('⏹️ Interval cleared for completed payment');
          }

          // Set isActive = false để prevent future calls
          isActiveRef.current = false;

          onPaymentCompleted?.(result);
        } else if (newStatus === 'failed') {
          console.log('❌ Payment FAILED - Stopping all tracking!');
          setPhase(5);
          setLoading(false);

          // Dừng interval NGAY LẬP TỨC
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log('⏹️ Interval cleared for failed payment');
          }

          // Set isActive = false để prevent future calls
          isActiveRef.current = false;

          onPaymentFailed?.(result);
        }
      }
    } catch (err: any) {
      // Bỏ qua lỗi nếu request bị abort (component unmount)
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        console.log('🛑 Payment check aborted - component unmounted');
        return;
      }

      if (isActiveRef.current) {
        console.error('❌ Payment check error:', err);
        setError(err.message || 'Lỗi kiểm tra thanh toán');
      }
    } finally {
      // Không tắt loading ở đây để tránh giật
      // Loading chỉ tắt khi completed/failed hoặc lần đầu
    }
  }, [paymentId, status, onPaymentCompleted, onPaymentFailed, onStatusUpdate]);

  const startPhase = useCallback(() => {
    // Không start nếu đã completed/failed
    if (status === 'completed' || status === 'failed' || !isActiveRef.current) {
      console.log('⏹️ Not starting tracking - payment already completed/failed');
      return;
    }

    const currentPhase = phases[0]; // Chỉ có 1 phase
    setPhase(1);

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    console.log(`🚀 Starting payment tracking (interval: ${currentPhase.interval}ms)`);

    // Initial check
    checkPaymentStatus();

    // Set up interval - chỉ 1 interval duy nhất 5 giây
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || 0);

      // Update time elapsed
      setTimeElapsed(elapsed);

      // Dừng nếu quá thời gian hoặc component không active
      if (elapsed >= maxTotalTime || !isActiveRef.current) {
        console.log('⏰ Payment tracking timeout or component inactive');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      console.log('🔄 Checking payment status...');
      checkPaymentStatus();
    }, currentPhase.interval);
  }, [checkPaymentStatus, maxTotalTime, status, phases]);

  // Manual check function
  const manualCheck = useCallback(async () => {
    await checkPaymentStatus();
  }, [checkPaymentStatus]);

  useEffect(() => {
    if (!paymentId) return;

    isActiveRef.current = true;
    startTimeRef.current = Date.now();
    setStatus('pending');
    setPhase(1);
    setTimeElapsed(0);
    setCheckCount(0);
    setError(null);

    startPhase();

    // Cleanup khi window/tab bị đóng
    const handleBeforeUnload = () => {
      console.log('🚪 Window closing - stopping payment tracking');
      isActiveRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      console.log('🧹 Cleaning up payment tracking - component unmounting');

      // Remove event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);

      // Đánh dấu không active để dừng tất cả operations
      isActiveRef.current = false;

      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('⏹️ Payment tracking interval cleared');
      }

      // Abort pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        console.log('🛑 Payment API request aborted');
      }
    };
  }, [paymentId, startPhase]);

  return {
    status,
    loading,
    error,
    phase,
    phaseInfo: phases[phase - 1] || phases[0],
    timeElapsed,
    checkCount,
    manualCheck,
  };
};
