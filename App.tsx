import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import ErrorBoundary from './src/components/ErrorBoundary';
import AppNavigator from "./src/navigation/AppNavigator";

// Patch Node.prototype.removeChild on Web to prevent React 19 / react-native-safe-area-context DOM cleanup crashes
if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof Node !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child) as T;
      }
      return child;
    }
    try {
      return originalRemoveChild.call(this, child) as T;
    } catch (e: any) {
      if (e?.name === 'NotFoundError' || e?.message?.includes('removeChild')) {
        return child;
      }
      throw e;
    }
  };
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}