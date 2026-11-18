/// <reference types="vite/client" />

interface Window {
  Telegram?: {
    WebApp: {
      initData: string;
      initDataUnsafe: any;
      version: string;
      platform: string;
      colorScheme: 'light' | 'dark';
      themeParams: any;
      isExpanded: boolean;
      viewportHeight: number;
      viewportStableHeight: number;
      headerColor: string;
      backgroundColor: string;
      isClosingConfirmationEnabled: boolean;
      BackButton: any;
      MainButton: any;
      SettingsButton: any;
      HapticFeedback: any;
      CloudStorage: any;
      BiometricManager: any;
      ready: () => void;
      expand: () => void;
      close: () => void;
      onEvent: (eventType: string, eventHandler: Function) => void;
      offEvent: (eventType: string, eventHandler: Function) => void;
      sendData: (data: string) => void;
      switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
      openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
      openTelegramLink: (url: string) => void;
      openInvoice: (url: string, callback?: (status: string) => void) => void;
      showPopup: (params: any, callback?: (buttonId: string) => void) => void;
      showAlert: (message: string, callback?: () => void) => void;
      showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
      showScanQrPopup: (params: any, callback?: (text: string) => void) => void;
      closeScanQrPopup: () => void;
      readTextFromClipboard: () => Promise<string>;
      requestWriteAccess: () => Promise<boolean>;
      requestContact: () => Promise<boolean>;
      downloadFile: (params: any, callback?: (status: string) => void) => void;
      shareToStory: (mediaUrl: string, params?: any) => Promise<boolean>;
      setHeaderColor: (color: string) => void;
      setBackgroundColor: (color: string) => void;
      enableClosingConfirmation: () => void;
      disableClosingConfirmation: () => void;
    };
  };
}